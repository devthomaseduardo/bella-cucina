import React from "react";
import { Check, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DateTimePicker from "./DateTimePicker";
import ReservationForm from "./ReservationForm";
import { supabase } from "@/lib/supabase";
import { motion, useReducedMotion } from "framer-motion";

interface ReservationSectionProps {
  restaurantName?: string;
  restaurantImage?: string;
  title?: string;
  description?: string;
}

const ReservationSection = ({
  restaurantName = "Bella Cucina",
  restaurantImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
  title = "Reservas",
  description = "Escolha data e horário, preencha seus dados e envie sua solicitação em poucos passos.",
}: ReservationSectionProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = React.useState(1);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [confirmation, setConfirmation] = React.useState<{
    name?: string;
    partySize?: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<{
    id: string;
    time: string;
    available: boolean;
  } | null>(null);

  const handleDateTimeSelect = (
    date: Date | undefined,
    timeSlot: { id: string; time: string; available: boolean } | null,
  ) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setSubmitError("");
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!selectedDate || !selectedTimeSlot?.time || submitting) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const [hours, minutes] = selectedTimeSlot.time.split(":").map(Number);
      const reservationDate = new Date(selectedDate);
      reservationDate.setHours(hours, minutes, 0, 0);

      const payload = {
        customer_name: String(values.name || ""),
        customer_email: String(values.email || ""),
        customer_phone: String(values.phone || ""),
        party_size: Number(values.partySize || 2),
        datetime_iso: reservationDate.toISOString(),
        special_requests: String(values.specialRequests || ""),
        status: "pending",
      };

      const hasSupabaseConfig = Boolean(
        import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
      );

      if (hasSupabaseConfig) {
        const { error } = await supabase.from("reservations").insert(payload);
        if (error) throw error;
      }

      setConfirmation({
        name: typeof values.name === "string" ? values.name : undefined,
        partySize: typeof values.partySize === "string" ? values.partySize : undefined,
      });
      setStep(3);
    } catch (error) {
      console.error("Falha ao criar reserva", error);
      setSubmitError("Não foi possível enviar a reserva agora. Revise os dados e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetReservation = () => {
    setStep(1);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setConfirmation(null);
    setSubmitError("");
  };

  return (
    <section id="reservations" className="relative scroll-mt-20 overflow-hidden bg-muted/20 py-14 sm:py-16 md:py-24">
      <div className="container relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-primary sm:text-[11px]">Reservas</p>
            <h2 className="mt-3 max-w-[10ch] font-display text-4xl leading-[0.98] text-foreground sm:text-5xl md:text-6xl">
              {title}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>

            <div className="relative mt-7 h-[22rem] overflow-hidden bg-black sm:h-[28rem] lg:h-[34rem]">
              <img src={restaurantImage} alt={restaurantName} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/18 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Bella Cucina</p>
                <h3 className="mt-2 max-w-[12ch] font-display text-3xl leading-tight text-white sm:text-4xl">
                  Sua mesa, no seu tempo.
                </h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
                  Escolha o horário disponível e deixe os dados necessários para a equipe organizar a recepção.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="mb-6 grid grid-cols-3 gap-2 border-b border-white/10 pb-4">
              {["Data e horário", "Seus dados", "Solicitação"].map((label, index) => {
                const number = index + 1;
                const active = step >= number;
                return (
                  <div key={label} className="min-w-0">
                    <span className={active ? "font-display text-xl text-primary" : "font-display text-xl text-muted-foreground/40"}>
                      0{number}
                    </span>
                    <p className={active ? "mt-1 truncate text-[10px] uppercase tracking-[0.14em] text-foreground sm:text-xs" : "mt-1 truncate text-[10px] uppercase tracking-[0.14em] text-muted-foreground/50 sm:text-xs"}>
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-background p-4 sm:p-6 md:p-7">
              {step === 1 && (
                <>
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Disponibilidade</p>
                      <h3 className="mt-2 font-display text-3xl text-foreground">Quando você quer vir?</h3>
                    </div>
                    <Clock3 className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                  </div>

                  <DateTimePicker
                    onDateTimeSelect={handleDateTimeSelect}
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                  />

                  <div className="mt-7 flex justify-end">
                    <Button
                      type="button"
                      onClick={() => selectedDate && selectedTimeSlot && setStep(2)}
                      disabled={!selectedDate || !selectedTimeSlot}
                      className="w-full rounded-full sm:w-auto sm:px-7"
                    >
                      Continuar
                    </Button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Dados da reserva</p>
                      <h3 className="mt-2 font-display text-3xl text-foreground">Só precisamos do essencial.</h3>
                    </div>
                    <Button type="button" variant="ghost" onClick={() => setStep(1)} className="w-fit rounded-full px-0 text-muted-foreground hover:bg-transparent hover:text-foreground">
                      Alterar horário
                    </Button>
                  </div>

                  <ReservationForm
                    onSubmit={handleSubmit}
                    selectedDate={selectedDate}
                    selectedTime={selectedTimeSlot?.time}
                  />

                  {submitting && <p className="mt-4 text-sm text-muted-foreground">Enviando sua solicitação...</p>}
                  {submitError && <p className="mt-4 text-sm leading-6 text-destructive">{submitError}</p>}
                </>
              )}

              {step === 3 && (
                <div className="py-6 sm:py-10">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Solicitação enviada</p>
                  <h3 className="mt-2 max-w-[12ch] font-display text-4xl leading-tight text-foreground sm:text-5xl">
                    Agora a equipe confirma os detalhes.
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {confirmation?.name ? `${confirmation.name}, sua solicitação foi registrada.` : "Sua solicitação foi registrada."} A reserva permanece pendente até a confirmação da casa.
                  </p>

                  {selectedDate && selectedTimeSlot && (
                    <div className="mt-6 border-y border-white/10 py-5 text-sm">
                      <p className="font-semibold text-foreground">
                        {selectedDate.toLocaleDateString("pt-BR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })} às {selectedTimeSlot.time}
                      </p>
                      {confirmation?.partySize && (
                        <p className="mt-1 text-muted-foreground">Mesa para {confirmation.partySize} pessoas</p>
                      )}
                    </div>
                  )}

                  <Button type="button" variant="ghost" onClick={resetReservation} className="mt-6 rounded-full px-0 text-foreground hover:bg-transparent hover:text-primary">
                    Fazer outra reserva
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
