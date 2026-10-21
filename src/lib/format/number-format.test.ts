import { describe, expect, it } from "vitest";
import {
  EMPTY_VALUE,
  formatCompactNumber,
  formatMoney,
  formatPercent,
  formatQuantity,
} from "./number-format";

describe("formatMoney", () => {
  it.each([
    { locale: "en", currency: "USD", amount: 1234.5, expected: "$1,234.50" },
    { locale: "tr", currency: "TRY", amount: 1234.5, expected: "₺1.234,50" },
    { locale: "tr", currency: "USD", amount: 1234.5, expected: "$1.234,50" },
    { locale: "en", currency: "TRY", amount: 1234.5, expected: "₺1,234.50" },
  ] as const)("formats $amount $currency for locale $locale", ({ locale, currency, amount, expected }) => {
    // Arrange
    const options = { locale, currency };

    // Act
    const result = formatMoney(amount, options);

    // Assert
    expect(result).toBe(expected);
  });

  it("formats negative amounts with a leading minus sign", () => {
    // Arrange
    const options = { locale: "en", currency: "USD" } as const;

    // Act
    const result = formatMoney(-1234.5, options);

    // Assert
    expect(result).toBe("-$1,234.50");
  });

  it("adds a plus sign to positive amounts when signed, but not to zero", () => {
    // Arrange
    const options = { locale: "en", currency: "USD", signed: true } as const;

    // Act
    const positive = formatMoney(12, options);
    const zero = formatMoney(0, options);

    // Assert
    expect(positive).toBe("+$12.00");
    expect(zero).toBe("$0.00");
  });

  it.each([
    { amount: 0.00001234, expected: "$0.00001234" },
    { amount: 0.1234, expected: "$0.1234" },
    { amount: 0.5, expected: "$0.50" },
    { amount: 0.000000001, expected: "$0.00" },
    { amount: 1.23456, expected: "$1.23" },
  ])("uses adaptive decimals for sub-unit price $amount", ({ amount, expected }) => {
    // Arrange
    const options = { locale: "en", currency: "USD" } as const;

    // Act
    const result = formatMoney(amount, options);

    // Assert
    expect(result).toBe(expected);
  });

  it.each([
    { amount: 1.234567, expected: "$1.234567" },
    { amount: 0.123456, expected: "$0.123456" },
    { amount: 150.5, expected: "$150.50" },
    { amount: 0.00001234, expected: "$0.00001234" },
  ])("keeps fund-grade decimals for unit price $amount", ({ amount, expected }) => {
    // Arrange
    const options = { locale: "en", currency: "USD", unitPrice: true } as const;

    // Act
    const result = formatMoney(amount, options);

    // Assert
    expect(result).toBe(expected);
  });

  it.each([
    { locale: "en", currency: "TRY", amount: 250394.4, expected: "₺250,394" },
    { locale: "tr", currency: "TRY", amount: 250394.6, expected: "₺250.395" },
    { locale: "en", currency: "USD", amount: 5078.2, expected: "$5,078" },
  ] as const)("formats whole units for axis labels: $amount $currency ($locale)", ({ locale, currency, amount, expected }) => {
    // Arrange
    const options = { locale, currency, wholeUnits: true };

    // Act
    const result = formatMoney(amount, options);

    // Assert
    expect(result).toBe(expected);
  });

  it("hides float artefacts by rounding only at display time", () => {
    // Arrange
    const floatSum = 0.1 + 0.2;

    // Act
    const result = formatMoney(floatSum, { locale: "en", currency: "USD" });

    // Assert
    expect(result).toBe("$0.30");
  });

  it("formats a plain number when the display currency is not hydrated yet", () => {
    // Arrange
    const options = { locale: "en", currency: null };

    // Act
    const result = formatMoney(1234.5, options);

    // Assert
    expect(result).toBe("1,234.50");
  });

  it("formats a native quote currency outside the display currencies", () => {
    // Arrange
    const options = { locale: "en", currency: "EUR" };

    // Act
    const result = formatMoney(1234.5, options);

    // Assert
    expect(result).toBe("€1,234.50");
  });

  it("falls back to a plain number for a malformed currency code instead of throwing", () => {
    // Arrange
    const options = { locale: "en", currency: "US D" };

    // Act
    const result = formatMoney(1234.5, options);

    // Assert
    expect(result).toBe("1,234.50");
  });

  it("formats compact amounts", () => {
    // Arrange
    const options = { locale: "en", currency: "USD", compact: true } as const;

    // Act
    const result = formatMoney(1_234_567, options);

    // Assert
    expect(result).toBe("$1.2M");
  });

  it.each([null, undefined, Number.NaN, Number.POSITIVE_INFINITY])(
    "returns the empty placeholder for %s",
    (amount) => {
      // Arrange
      const options = { locale: "en", currency: "USD" } as const;

      // Act
      const result = formatMoney(amount, options);

      // Assert
      expect(result).toBe(EMPTY_VALUE);
    },
  );
});

describe("formatPercent", () => {
  it.each([
    { locale: "en", value: 12.34, expected: "12.34%" },
    { locale: "tr", value: 12.34, expected: "%12,34" },
    { locale: "en", value: -3.5, expected: "-3.50%" },
  ])("formats $value percentage points for locale $locale", ({ locale, value, expected }) => {
    // Arrange
    const options = { locale };

    // Act
    const result = formatPercent(value, options);

    // Assert
    expect(result).toBe(expected);
  });

  it("adds a plus sign to positive changes when signed", () => {
    // Arrange
    const options = { locale: "en", signed: true };

    // Act
    const result = formatPercent(12.34, options);

    // Assert
    expect(result).toBe("+12.34%");
  });

  it("returns the empty placeholder for missing values", () => {
    // Arrange
    const options = { locale: "en" };

    // Act
    const result = formatPercent(null, options);

    // Assert
    expect(result).toBe(EMPTY_VALUE);
  });
});

describe("formatQuantity", () => {
  it.each([
    { locale: "en", value: 0.12345678, expected: "0.12345678" },
    { locale: "en", value: 10, expected: "10" },
    { locale: "tr", value: 1234.5, expected: "1.234,5" },
  ])("formats quantity $value for locale $locale without padding zeros", ({ locale, value, expected }) => {
    // Arrange
    const options = { locale };

    // Act
    const result = formatQuantity(value, options);

    // Assert
    expect(result).toBe(expected);
  });
});

describe("formatCompactNumber", () => {
  it("formats large counts in compact notation", () => {
    // Arrange
    const options = { locale: "en" };

    // Act
    const result = formatCompactNumber(2_500_000_000, options);

    // Assert
    expect(result).toBe("2.5B");
  });

  it("returns the empty placeholder for missing values", () => {
    // Arrange
    const options = { locale: "en" };

    // Act
    const result = formatCompactNumber(undefined, options);

    // Assert
    expect(result).toBe(EMPTY_VALUE);
  });
});
