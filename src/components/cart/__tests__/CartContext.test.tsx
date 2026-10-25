import type { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CartProvider, useCart } from "@/components/cart/CartContext";

const pizza = { id: "pizza", name: "Pizza Margherita", price: 58, image: "/p.png", category: "pizza" };
const tiramisu = { id: "tiramisu", name: "Tiramisù", price: 32, image: "/t.png", category: "desserts" };

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;
const renderCart = () => renderHook(() => useCart(), { wrapper });

describe("CartContext", () => {
  it("throws when used outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useCart())).toThrow("useCart must be used within a CartProvider");
  });

  it("adds items and computes totals", () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(pizza, 2);
      result.current.addItem(tiramisu);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(148);
  });

  it("merges the same dish for the same guest", () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(pizza, 1, "", "Ana");
      result.current.addItem(pizza, 2, "sem manjericão", "Ana");
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({ quantity: 3, notes: "sem manjericão" });
  });

  it("keeps the same dish separate per guest", () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(pizza, 1, "", "Ana");
      result.current.addItem(pizza, 1, "", "Bruno");
    });

    expect(result.current.items).toHaveLength(2);
  });

  it("removes an item when quantity drops to zero", () => {
    const { result } = renderCart();

    act(() => result.current.addItem(pizza));
    act(() => result.current.updateQuantity("pizza", 0));

    expect(result.current.items).toEqual([]);
  });

  it("persists the cart to localStorage", () => {
    const { result } = renderCart();

    act(() => result.current.addItem(pizza));

    expect(JSON.parse(window.localStorage.getItem("cart")!)).toHaveLength(1);
  });

  it("creates local orders in demo mode", async () => {
    const { result } = renderCart();

    let id = "";
    await act(async () => {
      id = await result.current.addOrder({
        tableNumber: "7",
        customerName: "Ana",
        items: [{ ...pizza, quantity: 1 }],
        status: "pending",
        totalPrice: 58,
      });
    });

    expect(id).toMatch(/^\d{4}$/);
    expect(result.current.orders).toHaveLength(1);
    expect(result.current.orders[0]).toMatchObject({ id, tableNumber: "7", status: "pending" });
  });
});
