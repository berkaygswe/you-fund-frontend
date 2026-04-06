"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAssetDetailComparsion } from "@/hooks/useAssetDetailComparison";
import { useAssetGraphComparison } from "@/hooks/useAssetGraphComparison";
import { useCurrency } from "@/hooks/useCurrency";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { ArrowDownRight, ArrowUpRight, BarChart3, Bitcoin, DollarSign, Gem } from "lucide-react"
import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const assetGroups = {
    indices: [
        { symbol: 'XU100', name: 'BIST 100', type: 'index' },
        { symbol: 'IXIC', name: 'NASDAQ', type: 'index' },
        { symbol: 'GSPC', name: 'S&P 500', type: 'index' },
    ],
    crypto: [
        { symbol: 'BTC', name: 'Bitcoin', type: 'crypto' },
        { symbol: 'ETH', name: 'Ethereum', type: 'crypto' },
        { symbol: 'SOL', name: 'Solana', type: 'crypto' },
        { symbol: 'AVAX', name: 'Avalanche', type: 'crypto' }
    ],
    forex: [
        { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex' },
        { symbol: 'GBPUSD', name: 'GBP/USD', type: 'forex' },
        { symbol: 'USDJPY', name: 'USD/JPY', type: 'forex' },
        { symbol: 'USDTRY', name: 'USD/TRY', type: 'forex' }
    ],
    commodities: [
        { symbol: 'XAU', name: 'GOLD', type: 'commodity' },
        { symbol: 'XAG', name: 'SILVER', type: 'commodity' },
        { symbol: 'CL', name: 'Crude Oil', type: 'commodity' },
        { symbol: 'NG', name: 'Natural Gas', type: 'commodity' }
    ],
    stocks: [
        { symbol: 'AAPL', name: 'Apple', type: 'stock' },
        { symbol: 'MSFT', name: 'Microsoft', type: 'stock' },
        { symbol: 'GOOGL', name: 'Google', type: 'stock' },
        { symbol: 'AMZN', name: 'Amazon', type: 'stock' }
    ],
    tefasFunds: [
        { symbol: 'TP2', name: 'TERA PORTFÖY PARA PİYASASI (TL) FONU', type: 'fund' },
        { symbol: 'PHE', name: 'PUSULA PORTFÖY HİSSE SENEDİ FONU (HİSSE SENEDİ YOĞUN FON)', type: 'fund' },
        { symbol: 'TLY', name: 'TERA PORTFÖY BİRİNCİ SERBEST FON', type: 'fund' },
        { symbol: 'AES', name: 'AK PORTFÖY PETROL YABANCI BYF FON SEPETİ FONU', type: 'fund' },
    ]
};

export function SectionCards() {
    const t = useTranslations('Dashboard.MarketOverview');
    const formatCurrency = useFormatCurrency()
    const currency = useCurrency();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<keyof typeof assetGroups>("indices");

    const today = new Date();
    const sDate = new Date(today);
    sDate.setDate(today.getDate() - 7);
    const startDate = sDate.toISOString().slice(0, 10);

    const activeAssets = assetGroups[activeTab];

    const assetCodes = useMemo(() => {
        return activeAssets.map(asset => asset.symbol);
    }, [activeAssets]);

    const { assetComparisonData: prices, loading: graphLoading, error: graphError, isPlaceholderData: graphPlaceholder } = useAssetGraphComparison(assetCodes, startDate, today.toISOString().slice(0, 10), currency);
    const { assetComparisonData, loading: comparisonLoading, error: comparisonError, isPlaceholderData: comparisonPlaceholder } = useAssetDetailComparsion(assetCodes, startDate, currency);

    const renderTableContent = () => {
        if (comparisonLoading || graphLoading || comparisonPlaceholder || graphPlaceholder || !currency) {
            return (
                <div className="w-full overflow-x-auto rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground bg-muted/40 border-b border-border/40 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">{t('asset')}</th>
                                <th className="px-6 py-4 font-medium text-right">{t('price')}</th>
                                <th className="px-6 py-4 font-medium text-right">{t('change7d')}</th>
                                <th className="px-6 py-4 font-medium text-right hidden md:table-cell">{t('trend7d')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><Skeleton className="h-8 w-32" /></td>
                                    <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-16 ml-auto" /></td>
                                    <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-20 ml-auto" /></td>
                                    <td className="px-6 py-4 text-right hidden md:table-cell"><Skeleton className="h-8 w-24 ml-auto" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        if (comparisonError || graphError) {
            return (
                <div className="p-6 text-center border rounded-xl bg-background/50">
                    <div className="text-red-500 mb-2">{t('errorLoadingMarketData')}</div>
                    <p className="text-sm text-muted-foreground">{t('tryAgainLater')}</p>
                </div>
            );
        }

        if (!assetComparisonData || assetComparisonData.length === 0 || !prices || prices.length === 0) {
            return (
                <div className="p-6 text-center border rounded-xl bg-background/50">
                    <div className="text-muted-foreground mb-2">{t('noMarketData')}</div>
                    <p className="text-sm text-muted-foreground">{t('checkBackLater')}</p>
                </div>
            );
        }

        return (
            <div className="w-full overflow-x-auto rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground bg-muted/40 border-b border-border/40 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">{t('asset')}</th>
                            <th className="px-6 py-4 font-medium text-right">{t('price')}</th>
                            <th className="px-6 py-4 font-medium text-right">{t('change7d')}</th>
                            <th className="px-6 py-4 font-medium text-right hidden md:table-cell">{t('trend7d')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {activeAssets.map((asset, idx) => {
                            const assetDetail = assetComparisonData?.find(data => data.symbol === asset.symbol);
                            const assetPrices = prices?.find(data => data.name === asset.symbol);

                            if (!assetDetail || !assetPrices || assetPrices.data.length === 0) return null;

                            const isUp = assetDetail.percentChangeFromStart >= 0;
                            const trendValues = assetPrices.data.map((d: { value: number }) => d.value);
                            const min = Math.min(...trendValues) * 0.98;
                            const max = Math.max(...trendValues);

                            return (
                                <tr key={idx} className="hover:bg-muted/30 transition-colors group cursor-pointer"
                                    onClick={() => {
                                        if (asset.type === 'fund' || asset.type === 'etf' || asset.type === 'stock') {
                                            router.push(`/${asset.type}/detail/${asset.symbol}`);
                                        }
                                    }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <span className="font-bold text-xs">{asset.symbol.substring(0, 2)}</span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground flex items-center gap-2">
                                                    {asset.symbol}
                                                    <span className="text-[10px] font-normal uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-background border border-border/50 text-muted-foreground">
                                                        {t(asset.type || 'asset')}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">{asset.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-foreground">
                                        {formatCurrency(assetDetail.close)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={`inline-flex items-center gap-1 font-mono text-xs font-medium px-2 py-1 rounded-md ${isUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                                            {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                            {Math.abs(assetDetail.percentChangeFromStart).toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right hidden md:table-cell">
                                        <div className="h-8 w-24 ml-auto flex items-end gap-[2px]">
                                            {trendValues.map((t: number, i: number) => {
                                                const height = max === min ? 50 : Math.max(10, ((t - min) / (max - min)) * 100);
                                                return (
                                                    <div key={i} className={`w-full rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity ${isUp ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ height: `${height}%` }}></div>
                                                )
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const getTabLabel = (key: string) => {
        if (key === 'tefasFunds') return t('tefasFundsLabel');
        return t(key);
    }

    return (
        <Tabs defaultValue="indices" onValueChange={(val) => setActiveTab(val as keyof typeof assetGroups)} className="w-full">
            <div className="flex items-center justify-between mb-4 mt-2 sm:mt-0 px-2 sm:px-0">
                <div className="hidden sm:block text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {getTabLabel(activeTab)} {t('overview')}
                </div>
                <TabsList className="bg-muted/50 p-1 border border-border/50 w-full sm:w-auto h-auto grid grid-cols-4 sm:flex gap-1">
                    <TabsTrigger value="indices" className="gap-2 text-xs py-2"><BarChart3 className="h-3 w-3" /> <span className="hidden sm:inline">{t('indices')}</span></TabsTrigger>
                    <TabsTrigger value="crypto" className="gap-2 text-xs py-2"><Bitcoin className="h-3 w-3" /> <span className="hidden sm:inline">{t('crypto')}</span></TabsTrigger>
                    <TabsTrigger value="forex" className="gap-2 text-xs py-2"><DollarSign className="h-3 w-3" /> <span className="hidden sm:inline">{t('forex')}</span></TabsTrigger>
                    <TabsTrigger value="commodities" className="gap-2 text-xs py-2"><Gem className="h-3 w-3" /> <span className="hidden sm:inline">{t('commodities')}</span></TabsTrigger>
                    <TabsTrigger value="stocks" className="gap-2 text-xs py-2"><Gem className="h-3 w-3" /> <span className="hidden sm:inline">{t('stocks')}</span></TabsTrigger>
                    <TabsTrigger value="tefasFunds" className="gap-2 text-xs py-2"><Gem className="h-3 w-3" /> <span className="hidden sm:inline">{t('tefasFundsLabel')}</span></TabsTrigger>
                </TabsList>
            </div>

            {Object.keys(assetGroups).map((key) => (
                <TabsContent key={key} value={key} className="mt-0 outline-none">
                    {renderTableContent()}
                </TabsContent>
            ))}
        </Tabs>
    )
}
