// src/features/portfolio/trade-intake/trade-intent.ts
//
// One trade intent = one idempotency key + one frozen request body.
// Re-submitting the unchanged form (double click, retry after a timeout)
// sends the identical key and body, so the backend books the trade once.
// Assumes the backend replays the original result for a repeated key + body.

import type { CreateTransactionRequest, InsufficientCashErrorData } from "@/types/portfolio";
import type { TradeFormValues } from "./trade-form";

export interface TradeIntent {
  fingerprint: string;
  idempotencyKey: string;
  request: CreateTransactionRequest;
}

/** Identity of what the user asked for; the portfolio revision is deliberately excluded. */
export function fingerprintTradeForm(values: TradeFormValues): string {
  return JSON.stringify([
    values.portfolioId,
    values.asset?.id ?? null,
    values.transactionType,
    values.quantity.trim(),
    values.pricePerUnit.trim(),
    values.fee.trim(),
    values.transactionDate,
    values.notes.trim(),
  ]);
}

export function resolveTradeIntent(
  current: TradeIntent | null,
  fingerprint: string,
  buildRequest: () => CreateTransactionRequest,
  createKey: () => string,
): TradeIntent {
  if (current && current.fingerprint === fingerprint) return current;
  return { fingerprint, idempotencyKey: createKey(), request: buildRequest() };
}

export function buildAutoFundedRequest(
  request: CreateTransactionRequest,
  shortfall: InsufficientCashErrorData,
): CreateTransactionRequest {
  return {
    ...request,
    funding: { mode: "AUTO_DEPOSIT_SHORTFALL", notes: "Auto top-up for purchase" },
    ifRevisionEquals: shortfall.portfolioRevision,
  };
}
