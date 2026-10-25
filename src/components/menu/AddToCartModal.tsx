import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus } from "lucide-react";
import { useCart } from "../cart/CartContext";
import { useI18n } from "@/i18n/I18nProvider";
import { getMenuItemDetails } from "@/data/menu-item-details";
import { formatPrice } from "@/lib/format";

interface AddToCartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
  };
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ open, onOpenChange, item }) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [itemCustomerName, setItemCustomerName] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, customerName } = useCart();
  const { t } = useI18n();
  const categoryLabel = t(`menu.category.${item.category}`);
  const details = getMenuItemDetails(item.id);

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setNotes("");
      setItemCustomerName(customerName || "");
      setAddedToCart(false);
    }
  }, [customerName, open]);

  const handleAddToCart = () => {
    addItem(item, quantity, notes, itemCustomerName);
    setAddedToCart(true);
    window.setTimeout(() => onOpenChange(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-background/95 shadow-[0_24px_90px_-48px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:max-w-[620px]">
        {addedToCart ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="font-display text-2xl text-primary">OK</span>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              {t("addToCart.successTitle")}
            </h2>
            <p className="text-muted-foreground">{t("addToCart.successBody")}</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("addToCart.title")}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-5 py-2 sm:py-4">
              <div className="overflow-hidden rounded-[1.5rem] bg-muted/20">
                <div className="aspect-[16/10] w-full max-h-[19rem]">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {categoryLabel}
                    </span>
                    <h3 className="mt-1 font-display text-3xl leading-tight text-foreground">
                      {item.name}
                    </h3>
                  </div>
                  <p className="font-display text-2xl text-primary">{formatPrice(item.price)}</p>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>

              {details.ingredients.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Ingredientes principais
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {details.ingredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="rounded-full bg-white/[0.05] px-3 py-1.5 text-xs text-foreground/80"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(details.allergens.length > 0 || details.dietary?.length) && (
                <div className="grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-2">
                  {details.allergens.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200/80">
                        Atenção a alergênicos
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {details.allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-100"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {details.dietary?.length ? (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
                        Perfil do prato
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {details.dietary.map((label) => (
                          <span
                            key={label}
                            className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-100"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <p className="text-xs leading-5 text-muted-foreground">
                Em caso de alergia ou restrição alimentar, informe nas observações e confirme com a equipe antes do consumo.
              </p>

              <div className="grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-[auto_1fr] sm:items-end">
                <div>
                  <label className="mb-2 block text-sm font-medium">{t("addToCart.quantity")}</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-white/10 bg-white/[0.04]"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-lg font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-white/10 bg-white/[0.04]"
                      onClick={() => setQuantity((value) => value + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Para quem é este prato?</label>
                  <Input
                    placeholder="Nome da pessoa"
                    value={itemCustomerName}
                    onChange={(event) => setItemCustomerName(event.target.value)}
                    className="rounded-full border-white/10 bg-white/[0.04]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Observações e restrições</label>
                <Textarea
                  placeholder="Ex.: alergia a castanhas, sem queijo, molho separado"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="resize-none rounded-2xl border-white/10 bg-white/[0.04]"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-medium">{t("addToCart.total")}</span>
                <span className="font-display text-2xl text-primary">
                  {formatPrice((item.price * quantity))}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="rounded-full border-white/10 bg-white/[0.04]"
                onClick={() => onOpenChange(false)}
              >
                {t("addToCart.cancel")}
              </Button>
              <Button className="rounded-full" onClick={handleAddToCart}>
                {t("addToCart.confirm")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartModal;
