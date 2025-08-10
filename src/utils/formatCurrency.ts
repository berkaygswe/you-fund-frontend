// utils/formatCurrency.ts
import { useCurrencySymbol } from './getCurrencySymbol'
import { shortenNumberIntl } from './shortenNumberIntl';

// Hook-safe version for use inside React components
export const useFormatCurrency = () => {
  const currency = useCurrencySymbol();

  return (price: number, shorten: boolean = false) => {
    // Format the price to two decimal places.
    let formattedPrice: string;

    if (shorten) {
      formattedPrice = shortenNumberIntl(price, 1);
    } else {
      formattedPrice = price.toFixed(2);
    }

    // Apply the requested formatting rules based on the currency.
    // For USD, the symbol comes before the price.
    if (currency === '$') {
      return `${currency}${formattedPrice}`;
    }

    // For all other currencies (like TRY), the symbol comes after the price.
    return `${formattedPrice} ${currency}`;
  }
}
