import { describe, expect, it } from "vitest";
import { resolveDisplayAmount } from "./display-amount";

const baseAmount = { amount: 34000, currency: "TRY" } as const;

describe("resolveDisplayAmount", () => {
  it("uses the converted amount and display currency when status is CONVERTED", () => {
    // Arrange
    const fields = {
      ...baseAmount,
      displayAmount: 1000,
      displayCurrency: "USD",
      displayFxRateDate: "2026-10-20",
      displayStatus: "CONVERTED",
    } as const;

    // Act
    const result = resolveDisplayAmount(fields);

    // Assert
    expect(result).toEqual({
      amount: 1000,
      currency: "USD",
      fxRateDate: "2026-10-20",
      isBaseFallback: false,
    });
  });

  it("uses the display fields when status is BASE (display equals base currency)", () => {
    // Arrange
    const fields = {
      ...baseAmount,
      displayAmount: 34000,
      displayCurrency: "TRY",
      displayFxRateDate: null,
      displayStatus: "BASE",
    } as const;

    // Act
    const result = resolveDisplayAmount(fields);

    // Assert
    expect(result).toEqual({
      amount: 34000,
      currency: "TRY",
      fxRateDate: null,
      isBaseFallback: false,
    });
  });

  it("falls back to the base amount and base currency when no rate is available", () => {
    // Arrange
    const fields = {
      ...baseAmount,
      displayAmount: null,
      displayCurrency: "USD",
      displayFxRateDate: null,
      displayStatus: "UNAVAILABLE",
    } as const;

    // Act
    const result = resolveDisplayAmount(fields);

    // Assert
    expect(result).toEqual({
      amount: 34000,
      currency: "TRY",
      fxRateDate: null,
      isBaseFallback: true,
    });
  });

  it("falls back to the base amount when display fields are absent (no currency requested)", () => {
    // Arrange
    const fields = { ...baseAmount };

    // Act
    const result = resolveDisplayAmount(fields);

    // Assert
    expect(result).toEqual({
      amount: 34000,
      currency: "TRY",
      fxRateDate: null,
      isBaseFallback: true,
    });
  });

  it("falls back to the base amount if CONVERTED arrives without a display amount", () => {
    // Arrange
    const fields = {
      ...baseAmount,
      displayAmount: null,
      displayCurrency: "USD",
      displayFxRateDate: "2026-10-20",
      displayStatus: "CONVERTED",
    } as const;

    // Act
    const result = resolveDisplayAmount(fields);

    // Assert
    expect(result.isBaseFallback).toBe(true);
    expect(result.currency).toBe("TRY");
  });
});
