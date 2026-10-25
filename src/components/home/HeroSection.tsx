import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, MapPin, QrCode } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { RESTAURANT, hoursForDay } from "@/data/restaurant";

interface HeroSectionProps {
  backgroundImage?: string;
  sideImage?: string;
  sideImageLabel?: string;
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
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  if (url.hostname !== "images.unsplash.com") return src;
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

const ease = [0.22, 1, 0.36, 1] as const;

const HeroSection = ({
  backgroundImage = "https://images.unsplash.com/photo-1588013273468-315fd88ea34c",
  sideImage = "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
  sideImageLabel = "Spaghetti alle vongole",
  eyebrow = "Trattoria contemporânea",
  title = "Alma italiana, mesa brasileira",
  subtitle = "Do antipasto à sobremesa, cozinha italiana de verdade.",
  ctaText = "Ver cardápio",
  secondaryCtaText = "Reservar mesa",
  onCtaClick = () => {},
  onSecondaryCtaClick = () => {},
}: HeroSectionProps) => {
  const shouldReduceMotion = useReducedMotion();
  const enter = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease },
        };

  return (
    <section className="grain relative w-full overflow-hidden bg-[#0b0706]">
      {/* Warm glow behind the headline on desktop. */}
      <div
        className="pointer-events-none absolute -left-40 top-1/4 hidden h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,hsl(7_76%_45%/0.22),transparent_65%)] lg:block"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-screen-2xl items-end gap-10 px-5 pb-28 pt-24 sm:px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-16 lg:pt-28">
        <div>
          {/* Phones: the dish leads, as a card above the headline. */}
          <motion.figure
            {...enter(0)}
            className="relative mb-8 overflow-hidden rounded-[1.75rem] lg:hidden"
          >
            <img
              src={heroUrl(backgroundImage, 800, 640)}
              srcSet={`${heroUrl(backgroundImage, 800, 640)} 1x, ${heroUrl(backgroundImage, 1200, 960)} 2x`}
              width={800}
              height={640}
              alt="Spaghetti alla carbonara com Parmigiano Reggiano"
              decoding="async"
              className="aspect-[5/4] w-full object-cover"
              {...{ fetchpriority: "high" }}
            />
            <figcaption className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-md">
              Massa fresca todos os dias
            </figcaption>
          </motion.figure>

          <motion.p
            {...enter(0)}
            className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--accent))]"
          >
            <span className="h-px w-10 bg-[hsl(var(--accent))]" aria-hidden />
            {eyebrow}
          </motion.p>

          <motion.h1
            {...enter(0.05)}
            className="mt-5 font-display text-[clamp(3.75rem,13vw,9rem)] leading-[0.86] tracking-[-0.03em] text-white"
          >
            Bella
            <span className="block italic text-[hsl(var(--accent))]">Cucina</span>
          </motion.h1>

          <motion.p {...enter(0.12)} className="mt-6 max-w-xl font-display text-2xl leading-snug text-white sm:text-3xl">
            {title}
          </motion.p>
          <motion.p {...enter(0.16)} className="mt-3 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            {subtitle}
          </motion.p>

          <motion.div {...enter(0.22)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={onCtaClick}
              className="shadow-[0_18px_50px_-20px_hsl(var(--primary))] hover:shadow-[0_22px_60px_-18px_hsl(var(--primary))]"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onSecondaryCtaClick}
              className="border-white/25 bg-white/[0.06] text-white backdrop-blur-md hover:border-white/40 hover:bg-white/[0.12] hover:text-white"
            >
              {secondaryCtaText}
            </Button>
          </motion.div>

          <motion.dl
            {...enter(0.3)}
            className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl lg:mt-14 lg:max-w-xl"
          >
            {signals.map((item) => {
              const content = (
                <>
                  <dt className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.12em] text-white/55 sm:justify-start">
                    <item.icon className="h-3.5 w-3.5 text-[hsl(var(--accent))]" aria-hidden />
                    {item.label}
                  </dt>
                  <dd className="mt-1.5 font-display text-base leading-snug text-white sm:text-lg">{item.value}</dd>
                </>
              );
              const cellClass = "block min-w-0 bg-black/30 px-2 py-4 text-center sm:px-5 sm:text-left";
              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${cellClass} transition hover:bg-white/[0.08]`}
                >
                  {content}
                </a>
              ) : (
                <div key={item.label} className={cellClass}>
                  {content}
                </div>
              );
            })}
          </motion.dl>
        </div>

        {/* Desktop: dish photo as the protagonist, with a floating "today" card. */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="relative hidden h-[min(78vh,46rem)] lg:block"
        >
          <img
            src={heroUrl(backgroundImage, 1200, 1500)}
            srcSet={`${heroUrl(backgroundImage, 900, 1125)} 900w, ${heroUrl(backgroundImage, 1200, 1500)} 1200w, ${heroUrl(backgroundImage, 1600, 2000)} 1600w`}
            sizes="(min-width: 1024px) 45vw, 100vw"
            width={1200}
            height={1500}
            alt="Spaghetti alla carbonara com Parmigiano Reggiano"
            decoding="async"
            className="h-full w-full rounded-[2rem] object-cover shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
            {...{ fetchpriority: "high" }}
          />
          <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" aria-hidden />

          <figure className="absolute -bottom-6 -left-10 flex w-72 items-center gap-4 rounded-2xl border border-white/10 bg-[#120c0a]/90 p-3 pr-5 shadow-2xl backdrop-blur-xl">
            <img
              src={heroUrl(sideImage, 200, 200)}
              width={80}
              height={80}
              alt=""
              loading="lazy"
              className="h-20 w-20 rounded-xl object-cover"
            />
            <figcaption>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[hsl(var(--accent))]">
                Feito hoje
              </span>
              <p className="mt-1 font-display text-lg leading-tight text-white">{sideImageLabel}</p>
            </figcaption>
          </figure>

          <span className="absolute right-6 top-6 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur-md">
            Massa fresca todos os dias
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
