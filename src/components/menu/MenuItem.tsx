import * as React from "react";
import { Button } from "@/components/ui/button";
import AddToCartModal from "./AddToCartModal";
import { useI18n } from "@/i18n/I18nProvider";
import { motion } from "framer-motion";
import { Info, Plus } from "lucide-react";
import { getMenuItemDetails } from "@/data/menu-item-details";
import { formatPrice } from "@/lib/format";

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const MenuItem = ({
  id,
  name,
  description,
  price = 0,
  image,
  category,
  className,
}: MenuItemProps & { className?: string }) => {
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const categoryLabel = t(`menu.category.${category}`);
  const details = getMenuItemDetails(id);

  return (
    <>
      <motion.article
        whileHover={{ y: -3 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={className}
      >
        <div
          role="button"
          tabIndex={0}
          className="group flex h-full w-full cursor-pointer flex-col overflow-hidden bg-muted/20 text-card-foreground transition duration-300 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          onClick={() => setIsModalOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setIsModalOpen(true);
            }
          }}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-black/10" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
                {categoryLabel}
              </span>
              <span className="font-display text-2xl text-white">{formatPrice(price)}</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-display text-2xl leading-tight text-foreground">{name}</h3>

            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>

            {(details.allergens.length > 0 || details.dietary?.length) && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {details.dietary?.slice(0, 1).map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-100"
                  >
                    {label}
                  </span>
                ))}
                {details.allergens.slice(0, 2).map((allergen) => (
                  <span
                    key={allergen}
                    className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-amber-100"
                  >
                    Contém {allergen}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 group-hover:text-foreground group-hover:underline">
                <Info className="h-4 w-4" aria-hidden />
                Detalhes
              </span>
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" aria-hidden />
                {t("menu.addToOrder")}
              </Button>
            </div>
          </div>
        </div>
      </motion.article>

      <AddToCartModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={{ id, name, description, price, image, category }}
      />
    </>
  );
};

export default MenuItem;
