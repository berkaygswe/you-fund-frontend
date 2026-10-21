import { describe, expect, it } from "vitest";
import type { FundPrices } from "@/types/fundPrices";
import { findTradeDayPriceRange } from "./price-range";

function bar(date: string, low: number, high: number, close: number): FundPrices {
  return { date, open: close, low, high, close, volume: 0 };
}

const prices = [
  bar("2026-10-15T00:00:00", 90, 95, 92),
  bar("2026-10-16T00:00:00", 100, 110, 105),
  bar("2026-10-19T00:00:00", 101, 111, 106),
];

describe("findTradeDayPriceRange", () => {
  it("uses the bar of the trade date when one exists", () => {
    // Arrange
    const tradeDate = "2026-10-16";

    // Act
    const range = findTradeDayPriceRange(prices, tradeDate);

    // Assert
    expect(range).toEqual({ date: "2026-10-16", low: 100, high: 110, close: 105 });
  });

  it("falls back to the closest preceding bar on a non-trading day", () => {
    // Arrange
    const saturday = "2026-10-17";

    // Act
    const range = findTradeDayPriceRange(prices, saturday);

    // Assert
    expect(range?.date).toBe("2026-10-16");
  });

  it("returns null when there is no bar on or before the trade date", () => {
    // Arrange
    const beforeHistory = "2026-01-01";

    // Act
    const range = findTradeDayPriceRange(prices, beforeHistory);

    // Assert
    expect(range).toBeNull();
  });

  it("uses the close when a bar has no low/high", () => {
    // Arrange
    const closeOnly = [bar("2026-10-16", 0, 0, 105)];

    // Act
    const range = findTradeDayPriceRange(closeOnly, "2026-10-16");

    // Assert
    expect(range).toEqual({ date: "2026-10-16", low: 105, high: 105, close: 105 });
  });
});
