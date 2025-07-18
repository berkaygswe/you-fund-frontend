// utils/formatCurrency.ts
import { useCurrencySymbol } from './getCurrencySymbol'

// Hook-safe version for use inside React components
export const useFormatCurrency = () => {
  const currency = useCurrencySymbol();

  return (price: number) => `${price.toFixed(2)} ${currency}`
}
