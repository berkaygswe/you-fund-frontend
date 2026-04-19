import { useMemo, ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { useCurrencySymbol } from './getCurrencySymbol';
import { shortenNumberIntl } from './shortenNumberIntl';

// Hook-safe version for use inside React components
export const useFormatCurrency = () => {
    const currency = useCurrencySymbol();
    const locale = useLocale();

    // eslint-disable-next-line react/display-name
    return useMemo(() => (price: number | null | undefined, shorten: boolean = false): ReactNode => {
        if (price == null || isNaN(price)) return '-';

        // Format the price to two decimal places.
        let formattedPrice: string;

        if (shorten) {
            formattedPrice = shortenNumberIntl(price, 1, locale);
        } else {
            formattedPrice = price.toFixed(2);
        }

        // Apply the requested formatting rules based on the currency.
        // Making the currency symbol slightly smaller via a text-[0.85em] relative size.
        if (currency === '$') {
            return (
                <>
                    <span className="text-[0.85em] opacity-80 font-normal mr-[1px]" > {currency} </span>
                    {formattedPrice}
                </>
            );
        }

        // For all other currencies (like TRY), the symbol comes after the price.
        return (
            <>
                {formattedPrice}
                <span className="text-[0.85em] opacity-80 font-normal ml-[2px]" > {currency} </span>
            </>
        );
    }, [currency, locale]);
};
