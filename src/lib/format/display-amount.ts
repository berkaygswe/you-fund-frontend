// src/lib/format/display-amount.ts
//
// Picks what to show for a base-currency amount that the backend may also have
// converted to the user's display currency (`?currency=`). Conversion itself is
// never done on the client.

import type { DisplayConversion } from "@/types/portfolio";
import type { CurrencyCode } from "./number-format";

export interface DisplayAmountFields extends DisplayConversion {
  /** Amount in the portfolio base currency. */
  amount: number | null | undefined;
  currency: CurrencyCode;
  displayAmount?: number | null;
}

export interface ResolvedDisplayAmount {
  amount: number | null | undefined;
  currency: CurrencyCode;
  /** Date of the FX observation used, when a conversion happened. */
  fxRateDate: string | null;
  /** True when the display value was unavailable and the base amount is shown instead. */
  isBaseFallback: boolean;
}

export function resolveDisplayAmount(fields: DisplayAmountFields): ResolvedDisplayAmount {
  const { displayStatus, displayAmount, displayCurrency } = fields;
  const hasDisplayValue =
    (displayStatus === "BASE" || displayStatus === "CONVERTED") &&
    typeof displayAmount === "number" &&
    !!displayCurrency;

  if (!hasDisplayValue) {
    return { amount: fields.amount, currency: fields.currency, fxRateDate: null, isBaseFallback: true };
  }

  return {
    amount: displayAmount,
    currency: displayCurrency,
    fxRateDate: displayStatus === "CONVERTED" ? fields.displayFxRateDate ?? null : null,
    isBaseFallback: false,
  };
}
