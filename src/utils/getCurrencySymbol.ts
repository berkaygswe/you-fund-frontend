// utils/getCurrencySymbol.ts

import { useCurrency } from "@/hooks/useCurrency"

export const useCurrencySymbol = () => {

    const currency = useCurrency();

    if (!currency) return '';

    switch (currency) {
        case 'USD':
            return '$'
        case 'TRY':
            return '₺'
        default:
            return ''
    }
}
