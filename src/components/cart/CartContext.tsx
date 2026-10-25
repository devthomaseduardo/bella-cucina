import * as React from "react";
import { createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import {
  ensureCustomerTableSession,
  type CustomerTableSession,
} from "@/lib/table-session";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  notes?: string;
  customerName?: string;
  status?: OrderStatus;
  guestId?: string | null;
}

export interface Order {
  id: string;
  tableNumber: string;
  customerName: string;
  items: CartItem[];
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  sessionId?: string | null;
  guestId?: string | null;
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    item: Omit<CartItem, "quantity">,
    quantity?: number,
    notes?: string,
    customerName?: string,
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  tableNumber: string | null;
  setTableNumber: (tableNumber: string) => void;
  customerName: string | null;
  setCustomerName: (name: string) => void;
  currentTableSession: CustomerTableSession | null;
  showSuccessToast: boolean;
  setShowSuccessToast: (show: boolean) => void;
  successMessage: string;
  setSuccessMessage: (message: string) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => Promise<string>;
  importOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const generateOrderId = () =>
  Math.floor(1000 + Math.random() * 9000).toString();

const hasSupabaseConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
);


const readLocalStorage = (key: string) => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
};

const readStoredCart = () => {
  const savedCart = readLocalStorage("cart");
  if (!savedCart) return [];

  try {
    return JSON.parse(savedCart) as CartItem[];
  } catch (error) {
    console.error("Failed to parse cart from localStorage", error);
    return [];
  }
};

const readStoredOrders = () => {
  const savedOrders = readLocalStorage("orders");
  if (!savedOrders) return [];

  try {
    return JSON.parse(savedOrders, (key, value) => {
      if (key === "createdAt" || key === "updatedAt") return new Date(value);
      return value;
    }) as Order[];
  } catch (error) {
    console.error("Failed to parse orders from localStorage", error);
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = React.useState<CartItem[]>(readStoredCart);
  const [tableNumber, setTableNumber] = React.useState<string | null>(() =>
    readLocalStorage("tableNumber"),
  );
  const [customerName, setCustomerName] = React.useState<string | null>(() =>
    readLocalStorage("customerName"),
  );
  const [currentTableSession, setCurrentTableSession] =
    React.useState<CustomerTableSession | null>(null);
  const [showSuccessToast, setShowSuccessToast] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [orders, setOrders] = React.useState<Order[]>(readStoredOrders);

  React.useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  React.useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  React.useEffect(() => {
    if (tableNumber) localStorage.setItem("tableNumber", tableNumber);
  }, [tableNumber]);

  React.useEffect(() => {
    if (customerName) localStorage.setItem("customerName", customerName);
  }, [customerName]);

  const addItem = (
    item: Omit<CartItem, "quantity">,
    quantity = 1,
    notes = "",
    itemCustomerName = "",
  ) => {
    setItems((prevItems) => {
      const resolvedCustomer = itemCustomerName || customerName || "";
      const existingItemIndex = prevItems.findIndex(
        (current) =>
          current.id === item.id &&
          (current.customerName || "") === resolvedCustomer,
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          notes: notes || updatedItems[existingItemIndex].notes,
        };
        setSuccessMessage(`${item.name} atualizado no pedido`);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        return updatedItems;
      }

      setSuccessMessage(`${item.name} adicionado ao pedido`);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      return [
        ...prevItems,
        {
          ...item,
          quantity,
          notes,
          customerName: resolvedCustomer || undefined,
          status: "pending",
        },
      ];
    });
  };

  const removeItem = (id: string) => {
    const itemToRemove = items.find((item) => item.id === id);
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    if (itemToRemove) {
      setSuccessMessage(`${itemToRemove.name} removido do pedido`);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const updateNotes = (id: string, notes: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, notes } : item)),
    );
    setSuccessMessage("Observações atualizadas");
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const clearCart = () => {
    setItems([]);
    setSuccessMessage("Pedido atual limpo");
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const addOrder = async (
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">,
  ) => {
    const createLocalOrder = (id = generateOrderId()) => {
      const now = new Date();
      const fallbackOrder: Order = {
        ...orderData,
        id,
        createdAt: now,
        updatedAt: now,
      };
      setOrders((prevOrders) => [...prevOrders, fallbackOrder]);
      return fallbackOrder.id;
    };

    if (!hasSupabaseConfig) return createLocalOrder();

    const tableSession = await ensureCustomerTableSession(orderData.customerName);
    if (!tableSession) return createLocalOrder();
    setCurrentTableSession(tableSession);

    // Prices and totals are computed by the database from menu_items.
    const { data: orderId, error } = await supabase.rpc("place_order", {
      p_session_id: tableSession.sessionId,
      p_guest_id: tableSession.guestId,
      p_items: orderData.items.map((item) => ({
        slug: item.id,
        quantity: item.quantity,
        notes: item.notes ?? "",
        customer_name: item.customerName ?? "",
      })),
    });

    if (error) throw error;

    const now = new Date();
    const newOrder: Order = {
      ...orderData,
      id: orderId as string,
      tableNumber: tableSession.tableNumber,
      sessionId: tableSession.sessionId,
      guestId: tableSession.guestId,
      items: orderData.items.map((item) => ({
        ...item,
        status: "pending",
        guestId: tableSession.guestId,
      })),
      createdAt: now,
      updatedAt: now,
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    return newOrder.id;
  };

  const importOrder = (order: Order) => {
    setOrders((prevOrders) => {
      if (prevOrders.some((current) => current.id === order.id)) {
        return prevOrders.map((current) =>
          current.id === order.id ? order : current,
        );
      }
      return [...prevOrders, order];
    });
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    const updatedAt = new Date();
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status, updatedAt } : order,
      ),
    );

    if (!hasSupabaseConfig) return;

    try {
      await supabase
        .from("orders")
        .update({ status, updated_at: updatedAt.toISOString() })
        .eq("id", orderId);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const totalItems = React.useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const totalPrice = React.useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateNotes,
    clearCart,
    totalItems,
    totalPrice,
    tableNumber,
    setTableNumber,
    customerName,
    setCustomerName,
    currentTableSession,
    showSuccessToast,
    setShowSuccessToast,
    successMessage,
    setSuccessMessage,
    orders,
    addOrder,
    importOrder,
    updateOrderStatus,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
