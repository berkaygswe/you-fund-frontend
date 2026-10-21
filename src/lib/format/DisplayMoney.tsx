// src/lib/format/DisplayMoney.tsx
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Money } from "./Money";
import { resolveDisplayAmount, type DisplayAmountFields } from "./display-amount";

interface DisplayMoneyProps {
  value: DisplayAmountFields;
  className?: string;
}

/**
 * Shows a base-currency amount in the display currency when the backend could
 * convert it, otherwise the base amount marked with an explanatory tooltip.
 */
export function DisplayMoney({ value, className }: DisplayMoneyProps) {
  const t = useTranslations("Money");
  const format = useFormatter();
  const resolved = resolveDisplayAmount(value);

  let title: string | undefined;
  if (resolved.isBaseFallback && value.displayStatus === "UNAVAILABLE") {
    title = t("fxUnavailable", { displayCurrency: value.displayCurrency ?? "", baseCurrency: value.currency });
  } else if (resolved.fxRateDate) {
    // LocalDate from the backend: format in UTC so it never shifts a day.
    const rateDate = format.dateTime(new Date(resolved.fxRateDate), { dateStyle: "medium", timeZone: "UTC" });
    title = t("fxConverted", { date: rateDate });
  }

  return (
    <span
      title={title}
      className={cn(resolved.isBaseFallback && title && "underline decoration-dotted underline-offset-4", className)}
    >
      <Money amount={resolved.amount} currency={resolved.currency} />
    </span>
  );
}
