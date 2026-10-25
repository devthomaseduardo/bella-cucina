import { describe, expect, it } from "vitest";
import {
  decodeOrderApprovalQr,
  encodeOrderApprovalQr,
  type OrderQrPayload,
} from "@/lib/order-qr";

const v2: OrderQrPayload = {
  v: 2,
  type: "order-approval",
  order: {
    id: "1234",
    tableNumber: "7",
    customerName: "Ana",
    items: [
      { id: "1", name: "Pizza", price: 58, quantity: 2, image: "/p.png", category: "pizza" },
    ],
    totalPrice: 116,
    createdAt: "2026-10-25T20:00:00.000Z",
  },
};

describe("order approval QR", () => {
  it("round-trips a v1 payload", () => {
    const v1: OrderQrPayload = {
      v: 1,
      type: "order-approval",
      orderId: "abc",
      createdAt: "2026-10-25T20:00:00.000Z",
    };
    expect(decodeOrderApprovalQr(encodeOrderApprovalQr(v1))).toEqual(v1);
  });

  it("round-trips a v2 payload", () => {
    expect(decodeOrderApprovalQr(encodeOrderApprovalQr(v2))).toEqual(v2);
  });

  it("produces a URL-safe string", () => {
    const encoded = encodeOrderApprovalQr(v2);
    expect(encoded.startsWith("bella-cucina:")).toBe(true);
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it("rejects values without the prefix", () => {
    expect(decodeOrderApprovalQr("https://example.com")).toBeNull();
  });

  it("rejects malformed base64 or JSON", () => {
    expect(decodeOrderApprovalQr("bella-cucina:%%%")).toBeNull();
  });

  it("rejects payloads of another type", () => {
    const raw = `bella-cucina:${btoa(JSON.stringify({ v: 1, type: "other" }))}`;
    expect(decodeOrderApprovalQr(raw)).toBeNull();
  });

  it("rejects v2 payloads missing required fields", () => {
    const broken = { ...v2, order: { ...v2.order, totalPrice: "116" } };
    const raw = `bella-cucina:${btoa(JSON.stringify(broken))}`;
    expect(decodeOrderApprovalQr(raw)).toBeNull();
  });
});
