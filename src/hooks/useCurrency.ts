import { useCurrencyStore } from "@/stores/currency-store";
import { Currency } from "@/types/currency";

/**
 * Returns the user's persisted currency ONLY after Zustand hydration completes.
 * Pre-hydration: returns null (consumers should show loading / skip fetch).
 * Post-hydration: returns the actual Currency value.
 */
export function useCurrency(): Currency | null {
    const currency = useCurrencyStore((s) => s.currency);
    const isHydrated = useCurrencyStore((s) => s._hasHydrated);

    return isHydrated ? currency : null;
}
