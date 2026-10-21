import { useCallback, ReactNode } from 'react';
import { Money } from '@/lib/format/Money';

/**
 * @deprecated Use `<Money amount={...} />` or `useFormatters().money` from `@/lib/format`.
 * Kept as a thin adapter so existing call sites get locale-aware output while they migrate.
 */
export const useFormatCurrency = () => {
    return useCallback(
        (price: number | null | undefined, shorten: boolean = false): ReactNode => (
            <Money amount={price} compact={shorten} />
        ),
        []
    );
};
