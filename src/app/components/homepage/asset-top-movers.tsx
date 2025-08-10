"use client"

import { useAssetTopMovers } from "@/hooks/useAssetTopMovers";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrencyStore } from "@/stores/currency-store";
import { Flame, Snowflake, TrendingUp, TrendingDown } from "lucide-react";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { useRouter } from 'next/navigation';

export default function AssetTopMovers(){

    const formatCurrency = useFormatCurrency();
    const currency = useCurrencyStore((s) => s.currency)
    const router = useRouter();

    const { assets: topLosers, loading: topLosersLoading, error: topLosersError } = useAssetTopMovers('ASC', currency);
    const { assets: topGainers, loading: topGainersLoading, error: topGainersError } = useAssetTopMovers('DESC', currency);

    if (topLosersLoading || topGainersLoading) {
        return (
            <div className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-8 w-8 rounded" />
                                    <div>
                                        <Skeleton className="h-4 w-16 mb-1" />
                                        <Skeleton className="h-3 w-12" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Skeleton className="h-4 w-16 mb-1" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Handle error state
    if (topLosersError || topGainersError) {
        return (
            <div className="text-center py-6">
                <div className="text-red-500 mb-2">Error loading market movers</div>
                <p className="text-sm text-muted-foreground">Please try again later</p>
            </div>
        );
    }

    const displayTopLosers = Array.isArray(topLosers) ? topLosers : [];
    const displayTopGainers = Array.isArray(topGainers) ? topGainers : [];

    // Only render the card if assetComparisonData has data and prices has data
    if (displayTopLosers.length === 0 && displayTopGainers.length === 0) {
        return (
            <div className="text-center py-6">
                <div className="text-muted-foreground mb-2">No market movers data</div>
                <p className="text-sm text-muted-foreground">Please check back later</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Top Gainers */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold text-sm">Top Gainers (24h)</h3>
                </div>
                <div className="space-y-2">
                    {displayTopGainers.slice(0, 5).map((asset, index) => {
                        const isFund = asset.type === 'fund';
                        return (
                            <div
                                key={asset.symbol}
                                onClick={() => {
                                    if (isFund) router.push(`/fund/detail/${asset.symbol}`);
                                }}
                                className={`flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors ${
                                    isFund ? 'cursor-pointer' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                                        <span className="text-xs font-bold text-green-600">#{index + 1}</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">{asset.symbol}</div>
                                        <div className="text-xs text-muted-foreground">{asset.name}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-sm">
                                        {formatCurrency(Number(asset.currentClose))}
                                    </div>
                                    <div className="flex items-center gap-1 text-green-600 text-xs">
                                        <TrendingUp className="h-3 w-3" />
                                        <span>+{asset.percentageChange.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Losers */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold text-sm">Top Losers (24h)</h3>
                </div>
                <div className="space-y-2">
                    {displayTopLosers.slice(0, 5).map((asset, index) => {
                        const isFund = asset.type === 'fund';
                        return (
                            <div
                                key={asset.symbol}
                                onClick={() => {
                                    if (isFund) router.push(`/fund/detail/${asset.symbol}`);
                                }}
                                className={`flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors ${
                                    isFund ? 'cursor-pointer' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg">
                                        <span className="text-xs font-bold text-red-600">#{index + 1}</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">{asset.symbol}</div>
                                        <div className="text-xs text-muted-foreground">{asset.name}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-sm">
                                        {formatCurrency(Number(asset.currentClose))}
                                    </div>
                                    <div className="flex items-center gap-1 text-red-600 text-xs">
                                        <TrendingDown className="h-3 w-3" />
                                        <span>{asset.percentageChange.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* View All Button 
            <div className="pt-2">
                <button className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border rounded-lg hover:bg-muted/50">
                    <span>View All Market Movers</span>
                    <ArrowUpRight className="h-4 w-4" />
                </button>
            </div>
            */}
        </div>
    )
}