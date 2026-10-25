import React, { useMemo } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const GALLERY_SRC: { src: string; captionKey: string; tone: string }[] = [
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=82",
    captionKey: "1",
    tone: "Sala",
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=82",
    captionKey: "2",
    tone: "Área externa",
  },
  {
    src: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=900&q=82",
    captionKey: "3",
    tone: "Massa",
  },
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=82",
    captionKey: "4",
    tone: "Forno",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Ossobuco.jpg",
    captionKey: "5",
    tone: "Brasa",
  },
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
    <section id="galeria" className="section-cream grain relative w-full scroll-mt-20 overflow-hidden py-16 md:py-24">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 grid gap-4 md:mb-10 lg:grid-cols-2 lg:items-end"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {t("gallery.kicker")}
            </p>
            <h2 className="mt-3 font-display text-4xl leading-[0.98] text-foreground sm:text-5xl md:text-6xl">
              Uma noite na Bella.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground lg:justify-self-end">
            Luz baixa, massa fresca feita no dia e o forno a lenha à vista. Você pede pelo celular e a
            noite segue sem interrupções.
          </p>
        </motion.div>

        {/* Mosaic: one large photo + four smaller ones; 2x2 grid on phones. */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:grid-rows-2">
          {items.map((item, index) => (
            <motion.figure
              key={item.src}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : index * 0.05 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-black",
                index === 0
                  ? "col-span-2 aspect-[16/10] lg:row-span-2 lg:aspect-auto"
                  : "aspect-square lg:aspect-[4/3]",
              )}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
                  {item.tone}
                </span>
                {index === 0 && (
                  <p className="mt-1 max-w-md font-display text-xl leading-tight text-white sm:text-3xl">
                    {item.alt}
                  </p>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryStrip;
