"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssetDetailComparsion } from "@/hooks/useAssetDetailComparison";
import { useAssetGraphComparison } from "@/hooks/useAssetGraphComparison";

import { useCurrencyStore } from "@/stores/currency-store";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { TrendingDown, TrendingUp, Globe, BarChart3, DollarSign } from "lucide-react"
import { useMemo } from "react";
import { Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const popularAssets = [
    { symbol: 'XAU', name: 'GOLD', type: 'commodity', icon_url : '', exchange_icon_url: '' },
    { symbol: 'XAG', name: 'SILVER', type: 'commodity', icon_url : '', exchange_icon_url: '' },
    { symbol: 'XU100', name: 'BIST 100', type: 'index', icon_url : '', exchange_icon_url: '' },
    { symbol: 'IXIC', name: 'NASDAQ', type: 'index', icon_url : '', exchange_icon_url: '' },
    { symbol: 'GSPC', name: 'S&P 500', type: 'index', icon_url : '', exchange_icon_url: '' },
]

const assetIcons = {
    commodity: <DollarSign className="h-4 w-4" />,
    index: <BarChart3 className="h-4 w-4" />,
    stock: <TrendingUp className="h-4 w-4" />,
    etf: <Globe className="h-4 w-4" />,
    fund: <BarChart3 className="h-4 w-4" />
};

export function SectionCards() {
    const formatCurrency = useFormatCurrency()
    const currency = useCurrencyStore((s) => s.currency)

    const today = new Date();
    const sDate = new Date(today);
    sDate.setDate(today.getDate() - 7);
    const startDate = sDate.toISOString().slice(0, 10);

    const assetCodes = useMemo(() => {
        return popularAssets.map(asset => asset.symbol);
    }, []); 

    const { assetComparisonData: prices, loading: graphLoading, error: graphError } = useAssetGraphComparison(assetCodes, startDate, today.toISOString().slice(0, 10), currency);
    const {assetComparisonData, loading: comparisonLoading, error: comparisonError} = useAssetDetailComparsion(assetCodes, startDate, currency);

    // Show skeleton while loading
    if (comparisonLoading || graphLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {popularAssets.map((asset) => (
                    <Card key={asset.symbol} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="flex items-center justify-between mb-3">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-12 w-16" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                        <CardFooter className="pt-3">
                            <div className="flex justify-between items-center w-full">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    // Handle error state
    if (comparisonError || graphError) {
        return (
            <Card className="p-6 text-center">
                <div className="text-red-500 mb-2">Error loading market data</div>
                <p className="text-sm text-muted-foreground">Please try again later</p>
            </Card>
        );
    }

    // Only render the card if assetComparisonData has data and prices has data
    if (!assetComparisonData || assetComparisonData.length === 0 || !prices || prices.length === 0) {
        return (
            <Card className="p-6 text-center">
                <div className="text-muted-foreground mb-2">No market data available</div>
                <p className="text-sm text-muted-foreground">Please check back later</p>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-5 gap-4">
            {popularAssets.map((asset) => {
                const assetDetail = assetComparisonData?.find(data => data.symbol === asset.symbol);
                const assetPrices = prices?.find(data => data.name === asset.symbol);

                if (!assetDetail || !assetPrices || assetPrices.data.length === 0) {
                    return (
                        <Card key={asset.symbol} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">{asset.name}</CardTitle>
                                    <div className="text-muted-foreground">
                                        {assetIcons[asset.type as keyof typeof assetIcons]}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-3">
                                <div className="text-center text-muted-foreground text-sm">
                                    No data available
                                </div>
                            </CardContent>
                        </Card>
                    );
                }

                const isPositive = assetDetail.percentChangeFromStart >= 0;
                const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
                const chartColor = isPositive ? '#22c55e' : '#ef4444';

                return (
                    <Card key={asset.symbol} className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] group">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="font-medium flex items-center gap-2">
                                    {asset.name}
                                    <span className="text-sm text-muted-foreground font-normal">
                                        {asset.symbol}
                                    </span>
                                </CardTitle>
                                <div className="text-muted-foreground">
                                    {assetIcons[asset.type as keyof typeof assetIcons]}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-xl font-bold whitespace-nowrap">
                                    {formatCurrency(assetDetail.close)}
                                </div>
                                <div className="w-16 h-12">
                                    <ChartContainer config={chartConfig} className="h-full w-full">
                                        <LineChart data={assetPrices.data}>
                                            <XAxis dataKey="date" hide /> 
                                            <YAxis dataKey="value" hide domain={['dataMin', 'dataMax']} /> 
                                            <Line
                                                dataKey="value"
                                                type="linear"
                                                stroke={chartColor}
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ChartContainer>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-3">
                            <div className="flex justify-between items-center w-full">
                                <span className="text-xs text-muted-foreground">7D Change</span>
                                <div className={`flex items-center gap-1 font-semibold ${changeColor}`}>
                                    <span>{assetDetail.percentChangeFromStart >= 0 ? '+' : ''}{assetDetail.percentChangeFromStart.toFixed(2)}%</span>
                                    {isPositive ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3" />
                                    )}
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}