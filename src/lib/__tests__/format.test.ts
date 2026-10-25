import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";

const normalize = (value: string) => value.replace(/\s/g, " ");

describe("formatPrice", () => {
  it("uses Brazilian currency format", () => {
    expect(normalize(formatPrice(52))).toBe("R$ 52,00");
  });

  it("groups thousands and keeps cents", () => {
    expect(normalize(formatPrice(1234.5))).toBe("R$ 1.234,50");
  });
});
