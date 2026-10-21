// src/lib/format/Money.tsx
"use client";

import { useFormatters, type MoneyCallOptions } from "./use-formatters";
import { EMPTY_VALUE, getMoneyFormat } from "./number-format";

interface MoneyProps extends MoneyCallOptions {
  amount: number | null | undefined;
  className?: string;
}

/**
 * Renders a monetary amount with a de-emphasised currency symbol.
 * Symbol position comes from the locale (Intl formatToParts), never hard-coded.
 */
export function Money({ amount, className, ...options }: MoneyProps) {
  const { locale, displayCurrency } = useFormatters();

  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return <span className={className}>{EMPTY_VALUE}</span>;
  }

  const parts = getMoneyFormat(amount, {
    ...options,
    locale,
    currency: options.currency ?? displayCurrency,
  }).formatToParts(amount);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.type === "currency" ? (
          <span key={index} className="text-[0.85em] font-normal opacity-80">
            {part.value}
          </span>
        ) : (
          part.value
        ),
      )}
    </span>
  );
}
