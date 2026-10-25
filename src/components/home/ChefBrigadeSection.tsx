import React from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { motion, useReducedMotion } from "framer-motion";

const CHEF_IMG =
  "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1100&q=85";

export function ChefBrigadeSection() {
  const { t } = useI18n();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="cucina" className="relative scroll-mt-24 overflow-hidden bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 1, x: -28 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:col-span-5"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_90px_-56px_rgba(0,0,0,0.9)]">
              <img
                src={CHEF_IMG}
                alt={t("chef.imageChefAlt")}
                className="aspect-[4/3] w-full object-cover object-top lg:aspect-[3/4]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/86 via-black/30 to-transparent p-6 pt-28 text-white">
                <p className="font-display text-2xl sm:text-3xl">{t("chef.role")}</p>
              </div>
            </div>

          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 1, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <p className="inline-flex rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[hsl(var(--accent))]">
              {t("chef.kicker")}
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-3xl text-foreground sm:text-4xl md:text-5xl">
              {t("chef.title")}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
              {t("chef.p1")}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              {t("chef.p2")}
            </p>

            <div className="mt-8 flex gap-4 rounded-2xl border border-primary/20 bg-primary/[0.08] p-5 md:p-6">
              <span className="font-display text-5xl leading-none text-primary" aria-hidden>
                "
              </span>
              <div>
                <p className="text-sm italic leading-relaxed text-foreground/92 md:text-base">
                  {t("chef.quote")}
                </p>
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  {t("chef.quoteBy")}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="font-display text-xl text-foreground">{t("chef.valuesTitle")}</h3>
              <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-muted-foreground sm:grid-cols-3">
                {(["value1", "value2", "value3"] as const).map((key, index) => (
                  <li key={key} className="flex gap-3">
                    <span className="font-display text-lg leading-none text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {t(`chef.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ChefBrigadeSection;
