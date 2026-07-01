import { useAssetDetailComparsion } from "@/hooks/useAssetDetailComparison";
import { useCurrency } from "@/hooks/useCurrency";
import type { AssetType as TypeOfAsset } from "@/types/asset";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { useMemo, useState } from "react";
import FloatingCard from "./FloatingCard";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { useTranslations } from 'next-intl';

const assets = [
    {
        type: 'stock',
        name: 'Apple Inc.',
        symbol: 'AAPL',
    },
    {
        type: 'stock',
        name: 'NVIDIA Corporation',
        symbol: 'NVDA',
    },
    {
        type: 'stock',
        name: 'Amazon.com Inc.',
        symbol: 'AMZN',
    },
    {
        type: 'etf',
        name: 'Vanguard S&P 500',
        symbol: 'VOO',
    },
    {
        type: 'etf',
        name: 'SPDR S&P 500',
        symbol: 'SPY',
    },
    {
        type: 'etf',
        name: 'Invesco QQQ Trust',
        symbol: 'QQQ',
    },
    {
        type: 'cryptocurrency',
        name: 'Bitcoin',
        symbol: 'BTC',
    },
    {
        type: 'cryptocurrency',
        name: 'Ethereum',
        symbol: 'ETH',
    },
    {
        type: 'cryptocurrency',
        name: 'Solana',
        symbol: 'SOL',
    },
    {
        type: 'fund',
        name: 'Istanbul Portfolio',
        symbol: 'IIE',
    },
    {
        type: 'fund',
        name: 'Istanbul Index Fund',
        symbol: 'IIH',
    },
    {
        type: 'fund',
        name: 'Borsa Istanbul Growth Portfolio',
        symbol: 'BGP',
    }
];

const assetTypeColors = {
    stock: 'bg-blue-600 dark:bg-blue-500',
    etf: 'bg-indigo-600 dark:bg-indigo-500',
    fund: 'bg-emerald-600 dark:bg-emerald-500',
    cryptocurrency: 'bg-amber-600 dark:bg-amber-500'
};

export default function AssetType() {
    const t = useTranslations('Landing.Compare');
    const tAsset = useTranslations('AssetTypes');
    const formatCurrency = useFormatCurrency();
    const currency = useCurrency();

    const today = new Date();
    const sDate = new Date(today);
    sDate.setDate(today.getDate() - 7);
    const startDate = sDate.toISOString().slice(0, 10);

    const [activeTab, setActiveTab] = useState('stock');
    const assetIdentifiers = useMemo(() => assets.map(asset => ({ 
        type: asset.type as TypeOfAsset, 
        symbol: asset.symbol 
    })), []);
    
    const { assetComparisonData, loading: comparisonLoading, error: comparisonError } = useAssetDetailComparsion(assetIdentifiers, startDate, currency);

    const filteredAssets = useMemo(() => {
        if (!assetComparisonData || !Array.isArray(assetComparisonData)) return [];
        return assetComparisonData.filter(asset => asset.type === activeTab);
    }, [assetComparisonData, activeTab]);

    return (
        <div className="bg-card/20 dark:bg-card/5 backdrop-blur-md rounded-3xl p-8 border border-border/40 dark:border-border/10 shadow-sm transition-colors duration-300">
            <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-primary/10 border-primary/20 dark:bg-primary/20 dark:border-primary/30 border rounded-full px-4 py-1.5 mb-4 shadow-xs">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-semibold tracking-wider text-foreground/90">{t('badge')}</span>
                </div>
                <h2 className="text-3xl font-black mb-4 text-foreground tracking-tight">
                    {t('title')}
                </h2>
                <p className="text-muted-foreground font-semibold text-sm">{t('subtitle')}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {['stock', 'etf', 'cryptocurrency', 'fund'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-xs cursor-pointer ${activeTab === type
                                ? `${assetTypeColors[type as keyof typeof assetTypeColors]} text-white shadow-md`
                                : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/70 border border-border/40 hover:text-foreground'
                            }`}
                    >
                        {tAsset(type)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {!comparisonLoading && !comparisonError && filteredAssets.map((asset) => (
                    <FloatingCard key={asset.symbol} className="group hover:-translate-y-1 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 ${assetTypeColors[asset.type as keyof typeof assetTypeColors]} rounded-lg flex items-center justify-center text-white font-black text-sm`}>
                                    {asset.symbol.charAt(0)}
                                </div>
                                <span className="font-extrabold text-lg text-foreground">{asset.symbol}</span>
                            </div>
                            {asset.percentChangeFromStart !== undefined && (
                                <div className={`flex items-center space-x-1 text-sm font-bold ${asset.percentChangeFromStart >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                                    {asset.percentChangeFromStart >= 0 ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}
                                    <span>
                                        {asset.percentChangeFromStart >= 0 ? '+' : ''}{asset.percentChangeFromStart.toFixed(2)}%
                                    </span>
                                </div>
                            )}
                            {asset.percentChangeFromStart === undefined && (
                                <span className="text-muted-foreground text-sm font-bold">N/A</span>
                            )}
                        </div>

                        <div className="text-2xl font-black mb-2 text-foreground tracking-tight">
                            {formatCurrency(asset.close)}
                        </div>
                        <div className="text-muted-foreground text-xs font-bold mb-4">{asset.name}</div>

                        {asset.volume !== null && (
                            <div className="space-y-2 pt-4 border-t border-border/40">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-muted-foreground">{t('volume')}</span>
                                    <span className="text-foreground">{asset.volume.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </FloatingCard>
                ))}

                {comparisonLoading && (
                    <>
                        {[1, 2, 3].map((i) => (
                            <FloatingCard key={i} className="animate-pulse">
                                <div className="h-4 bg-secondary/60 dark:bg-secondary/20 rounded-md mb-4"></div>
                                <div className="h-6 bg-secondary/60 dark:bg-secondary/20 rounded-md mb-2"></div>
                                <div className="h-4 bg-secondary/60 dark:bg-secondary/20 rounded-md mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-secondary/60 dark:bg-secondary/20 rounded-md"></div>
                                    <div className="h-3 bg-secondary/60 dark:bg-secondary/20 rounded-md"></div>
                                </div>
                            </FloatingCard>
                        ))}
                    </>
                )}

                {comparisonError && (
                    <div className="col-span-full text-center py-8">
                        <div className="text-rose-500 dark:text-rose-400 font-bold mb-2">{t('error')}</div>
                        <div className="text-muted-foreground text-sm font-semibold">{t('tryAgain')}</div>
                    </div>
                )}

                {!comparisonLoading && !comparisonError && filteredAssets.length === 0 && (
                    <div className="col-span-full text-center py-8">
                        <div className="text-muted-foreground font-bold mb-2">{t('noData', { type: tAsset(activeTab) })}</div>
                        <div className="text-muted-foreground/60 text-sm font-semibold">{t('trySelect')}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

