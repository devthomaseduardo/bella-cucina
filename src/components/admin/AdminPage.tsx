import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CartProvider, Order, useCart } from "@/components/cart/CartContext";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type OrderStatus = Order["status"];

type SupabaseOrderItemRow = {
  id: string;
  menu_item_id: string | null;
  name: string;
  price: number | string;
  quantity: number;
  image_url: string | null;
  category: string | null;
  notes: string | null;
  customer_name: string | null;
};

type SupabaseOrderRow = {
  id: string;
  table_number: string;
  customer_name: string | null;
  status: OrderStatus;
  total_price: number | string;
  created_at: string;
  updated_at: string;
  order_items?: SupabaseOrderItemRow[];
};

const hasSupabaseConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const statusLabels: Record<OrderStatus | "all" | "active", string> = {
  all: "Todos",
  active: "Em aberto",
  pending: "Pendente",
  preparing: "Produção",
  ready: "Pronto",
  delivered: "Fechado",
  cancelled: "Cancelado",
};

const statusStyles: Record<OrderStatus, string> = {
  pending: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  preparing: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  ready: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  delivered: "border-white/15 bg-white/[0.06] text-white/[0.78]",
  cancelled: "border-red-400/25 bg-red-400/10 text-red-200",
};

const nextStatus: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  pending: { status: "preparing", label: "Enviar para produção" },
  preparing: { status: "ready", label: "Marcar pronto" },
  ready: { status: "delivered", label: "Fechar no caixa" },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

const mapRemoteOrder = (row: SupabaseOrderRow): Order => ({
  id: row.id,
  tableNumber: row.table_number,
  customerName: row.customer_name || "",
  status: row.status,
  totalPrice: Number(row.total_price),
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  items: (row.order_items || []).map((item) => ({
    id: item.menu_item_id || item.id,
    name: item.name,
    price: Number(item.price),
    quantity: item.quantity,
    image: item.image_url || "",
    category: item.category || "",
    notes: item.notes || undefined,
    customerName: item.customer_name || undefined,
  })),
});

const AdminPageContent = () => {
  const { orders, importOrder, updateOrderStatus } = useCart();
  const [statusFilter, setStatusFilter] = React.useState<OrderStatus | "all" | "active">("active");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [syncState, setSyncState] = React.useState<"local" | "loading" | "online" | "error">(
    hasSupabaseConfig ? "loading" : "local",
  );
  const importOrderRef = React.useRef(importOrder);

  React.useEffect(() => {
    importOrderRef.current = importOrder;
  }, [importOrder]);

  const loadRemoteOrders = React.useCallback(async () => {
    if (!hasSupabaseConfig) {
      setSyncState("local");
      return;
    }

    setSyncState("loading");
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar pedidos do admin:", error);
      setSyncState("error");
      return;
    }

    (data as SupabaseOrderRow[] | null)?.forEach((row) => {
      importOrderRef.current(mapRemoteOrder(row));
    });
    setSyncState("online");
  }, []);

  React.useEffect(() => {
    void loadRemoteOrders();

    if (!hasSupabaseConfig) return;

    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        void loadRemoteOrders();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, () => {
        void loadRemoteOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadRemoteOrders]);

  const sortedOrders = React.useMemo(
    () => [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [orders],
  );

  const filteredOrders = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sortedOrders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active"
          ? order.status === "pending" || order.status === "preparing" || order.status === "ready"
          : order.status === statusFilter);

      if (!matchesStatus) return false;
      if (!query) return true;

      return (
        order.id.toLowerCase().includes(query) ||
        order.tableNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.items.some((item) => item.name.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, sortedOrders, statusFilter]);

  const summary = React.useMemo(() => {
    const activeOrders = orders.filter(
      (order) => order.status === "pending" || order.status === "preparing" || order.status === "ready",
    );
    const deliveredOrders = orders.filter((order) => order.status === "delivered");
    const cancelledOrders = orders.filter((order) => order.status === "cancelled");
    const activeTotal = activeOrders.reduce((total, order) => total + order.totalPrice, 0);
    const deliveredTotal = deliveredOrders.reduce((total, order) => total + order.totalPrice, 0);
    const cancelledTotal = cancelledOrders.reduce((total, order) => total + order.totalPrice, 0);
    const averageTicket = deliveredOrders.length > 0 ? deliveredTotal / deliveredOrders.length : 0;

    return {
      activeCount: activeOrders.length,
      activeTotal,
      deliveredCount: deliveredOrders.length,
      deliveredTotal,
      cancelledTotal,
      averageTicket,
    };
  }, [orders]);

  const tableSummaries = React.useMemo(() => {
    const tableMap = new Map<string, { total: number; count: number; ready: number }>();

    orders
      .filter((order) => order.status !== "cancelled" && order.status !== "delivered")
      .forEach((order) => {
        const current = tableMap.get(order.tableNumber) || { total: 0, count: 0, ready: 0 };
        tableMap.set(order.tableNumber, {
          total: current.total + order.totalPrice,
          count: current.count + 1,
          ready: current.ready + (order.status === "ready" ? 1 : 0),
        });
      });

    return [...tableMap.entries()]
      .map(([tableNumber, value]) => ({ tableNumber, ...value }))
      .sort((a, b) => Number(a.tableNumber) - Number(b.tableNumber));
  }, [orders]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    if (hasSupabaseConfig) {
      void loadRemoteOrders();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-[1520px] px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Button
              asChild
              variant="outline"
              className="mb-5 rounded-full border-white/10 bg-white/[0.045]"
            >
              <Link to="/menu">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
                Voltar para o site
              </Link>
            </Button>
            <p className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--accent))]">
              Caixa & administração
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Operação do restaurante
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Acompanhe pedidos por mesa, produção, fechamento de conta e volume do caixa em uma tela de operação.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Badge
              variant="outline"
              className={cn(
                "w-fit rounded-full px-3 py-1 uppercase tracking-[0.16em]",
                syncState === "online" && "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
                syncState === "loading" && "border-amber-400/25 bg-amber-400/10 text-amber-200",
                syncState === "error" && "border-red-400/25 bg-red-400/10 text-red-200",
                syncState === "local" && "border-white/15 bg-white/[0.06] text-white/62",
              )}
            >
              {syncState === "online" && "online"}
              {syncState === "loading" && "sincronizando"}
              {syncState === "error" && "modo local"}
              {syncState === "local" && "local"}
            </Badge>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.045]"
              onClick={() => void loadRemoteOrders()}
            >
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
              Atualizar
            </Button>
          </div>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Em aberto</p>
            <p className="mt-3 font-display text-3xl">{formatCurrency(summary.activeTotal)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{summary.activeCount} pedidos ativos</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Recebido</p>
            <p className="mt-3 font-display text-3xl">{formatCurrency(summary.deliveredTotal)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{summary.deliveredCount} contas fechadas</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Ticket médio</p>
            <p className="mt-3 font-display text-3xl">{formatCurrency(summary.averageTicket)}</p>
            <p className="mt-1 text-sm text-muted-foreground">sobre pedidos fechados</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Cancelado</p>
            <p className="mt-3 font-display text-3xl">{formatCurrency(summary.cancelledTotal)}</p>
            <p className="mt-1 text-sm text-muted-foreground">fora do caixa recebido</p>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="min-w-0 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar mesa, pedido, cliente ou item"
                className="h-11 rounded-full border-white/10 bg-black/20 text-foreground placeholder:text-muted-foreground lg:max-w-sm"
              />
              <Tabs
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
                className="w-full lg:w-auto"
              >
                <TabsList className="grid h-auto grid-cols-2 gap-1 rounded-full border border-white/10 bg-black/20 p-1 sm:grid-cols-3 lg:flex">
                  {(["active", "all", "pending", "preparing", "ready", "delivered"] as const).map((status) => (
                    <TabsTrigger
                      key={status}
                      value={status}
                      className="rounded-full px-3 py-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {statusLabels[status]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-10 text-center text-muted-foreground">
                Nenhum pedido encontrado para esse filtro.
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order) => {
                  const next = nextStatus[order.status];

                  return (
                    <article
                      key={order.id}
                      className="rounded-2xl border border-white/10 bg-black/[0.18] p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-display text-2xl">Mesa {order.tableNumber}</h2>
                            <Badge variant="outline" className={cn("rounded-full", statusStyles[order.status])}>
                              {statusLabels[order.status]}
                            </Badge>
                            {order.customerName && (
                              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-muted-foreground">
                                {order.customerName}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Pedido #{order.id} · {formatTime(order.createdAt)}
                          </p>
                        </div>

                        <div className="text-left lg:text-right">
                          <p className="font-display text-2xl">{formatCurrency(order.totalPrice)}</p>
                          <p className="text-xs text-muted-foreground">{order.items.length} itens lançados</p>
                        </div>
                      </div>

                      <div className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10">
                        {order.items.map((item) => (
                          <div key={`${order.id}-${item.id}-${item.customerName || ""}`} className="grid gap-2 p-3 sm:grid-cols-[1fr_auto]">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">
                                {item.quantity}x {item.name}
                              </p>
                              {(item.notes || item.customerName) && (
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                  {item.customerName && `Para: ${item.customerName}`}
                                  {item.customerName && item.notes && " · "}
                                  {item.notes && `Obs: ${item.notes}`}
                                </p>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-muted-foreground">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                        {next && (
                          <Button
                            type="button"
                            className="rounded-full"
                            onClick={() => void handleStatusChange(order.id, next.status)}
                          >
                            {next.label}
                          </Button>
                        )}
                        {order.status !== "cancelled" && order.status !== "delivered" && (
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-full border-red-400/25 bg-red-400/10 text-red-100 hover:bg-red-400/15"
                            onClick={() => void handleStatusChange(order.id, "cancelled")}
                          >
                            Cancelar pedido
                          </Button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="grid content-start gap-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--accent))]">
                Mesas abertas
              </p>
              <div className="mt-4 grid gap-3">
                {tableSummaries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma mesa aberta agora.</p>
                ) : (
                  tableSummaries.map((table) => (
                    <div key={table.tableNumber} className="rounded-2xl border border-white/10 bg-black/[0.18] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-display text-xl">Mesa {table.tableNumber}</p>
                        <p className="text-sm font-semibold">{formatCurrency(table.total)}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {table.count} pedido(s) · {table.ready} pronto(s)
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--accent))]">
                Fluxo correto
              </p>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li><span className="font-semibold text-primary">01</span> Cliente monta pedido e informa mesa.</li>
                <li><span className="font-semibold text-primary">02</span> Caixa/admin recebe como pendente.</li>
                <li><span className="font-semibold text-primary">03</span> Pedido avança para produção, pronto e fechado.</li>
              </ol>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

const AdminPage = () => (
  <CartProvider>
    <AdminPageContent />
  </CartProvider>
);

export default AdminPage;
