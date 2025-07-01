// utils/getDefaultCurrency.ts
export function getDefaultCurrencyFromLocale(): "TRY" | "USD" {
  if (typeof navigator === "undefined") return "USD"

  const lang = navigator.language || navigator.languages?.[0] || ""

  if (lang.startsWith("tr")) return "TRY" // Turkish
  return "USD" // fallback
}