"use client"

import { useAssetTopMovers } from "@/hooks/useAssetTopMovers";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/hooks/useCurrency";
import { Flame, Snowflake, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function AssetTopMovers() {
    const t = useTranslations('Dashboard.MarketOverview');
    const formatCurrency = useFormatCurrency();
    const currency = useCurrency();
    const router = useRouter();

    const { assets: topLosers, loading: topLosersLoading, error: topLosersError } = useAssetTopMovers('ASC', currency);
    const { assets: topGainers, loading: topGainersLoading, error: topGainersError } = useAssetTopMovers('DESC', currency);

    if (topLosersLoading || topGainersLoading || !currency || topLosers === null || topGainers === null) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-4 rounded-xl border h-[116px]">
                                <Skeleton className="h-4 w-12 mb-2" />
                                <Skeleton className="h-3 w-24 mb-4" />
                                <div className="flex justify-between items-end">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-4 rounded-xl border h-[116px]">
                                <Skeleton className="h-4 w-12 mb-2" />
                                <Skeleton className="h-3 w-24 mb-4" />
                                <div className="flex justify-between items-end">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (topLosersError || topGainersError) {
        return (
            <div className="text-center py-6">
                <div className="text-red-500 mb-2">{t('errorLoadingMovers')}</div>
                <p className="text-sm text-muted-foreground">{t('tryAgainLater')}</p>
            </div>
        );
    }

    const displayTopLosers = topLosers ?? [];
    const displayTopGainers = topGainers ?? [];

    if (displayTopLosers.length === 0 && displayTopGainers.length === 0) {
        return (
            <div className="text-center py-6">
                <div className="text-muted-foreground mb-2">{t('noMoversData')}</div>
                <p className="text-sm text-muted-foreground">{t('checkBackLater')}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Top Gainers */}
            <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">{t('topGainers')}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {displayTopGainers.slice(0, 6).map((asset) => {
                        return (
                            <div
                                key={asset.symbol}
                                onClick={() => {
                                    router.push(`/asset/${asset.type}/${asset.symbol}`);
                                }}
                                className={`p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors group relative overflow-hidden cursor-pointer`}
                            >
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <div className="font-bold text-foreground">{asset.symbol}</div>
                                    <div className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full border border-border/50 uppercase">{asset.type || t('asset')}</div>
                                </div>
                                <div className="text-xs text-muted-foreground mb-4 relative z-10 line-clamp-1">{asset.name}</div>
                                <div className="flex justify-between items-end relative z-10">
                                    <div className="font-mono font-medium text-foreground">{formatCurrency(Number(asset.currentClose))}</div>
                                    <div className="flex items-center text-xs font-mono font-bold text-emerald-500">
                                        <ArrowUpRight className="h-3 w-3 mr-0.5" /> +{asset.percentageChange.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Losers */}
            <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                    <Snowflake className="h-4 w-4 text-rose-500" />
                    <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">{t('topLosers')}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {displayTopLosers.slice(0, 6).map((asset) => {
                        return (
                            <div
                                key={asset.symbol}
                                onClick={() => {
                                    router.push(`/asset/${asset.type}/${asset.symbol}`);
                                }}
                                className={`p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-colors group relative overflow-hidden cursor-pointer`}
                            >
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <div className="font-bold text-foreground">{asset.symbol}</div>
                                    <div className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full border border-border/50 uppercase">{asset.type || t('asset')}</div>
                                </div>
                                <div className="text-xs text-muted-foreground mb-4 relative z-10 line-clamp-1">{asset.name}</div>
                                <div className="flex justify-between items-end relative z-10">
                                    <div className="font-mono font-medium text-foreground">{formatCurrency(Number(asset.currentClose))}</div>
                                    <div className="flex items-center text-xs font-mono font-bold text-rose-500">
                                        <ArrowDownRight className="h-3 w-3 mr-0.5" /> {Math.abs(asset.percentageChange).toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
