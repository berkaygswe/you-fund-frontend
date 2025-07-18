// stores/currency-store.ts
import { Currency } from '@/types/currency'
import { getDefaultCurrencyFromLocale } from '@/utils/getDefaultCurrency'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CurrencyState {
  currency: Currency
  setCurrency: (currency: Currency) => void
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: getDefaultCurrencyFromLocale(), // default currency
      setCurrency: (currency: Currency) => set({ currency }),
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'currency-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)