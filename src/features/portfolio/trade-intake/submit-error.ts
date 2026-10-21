// src/features/portfolio/trade-intake/submit-error.ts
import { AuthApiError } from "@/lib/auth-client";
import type { InsufficientCashErrorData, PortfolioApiErrorData } from "@/types/portfolio";

/**
 * Every way a trade submission can fail, from the user's point of view.
 * `unknownOutcome` is the only case where the trade may have been booked.
 */
export type TradeSubmitError =
  | { kind: "insufficientCash"; data: InsufficientCashErrorData }
  | { kind: "staleRevision" }
  | { kind: "insufficientHoldings" }
  | { kind: "settlementUnavailable" }
  | { kind: "rejected"; message: string | null }
  | { kind: "unknownOutcome" };

const SETTLEMENT_UNAVAILABLE_CODES = new Set(["MARKET_SETTLEMENT_UNAVAILABLE", "PRICE_UNAVAILABLE"]);

export function classifySubmitError(error: unknown): TradeSubmitError {
  // Network failure, timeout or anything thrown before a response: the request
  // may or may not have reached the backend.
  if (!(error instanceof AuthApiError)) return { kind: "unknownOutcome" };
  if (error.status >= 500) return { kind: "unknownOutcome" };

  const data = error.data as unknown as PortfolioApiErrorData | undefined;
  const code = data?.code;

  if (code === "INSUFFICIENT_CASH") return { kind: "insufficientCash", data: data as InsufficientCashErrorData };
  if (code === "STALE_PORTFOLIO_REVISION") return { kind: "staleRevision" };
  if (code === "INSUFFICIENT_HOLDINGS") return { kind: "insufficientHoldings" };
  if (error.status === 422 || (code && SETTLEMENT_UNAVAILABLE_CODES.has(code))) return { kind: "settlementUnavailable" };

  return { kind: "rejected", message: data?.message ?? null };
}

/**
 * Whether a retry must reuse the same idempotency key and body. Only when we
 * cannot know whether the trade was booked; a definite rejection starts over.
 */
export function keepsIntentForRetry(error: TradeSubmitError): boolean {
  return error.kind === "unknownOutcome";
}
