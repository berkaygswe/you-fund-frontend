export const SUPPORTED_CURRENCIES = [
  { value: "USD", label: "US Dollar", symbol: "$", countryCode: "us" },
  { value: "TRY", label: "Turkish Lira", symbol: "₺", countryCode: "tr" },
] as const;

export type Currency = (typeof SUPPORTED_CURRENCIES)[number]["value"];
