"use client";

import { useAssetDetailComparsion } from "@/hooks/useAssetDetailComparison";
import { useCurrency } from "@/hooks/useCurrency";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useMemo, useRef } from "react";
import { useRealtimePrices } from '@/hooks/useRealtimePrices';

const popularAssets = [
    { symbol: 'XAU', name: 'GOLD' },
    { symbol: 'XAG', name: 'SILVER' },
    { symbol: 'XU100', name: 'BIST 100' },
    { symbol: 'IXIC', name: 'NASDAQ' },
    { symbol: 'GSPC', name: 'S&P 500' },
    { symbol: 'BTC', name: 'BTC', isCrypto: true },
];

/**
 * Hook that tracks price direction changes and returns a flash key + direction.
 */
function useFlash(currentValue: number | undefined, initialValue: number) {
    const prevRef = useRef(initialValue);
    const flashRef = useRef<{ key: number; direction: 'green' | 'red' }>({ key: 0, direction: 'green' });

    if (currentValue !== undefined && currentValue !== prevRef.current) {
        const direction = currentValue > prevRef.current ? 'green' : 'red';
        prevRef.current = currentValue;
        // Increment the key to force a new element mount → restart CSS animation
        flashRef.current = { key: flashRef.current.key + 1, direction };
    }

    return flashRef.current;
}

function FlashOverlay({ flashKey, direction }: { flashKey: number; direction: 'green' | 'red' }) {
    if (flashKey === 0) return null;
    return (
        <span
            key={flashKey}
            className={`absolute inset-0 rounded pointer-events-none price-flash-${direction}`}
        />
    );
}

interface TickerItemProps {
    symbol: string;
    name: string;
    initialValue: number;
    initialChange: number;
    realtimePrice?: number;
    realtimeChange?: number;
}

function TickerItem({ symbol, name, initialValue, initialChange, realtimePrice, realtimeChange }: TickerItemProps) {
    const formatCurrency = useFormatCurrency();
    const { key: flashKey, direction } = useFlash(realtimePrice, initialValue);

    const displayPrice = realtimePrice ?? initialValue;
    const displayChange = realtimeChange ?? initialChange;
    const isUp = displayChange >= 0;

    return (
        <div className="relative flex items-center gap-2 flex-shrink-0 group cursor-pointer px-4 py-1 rounded transition-colors hover:bg-muted/30">
            <FlashOverlay flashKey={flashKey} direction={direction} />
            <span className="relative z-[1] text-sm font-medium tracking-tight group-hover:text-primary transition-colors text-muted-foreground" title={name}>{name}</span>
            <span className="relative z-[1] text-sm font-mono tabular-nums font-semibold">{formatCurrency(displayPrice)}</span>
            <div className={`relative z-[1] flex items-center text-xs font-mono font-medium ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isUp ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                {Math.abs(displayChange).toFixed(2)}%
            </div>
            <div className="h-3 w-px bg-border/50 ml-4 hidden sm:block"></div>
        </div>
    );
}

export function SlidingMarketTicker() {
    const currency = useCurrency();

    const today = new Date();
    const sDate = new Date(today);
    sDate.setDate(today.getDate() - 7);
    const startDate = sDate.toISOString().slice(0, 10);

    const assetCodes = useMemo(() => {
        return popularAssets.map(asset => asset.symbol);
    }, []);

    const wsSymbols = useMemo(() => {
        return popularAssets.map(asset =>
            asset.isCrypto && currency ? `${asset.symbol}-${currency}` : asset.symbol
        );
    }, [currency]);

    const { assetComparisonData, loading } = useAssetDetailComparsion(assetCodes, startDate, currency);
    const realtimePrices = useRealtimePrices(wsSymbols, currency);

    if (loading || !assetComparisonData) {
        return (
            <div className="w-full h-[40px] border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            </div>
        );
    }

    const tickerItems = popularAssets.map(asset => {
        const detail = assetComparisonData.find(d => d.symbol === asset.symbol);
        if (!detail) return null;

        // Determine the symbol string used to subscribe
        const wsSymbol = asset.isCrypto && currency ? `${asset.symbol}-${currency}` : asset.symbol;
        const rt = realtimePrices[wsSymbol];

        return {
            symbol: asset.symbol,
            name: asset.name,
            initialValue: detail.close,
            initialChange: detail.percentChangeFromStart,
            realtimePrice: rt?.price,
            realtimeChange: rt?.dailyChangePercent
        };
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    if (tickerItems.length === 0) return null;

    // We duplicate the items enough times to fill the screen twice, 
    // ensuring the marquee loops seamlessly. We will repeat it twice for sufficient coverage.
    const repeatedItems = [...tickerItems, ...tickerItems];

    return (
        <div className="w-full max-w-full overflow-hidden border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative isolate">
            {/* Gradient masks for smooth fade effect on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>

            <div className="animate-marquee py-2">
                {repeatedItems.map((item, i) => (
                    <TickerItem
                        key={i}
                        symbol={item.symbol}
                        name={item.name}
                        initialValue={item.initialValue}
                        initialChange={item.initialChange}
                        realtimePrice={item.realtimePrice}
                        realtimeChange={item.realtimeChange}
                    />
                ))}
            </div>
        </div>
    );
}
