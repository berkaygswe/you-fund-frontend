import { describe, expect, it } from "vitest";
import type { AssetSummary } from "@/types/portfolio";
import {
  computeTradeTotals,
  resolveQuoteCurrency,
  toTransactionTimestamp,
  validateTradeForm,
  type TradeFormValues,
  type TradeValidationContext,
} from "./trade-form";

// Local-time "now" so the tests do not depend on the machine's timezone.
const NOW = new Date(2026, 9, 21, 12, 0);

const voo: AssetSummary = { id: "asset-voo", symbol: "VOO", name: "Vanguard S&P 500 ETF", type: "etf", currency: "usd" };

function formValues(overrides: Partial<TradeFormValues> = {}): TradeFormValues {
  return {
    portfolioId: 2,
    asset: voo,
    transactionType: "BUY",
    quantity: "2",
    pricePerUnit: "679.19",
    fee: "0",
    transactionDate: "2026-10-21T09:30",
    notes: "",
    ...overrides,
  };
}

function context(overrides: Partial<TradeValidationContext> = {}): TradeValidationContext {
  return { now: NOW, priceRange: null, portfolioRevision: 3, ...overrides };
}

describe("resolveQuoteCurrency", () => {
  it("uses the asset's own currency, normalised to upper case", () => {
    // Arrange
    const asset = { ...voo, currency: "usd" };

    // Act
    const currency = resolveQuoteCurrency(asset);

    // Assert
    expect(currency).toBe("USD");
  });

  it.each([undefined, "", "US DOLLAR"])("returns null instead of guessing when the currency is %s", (raw) => {
    // Arrange
    const asset = { ...voo, symbol: "THYAO.IS", currency: raw };

    // Act
    const currency = resolveQuoteCurrency(asset);

    // Assert
    expect(currency).toBeNull();
  });
});

describe("validateTradeForm", () => {
  it("builds the transaction request for a valid trade", () => {
    // Arrange
    const values = formValues({ fee: "1.5", transactionDate: "2026-10-20T09:30", notes: "  first buy  " });

    // Act
    const result = validateTradeForm(values, context());

    // Assert
    expect(result).toEqual({
      ok: true,
      quoteCurrency: "USD",
      request: {
        assetId: "asset-voo",
        transactionType: "BUY",
        quantity: 2,
        pricePerUnit: 679.19,
        fee: 1.5,
        transactionDate: new Date(2026, 9, 20, 9, 30).toISOString(),
        notes: "first buy",
        ifRevisionEquals: 3,
      },
    });
  });

  it.each([
    { field: "quantity", value: "0", code: "mustBePositive" },
    { field: "quantity", value: "-5", code: "mustBePositive" },
    { field: "quantity", value: "", code: "required" },
    { field: "pricePerUnit", value: "0", code: "mustBePositive" },
    { field: "pricePerUnit", value: "abc", code: "required" },
    { field: "fee", value: "-3", code: "mustNotBeNegative" },
  ] as const)("rejects $field = '$value' with $code", ({ field, value, code }) => {
    // Arrange
    const values = formValues({ [field]: value });

    // Act
    const result = validateTradeForm(values, context());

    // Assert
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[field]).toBe(code);
  });

  it("treats an empty fee as zero", () => {
    // Arrange
    const values = formValues({ fee: "" });

    // Act
    const result = validateTradeForm(values, context());

    // Assert
    expect(result.ok && result.request.fee).toBe(0);
  });

  it("rejects a trade dated after now", () => {
    // Arrange
    const values = formValues({ transactionDate: "2026-10-22T09:30" });

    // Act
    const result = validateTradeForm(values, context());

    // Assert
    expect(!result.ok && result.errors.transactionDate).toBe("futureDate");
  });

  it("blocks submit when the asset's currency is unknown", () => {
    // Arrange
    const values = formValues({ asset: { ...voo, currency: undefined } });

    // Act
    const result = validateTradeForm(values, context());

    // Assert
    expect(!result.ok && result.errors.asset).toBe("currencyUnknown");
  });

  it("requires a portfolio and an asset", () => {
    // Arrange
    const values = formValues({ portfolioId: null, asset: null });

    // Act
    const result = validateTradeForm(values, context());

    // Assert
    expect(!result.ok && result.errors).toMatchObject({ portfolio: "required", asset: "required" });
  });

  it.each([
    { price: "99.99", ok: false },
    { price: "100", ok: true },
    { price: "110", ok: true },
    { price: "110.01", ok: false },
  ])("enforces the trade day's low-high range (inclusive) for price $price", ({ price, ok }) => {
    // Arrange
    const values = formValues({ pricePerUnit: price });
    const priceRange = { date: "2026-10-20", low: 100, high: 110, close: 105 };

    // Act
    const result = validateTradeForm(values, context({ priceRange }));

    // Assert
    expect(result.ok).toBe(ok);
    if (!result.ok) expect(result.errors.pricePerUnit).toBe("outsidePriceRange");
  });
});

describe("computeTradeTotals", () => {
  it("adds the fee to a buy", () => {
    // Arrange
    const values = formValues({ quantity: "2", pricePerUnit: "50", fee: "1.25" });

    // Act
    const totals = computeTradeTotals(values);

    // Assert
    expect(totals).toEqual({ subtotal: 100, fee: 1.25, total: 101.25 });
  });

  it("deducts the fee from sale proceeds", () => {
    // Arrange
    const values = formValues({ transactionType: "SELL", quantity: "2", pricePerUnit: "50", fee: "1.25" });

    // Act
    const totals = computeTradeTotals(values);

    // Assert
    expect(totals).toEqual({ subtotal: 100, fee: 1.25, total: 98.75 });
  });

  it("returns null until quantity and price are valid", () => {
    // Arrange
    const values = formValues({ quantity: "" });

    // Act
    const totals = computeTradeTotals(values);

    // Assert
    expect(totals).toBeNull();
  });
});

describe("toTransactionTimestamp", () => {
  it("uses the exact current time for a trade dated today", () => {
    // Arrange
    const dateInput = "2026-10-21T09:30";

    // Act
    const timestamp = toTransactionTimestamp(dateInput, NOW);

    // Assert
    expect(timestamp).toBe(NOW.toISOString());
  });

  it("keeps the selected time for a historical trade", () => {
    // Arrange
    const dateInput = "2026-07-23T10:42";

    // Act
    const timestamp = toTransactionTimestamp(dateInput, NOW);

    // Assert
    expect(timestamp).toBe(new Date(2026, 6, 23, 10, 42).toISOString());
  });
});
