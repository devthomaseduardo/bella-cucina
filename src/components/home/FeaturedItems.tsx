import React from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useI18n } from "@/i18n/I18nProvider";
import { FEATURED_HIGHLIGHT_ITEMS } from "@/data/italian-menu";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/format";

interface FeaturedItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
}

interface FeaturedItemsProps {
  items?: FeaturedItem[];
  title?: string;
  subtitle?: string;
}

const DEFAULT_FEATURED: FeaturedItem[] = FEATURED_HIGHLIGHT_ITEMS;

const FeaturedItems = ({ items = DEFAULT_FEATURED, title, subtitle }: FeaturedItemsProps) => {
  const { t } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const resolvedTitle = title ?? t("featured.title");
  const resolvedSubtitle = subtitle ?? t("featured.subtitle");
  const navigate = useNavigate();

  return (
    <section className="w-full overflow-hidden bg-background py-14 sm:py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 grid gap-5 md:mb-10 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-primary sm:text-[11px]">
              Destaques da cozinha
            </p>
            <h2 className="mt-3 max-w-[12ch] font-display text-4xl leading-[0.98] text-foreground sm:text-5xl md:text-6xl">
              {resolvedTitle}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              {resolvedSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cardapio")}
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary"
          >
            {t("featured.ctaFull")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </button>
        </motion.div>

        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {items.map((item, index) => (
              <CarouselItem key={item.id} className="basis-[88%] pl-4 sm:basis-[58%] md:basis-1/2 xl:basis-1/3">
                <motion.article
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ delay: shouldReduceMotion ? 0 : (index % 3) * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group h-full overflow-hidden bg-muted/20"
                >
                  <button type="button" onClick={() => navigate("/cardapio")} className="block w-full text-left">
                    <div className="relative aspect-[4/3] overflow-hidden bg-black">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/72">
                          {t(`menu.category.${item.category}`)}
                        </span>
                        <span className="font-display text-2xl text-white">{formatPrice(item.price)}</span>
                      </div>
                    </div>

                    <div className="flex min-h-[12rem] flex-col p-5 sm:min-h-[13rem] sm:p-6">
                      <h3 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
                        {item.name}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-5">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Assinatura da casa</span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground transition group-hover:text-primary">
                          Ver prato
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.article>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-5 flex justify-end gap-2">
            <CarouselPrevious className="static h-10 w-10 translate-y-0 border-0 bg-muted/40 text-foreground hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="static h-10 w-10 translate-y-0 border-0 bg-muted/40 text-foreground hover:bg-primary hover:text-primary-foreground" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedItems;
