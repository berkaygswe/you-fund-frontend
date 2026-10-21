// src/features/portfolio/trade-intake/price-range.ts
import type { FundPrices } from "@/types/fundPrices";

/** The daily low-high range a trade price must fall into, in the asset's quote currency. */
export interface PriceRange {
  /** yyyy-MM-dd of the bar used (may precede the trade date on non-trading days). */
  date: string;
  low: number;
  high: number;
  close: number;
}

const DATE_LENGTH = "yyyy-MM-dd".length;

/**
 * Range of the trade date's bar, or of the closest preceding bar when the trade
 * date has none (weekend/holiday). Dates compare as yyyy-MM-dd strings, which
 * avoids timezone shifts from `new Date(...)`.
 */
export function findTradeDayPriceRange(prices: FundPrices[], tradeDate: string): PriceRange | null {
  let best: FundPrices | null = null;
  let bestDate = "";

  for (const price of prices) {
    const barDate = price.date.substring(0, DATE_LENGTH);
    if (barDate <= tradeDate && barDate > bestDate) {
      best = price;
      bestDate = barDate;
    }
  }

  if (!best) return null;
  return {
    date: bestDate,
    low: best.low || best.close,
    high: best.high || best.close,
    close: best.close,
  };
}

export function isWithinPriceRange(price: number, range: PriceRange): boolean {
  return price >= range.low && price <= range.high;
}
