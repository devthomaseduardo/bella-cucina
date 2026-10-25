import React from "react";
import { DoorClosed, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type OpenSession = {
  id: string;
  status: "open" | "payment_pending";
  opened_at: string;
  restaurant_tables: { number: string } | null;
  table_guests: { name: string }[];
  orders: { total_price: number; status: string }[];
};

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function TableSessionsPanel() {
  const [sessions, setSessions] = React.useState<OpenSession[]>([]);

  const refresh = React.useCallback(async () => {
    const { data, error } = await supabase
      .from("table_sessions")
      .select(
        "id,status,opened_at,restaurant_tables(number),table_guests(name),orders(total_price,status)",
      )
      .neq("status", "closed")
      .order("opened_at", { ascending: true });

    if (!error && data) setSessions(data as unknown as OpenSession[]);
  }, []);

  React.useEffect(() => {
    void refresh();

    const channel = supabase
      .channel("salon:table-sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "table_sessions" },
        () => void refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => void refresh(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  const closeSession = async (sessionId: string) => {
    await supabase
      .from("table_sessions")
      .update({ status: "closed", closed_at: new Date().toISOString() })
      .eq("id", sessionId);
    await refresh();
  };

  if (!sessions.length) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Sessões atuais
          </p>
          <h2 className="mt-1 font-display text-2xl">Mesas abertas</h2>
        </div>
        <p className="max-w-sm text-right text-xs leading-5 text-muted-foreground">
          Encerrar a mesa separa esta visita da próxima e impede que uma nova ocupação receba pedidos anteriores.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sessions.map((session) => {
          const total = session.orders
            .filter((order) => order.status !== "cancelled")
            .reduce((sum, order) => sum + Number(order.total_price), 0);
          const allDelivered =
            session.orders.length > 0 &&
            session.orders.every((order) =>
              ["delivered", "cancelled"].includes(order.status),
            );

          return (
            <article
              key={session.id}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Mesa
                  </p>
                  <p className="font-display text-3xl">
                    {session.restaurant_tables?.number ?? "?"}
                  </p>
                </div>
                <p className="text-right font-display text-2xl">{money(total)}</p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <UsersRound className="h-4 w-4 text-primary" />
                {session.table_guests.length
                  ? session.table_guests.map((guest) => guest.name).join(", ")
                  : "Sem participantes identificados"}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {allDelivered ? "Consumo entregue" : "Mesa em atendimento"}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                 
                  onClick={() => void closeSession(session.id)}
                  disabled={!allDelivered}
                  title={
                    allDelivered
                      ? "Encerrar sessão desta ocupação"
                      : "Entregue ou cancele todos os pedidos antes de encerrar"
                  }
                >
                  <DoorClosed className="mr-1.5 h-3.5 w-3.5" />
                  Encerrar mesa
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
