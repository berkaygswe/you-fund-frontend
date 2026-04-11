"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { AssetIdentifier } from "@/types/asset";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PriceUpdate {
    symbol: string;
    price?: number;
    dailyChangePercent?: number;
    lastUpdate?: number;
    currency?: string;
}

interface RealtimeMessage {
    symbol: string;
    p: number;
    d1: number;
    m1: number;
    y1: number;
    ytd: number;
    ts: number;
    currency: string;
}

interface WebSocketContextValue {
    /** Subscribe assets for a given currency. Returns an unsubscribe function. */
    subscribe: (assets: AssetIdentifier[], currency: string) => () => void;
    /** All price updates received so far, keyed by symbol. */
    prices: Record<string, PriceUpdate>;
    /** Whether the shared WebSocket is currently open. */
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});

    /**
     * Ref-counted map: "symbol::currency" → number of active subscribers.
     * We only send subscribe/unsubscribe to the server when the count
     * transitions between 0 and 1.
     */
    const refCountMap = useRef<Map<string, number>>(new Map());

    /**
     * Tracks the currently subscribed currency per asset key.
     * Needed so we can batch the server messages correctly.
     */
    const subscribedCurrencies = useRef<Map<string, string>>(new Map());

    /**
     * Tracks the asset identity (type and symbol) per key.
     */
    const assetMeta = useRef<Map<string, AssetIdentifier>>(new Map());

    // ── Connection lifecycle (mount/unmount only) ──────────────────────────

    useEffect(() => {
        const isCleaningUp = { current: false };
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws/prices`);
        wsRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);

            // Re-subscribe any symbols that were registered before the connection opened
            // (or after a reconnect). Group by currency to batch the subscribe messages.
            const byCurrency = new Map<string, AssetIdentifier[]>();
            for (const [key, count] of refCountMap.current.entries()) {
                if (count > 0) {
                    const currency = subscribedCurrencies.current.get(key);
                    const asset = assetMeta.current.get(key);
                    if (currency && asset) {
                        const list = byCurrency.get(currency) || [];
                        list.push(asset);
                        byCurrency.set(currency, list);
                    }
                }
            }
            for (const [currency, assets] of byCurrency) {
                ws.send(
                    JSON.stringify({ action: "subscribe", assets, currency })
                );
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
        };

        ws.onerror = () => {
            // Suppress errors caused by intentional cleanup during unmount.
            // When we close a socket that is still CONNECTING, the browser fires
            // an error event before the close event — this is harmless.
            if (isCleaningUp.current) return;
            console.error("WebSocket connection error");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const updates: RealtimeMessage[] = Array.isArray(data)
                    ? data
                    : [data];

                setPrices((prev) => {
                    const next = { ...prev };
                    let hasChanges = false;

                    for (const u of updates) {
                        if (u.symbol) {
                            next[u.symbol] = {
                                symbol: u.symbol,
                                price: u.p,
                                dailyChangePercent: u.d1,
                                lastUpdate: u.ts * 1000,
                                currency: u.currency,
                            };
                            hasChanges = true;
                        }
                    }

                    return hasChanges ? next : prev;
                });
            } catch {
                console.error("WebSocket message parse error");
            }
        };

        return () => {
            isCleaningUp.current = true;
            ws.close();
            wsRef.current = null;
        };
    }, []);

    // ── Subscribe / Unsubscribe with ref counting ─────────────────────────

    const subscribe = useCallback(
        (assets: AssetIdentifier[], currency: string): (() => void) => {
            const newAssets: AssetIdentifier[] = [];

            for (const asset of assets) {
                const key = `${asset.type}::${asset.symbol}::${currency}`;
                const current = refCountMap.current.get(key) ?? 0;
                refCountMap.current.set(key, current + 1);
                subscribedCurrencies.current.set(key, currency);
                assetMeta.current.set(key, asset);

                // First subscriber for this key → actually subscribe on the server
                if (current === 0) {
                    newAssets.push(asset);
                }
            }

            // Send subscribe message if there are new symbols to subscribe
            if (newAssets.length > 0) {
                const ws = wsRef.current;
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(
                        JSON.stringify({
                            action: "subscribe",
                            assets: newAssets,
                            currency,
                        })
                    );
                }
                // If socket isn't open yet, onopen will re-subscribe from the refCountMap
            }

            // Return the unsubscribe cleanup function
            return () => {
                const staleAssets: AssetIdentifier[] = [];

                for (const asset of assets) {
                    const key = `${asset.type}::${asset.symbol}::${currency}`;
                    const current = refCountMap.current.get(key) ?? 0;
                    const next = Math.max(0, current - 1);
                    refCountMap.current.set(key, next);

                    // Last subscriber removed → unsubscribe from the server
                    if (next === 0) {
                        staleAssets.push(asset);
                        refCountMap.current.delete(key);
                        subscribedCurrencies.current.delete(key);
                        assetMeta.current.delete(key);
                    }
                }

                if (staleAssets.length > 0) {
                    const ws = wsRef.current;
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(
                            JSON.stringify({
                                action: "unsubscribe",
                                assets: staleAssets,
                                currency,
                            })
                        );
                    }
                }
            };
        },
        []
    );

    return (
        <WebSocketContext.Provider value={{ subscribe, prices, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
}

// ─── Hook to access the context ─────────────────────────────────────────────

export function useWebSocket() {
    const ctx = useContext(WebSocketContext);
    if (!ctx) {
        throw new Error("useWebSocket must be used within a <WebSocketProvider>");
    }
    return ctx;
}
