import React, { useState } from "react";
import { ReceiptText, ShoppingBag } from "lucide-react";

import AccountModal from "@/components/cart/AccountModal";
import CartModal from "@/components/cart/CartModal";
import { useCart } from "@/components/cart/CartContext";
import WaiterButton from "@/components/waiter/WaiterButton";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type FloatingActionsProps = {
  className?: string;
  showWaiterAction?: boolean;
};

const FloatingActions = ({
  className,
  showWaiterAction = false,
}: FloatingActionsProps) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { totalItems, totalPrice } = useCart();
  const hasItems = totalItems > 0;
  const itemLabel = totalItems === 1 ? "1 item" : `${totalItems} itens`;

  return (
    <>
      {/* Keeps the end of the page reachable above the mobile action bar. */}
      <div aria-hidden className="h-24 sm:hidden" />

      <div
        className={cn(
          "fixed z-50",
          // Mobile: full-width bottom bar with large touch targets.
          "inset-x-0 bottom-0 flex gap-2 border-t border-white/10 bg-black/80 px-4 pt-3 backdrop-blur-xl",
          "pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]",
          // Desktop: floating stack in the bottom-right corner.
          "sm:inset-x-auto sm:bottom-6 sm:right-6 sm:flex-col sm:items-end sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => setAccountOpen(true)}
          className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 text-white transition hover:bg-white/[0.12] sm:h-10 sm:border-white/10 sm:bg-black/[0.72] sm:px-3.5 sm:shadow-xl sm:backdrop-blur-xl sm:hover:-translate-y-0.5 sm:hover:bg-black/85"
          aria-label="Abrir conta da mesa"
        >
          <ReceiptText className="h-4 w-4 text-primary" aria-hidden />
          <span className="text-sm font-semibold sm:hidden">Conta</span>
          <span className="hidden text-xs font-semibold sm:inline">Minha conta</span>
          <span className="hidden text-[9px] uppercase tracking-[0.14em] text-white/55 sm:inline">
            ao vivo
          </span>
        </button>

        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className={cn(
            "flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full px-4 transition-all sm:h-11 sm:min-w-[11rem] sm:flex-none sm:px-3.5",
            "sm:hover:-translate-y-0.5 active:translate-y-0",
            hasItems
              ? "bg-primary text-primary-foreground shadow-[0_18px_60px_-24px_hsl(var(--primary))] hover:bg-primary/90"
              : "border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12] sm:border-white/10 sm:bg-black/[0.68] sm:shadow-xl sm:backdrop-blur-xl",
          )}
          aria-label={hasItems ? `Ver pedido, ${itemLabel}, ${formatPrice(totalPrice)}` : "Abrir pedido"}
        >
          <span className="relative shrink-0">
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {hasItems && (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </span>
          <span className="whitespace-nowrap text-left text-sm font-semibold">
            {hasItems ? "Ver pedido" : "Seu pedido"}
          </span>
          {hasItems && (
            <span className="ml-auto shrink-0 rounded-full bg-black/[0.16] px-2.5 py-1 text-xs font-semibold">
              {formatPrice(totalPrice)}
            </span>
          )}
        </button>

        {showWaiterAction && (
          <WaiterButton
            variant="secondary"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-full border border-white/10 bg-black/[0.68] text-foreground shadow-xl backdrop-blur-xl hover:bg-white/[0.12] sm:h-10 sm:w-10"
          />
        )}
      </div>

      <CartModal open={cartOpen} onOpenChange={setCartOpen} />
      <AccountModal open={accountOpen} onOpenChange={setAccountOpen} />
    </>
  );
};

export default FloatingActions;
