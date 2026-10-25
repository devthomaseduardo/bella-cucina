import React from "react";
import { Check, ChefHat, Clock3 } from "lucide-react";

import WaiterLogin from "@/components/waiter/Login";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type KitchenItem = {
  id: string;
  order_id: string;
  name: string;
  quantity: number;
  notes: string | null;
  customer_name: string | null;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
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
  let status = "pending";

  if (statuses.every((value) => value === "cancelled")) status = "cancelled";
  else if (statuses.every((value) => value === "delivered" || value === "cancelled")) status = "delivered";
  else if (statuses.every((value) => ["ready", "delivered", "cancelled"].includes(value))) status = "ready";
  else if (statuses.some((value) => value === "preparing" || value === "ready")) status = "preparing";

  await supabase.from("orders").update({ status }).eq("id", orderId);
}

function KitchenBoard() {
  const [items, setItems] = React.useState<KitchenItem[]>([]);
  const [connected, setConnected] = React.useState(false);

  const refresh = React.useCallback(async () => {
    const { data, error } = await supabase
      .from("order_items")
      .select(
        "id,order_id,name,quantity,notes,customer_name,status,created_at,orders(table_number,customer_name)",
      )
      .in("status", ["pending", "preparing"])
      .order("created_at", { ascending: true });

    if (!error && data) setItems(data as unknown as KitchenItem[]);
  }, []);

  React.useEffect(() => {
    void refresh();

    const channel = supabase
      .channel("kitchen:order-items")
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

  const updateStatus = async (
    item: KitchenItem,
    status: KitchenItem["status"],
  ) => {
    await supabase.from("order_items").update({ status }).eq("id", item.id);
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
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Cozinha</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cada prato mostra mesa e pessoa antes de sair da cozinha.
            </p>
          </div>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-400"}`} />
            {connected ? "Sincronizado" : "Reconectando"}
          </span>
        </header>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-center text-muted-foreground">
            Nenhum prato aguardando preparo.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_-60px_rgba(0,0,0,0.9)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Mesa {item.orders?.table_number ?? "?"}
                    </p>
                    <h2 className="mt-2 font-display text-2xl leading-tight">
                      {item.quantity}x {item.name}
                    </h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-muted-foreground">
                    {item.status === "pending" ? "Recebido" : "Preparando"}
                  </span>
                </div>

                <div className="mt-5 rounded-2xl bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Levar para
                  </p>
                  <p className="mt-1 text-xl font-semibold text-foreground">
                    {item.customer_name || item.orders?.customer_name || "Mesa"}
                  </p>
                  {item.notes && (
                    <p className="mt-3 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">
                      Observação: {item.notes}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex gap-2">
                  {item.status === "pending" ? (
                    <Button
                      className="w-full"
                      onClick={() => void updateStatus(item, "preparing")}
                    >
                      <ChefHat className="mr-2 h-4 w-4" />
                      Iniciar preparo
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => void updateStatus(item, "ready")}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Pronto para servir
                    </Button>
                  )}
                </div>

                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  Pedido às {new Date(item.created_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function KitchenPage() {
  const [authenticated, setAuthenticated] = React.useState(false);

  if (!authenticated) {
    return (
      <WaiterLogin
        onLogin={() => setAuthenticated(true)}
        title="Acesso da cozinha"
        description="Entre com uma conta da equipe para visualizar e atualizar os pratos em preparo."
      />
    );
  }

  return <KitchenBoard />;
}
