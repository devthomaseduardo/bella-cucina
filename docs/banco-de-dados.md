# Banco de dados (Supabase)

O schema fica em [supabase/migrations](../supabase/migrations). As migrations são aplicadas **em ordem numérica**:

| Migration | Conteúdo |
|-----------|----------|
| `00001_initial_schema.sql` | Cardápio, pedidos, itens, reservas, RLS inicial |
| `00002_table_sessions_and_live_bill.sql` | Mesas, sessões, convidados, conta ao vivo, Realtime, 30 mesas de demo |
| `00003_harden_anonymous_customer_rls.sql` | `is_staff_session()`: separa clientes anônimos de staff |
| `00004_join_table_from_qr_token.sql` | `join_table_session_by_token`: entrada pela mesa via QR |
| `00005_staff_table_access.sql` | Staff pode ler `restaurant_tables` |
| `00006_staff_roles_and_server_pricing.sql` | Papéis de staff, `place_order` com preço do servidor, fim da entrada por número, correção do `join_table_session_by_token` |

## Tabelas

```
menu_categories 1─* menu_items

restaurant_tables 1─* table_sessions 1─* table_guests
                          │                  │
                          └──* orders *──────┘
                                 │
                                 └─* order_items

reservations (independente)
```

| Tabela | Descrição | Campos importantes |
|--------|-----------|--------------------|
| `menu_categories` | Categorias do cardápio | `name_pt/en/it`, `order` |
| `menu_items` | Pratos | `slug` (mesmo id do front), `name_*`, `description_*`, `price`, `available`, `popular` |
| `restaurant_tables` | Mesas físicas | `number` (único), `qr_token` (único, secreto), `active` |
| `table_sessions` | Ocupação de uma mesa | `status`: `open`, `payment_pending`, `closed`. Índice único garante uma sessão aberta por mesa |
| `table_guests` | Pessoa na sessão | `user_id` (usuário anônimo), `name` |
| `orders` | Pedido | `session_id`, `guest_id`, `status`, `total_price` |
| `order_items` | Item do pedido | `status` por item, `notes`, `customer_name` |
| `reservations` | Reservas online | `datetime_iso`, `party_size`, `status` |
| `staff_members` | Contas da equipe | `user_id`, `role` (`waiter`, `kitchen`, `admin`), `active` |

Status de pedido e item: `pending` → `preparing` → `ready` → `delivered` (ou `cancelled`).

## Funções (RPC)

| Função | Quem chama | O que faz |
|--------|------------|-----------|
| `join_table_session_by_token(p_table_token, p_guest_name)` | Cliente anônimo | Valida o QR, abre ou reaproveita a sessão aberta e cria ou atualiza o convidado. Retorna `session_id`, `guest_id` e `table_number` |
| `place_order(p_session_id, p_guest_id, p_items)` | Cliente anônimo | Cria o pedido. Busca o preço de cada `slug` em `menu_items`, valida quantidade e se a sessão está aberta, e calcula o total. É a única forma de criar pedidos |
| `is_staff_session()` | Policies | `true` se o usuário está ativo em `staff_members` |
| `has_staff_role(p_roles)` | Policies | `true` se o usuário tem um dos papéis informados |

## Regras de acesso (RLS)

| Recurso | Visitante | Cliente anônimo | Staff |
|---------|:---------:|:---------------:|:-----:|
| Cardápio | ler | ler | ler (admin escreve) |
| Reservas | criar | criar | tudo |
| Sessão / convidados | — | ler a **própria** sessão | ler e atualizar |
| Pedidos e itens | — | criar via `place_order` e ler na **própria** sessão | ler e atualizar |
| Mesas | — | — | ler |

O cliente só enxerga dados de sessões das quais é convidado (`table_guests.user_id = auth.uid()`). Por isso uma sessão fechada não aparece para quem senta depois na mesma mesa.

## Tipos TypeScript

```bash
SUPABASE_PROJECT_ID=<id> npm run types:supabase
```

Gera `src/types/supabase.ts`. Rode de novo sempre que criar uma migration.

## Criando uma migration

1. Crie `supabase/migrations/000NN_descricao.sql` com o próximo número.
2. Prefira `IF NOT EXISTS` / `DROP ... IF EXISTS` para que ela possa rodar de novo sem quebrar.
3. Toda tabela nova precisa de `ENABLE ROW LEVEL SECURITY` e policies explícitas.
4. Atualize este documento.
