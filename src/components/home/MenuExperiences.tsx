import React from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    key: "carta" as const,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/cc/Tagliatelle_rag%C3%B9_bolognese_01.jpg",
    code: "01",
    accent: "from-red-500/28",
  },
  {
    key: "degustacao" as const,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
    code: "02",
    accent: "from-amber-400/24",
  },
  {
    key: "aperitivo" as const,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80",
    code: "03",
    accent: "from-sky-400/18",
  },
];

export function MenuExperiences() {
  const { t } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  return (
    <section
      id="esperienze"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-muted/30 py-16 md:py-24"
    >
      <div className="absolute inset-0 bella-grid-bg opacity-25" aria-hidden />
      <div className="container relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 1, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--accent))]">
            {t("experiences.kicker")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl md:text-5xl">
            {t("experiences.title")}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t("experiences.subtitle")}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((c, index) => (
              <motion.button
              key={c.key}
              type="button"
              onClick={() => navigate("/cardapio")}
                initial={shouldReduceMotion ? false : { opacity: 1, y: 24 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: shouldReduceMotion ? 0 : index * 0.08,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              className={cn(
                  "group relative min-h-[28rem] overflow-hidden rounded-[1.5rem] border border-white/10 text-left",
                  "bg-white/[0.045] shadow-[0_24px_80px_-56px_rgba(0,0,0,0.9)] transition duration-300",
                  "hover:-translate-y-1 hover:border-primary/35 hover:bg-white/[0.065]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
                <div className="absolute inset-0">
                <img
                  src={c.image}
                  alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                  loading="lazy"
                />
                  <div className={cn("absolute inset-0 bg-gradient-to-t via-black/36 to-black/12", c.accent)} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-transparent to-transparent" />
              </div>

                <div className="relative z-10 flex h-full min-h-[28rem] flex-col justify-between p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur">
                  Bella Cucina
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 font-display text-lg text-[hsl(var(--accent))] backdrop-blur">
                      {c.code}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl leading-tight text-white transition-colors group-hover:text-[hsl(var(--accent))] sm:text-3xl">
                  {t(`experiences.cards.${c.key}.title`)}
                </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/[0.78] transition-colors group-hover:text-white/[0.92]">
                  {t(`experiences.cards.${c.key}.body`)}
                </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors group-hover:text-[hsl(var(--accent))]">
                  {t("experiences.cta")}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                </span>
              </div>
                </div>
              </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MenuExperiences;
