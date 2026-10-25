import React from "react";
import {
  Accessibility,
  ArrowUpRight,
  Car,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  QrCode,
  Sun,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useI18n } from "@/i18n/I18nProvider";
import { RESTAURANT, hoursForDay } from "@/data/restaurant";
import { cn } from "@/lib/utils";

const AMENITY_ICONS: Record<string, LucideIcon> = {
  "Área externa": Sun,
  "Wi-Fi": Wifi,
  Valet: Car,
  Acessível: Accessibility,
  "Pet friendly": PawPrint,
  "Pedido pelo QR": QrCode,
};

const VisitSection = () => {
  const { t } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const today = hoursForDay();

  return (
    <section id="contact" className="scroll-mt-24 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--accent))]">
              {t("contact.kicker")}
            </p>
            <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
              {t("contact.visitTitle")}
            </h2>

            <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
              <div className="flex gap-4 py-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <dt className="sr-only">Endereço</dt>
                  <dd className="text-foreground">{RESTAURANT.address}</dd>
                  <a
                    href={RESTAURANT.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    Como chegar
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </div>

              <div className="py-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Horários
                </dt>
                <dd className="mt-2 space-y-1">
                  {RESTAURANT.hours.map((entry) => (
                    <p
                      key={entry.label}
                      className={cn(
                        "flex justify-between gap-4 text-sm",
                        entry === today ? "font-semibold text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <span>
                        {entry.label}
                        {entry === today && <span className="ml-2 text-primary">· hoje</span>}
                      </span>
                      <span>
                        {entry.opens} às {entry.closes}
                      </span>
                    </p>
                  ))}
                </dd>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 py-4 text-sm">
                <dt className="sr-only">Contato</dt>
                <dd>
                  <a
                    href={`tel:+55${RESTAURANT.phone.replace(/\D/g, "")}`}
                    className="inline-flex items-center gap-2 text-foreground hover:text-primary"
                  >
                    <Phone className="h-4 w-4 text-primary" aria-hidden />
                    {RESTAURANT.phone}
                  </a>
                </dd>
                <dd>
                  <a
                    href={`mailto:${RESTAURANT.email}`}
                    className="inline-flex items-center gap-2 text-foreground hover:text-primary"
                  >
                    <Mail className="h-4 w-4 text-primary" aria-hidden />
                    {RESTAURANT.email}
                  </a>
                </dd>
              </div>
            </dl>

            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3" aria-label="Comodidades">
              {RESTAURANT.amenities.map((amenity) => {
                const Icon = AMENITY_ICONS[amenity] ?? Sun;
                return (
                  <li key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden />
                    {amenity}
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] lg:col-span-7"
          >
            <iframe
              src={RESTAURANT.mapsEmbedUrl}
              className="h-[280px] w-full grayscale-[0.4] sm:h-full sm:min-h-[420px]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa: ${RESTAURANT.address}`}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisitSection;
