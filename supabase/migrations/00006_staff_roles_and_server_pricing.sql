-- Staff roles, QR-only table access and server-side order pricing.
-- Refs: #2 (staff roles), #3 (join by table number), #4 (client-side prices).

-- 1. Menu: stable slugs shared with the front-end and availability flag.

ALTER TABLE menu_categories ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS available BOOLEAN NOT NULL DEFAULT TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS menu_categories_slug_key ON menu_categories(slug);
CREATE UNIQUE INDEX IF NOT EXISTS menu_items_slug_key ON menu_items(slug);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);

-- 2. Staff roles. Only accounts listed here count as staff.

CREATE TABLE IF NOT EXISTS staff_members (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('waiter', 'kitchen', 'admin')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_staff_session()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_members
    WHERE user_id = auth.uid() AND active = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION has_staff_role(p_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_members
    WHERE user_id = auth.uid() AND active = TRUE AND role = ANY(p_roles)
  );
$$;

REVOKE ALL ON FUNCTION has_staff_role(TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION has_staff_role(TEXT[]) TO authenticated;

DROP POLICY IF EXISTS "Staff can read own membership" ON staff_members;
CREATE POLICY "Staff can read own membership"
ON staff_members FOR SELECT
USING (user_id = auth.uid());

-- Menu and reservations are managed by admins only.
DROP POLICY IF EXISTS "Staff can manage menu categories" ON menu_categories;
DROP POLICY IF EXISTS "Staff can manage menu items" ON menu_items;
DROP POLICY IF EXISTS "Staff can manage reservations" ON reservations;

CREATE POLICY "Admins can manage menu categories"
ON menu_categories FOR ALL
USING (has_staff_role(ARRAY['admin']))
WITH CHECK (has_staff_role(ARRAY['admin']));

CREATE POLICY "Admins can manage menu items"
ON menu_items FOR ALL
USING (has_staff_role(ARRAY['admin']))
WITH CHECK (has_staff_role(ARRAY['admin']));

CREATE POLICY "Staff can read reservations"
ON reservations FOR SELECT
USING (is_staff_session());

CREATE POLICY "Admins can manage reservations"
ON reservations FOR UPDATE
USING (has_staff_role(ARRAY['admin', 'waiter']))
WITH CHECK (has_staff_role(ARRAY['admin', 'waiter']));

-- 3. Tables can only be joined through their QR token.

DROP FUNCTION IF EXISTS join_table_session(TEXT, TEXT);

-- 4. Valid order and item states.

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
CHECK (status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled'));

ALTER TABLE order_items ADD CONSTRAINT order_items_quantity_check CHECK (quantity > 0);

-- 5. Orders are created only through place_order, which prices items from menu_items.

DROP POLICY IF EXISTS "Guests can insert orders in their session" ON orders;
DROP POLICY IF EXISTS "Guests can insert items in their session" ON order_items;

CREATE OR REPLACE FUNCTION place_order(
    p_session_id UUID,
    p_guest_id UUID,
    p_items JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_guest table_guests%ROWTYPE;
    v_session table_sessions%ROWTYPE;
    v_table_number TEXT;
    v_order_id UUID;
    v_item JSONB;
    v_menu menu_items%ROWTYPE;
    v_quantity INTEGER;
    v_total NUMERIC(10, 2) := 0;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    SELECT * INTO v_guest
    FROM table_guests
    WHERE id = p_guest_id AND session_id = p_session_id AND user_id = auth.uid();

    IF v_guest.id IS NULL THEN
        RAISE EXCEPTION 'Guest does not belong to this table session';
    END IF;

    SELECT * INTO v_session FROM table_sessions WHERE id = p_session_id FOR UPDATE;

    IF v_session.status <> 'open' THEN
        RAISE EXCEPTION 'Table session is not accepting orders';
    END IF;

    IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item';
    END IF;

    SELECT number INTO v_table_number FROM restaurant_tables WHERE id = v_session.table_id;

    INSERT INTO orders(table_number, customer_name, status, total_price, session_id, guest_id)
    VALUES (v_table_number, v_guest.name, 'pending', 0, p_session_id, p_guest_id)
    RETURNING id INTO v_order_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_quantity := (v_item ->> 'quantity')::INTEGER;
        IF v_quantity IS NULL OR v_quantity < 1 OR v_quantity > 50 THEN
            RAISE EXCEPTION 'Invalid quantity for item %', v_item ->> 'slug';
        END IF;

        SELECT * INTO v_menu FROM menu_items WHERE slug = v_item ->> 'slug';

        IF v_menu.id IS NULL OR NOT v_menu.available THEN
            RAISE EXCEPTION 'Menu item % is not available', v_item ->> 'slug';
        END IF;

        INSERT INTO order_items(
            order_id, menu_item_id, name, price, quantity, image_url, category,
            notes, customer_name, session_id, guest_id, status
        )
        VALUES (
            v_order_id, v_menu.id, v_menu.name_pt, v_menu.price, v_quantity, v_menu.image_url,
            (SELECT slug FROM menu_categories WHERE id = v_menu.category_id),
            nullif(left(trim(coalesce(v_item ->> 'notes', '')), 500), ''),
            coalesce(nullif(left(trim(coalesce(v_item ->> 'customer_name', '')), 80), ''), v_guest.name),
            p_session_id, p_guest_id, 'pending'
        );

        v_total := v_total + v_menu.price * v_quantity;
    END LOOP;

    UPDATE orders SET total_price = v_total WHERE id = v_order_id;

    RETURN v_order_id;
END;
$$;

REVOKE ALL ON FUNCTION place_order(UUID, UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION place_order(UUID, UUID, JSONB) TO authenticated;

-- 6. Fix: the OUT parameter "session_id" clashed with table_guests.session_id
-- ("column reference is ambiguous"), so joining a table by QR always failed.

CREATE OR REPLACE FUNCTION join_table_session_by_token(
    p_table_token UUID,
    p_guest_name TEXT
)
RETURNS TABLE(session_id UUID, guest_id UUID, table_number TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
    v_user_id UUID := auth.uid();
    v_name TEXT := left(trim(coalesce(p_guest_name, '')), 80);
    v_table restaurant_tables%ROWTYPE;
    v_session table_sessions%ROWTYPE;
    v_guest table_guests%ROWTYPE;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    IF v_name = '' THEN
        RAISE EXCEPTION 'Guest name is required';
    END IF;

    SELECT t.* INTO v_table
    FROM restaurant_tables t
    WHERE t.qr_token = p_table_token AND t.active = TRUE;

    IF v_table.id IS NULL THEN
        RAISE EXCEPTION 'Invalid or inactive table QR token';
    END IF;

    SELECT s.* INTO v_session
    FROM table_sessions s
    WHERE s.table_id = v_table.id AND s.status <> 'closed'
    ORDER BY s.opened_at DESC
    LIMIT 1;

    IF v_session.id IS NULL THEN
        INSERT INTO table_sessions(table_id)
        VALUES (v_table.id)
        ON CONFLICT DO NOTHING
        RETURNING * INTO v_session;

        -- Another guest opened the session concurrently: reuse it.
        IF v_session.id IS NULL THEN
            SELECT s.* INTO v_session
            FROM table_sessions s
            WHERE s.table_id = v_table.id AND s.status <> 'closed';
        END IF;
    END IF;

    IF v_session.status <> 'open' THEN
        RAISE EXCEPTION 'Table session is not accepting new guests';
    END IF;

    SELECT g.* INTO v_guest
    FROM table_guests g
    WHERE g.session_id = v_session.id AND g.user_id = v_user_id;

    IF v_guest.id IS NULL THEN
        INSERT INTO table_guests(session_id, user_id, name)
        VALUES (v_session.id, v_user_id, v_name)
        RETURNING * INTO v_guest;
    ELSIF v_guest.name IS DISTINCT FROM v_name THEN
        UPDATE table_guests g
        SET name = v_name
        WHERE g.id = v_guest.id
        RETURNING * INTO v_guest;
    END IF;

    RETURN QUERY SELECT v_session.id, v_guest.id, v_table.number;
END;
$$;

REVOKE ALL ON FUNCTION join_table_session_by_token(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION join_table_session_by_token(UUID, TEXT) TO authenticated;
