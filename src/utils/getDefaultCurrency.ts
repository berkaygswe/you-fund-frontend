import { Currency, SUPPORTED_CURRENCIES } from "@/types/currency";

export function getDefaultCurrencyFromLocale(): Currency {
  if (typeof navigator === "undefined") return SUPPORTED_CURRENCIES[0].value;

  const lang = navigator.language || navigator.languages?.[0] || "";

  if (lang.startsWith("tr")) return "TRY"; // Turkish
  return SUPPORTED_CURRENCIES[0].value; // fallback
}
