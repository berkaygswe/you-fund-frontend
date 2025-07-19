import { useAssetDetailComparsion } from "@/hooks/useAssetDetailComparison";
import { useCurrencyStore } from "@/stores/currency-store";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { useMemo, useState } from "react";
import FloatingCard from "./FloatingCard";

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
    console.log('assetComparisonData', assetComparisonData);

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
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Compare Everything</h2>
                <p className="text-gray-300">All major asset classes in one powerful platform</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {['stock', 'etf', 'crypto', 'fund'].map((type) => (
                <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    activeTab === type 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
                ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {!comparisonLoading && !comparisonError && filteredAssets.map((asset) => (
                    <FloatingCard key={asset.symbol}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-semibold">{asset.symbol}</span>
                            {/* Display percentage change and color it based on value */}
                            {asset.percentChangeFromStart !== undefined && (
                                <span className={asset.percentChangeFromStart >= 0 ? 'text-green-400' : 'text-red-400'}>
                                    {asset.percentChangeFromStart.toFixed(2)}%
                                </span>
                            )}
                            {asset.percentChangeFromStart === undefined && (
                                <span className="text-gray-400">N/A</span>
                            )}
                        </div>
                        <div className="text-2xl font-bold mb-2">
                            {/* Format the close price using your currency formatter */}
                            {formatCurrency(asset.close)}
                        </div>
                        <div className="text-gray-400 text-sm">{asset.name}</div>
                    </FloatingCard>
                ))}
            </div>
        </div>
    )
}