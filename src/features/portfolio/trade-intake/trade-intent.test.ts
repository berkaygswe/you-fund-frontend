import { describe, expect, it } from "vitest";
import type { CreateTransactionRequest, InsufficientCashErrorData } from "@/types/portfolio";
import { buildAutoFundedRequest, fingerprintTradeForm, resolveTradeIntent } from "./trade-intent";
import type { TradeFormValues } from "./trade-form";

const values: TradeFormValues = {
  portfolioId: 2,
  asset: { id: "asset-voo", symbol: "VOO", name: "VOO", type: "etf", currency: "USD" },
  transactionType: "BUY",
  quantity: "2",
  pricePerUnit: "679.19",
  fee: "0",
  transactionDate: "2026-10-21T09:30",
  notes: "",
};

const request: CreateTransactionRequest = {
  assetId: "asset-voo",
  transactionType: "BUY",
  quantity: 2,
  pricePerUnit: 679.19,
  fee: 0,
  transactionDate: "2026-10-21T09:30:00.000Z",
  ifRevisionEquals: 3,
};

function sequentialKeys() {
  let counter = 0;
  return () => `key-${++counter}`;
}

describe("resolveTradeIntent", () => {
  it("creates an intent with a fresh key and a frozen request", () => {
    // Arrange
    const createKey = sequentialKeys();

    // Act
    const intent = resolveTradeIntent(null, fingerprintTradeForm(values), () => request, createKey);

    // Assert
    expect(intent).toEqual({ fingerprint: fingerprintTradeForm(values), idempotencyKey: "key-1", request });
  });

  it("reuses key and request when the same form is submitted again (double click / retry)", () => {
    // Arrange
    const createKey = sequentialKeys();
    const first = resolveTradeIntent(null, fingerprintTradeForm(values), () => request, createKey);
    const laterRequest = { ...request, transactionDate: "2026-10-21T09:31:07.000Z" };

    // Act
    const second = resolveTradeIntent(first, fingerprintTradeForm(values), () => laterRequest, createKey);

    // Assert
    expect(second).toBe(first);
  });

  it("starts a new intent when any field changes", () => {
    // Arrange
    const createKey = sequentialKeys();
    const first = resolveTradeIntent(null, fingerprintTradeForm(values), () => request, createKey);
    const changed = fingerprintTradeForm({ ...values, quantity: "3" });

    // Act
    const second = resolveTradeIntent(first, changed, () => ({ ...request, quantity: 3 }), createKey);

    // Assert
    expect(second.idempotencyKey).toBe("key-2");
    expect(second.request.quantity).toBe(3);
  });

  it("ignores whitespace-only note changes", () => {
    // Arrange
    const padded = { ...values, notes: "  " };

    // Act
    const same = fingerprintTradeForm(padded) === fingerprintTradeForm(values);

    // Assert
    expect(same).toBe(true);
  });
});

describe("buildAutoFundedRequest", () => {
  it("adds shortfall funding and the revision from the 409 response", () => {
    // Arrange
    const shortfall: InsufficientCashErrorData = {
      code: "INSUFFICIENT_CASH",
      available: 100,
      required: 1358.38,
      shortfall: 1258.38,
      currency: "USD",
      portfolioRevision: 4,
    };

    // Act
    const funded = buildAutoFundedRequest(request, shortfall);

    // Assert
    expect(funded).toEqual({
      ...request,
      ifRevisionEquals: 4,
      funding: { mode: "AUTO_DEPOSIT_SHORTFALL", notes: "Auto top-up for purchase" },
    });
  });
});
