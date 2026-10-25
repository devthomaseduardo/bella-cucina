import React from "react";
import { CheckCircle2, MapPin, UserRound } from "lucide-react";

import TableSessionsPanel from "@/components/salon/TableSessionsPanel";
import WaiterLogin from "@/components/waiter/Login";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type SalonItem = {
  id: string;
  order_id: string;
  name: string;
  quantity: number;
  notes: string | null;
  customer_name: string | null;
  status: "ready" | "delivered";
  created_at: string;
  orders: {
    table_number: string;
    customer_name: string | null;
  } | null;
};

async function syncOrderStatus(orderId: string) {
  const { data } = await supabase
    .from("order_items")
    .select("status")
    .eq("order_id", orderId);

  if (!data?.length) return;
  const statuses = data.map((item) => item.status);

  const status = statuses.every(
    (value) => value === "delivered" || value === "cancelled",
  )
    ? "delivered"
    : statuses.every((value) =>
          ["ready", "delivered", "cancelled"].includes(value),
        )
      ? "ready"
      : "preparing";

  await supabase.from("orders").update({ status }).eq("id", orderId);
}

function SalonBoard() {
  const [items, setItems] = React.useState<SalonItem[]>([]);
  const [connected, setConnected] = React.useState(false);

  const refresh = React.useCallback(async () => {
    const { data, error } = await supabase
      .from("order_items")
      .select(
        "id,order_id,name,quantity,notes,customer_name,status,created_at,orders(table_number,customer_name)",
      )
      .eq("status", "ready")
      .order("created_at", { ascending: true });

    if (!error && data) setItems(data as unknown as SalonItem[]);
  }, []);

  React.useEffect(() => {
    void refresh();

    const channel = supabase
      .channel("salon:ready-items")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_items" },
        () => void refresh(),
      )
      .subscribe((status) => setConnected(status === "SUBSCRIBED"));

    return () => {
      setConnected(false);
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  const markDelivered = async (item: SalonItem) => {
    await supabase
      .from("order_items")
      .update({ status: "delivered" })
      .eq("id", item.id);
    await syncOrderStatus(item.order_id);
    await refresh();
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Operação
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Salão</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Aqui aparecem somente os pratos prontos. A equipe recebe mesa e nome de quem pediu antes de sair da cozinha.
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-400"}`} />
            {connected ? "Sincronizado" : "Reconectando"}
          </span>
        </header>

        <TableSessionsPanel />

        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Saída da cozinha
            </p>
            <h3 className="mt-1 font-display text-2xl">Prontos para levar</h3>
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-center text-muted-foreground">
              Nenhum prato aguardando retirada.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.06] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Pronto
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-3xl leading-tight">
                    {item.quantity}x {item.name}
                  </h3>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-black/20 p-4">
                      <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> Mesa
                      </p>
                      <p className="mt-1 text-2xl font-semibold">
                        {item.orders?.table_number ?? "?"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-black/20 p-4">
                      <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        <UserRound className="h-3.5 w-3.5" /> Pessoa
                      </p>
                      <p className="mt-1 truncate text-lg font-semibold">
                        {item.customer_name || item.orders?.customer_name || "Mesa"}
                      </p>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">
                      Observação: {item.notes}
                    </p>
                  )}

                  <Button
                    className="mt-5 w-full rounded-full"
                    onClick={() => void markDelivered(item)}
                  >
                    Marcar como entregue
                  </Button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function SalonPage() {
  const [authenticated, setAuthenticated] = React.useState(false);

  if (!authenticated) {
    return (
      <WaiterLogin
        onLogin={() => setAuthenticated(true)}
        title="Acesso do salão"
        description="Entre com uma conta da equipe para visualizar somente o que já está pronto para ser levado às mesas."
      />
    );
  }

  return <SalonBoard />;
}
