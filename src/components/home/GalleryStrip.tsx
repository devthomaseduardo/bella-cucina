import React, { useMemo } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { motion, useReducedMotion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const GALLERY_SRC: { src: string; captionKey: string; tone: string }[] = [
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=82",
    captionKey: "1",
    tone: "Sala",
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1000&q=82",
    captionKey: "2",
    tone: "Cozinha",
  },
  {
    src: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=1000&q=82",
    captionKey: "3",
    tone: "Massa",
  },
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000&q=82",
    captionKey: "4",
    tone: "Forno",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Ossobuco.jpg",
    captionKey: "5",
    tone: "Brasa",
  },
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=82",
    captionKey: "6",
    tone: "Reserva",
  },
];

const storyBeats = [
  { code: "01", title: "Chegada", body: "Mesa pronta, luz baixa e recepção sem pressa." },
  { code: "02", title: "Cozinha", body: "Massa fresca, forno aceso e finalização à vista." },
  { code: "03", title: "Mesa", body: "Pedido pelo celular sem interromper a experiência." },
];

const GalleryStrip = () => {
  const { t } = useI18n();
  const shouldReduceMotion = useReducedMotion();

  const items = useMemo(
    () =>
      GALLERY_SRC.map((row) => ({
        src: row.src,
        alt: t(`gallery.caption.${row.captionKey}`),
        tone: row.tone,
      })),
    [t],
  );

  return (
    <section id="featured" className="relative w-full scroll-mt-20 overflow-hidden bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 grid gap-5 md:mb-10 lg:grid-cols-[0.8fr_1fr] lg:items-end"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:text-xs">
              {t("gallery.kicker")}
            </p>
            <h2 className="mt-3 max-w-[10ch] font-display text-4xl leading-[0.98] text-foreground sm:text-5xl md:text-6xl">
              Uma noite na Bella.
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base lg:justify-self-end">
            Sala, cozinha e atendimento foram pensados como uma única experiência. O digital entra para reduzir espera, não para competir com a mesa.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)] lg:gap-6">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-w-0 overflow-hidden bg-black"
          >
            <Carousel opts={{ align: "start", loop: true }} aria-label="Cenas da experiência Bella Cucina">
              <CarouselContent>
                {items.slice(0, 5).map((item, index) => (
                  <CarouselItem key={item.src}>
                    <figure className="relative h-[28rem] overflow-hidden sm:h-[34rem] lg:h-[42rem]">
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading={index === 0 ? "eager" : "lazy"}
                        className="h-full w-full object-cover transition duration-1000 ease-out hover:scale-[1.025]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/12 to-black/10" />
                      <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7 md:p-9">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                              {String(index + 1).padStart(2, "0")} · {item.tone}
                            </span>
                            <p className="mt-2 max-w-xl font-display text-3xl leading-tight text-white sm:text-4xl md:text-5xl">
                              {item.alt}
                            </p>
                          </div>
                          <span className="hidden shrink-0 text-xs uppercase tracking-[0.16em] text-white/45 sm:block">
                            Bella Cucina
                          </span>
                        </div>
                      </figcaption>
                    </figure>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="absolute right-4 top-4 z-10 flex gap-2 sm:right-6 sm:top-6">
                <CarouselPrevious className="static h-10 w-10 translate-y-0 border-0 bg-black/55 text-white backdrop-blur-md hover:bg-black/75 hover:text-white" />
                <CarouselNext className="static h-10 w-10 translate-y-0 border-0 bg-black/55 text-white backdrop-blur-md hover:bg-black/75 hover:text-white" />
              </div>
            </Carousel>
          </motion.div>

          <motion.aside
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.58, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-between bg-muted/20 p-5 sm:p-6 lg:p-7"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Ritual da noite</p>
              <h3 className="mt-3 max-w-[12ch] font-display text-3xl leading-tight text-foreground">
                O serviço acompanha o ritmo da mesa.
              </h3>

              <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {storyBeats.map((beat) => (
                  <div key={beat.code} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
                    <span className="font-display text-xl text-primary">{beat.code}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{beat.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{beat.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <figure className="relative mt-6 min-h-[14rem] overflow-hidden lg:min-h-[16rem]">
              <img src={items[5]?.src} alt={items[5]?.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/12 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <span className="text-xs uppercase tracking-[0.16em] text-primary">Reserva</span>
                <p className="mt-2 max-w-[20rem] font-display text-2xl leading-tight text-white">
                  Planeje a noite em poucos passos.
                </p>
              </figcaption>
            </figure>
          </motion.aside>
        </div>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible">
          {items.slice(1, 5).map((item, index) => (
            <figure key={`${item.src}-${index}`} className="group relative aspect-[4/3] w-[72vw] max-w-[19rem] shrink-0 overflow-hidden sm:w-auto sm:max-w-none">
              <img src={item.src} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4">
                <span className="text-xs uppercase tracking-[0.16em] text-primary">{item.tone}</span>
                <p className="mt-1 line-clamp-1 text-sm font-medium text-white">{item.alt}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryStrip;
