import React, { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface DateTimePickerProps {
  onDateTimeSelect?: (date: Date | undefined, timeSlot: TimeSlot | null) => void;
  selectedDate?: Date;
  selectedTimeSlot?: TimeSlot | null;
}

const BASE_SLOTS: TimeSlot[] = [
  { id: "1130", time: "11:30", available: true },
  { id: "1200", time: "12:00", available: true },
  { id: "1230", time: "12:30", available: false },
  { id: "1300", time: "13:00", available: true },
  { id: "1330", time: "13:30", available: true },
  { id: "1730", time: "17:30", available: true },
  { id: "1800", time: "18:00", available: true },
  { id: "1830", time: "18:30", available: true },
  { id: "1900", time: "19:00", available: true },
  { id: "1930", time: "19:30", available: false },
  { id: "2000", time: "20:00", available: true },
  { id: "2030", time: "20:30", available: true },
];

const DateTimePicker = ({
  onDateTimeSelect = () => {},
  selectedDate,
  selectedTimeSlot,
}: DateTimePickerProps) => {
  const date = selectedDate;
  const timeSlot = selectedTimeSlot ?? null;
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    setAvailableTimeSlots(date ? BASE_SLOTS : []);
  }, [date]);

  const selectedTimeIsValid = useMemo(() => {
    if (!timeSlot) return false;
    return availableTimeSlots.some((slot) => slot.id === timeSlot.id && slot.available);
  }, [availableTimeSlots, timeSlot]);

  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <Label className="text-sm font-semibold text-foreground">Escolha a data</Label>
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Passo 01</span>
        </div>
        <div className="overflow-hidden bg-muted/20 p-2 sm:p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => onDateTimeSelect(newDate, null)}
            disabled={(candidate) => {
              const normalized = new Date(candidate);
              normalized.setHours(0, 0, 0, 0);
              return normalized < today;
            }}
            className="mx-auto rounded-none border-0 bg-transparent"
          />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <Label className="text-sm font-semibold text-foreground">Escolha o horário</Label>
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Passo 02</span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
          {availableTimeSlots.map((slot) => {
            const selected = timeSlot?.id === slot.id;

            return (
              <Button
                key={slot.id}
                type="button"
                variant="ghost"
                disabled={!slot.available}
                onClick={() => slot.available && onDateTimeSelect(date, slot)}
                className={
                  selected
                    ? "h-11 rounded-full bg-primary px-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                    : "h-11 rounded-full bg-muted/25 px-2 text-sm text-foreground hover:bg-muted/45 disabled:cursor-not-allowed disabled:opacity-30"
                }
              >
                {slot.time}
              </Button>
            );
          })}
        </div>

        {!date && (
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Selecione uma data para visualizar os horários disponíveis.
          </p>
        )}

        {date && !timeSlot && (
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Os horários indisponíveis permanecem visíveis para deixar a ocupação clara.
          </p>
        )}

        {date && timeSlot && selectedTimeIsValid && (
          <div className="mt-6 bg-primary/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Sua escolha</p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {date.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })} às {timeSlot.time}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;
