import { useEffect, useMemo, useRef, useState } from 'react';
import { useWebSocket, PriceUpdate } from '@/providers/WebSocketProvider';
import { AssetIdentifier } from '@/types/asset';

export type { PriceUpdate } from '@/providers/WebSocketProvider';

/**
 * Subscribes to real-time price updates for the given assets.
 *
 * Uses the shared WebSocket connection from WebSocketProvider.
 * Multiple components can subscribe to overlapping assets without
 * creating duplicate server subscriptions (ref-counted internally).
 *
 * Returns only the price updates relevant to the requested assets.
 */
export const useRealtimePrices = (assets: AssetIdentifier[], currency: string | null) => {
    const { subscribe, prices } = useWebSocket();
    const [, forceUpdate] = useState(0);

    // Keep a stable reference for comparison
    const assetsKey = useMemo(() => assets.map(a => `${a.type}:${a.symbol}`).join(','), [assets]);

    // Reset component-level awareness when currency changes
    const prevCurrencyRef = useRef(currency);
    useEffect(() => {
        if (currency && currency !== prevCurrencyRef.current) {
            prevCurrencyRef.current = currency;
            forceUpdate((n) => n + 1);
        }
    }, [currency]);

    // Subscribe/unsubscribe when assets or currency change
    useEffect(() => {
        if (!currency || assets.length === 0) return;

        const unsubscribe = subscribe(assets, currency);
        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsKey, currency, subscribe]);

    // Filter the shared price store to only return data for the requested assets
    return useMemo(() => {
        const filtered: Record<string, PriceUpdate> = {};

        for (const asset of assets) {
            const requestedSymbol = asset.symbol;
            // requestedSymbol might be "BTC-USD" or just "VOO"
            const baseSymbol = requestedSymbol.split('-')[0];
            const p = prices[baseSymbol];

            // If we have a price for this base symbol, AND it matches our current currency
            if (p && (!currency || p.currency === currency)) {
                // Key it under the requested symbol so the component can find it easily
                filtered[requestedSymbol] = p;
            }
        }

        return filtered;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsKey, prices, currency]);
};
