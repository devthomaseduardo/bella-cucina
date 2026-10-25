import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import type { SupportedLanguage } from "@/i18n/types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const HERO_BG =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2400&q=88";

const languages: {
  code: SupportedLanguage;
  label: string;
  native: string;
}[] = [
  { code: "pt", label: "Português", native: "BR" },
  { code: "en", label: "English", native: "EN" },
  { code: "it", label: "Italiano", native: "IT" },
];

const LanguageSelectPage = () => {
  const navigate = useNavigate();
  const { setLanguage, t } = useI18n();
  const shouldReduceMotion = useReducedMotion();

  const pick = (lang: SupportedLanguage) => {
    setLanguage(lang);
    navigate("/menu", { replace: true });
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#0a0705]">
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="h-full w-full object-cover object-center"
          {...{ fetchpriority: "high" }}
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,6,4,0.94)_0%,rgba(8,6,4,0.72)_48%,rgba(8,6,4,0.88)_100%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,78,48,0.12),transparent_55%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-screen-2xl flex-col justify-center px-6 py-16 md:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[hsl(var(--accent))]">
              Bella Cucina
            </p>

            <h1 className="mt-5 max-w-[11ch] font-display text-[clamp(3.25rem,9vw,5.75rem)] leading-[0.9] tracking-[-0.02em] text-white">
              {t("languageSelect.title")}
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              {t("languageSelect.subtitle")}
            </p>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.2em] text-white/40">
              <span>Cardápio digital</span>
              <span>Pedidos por QR</span>
              <span>Reservas online</span>
            </div>

            <p className="mt-6 max-w-sm text-xs leading-relaxed text-white/35">
              {t("languageSelect.note")}
            </p>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{
              delay: 0.12,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5 shadow-[0_32px_100px_-40px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-7"
          >
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
              Idioma · Language · Lingua
            </p>
            <p className="mt-2 font-display text-2xl text-white sm:text-3xl">
              Escolha o idioma
            </p>

            <div className="mt-6 grid gap-3">
              {languages.map((lang, i) => (
                <motion.div
                  key={lang.code}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 12 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.18 + i * 0.06,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => pick(lang.code)}
                    className={cn(
                      "group flex h-[3.6rem] w-full items-center justify-between rounded-2xl border-white/12 bg-white/[0.04] px-5 text-left text-base font-medium !text-white",
                      "transition-all duration-300 hover:border-primary/50 hover:bg-white/[0.09] hover:!text-white",
                      "focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/[0.06] text-[11px] font-semibold tracking-wider text-primary">
                        {lang.native}
                      </span>
                      {lang.label}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 text-white/40 transition group-hover:translate-x-1 group-hover:text-primary"
                      aria-hidden
                    />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectPage;
