import { useEffect, useRef, useState } from 'react';

export interface PriceUpdate {
    symbol: string;
    price?: number;
    dailyChangePercent?: number;
    lastUpdate?: number;
}

interface RealtimeMessage {
    symbol: string;
    p: number;      // price
    d1: number;     // daily change %
    m1: number;     // 1 month change %
    y1: number;     // 1 year change %
    ytd: number;    // YTD change %
    ts: number;     // timestamp in seconds
    currency: string;
}

export const useRealtimePrices = (symbols: string[], currency: string | null) => {
    const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const currencyRef = useRef(currency);

    // 0. Reset prices and update currencyRef when currency changes
    useEffect(() => {
        if (!currency) return;
        setPrices({});
        currencyRef.current = currency;
    }, [currency]);

    // 1. Manage Connection (Only on mount/unmount)
    useEffect(() => {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws/prices`);
        wsRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
        };

        ws.onclose = () => {
            setIsConnected(false);
        };

        ws.onerror = (err) => {
            console.error("WebSocket Error:", err);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const updates: RealtimeMessage[] = Array.isArray(data) ? data : [data];

                setPrices(prev => {
                    const next = { ...prev };
                    let hasChanges = false;

                    updates.forEach((u) => {
                        if (u.symbol && u.currency === currencyRef.current) {
                            next[u.symbol] = {
                                symbol: u.symbol,
                                price: u.p,
                                dailyChangePercent: u.d1,
                                lastUpdate: u.ts * 1000
                            };
                            hasChanges = true;
                        }
                    });

                    return hasChanges ? next : prev;
                });
            } catch (err) {
                console.error('WebSocket message parse error', err);
            }
        };

        return () => {
            ws.close();
        };
    }, []);

    // 2. Manage Subscriptions (When symbols/currency/connection changes)
    useEffect(() => {
        const ws = wsRef.current;

        if (ws && isConnected && symbols.length > 0 && currency) {
            ws.send(JSON.stringify({
                action: 'subscribe',
                symbols,
                currency
            }));

            return () => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        action: 'unsubscribe',
                        symbols,
                        currency
                    }));
                }
            };
        }
    }, [isConnected, symbols.join(','), currency]);

    return prices;
};
