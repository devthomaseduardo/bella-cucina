/** Single source for the restaurant's public details (hero, visit section, footer). */

export type OpeningHours = {
  /** 0 = Sunday … 6 = Saturday */
  days: number[];
  label: string;
  opens: string;
  closes: string;
};

const HOURS: OpeningHours[] = [
  { days: [1, 2, 3, 4], label: "Segunda a quinta", opens: "11h", closes: "22h" },
  { days: [5, 6], label: "Sexta e sábado", opens: "11h", closes: "23h" },
  { days: [0], label: "Domingo", opens: "12h", closes: "21h" },
];

export const RESTAURANT = {
  name: "Bella Cucina",
  neighborhood: "Jardins, São Paulo",
  shortLocation: "Jardins · SP",
  address: "Alameda Lorena, 1234 — Jardins, São Paulo",
  phone: "(11) 1234-5678",
  email: "contato@bellacucina.com",
  mapsUrl: "https://maps.google.com/?q=Alameda+Lorena+1234+Jardins+Sao+Paulo",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Alameda+Lorena+1234+Jardins+Sao+Paulo&output=embed",
  hours: HOURS,
  amenities: ["Área externa", "Wi-Fi", "Valet", "Acessível", "Pet friendly", "Pedido pelo QR"],
};

export function hoursForDay(date = new Date()) {
  const day = date.getDay();
  return RESTAURANT.hours.find((entry) => entry.days.includes(day)) ?? null;
}
