import React from "react";
import { CheckCircle2, Clock3, RefreshCw, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import {
  clearCustomerTableSession,
  readCustomerTableSession,
} from "@/lib/table-session";

type AccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type LiveItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  customer_name: string | null;
  notes: string | null;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
};

type LiveOrder = {
  id: string;
  status: string;
  created_at: string;
  order_items: LiveItem[];
};

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const statusLabel: Record<LiveItem["status"], string> = {
  pending: "Recebido",
  preparing: "Preparando",
  ready: "Pronto para servir",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const normalize = (value?: string | null) =>
  (value ?? "").trim().toLocaleLowerCase("pt-BR");

export default function AccountModal({ open, onOpenChange }: AccountModalProps) {
  const [orders, setOrders] = React.useState<LiveOrder[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [connected, setConnected] = React.useState(false);
  const [updatedAt, setUpdatedAt] = React.useState<Date | null>(null);
  const session = readCustomerTableSession();

  const refresh = React.useCallback(async () => {
    if (!session?.sessionId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id,status,created_at,order_items(id,name,price,quantity,image_url,customer_name,notes,status)",
      )
      .eq("session_id", session.sessionId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setOrders(data as LiveOrder[]);
      setUpdatedAt(new Date());
    }
    setLoading(false);
  }, [session?.sessionId]);

  React.useEffect(() => {
    if (!open || !session?.sessionId) return;

    void refresh();

    const channel = supabase
      .channel(`customer-session:${session.sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `session_id=eq.${session.sessionId}`,
        },
        () => void refresh(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_items",
          filter: `session_id=eq.${session.sessionId}`,
        },
        () => void refresh(),
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "table_sessions",
          filter: `id=eq.${session.sessionId}`,
        },
        (payload) => {
          if ((payload.new as { status?: string })?.status === "closed") {
            clearCustomerTableSession();
          }
          void refresh();
        },
      )
      .subscribe((status) => setConnected(status === "SUBSCRIBED"));

    return () => {
      setConnected(false);
      void supabase.removeChannel(channel);
    };
  }, [open, refresh, session?.sessionId]);

  const items = React.useMemo(
    () => orders.flatMap((order) => order.order_items ?? []),
    [orders],
  );

  const billableItems = React.useMemo(
    () => items.filter((item) => item.status !== "cancelled"),
    [items],
  );

  const tableTotal = billableItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const myItems = session
    ? billableItems.filter(
        (item) => normalize(item.customer_name) === normalize(session.guestName),
      )
    : [];

  const myTotal = myItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const people = React.useMemo(() => {
    const map = new Map<string, { name: string; total: number }>();

    billableItems.forEach((item) => {
      const name = item.customer_name?.trim() || "Compartilhado";
      const key = normalize(name) || "compartilhado";
      const current = map.get(key) ?? { name, total: 0 };
      current.total += Number(item.price) * item.quantity;
      map.set(key, current);
    });

    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [billableItems]);

  const equalSplit = people.length ? tableTotal / people.length : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-background/95 sm:max-w-[620px]">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-8">
            <div>
              <DialogTitle className="font-display text-2xl">Sua conta</DialogTitle>
              <DialogDescription>
                {session
                  ? `Mesa ${session.tableNumber}. Sessão atual de ${session.guestName}.`
                  : "A conta aparece depois do primeiro pedido desta visita."}
              </DialogDescription>
            </div>
            {session && (
              <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-400"}`}
                />
                {connected ? "Sincronizado" : "Reconectando"}
              </span>
            )}
          </div>
        </DialogHeader>

        {!session ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-sm leading-6 text-muted-foreground">
            Faça seu primeiro pedido informando mesa e nome. A partir daí, o sistema cria uma sessão exclusiva para esta ocupação da mesa e acompanha somente os pedidos dessa sessão.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
                  Minha parte
                </p>
                <p className="mt-2 font-display text-3xl">{money(myTotal)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Total da mesa
                </p>
                <p className="mt-2 font-display text-3xl text-foreground">
                  {money(tableTotal)}
                </p>
              </div>
            </div>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Seus pedidos</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => void refresh()}
                  disabled={loading}
                >
                  <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                  Atualizar
                </Button>
              </div>

              <div className="space-y-2">
                {myItems.length === 0 ? (
                  <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-muted-foreground">
                    Ainda não há itens vinculados ao seu nome.
                  </p>
                ) : (
                  myItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3"
                    >
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-muted">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">
                          {item.quantity}x {item.name}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          {item.status === "delivered" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Clock3 className="h-3.5 w-3.5 text-primary" />
                          )}
                          {statusLabel[item.status]}
                        </div>
                        {item.notes && (
                          <p className="mt-1 text-xs text-muted-foreground">Obs: {item.notes}</p>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {money(Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Divisão da mesa</h3>
              </div>
              <div className="mt-4 space-y-2">
                {people.map((person) => (
                  <div key={normalize(person.name)} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{person.name}</span>
                    <span className="font-medium text-foreground">{money(person.total)}</span>
                  </div>
                ))}
              </div>
              {people.length > 1 && (
                <div className="mt-4 border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Se todos dividirem igualmente
                    </span>
                    <span className="font-semibold text-foreground">
                      {money(equalSplit)} por pessoa
                    </span>
                  </div>
                </div>
              )}
            </section>

            <p className="text-center text-xs text-muted-foreground">
              {updatedAt
                ? `Atualizado às ${updatedAt.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}`
                : "Sincronizando dados da mesa"}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
