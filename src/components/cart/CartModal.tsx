import React, { useState } from "react";
import { CheckCircle2, Edit, Minus, Plus, ReceiptText, Trash2, User, X } from "lucide-react";

import { useCart, type CartItem } from "./CartContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { getMenuItemDetails } from "@/data/menu-item-details";
import { getTableToken, hasSupabaseConfig } from "@/lib/table-session";
import { formatPrice } from "@/lib/format";

interface CartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartModal: React.FC<CartModalProps> = ({ open, onOpenChange }) => {
  const {
    items,
    updateQuantity,
    removeItem,
    totalPrice,
    totalItems,
    clearCart,
    updateNotes,
    tableNumber,
    setTableNumber,
    customerName,
    setCustomerName,
    setSuccessMessage,
    setShowSuccessToast,
    addOrder,
    currentTableSession,
  } = useCart();

  const tableToken = getTableToken();
  // With a real backend, the table always comes from the QR code.
  const requiresQr = hasSupabaseConfig && !tableToken;
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemNotes, setItemNotes] = useState("");
  const [localTableNumber, setLocalTableNumber] = useState(
    tableNumber || (tableToken ? "QR" : ""),
  );
  const [localCustomerName, setLocalCustomerName] = useState(customerName || "");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedItems, setSubmittedItems] = useState<CartItem[]>([]);
  const [submittedTotal, setSubmittedTotal] = useState(0);

  const notify = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    window.setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleUpdateNotes = (id: string) => {
    updateNotes(id, itemNotes);
    setEditingItemId(null);
  };

  const startEditingNotes = (item: CartItem) => {
    setEditingItemId(item.id);
    setItemNotes(item.notes || "");
  };

  const handleCheckout = async () => {
    if (isSubmitting) return;
    if (requiresQr) {
      notify("Escaneie o QR code da sua mesa para fazer o pedido.");
      return;
    }
    if (!tableToken && !localTableNumber.trim()) {
      notify("Informe o número da sua mesa.");
      return;
    }
    if (!localCustomerName.trim()) {
      notify("Informe seu nome antes de finalizar o pedido.");
      return;
    }

    if (!tableToken && localTableNumber !== tableNumber) {
      setTableNumber(localTableNumber);
    }
    if (localCustomerName !== customerName) setCustomerName(localCustomerName);

    const snapshot = items.map((item) => ({ ...item }));
    const snapshotTotal = totalPrice;

    setIsSubmitting(true);
    try {
      const orderId = await addOrder({
        tableNumber: tableToken ? "QR" : localTableNumber,
        customerName: localCustomerName,
        items: snapshot,
        status: "pending",
        totalPrice: snapshotTotal,
      });

      setSubmittedItems(snapshot);
      setSubmittedTotal(snapshotTotal);
      setCreatedOrderId(orderId);
      setOrderSuccess(true);
    } catch (error) {
      console.error("Failed to place order", error);
      notify(
        error instanceof Error && error.message.startsWith("Escaneie")
          ? error.message
          : "Não foi possível enviar o pedido. Tente novamente ou chame o garçom.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const finishConfirmation = () => {
    clearCart();
    setOrderSuccess(false);
    setCreatedOrderId(null);
    setSubmittedItems([]);
    setSubmittedTotal(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] flex-col border-white/10 bg-background/95 shadow-[0_24px_90px_-48px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:max-w-[620px]">
        {orderSuccess ? (
          <div className="flex min-h-0 flex-col py-2">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-7 w-7" aria-hidden />
              </div>
              <h2 className="font-display text-3xl text-foreground">Pedido enviado</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                A equipe já recebeu seu pedido. Acompanhe o preparo em Minha conta.
              </p>
            </div>

            {createdOrderId && (
              <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] bg-white/[0.035]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
                  <div>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <ReceiptText className="h-4 w-4 text-primary" aria-hidden />
                      Pedido #{createdOrderId.slice(0, 6).toUpperCase()}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {`Mesa ${currentTableSession?.tableNumber ?? localTableNumber}`} · {localCustomerName}
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-100">
                    Aguardando confirmação
                  </span>
                </div>

                <ScrollArea className="max-h-[46vh] flex-1 px-4 sm:px-5">
                  <div className="divide-y divide-white/10">
                    {submittedItems.map((item) => {
                      const details = getMenuItemDetails(item.id);
                      return (
                        <article key={`${item.id}-${item.customerName || "pedido"}`} className="py-4">
                          <div className="flex gap-3 sm:gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-24"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-display text-xl leading-tight text-foreground">{item.name}</p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {item.quantity} {item.quantity === 1 ? "unidade" : "unidades"}
                                    {item.customerName ? ` · Para ${item.customerName}` : ""}
                                  </p>
                                </div>
                                <p className="shrink-0 text-sm font-semibold text-primary">
                                  {formatPrice((item.price * item.quantity))}
                                </p>
                              </div>

                              {details.ingredients.length > 0 && (
                                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                                  <span className="font-semibold text-foreground/75">Ingredientes:</span>{" "}
                                  {details.ingredients.join(", ")}
                                </p>
                              )}

                              {details.allergens.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {details.allergens.map((allergen) => (
                                    <span
                                      key={allergen}
                                      className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-amber-100"
                                    >
                                      {allergen}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {item.notes && (
                                <p className="mt-2 rounded-xl bg-primary/10 px-3 py-2 text-xs leading-5 text-primary">
                                  Observação: {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </ScrollArea>

                <div className="border-t border-white/10 px-4 py-4 sm:px-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Resumo</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {(() => {
                          const count = submittedItems.reduce((sum, item) => sum + item.quantity, 0);
                          return count === 1 ? "1 item enviado" : `${count} itens enviados`;
                        })()}
                      </p>
                    </div>
                    <p className="font-display text-3xl text-foreground">{formatPrice(submittedTotal)}</p>
                  </div>
                </div>
              </div>
            )}

            <Button className="mt-4 w-full" onClick={finishConfirmation}>
              Continuar no cardápio
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Seu pedido</DialogTitle>
              <DialogDescription>
                Confira os pratos, quantidades e observações antes de enviar.
              </DialogDescription>
            </DialogHeader>

            {items.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Seu pedido está vazio. Escolha um prato no cardápio e toque em Adicionar.</p>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="mt-4 rounded-full border-white/10 bg-white/[0.04]"
                >
                  Voltar ao cardápio
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    {requiresQr ? (
                      <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
                          Mesa não identificada
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Escaneie o QR code da sua mesa com a câmera do celular para enviar o pedido.
                        </p>
                      </div>
                    ) : tableToken ? (
                      <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                          Mesa identificada
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Seu pedido vai direto para a sua mesa.
                        </p>
                      </div>
                    ) : (
                      <>
                        <Label htmlFor="tableNumber">Número da mesa</Label>
                        <Input
                          id="tableNumber"
                          value={localTableNumber}
                          onChange={(event) => setLocalTableNumber(event.target.value)}
                          placeholder="Ex.: 12"
                          className="mt-1 rounded-full border-white/10 bg-white/[0.04]"
                        />
                        <p className="mt-1.5 text-xs leading-4 text-muted-foreground">
                          Entrada manual para demonstração. No restaurante, a mesa vem do QR.
                        </p>
                      </>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="customerName">Seu nome</Label>
                    <div className="relative mt-1">
                      <Input
                        id="customerName"
                        value={localCustomerName}
                        onChange={(event) => setLocalCustomerName(event.target.value)}
                        placeholder="Ex.: Thomas"
                        className="rounded-full border-white/10 bg-white/[0.04] pl-9"
                      />
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden />
                    </div>
                  </div>
                </div>

                <ScrollArea className="max-h-[43vh] flex-1 pr-3">
                  <div className="mt-4 space-y-4">
                    {items.map((item) => {
                      const details = getMenuItemDetails(item.id);
                      return (
                        <div key={`${item.id}-${item.customerName || "item"}`} className="border-b border-white/10 pb-4">
                          <div className="flex gap-3">
                            <img src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-medium text-foreground">{item.name}</h4>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {formatPrice(item.price)}
                                    {item.customerName ? ` · Para ${item.customerName}` : ""}
                                  </p>
                                </div>
                                <Button variant="ghost" size="icon" className="-mr-2 -mt-2 shrink-0" onClick={() => removeItem(item.id)} aria-label={`Remover ${item.name}`}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>

                              {details.allergens.length > 0 && (
                                <p className="mt-2 text-xs leading-4 text-amber-100/80">
                                  Alergênicos: {details.allergens.join(", ")}
                                </p>
                              )}

                              {editingItemId === item.id ? (
                                <div className="mt-2">
                                  <Textarea
                                    value={itemNotes}
                                    onChange={(event) => setItemNotes(event.target.value)}
                                    placeholder="Observações ou restrições"
                                    className="h-20 rounded-2xl border-white/10 bg-white/[0.04] text-sm"
                                  />
                                  <div className="mt-2 flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setEditingItemId(null)}>
                                      <X className="mr-1 h-4 w-4" /> Cancelar
                                    </Button>
                                    <Button size="sm" onClick={() => handleUpdateNotes(item.id)}>Salvar</Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {item.notes && (
                                    <p className="mt-2 rounded-xl bg-primary/10 px-3 py-2 text-xs text-primary">
                                      Obs: {item.notes}
                                    </p>
                                  )}
                                  <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        aria-label={`Diminuir ${item.name}`}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <span className="w-7 text-center text-sm">{item.quantity}</span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        aria-label={`Aumentar ${item.name}`}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <Button variant="ghost" size="sm" className="px-2" onClick={() => startEditingNotes(item)}>
                                      <Edit className="h-4 w-4" aria-hidden /> Observação
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{totalItems === 1 ? "1 item" : `${totalItems} itens`}</p>
                      <p className="text-sm font-medium">Total</p>
                    </div>
                    <span className="font-display text-3xl">{formatPrice(totalPrice)}</span>
                  </div>
                  <DialogFooter className="flex-col gap-2 sm:flex-col">
                    <Button onClick={handleCheckout} className="w-full" disabled={isSubmitting || requiresQr}>
                      {isSubmitting ? "Enviando pedido..." : "Enviar pedido"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => clearCart()}
                      className="w-full rounded-full border-white/10 bg-white/[0.04]"
                    >
                      Limpar carrinho
                    </Button>
                  </DialogFooter>
                </div>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
