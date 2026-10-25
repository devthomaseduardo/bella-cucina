import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface HeroSectionProps {
  backgroundImage?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  onCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
}

const signals = [
  { label: "Pedido", value: "QR na mesa" },
  { label: "Reserva", value: "Online" },
  { label: "Menu", value: "PT · EN · IT" },
];

const HeroSection = ({
  backgroundImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=85",
  eyebrow = "Fine dining",
  title = "Bem-vindo ao Nosso Restaurante",
  subtitle = "Experimente as melhores delícias culinárias com nosso cardápio cuidadosamente elaborado e serviço excepcional.",
  ctaText = "Ver Cardápio",
  secondaryCtaText = "Fazer Reserva",
  onCtaClick = () => {},
  onSecondaryCtaClick = () => {},
}: HeroSectionProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0705]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="h-full w-full object-cover object-[center_30%]"
          {...{ fetchpriority: "high" }}
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,5,0.55)_0%,rgba(10,7,5,0.25)_35%,rgba(10,7,5,0.92)_78%,#0a0705_100%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,7,5,0.75)_0%,rgba(10,7,5,0.35)_50%,rgba(10,7,5,0.55)_100%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(196,78,48,0.14),transparent_50%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-screen-2xl flex-col justify-end px-5 pb-10 pt-28 sm:px-6 sm:pb-14 md:px-8 md:pb-16 lg:justify-center lg:pb-20">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
            <span className="h-px w-8 bg-[hsl(var(--accent))]" aria-hidden />
            {eyebrow}
          </p>

          <h1 className="mt-5 font-display text-[clamp(3.5rem,12vw,7.5rem)] leading-[0.88] tracking-[-0.02em] text-white">
            Bella
            <span className="block text-white/90">Cucina</span>
          </h1>

          <p className="mt-3 font-display text-xl text-white/55 sm:text-2xl md:text-3xl">
            {title}
          </p>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={onCtaClick}
              className="h-12 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_18px_50px_-20px_hsl(var(--primary))] transition hover:bg-primary/90 hover:shadow-[0_22px_60px_-18px_hsl(var(--primary))]"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onSecondaryCtaClick}
              className="h-12 rounded-full border-white/20 bg-white/[0.06] px-7 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.12] hover:text-white"
            >
              {secondaryCtaText}
            </Button>
          </div>
        </motion.div>

        {/* Bottom signals bar */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl sm:mt-16 lg:mt-20"
        >
          {signals.map((item) => (
            <div
              key={item.label}
              className="bg-black/20 px-4 py-4 text-center sm:px-6 sm:py-5 sm:text-left"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                {item.label}
              </p>
              <p className="mt-1.5 font-display text-lg text-white sm:text-xl">
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("featured")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="mx-auto mt-8 hidden h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.06] text-white/55 transition hover:bg-white/[0.12] hover:text-white md:grid"
          aria-label="Ver destaques"
        >
          <ChevronDown className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
