// src/lib/format/number-format.ts
//
// The single place where numbers become user-facing text.
// Pure functions: locale and currency are passed in, so they work in charts,
// tooltips and tests without React. Components use `useFormatters()` instead.
//
// Trade-off: amounts stay JS numbers (the backend sends JSON numbers and is
// authoritative for settled values). Rounding happens only here, at display time.

import type { Currency } from "@/types/currency";

/** ISO 4217 code. Display currencies are `Currency`; trades can settle in any quote currency. */
export type CurrencyCode = Currency | string;

export const EMPTY_VALUE = "-";

const STANDARD_FRACTION_DIGITS = 2;
const MAX_FRACTION_DIGITS = 8;
// Fund unit prices (e.g. TEFAS) are published with 6 decimals.
const UNIT_PRICE_FRACTION_DIGITS = 6;
// Significant digits kept for sub-unit prices, e.g. 0.00001234 keeps "1234".
const SUB_UNIT_SIGNIFICANT_DIGITS = 4;

export interface LocaleOptions {
  locale: string;
}

export interface MoneyFormatOptions extends LocaleOptions {
  /** null while the display currency is not hydrated: formats a plain number. */
  currency: CurrencyCode | null;
  compact?: boolean;
  /** Show "+" on positive values (P&L, daily change). */
  signed?: boolean;
  /** Price of one unit (trade price, fund NAV): keeps up to 6 decimals instead of 2. */
  unitPrice?: boolean;
  /** No decimals, e.g. chart axis ticks. Ignored when `compact` is set. */
  wholeUnits?: boolean;
}

export interface PercentFormatOptions extends LocaleOptions {
  signed?: boolean;
}

type NumberValue = number | null | undefined;

const ISO_CURRENCY_CODE = /^[A-Z]{3}$/;

const formatterCache = new Map<string, Intl.NumberFormat>();

function getNumberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const cacheKey = `${locale}|${JSON.stringify(options)}`;
  let formatter = formatterCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    formatterCache.set(cacheKey, formatter);
  }
  return formatter;
}

function isFormattable(value: NumberValue): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Fraction digits for a price: 2 for values >= 1, more for sub-unit values so
 * that small crypto prices do not collapse to 0.00.
 */
function maximumFractionDigitsFor(amount: number): number {
  const magnitude = Math.abs(amount);
  if (magnitude >= 1 || magnitude === 0) return STANDARD_FRACTION_DIGITS;

  const leadingZeros = -Math.floor(Math.log10(magnitude)) - 1;
  const digits = leadingZeros + SUB_UNIT_SIGNIFICANT_DIGITS;
  return Math.min(MAX_FRACTION_DIGITS, Math.max(STANDARD_FRACTION_DIGITS, digits));
}

export function getMoneyFormat(amount: number, options: MoneyFormatOptions): Intl.NumberFormat {
  const { locale, currency, compact = false, signed = false, unitPrice = false, wholeUnits = false } = options;
  const maximumFractionDigits = unitPrice
    ? Math.max(UNIT_PRICE_FRACTION_DIGITS, maximumFractionDigitsFor(amount))
    : maximumFractionDigitsFor(amount);

  const fractionOptions: Intl.NumberFormatOptions = compact
    ? { notation: "compact", maximumFractionDigits: 1 }
    : wholeUnits
    ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    : {
        minimumFractionDigits: STANDARD_FRACTION_DIGITS,
        maximumFractionDigits,
      };

  // A malformed code must not crash a table render; show the bare number instead.
  const currencyOptions: Intl.NumberFormatOptions = currency && ISO_CURRENCY_CODE.test(currency)
    ? { style: "currency", currency, currencyDisplay: "narrowSymbol" }
    : {};

  return getNumberFormat(locale, {
    ...currencyOptions,
    ...fractionOptions,
    signDisplay: signed ? "exceptZero" : "auto",
  });
}

export function formatMoney(amount: NumberValue, options: MoneyFormatOptions): string {
  if (!isFormattable(amount)) return EMPTY_VALUE;
  return getMoneyFormat(amount, options).format(amount);
}

/** `value` is in percentage points: 12.34 renders as "12.34%". */
export function formatPercent(value: NumberValue, options: PercentFormatOptions): string {
  if (!isFormattable(value)) return EMPTY_VALUE;

  return getNumberFormat(options.locale, {
    style: "percent",
    minimumFractionDigits: STANDARD_FRACTION_DIGITS,
    maximumFractionDigits: STANDARD_FRACTION_DIGITS,
    signDisplay: options.signed ? "exceptZero" : "auto",
  }).format(value / 100);
}

/** Asset quantities: up to 8 decimals, no padding zeros. */
export function formatQuantity(value: NumberValue, options: LocaleOptions): string {
  if (!isFormattable(value)) return EMPTY_VALUE;
  return getNumberFormat(options.locale, { maximumFractionDigits: MAX_FRACTION_DIGITS }).format(value);
}

/** Non-monetary large numbers (supply, volume counts): 2.5B. */
export function formatCompactNumber(value: NumberValue, options: LocaleOptions): string {
  if (!isFormattable(value)) return EMPTY_VALUE;
  return getNumberFormat(options.locale, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
