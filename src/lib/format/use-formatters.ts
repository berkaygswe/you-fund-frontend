// src/lib/format/use-formatters.ts
import { useMemo } from "react";
import { useLocale } from "next-intl";
import { useCurrency } from "@/hooks/useCurrency";
import {
  formatCompactNumber,
  formatMoney,
  formatPercent,
  formatQuantity,
  type CurrencyCode,
} from "./number-format";

type NumberValue = number | null | undefined;

export interface MoneyCallOptions {
  /**
   * Defaults to the user's display currency. Pass it only for amounts that are
   * NOT in the display currency, e.g. a trade in the asset's native quote currency.
   */
  currency?: CurrencyCode;
  compact?: boolean;
  signed?: boolean;
  unitPrice?: boolean;
  wholeUnits?: boolean;
}

/**
 * Formatters bound to the active next-intl locale and the user's display currency.
 * Use the pure functions in `number-format.ts` outside React (chart callbacks, tests).
 */
export function useFormatters() {
  const locale = useLocale();
  const displayCurrency = useCurrency();

  return useMemo(
    () => ({
      locale,
      displayCurrency,
      money: (amount: NumberValue, options: MoneyCallOptions = {}) =>
        formatMoney(amount, { ...options, locale, currency: options.currency ?? displayCurrency }),
      percent: (value: NumberValue, options: { signed?: boolean } = {}) =>
        formatPercent(value, { ...options, locale }),
      quantity: (value: NumberValue) => formatQuantity(value, { locale }),
      compactNumber: (value: NumberValue) => formatCompactNumber(value, { locale }),
    }),
    [locale, displayCurrency],
  );
}
