import { useAssetDetailComparsion } from "@/hooks/useAssetDetailComparison";
import { useCurrencyStore } from "@/stores/currency-store";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { useMemo, useState } from "react";
import FloatingCard from "./FloatingCard";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";

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
    stock: 'from-blue-500 to-cyan-500',
    etf: 'from-purple-500 to-pink-500',
    fund: 'from-green-500 to-emerald-500',
    crypto: 'from-orange-500 to-red-500'
};

export default function AssetType() {

    const formatCurrency = useFormatCurrency()
    const currency = useCurrencyStore((s) => s.currency)

    const today = new Date();
    const sDate = new Date(today);
    sDate.setDate(today.getDate() - 7);
    const startDate = sDate.toISOString().slice(0, 10);

    const [activeTab, setActiveTab] = useState('stock');
    const assetCodes = useMemo(() => assets.map(asset => asset.symbol), [assets]);
    const {assetComparisonData, loading: comparisonLoading, error: comparisonError} = useAssetDetailComparsion(assetCodes, startDate, currency);

    // Filter assets based on the activeTab
    const filteredAssets = useMemo(() => {
        if (!assetComparisonData || !Array.isArray(assetComparisonData)) return [];

        // Filter based on the activeTab.
        // Note: 'crypto' type is in the buttons but not in your `assets` array.
        // If you want to display crypto, you'll need to add crypto assets to your `assets` array
        // and ensure your useAssetDetailComparsion hook fetches data for them.
        return assetComparisonData.filter(asset => asset.type === activeTab);
    }, [assetComparisonData, activeTab]);

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-4 py-2 mb-4 border border-blue-500/30">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-200">Rich Market Data</span>
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Compare Everything
                </h2>
                <p className="text-gray-300">All major asset classes in one powerful platform</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {['stock', 'etf', 'crypto', 'fund'].map((type) => (
                <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeTab === type 
                        ? `bg-gradient-to-r ${assetTypeColors[type as keyof typeof assetTypeColors]} text-white shadow-lg` 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    }`}
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
                ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {!comparisonLoading && !comparisonError && filteredAssets.map((asset) => (
                    <FloatingCard key={asset.symbol} className="group hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 bg-gradient-to-r ${assetTypeColors[asset.type as keyof typeof assetTypeColors]} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                                    {asset.symbol.charAt(0)}
                                </div>
                                <span className="font-semibold text-lg">{asset.symbol}</span>
                            </div>
                            {/* Display percentage change and color it based on value */}
                            {asset.percentChangeFromStart !== undefined && (
                                <div className={`flex items-center space-x-1 ${asset.percentChangeFromStart >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {asset.percentChangeFromStart >= 0 ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}
                                    <span className="font-semibold">
                                        {asset.percentChangeFromStart >= 0 ? '+' : ''}{asset.percentChangeFromStart.toFixed(2)}%
                                    </span>
                                </div>
                            )}
                            {asset.percentChangeFromStart === undefined && (
                                <span className="text-gray-400">N/A</span>
                            )}
                        </div>
                        <div className="text-2xl font-bold mb-2 text-white">
                            {/* Format the close price using your currency formatter */}
                            {formatCurrency(asset.close)}
                        </div>
                        <div className="text-gray-400 text-sm mb-4">{asset.name}</div>
                        
                        {/* Additional metrics */}
                        {asset.volume !== null && (
                            <div className="space-y-2 pt-4 border-t border-white/10">
                                <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Volume</span>
                                <span className="text-white">{asset.volume.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </FloatingCard>
                ))}
                
                {/* Loading state */}
                {comparisonLoading && (
                    <>
                        {[1, 2, 3].map((i) => (
                            <FloatingCard key={i} className="animate-pulse">
                                <div className="h-4 bg-white/10 rounded mb-4"></div>
                                <div className="h-6 bg-white/10 rounded mb-2"></div>
                                <div className="h-4 bg-white/10 rounded mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-white/10 rounded"></div>
                                    <div className="h-3 bg-white/10 rounded"></div>
                                    <div className="h-3 bg-white/10 rounded"></div>
                                </div>
                            </FloatingCard>
                        ))}
                    </>
                )}
                
                {/* Error state */}
                {comparisonError && (
                    <div className="col-span-full text-center py-8">
                        <div className="text-red-400 mb-2">Unable to load market data</div>
                        <div className="text-gray-400 text-sm">Please try again later</div>
                    </div>
                )}
                
                {/* Empty state */}
                {!comparisonLoading && !comparisonError && filteredAssets.length === 0 && (
                    <div className="col-span-full text-center py-8">
                        <div className="text-gray-400 mb-2">No {activeTab} data available</div>
                        <div className="text-gray-500 text-sm">Try selecting a different asset type</div>
                    </div>
                )}
            </div>
        </div>
    )
}