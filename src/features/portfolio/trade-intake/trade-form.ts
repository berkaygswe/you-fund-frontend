// src/features/portfolio/trade-intake/trade-form.ts
//
// Pure trade rules: turn raw form input into a CreateTransactionRequest or a
// set of field errors. The backend re-validates; these rules exist so users
// never submit something we already know is wrong.

import type { AssetSummary, CreateTransactionRequest, TransactionType } from "@/types/portfolio";
import { isWithinPriceRange, type PriceRange } from "./price-range";

export interface TradeFormValues {
  portfolioId: number | null;
  asset: AssetSummary | null;
  transactionType: TransactionType;
  /** Raw input strings, as typed. */
  quantity: string;
  pricePerUnit: string;
  fee: string;
  /** Local date-time from the picker: yyyy-MM-dd'T'HH:mm. */
  transactionDate: string;
  notes: string;
}

export type TradeField = "portfolio" | "asset" | "quantity" | "pricePerUnit" | "fee" | "transactionDate";

export type TradeFieldErrorCode =
  | "required"
  | "mustBePositive"
  | "mustNotBeNegative"
  | "futureDate"
  | "currencyUnknown"
  | "outsidePriceRange";

export type TradeFieldErrors = Partial<Record<TradeField, TradeFieldErrorCode>>;

export interface TradeValidationContext {
  now: Date;
  /** Trade day's range in the quote currency; null when no price history is loaded. */
  priceRange: PriceRange | null;
  /** Optimistic-concurrency guard sent as ifRevisionEquals. */
  portfolioRevision: number | undefined;
}

export type TradeValidationResult =
  | { ok: true; request: CreateTransactionRequest; quoteCurrency: string }
  | { ok: false; errors: TradeFieldErrors };

export interface TradeTotals {
  subtotal: number;
  fee: number;
  /** BUY: subtotal + fee (cost). SELL: subtotal - fee (proceeds). */
  total: number;
}

const ISO_CURRENCY_CODE = /^[A-Z]{3}$/;
const DATE_LENGTH = "yyyy-MM-dd".length;

/**
 * The currency the asset is priced and traded in. Returns null when unknown:
 * a financial flow must not guess (e.g. from a ".IS" suffix).
 */
export function resolveQuoteCurrency(asset: AssetSummary): string | null {
  const code = asset.currency?.trim().toUpperCase();
  return code && ISO_CURRENCY_CODE.test(code) ? code : null;
}

function parseAmount(raw: string): number | null {
  if (raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function localDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * A trade dated today is stamped with the exact current time; a historical
 * trade keeps the user-selected time.
 */
export function toTransactionTimestamp(dateInput: string, now: Date): string {
  const isToday = dateInput.substring(0, DATE_LENGTH) === localDateKey(now);
  return isToday ? now.toISOString() : new Date(dateInput).toISOString();
}

function isFutureDate(dateInput: string, now: Date): boolean {
  if (dateInput.substring(0, DATE_LENGTH) === localDateKey(now)) return false;
  return new Date(dateInput).getTime() > now.getTime();
}

export function validateTradeForm(values: TradeFormValues, context: TradeValidationContext): TradeValidationResult {
  const errors: TradeFieldErrors = {};

  if (values.portfolioId === null) errors.portfolio = "required";

  const quoteCurrency = values.asset ? resolveQuoteCurrency(values.asset) : null;
  if (!values.asset) errors.asset = "required";
  else if (!quoteCurrency) errors.asset = "currencyUnknown";

  const quantity = parseAmount(values.quantity);
  if (quantity === null) errors.quantity = "required";
  else if (quantity <= 0) errors.quantity = "mustBePositive";

  const pricePerUnit = parseAmount(values.pricePerUnit);
  if (pricePerUnit === null) errors.pricePerUnit = "required";
  else if (pricePerUnit <= 0) errors.pricePerUnit = "mustBePositive";
  else if (context.priceRange && !isWithinPriceRange(pricePerUnit, context.priceRange)) {
    errors.pricePerUnit = "outsidePriceRange";
  }

  // An empty fee means "no fee".
  const fee = values.fee.trim() === "" ? 0 : parseAmount(values.fee);
  if (fee === null || fee < 0) errors.fee = "mustNotBeNegative";

  if (!values.transactionDate) errors.transactionDate = "required";
  else if (isFutureDate(values.transactionDate, context.now)) errors.transactionDate = "futureDate";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  // All guarded above; the non-null assertions restate that for the compiler.
  const notes = values.notes.trim();
  return {
    ok: true,
    quoteCurrency: quoteCurrency!,
    request: {
      assetId: values.asset!.id,
      transactionType: values.transactionType,
      quantity: quantity!,
      pricePerUnit: pricePerUnit!,
      fee: fee!,
      transactionDate: toTransactionTimestamp(values.transactionDate, context.now),
      notes: notes || undefined,
      ifRevisionEquals: context.portfolioRevision,
    },
  };
}

/** Preview totals in the quote currency; null until quantity and price are usable. */
export function computeTradeTotals(values: TradeFormValues): TradeTotals | null {
  const quantity = parseAmount(values.quantity);
  const pricePerUnit = parseAmount(values.pricePerUnit);
  if (quantity === null || pricePerUnit === null || quantity <= 0 || pricePerUnit <= 0) return null;

  const parsedFee = parseAmount(values.fee);
  const fee = parsedFee !== null && parsedFee > 0 ? parsedFee : 0;
  const subtotal = quantity * pricePerUnit;

  return {
    subtotal,
    fee,
    total: values.transactionType === "BUY" ? subtotal + fee : subtotal - fee,
  };
}
