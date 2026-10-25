import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, { message: "Informe um nome com pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Informe um e-mail válido." }),
  phone: z.string().min(10, { message: "Informe um telefone válido." }),
  partySize: z.string().min(1, { message: "Informe o número de pessoas." }),
  specialRequests: z.string().optional(),
});

type ReservationFormValues = z.infer<typeof formSchema>;

interface ReservationFormProps {
  onSubmit?: (values: ReservationFormValues) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

const fieldClass =
  "h-11 rounded-none border-0 border-b border-white/12 bg-transparent px-0 text-foreground shadow-none focus-visible:border-primary focus-visible:ring-0";

const ReservationForm = ({
  onSubmit,
  selectedDate = new Date(),
  selectedTime = "19:00",
}: ReservationFormProps) => {
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      partySize: "2",
      specialRequests: "",
    },
  });

  return (
    <div className="w-full">
      {selectedDate && selectedTime && (
        <div className="mb-7 border-y border-white/10 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Horário escolhido</p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {selectedDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })} às {selectedTime}
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => onSubmit?.(values))} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} className={fieldClass} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de pessoas</FormLabel>
                  <FormControl>
                    <Input placeholder="2" {...field} type="number" min="1" max="20" className={fieldClass} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} inputMode="tel" className={fieldClass} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} type="email" className={fieldClass} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Restrições alimentares, ocasião especial ou preferência de mesa."
                    className="min-h-[110px] resize-none rounded-none border-0 border-b border-white/12 bg-transparent px-0 shadow-none focus-visible:border-primary focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>A equipe confirma disponibilidade e detalhes antes da reserva ficar confirmada.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2 w-full sm:w-auto sm:px-8">
            Enviar solicitação
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ReservationForm;
