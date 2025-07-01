// utils/formatCurrency.ts
import { getCurrencySymbol } from './getCurrencySymbol'

// Hook-safe version for use inside React components
export const useFormatCurrency = () => {
  const currency = getCurrencySymbol();

  return (price: number) => `${price.toFixed(2)} ${currency}`
}
