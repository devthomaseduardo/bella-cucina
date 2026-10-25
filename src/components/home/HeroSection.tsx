import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Clock, MapPin, QrCode } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { RESTAURANT, hoursForDay } from "@/data/restaurant";

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

const today = hoursForDay();

/** Unsplash serves resized, compressed variants via query params. */
function heroUrl(src: string, width: number, height: number) {
  if (!src.includes("images.unsplash.com")) return src;
  const url = new URL(src);
  url.search = new URLSearchParams({
    w: String(width),
    h: String(height),
    fit: "crop",
    auto: "format",
    q: "75",
  }).toString();
  return url.toString();
}

// Practical info first: where, when, how to order.
const signals = [
  { icon: MapPin, label: "Endereço", value: RESTAURANT.shortLocation, href: RESTAURANT.mapsUrl },
  { icon: Clock, label: "Hoje", value: today ? `${today.opens} às ${today.closes}` : "Fechado" },
  { icon: QrCode, label: "Pedido", value: "QR na mesa" },
];

const HeroSection = ({
  backgroundImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=85",
  eyebrow = "Fine dining",
  title = "Bem-vindo ao Nosso Restaurante",
  subtitle = "Experimente as melhores delícias culinárias com nosso cardápio cuidadosamente elaborado e serviço excepcional.",
  ctaText = "Ver cardápio",
  secondaryCtaText = "Reservar mesa",
  onCtaClick = () => {},
  onSecondaryCtaClick = () => {},
}: HeroSectionProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0705]">
      {/* Background image */}
      <div className="absolute inset-0">
        {/* Right-sized hero: 800x1200 portrait on phones, 1920x1080 on desktop. */}
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={`${heroUrl(backgroundImage, 800, 1200)} 1x, ${heroUrl(backgroundImage, 1200, 1800)} 2x`}
          />
          <img
            src={heroUrl(backgroundImage, 1920, 1080)}
            srcSet={`${heroUrl(backgroundImage, 1280, 720)} 1280w, ${heroUrl(backgroundImage, 1920, 1080)} 1920w, ${heroUrl(backgroundImage, 2560, 1440)} 2560w`}
            sizes="100vw"
            width={1920}
            height={1080}
            alt=""
            decoding="async"
            className="h-full w-full object-cover object-[center_30%]"
            {...{ fetchpriority: "high" }}
          />
        </picture>
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

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-screen-2xl flex-col justify-end px-5 pb-28 pt-28 sm:px-6 sm:pb-14 md:px-8 md:pb-16 lg:justify-center lg:pb-20">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[hsl(var(--accent))]">
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
              className="bg-primary text-primary-foreground shadow-[0_18px_50px_-20px_hsl(var(--primary))] transition hover:bg-primary/90 hover:shadow-[0_22px_60px_-18px_hsl(var(--primary))]"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onSecondaryCtaClick}
              className="border-white/20 bg-white/[0.06] text-white backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.12] hover:text-white"
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
          {signals.map((item) => {
            const content = (
              <>
                <p className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.12em] text-white/50 sm:justify-start">
                  <item.icon className="h-3.5 w-3.5 text-[hsl(var(--accent))]" aria-hidden />
                  {item.label}
                </p>
                <p className="mt-1.5 font-display text-base leading-snug text-white sm:text-xl">
                  {item.value}
                </p>
              </>
            );
            const cellClass =
              "block min-w-0 bg-black/20 px-2 py-4 text-center sm:px-6 sm:py-5 sm:text-left";
            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`${cellClass} transition hover:bg-white/[0.06]`}
              >
                {content}
              </a>
            ) : (
              <div key={item.label} className={cellClass}>
                {content}
              </div>
            );
          })}
        </motion.div>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("galeria")
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
