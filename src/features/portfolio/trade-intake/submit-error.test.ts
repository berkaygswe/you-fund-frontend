import { describe, expect, it } from "vitest";
import { AuthApiError } from "@/lib/auth-client";
import type { AuthError } from "@/types/auth";
import { classifySubmitError, keepsIntentForRetry } from "./submit-error";

function apiError(status: number, data: Record<string, unknown>): AuthApiError {
  return new AuthApiError(status, data as unknown as AuthError);
}

const insufficientCash = {
  code: "INSUFFICIENT_CASH",
  available: 100,
  required: 150,
  shortfall: 50,
  currency: "USD",
  portfolioRevision: 4,
};

describe("classifySubmitError", () => {
  it.each([
    { name: "insufficient cash", error: apiError(409, insufficientCash), kind: "insufficientCash" },
    { name: "stale revision", error: apiError(409, { code: "STALE_PORTFOLIO_REVISION" }), kind: "staleRevision" },
    { name: "insufficient holdings", error: apiError(409, { code: "INSUFFICIENT_HOLDINGS" }), kind: "insufficientHoldings" },
    { name: "422 settlement", error: apiError(422, { code: "MARKET_SETTLEMENT_UNAVAILABLE" }), kind: "settlementUnavailable" },
    { name: "price unavailable", error: apiError(400, { code: "PRICE_UNAVAILABLE" }), kind: "settlementUnavailable" },
    { name: "other 4xx", error: apiError(400, { message: "Quantity too large" }), kind: "rejected" },
    { name: "5xx", error: apiError(503, { message: "Service unavailable" }), kind: "unknownOutcome" },
    { name: "network failure", error: new TypeError("Failed to fetch"), kind: "unknownOutcome" },
  ])("classifies $name as $kind", ({ error, kind }) => {
    // Arrange
    const thrown: unknown = error;

    // Act
    const result = classifySubmitError(thrown);

    // Assert
    expect(result.kind).toBe(kind);
  });

  it("keeps the insufficient-cash payload for the auto-deposit offer", () => {
    // Arrange
    const thrown = apiError(409, insufficientCash);

    // Act
    const result = classifySubmitError(thrown);

    // Assert
    expect(result).toEqual({ kind: "insufficientCash", data: insufficientCash });
  });

  it("keeps the backend message of an otherwise unclassified rejection", () => {
    // Arrange
    const thrown = apiError(400, { message: "Quantity too large" });

    // Act
    const result = classifySubmitError(thrown);

    // Assert
    expect(result).toEqual({ kind: "rejected", message: "Quantity too large" });
  });
});

describe("keepsIntentForRetry", () => {
  it("keeps the intent (same key and body) only when the outcome is unknown", () => {
    // Arrange
    const unknown = { kind: "unknownOutcome" } as const;
    const definite = [
      { kind: "staleRevision" },
      { kind: "insufficientHoldings" },
      { kind: "settlementUnavailable" },
      { kind: "rejected", message: null },
    ] as const;

    // Act
    const keepsUnknown = keepsIntentForRetry(unknown);
    const keepsDefinite = definite.map(keepsIntentForRetry);

    // Assert
    expect(keepsUnknown).toBe(true);
    expect(keepsDefinite).toEqual([false, false, false, false]);
  });
});
