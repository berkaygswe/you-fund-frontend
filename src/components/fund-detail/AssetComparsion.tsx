"use client";

import { Button } from "@/components/ui/button";
import { useAssetDetailComparsion } from "@/hooks/useAssetDetailComparison";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
} from "@/components/ui/chart"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AssetSearchPanel } from "./AssetSearchPanel";
import { AssetSearchResult } from "@/types/assetSearchResult";
import { CirclePlus, TrendingUp } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

const getStartDateFromRange = (range: string) => {
    const today = new Date();
    const startDate = new Date(today);
    switch (range) {
        case "1w":
            startDate.setDate(today.getDate() - 7);
            break;
        case "1m":
            startDate.setMonth(today.getMonth() - 1);
            break;
        case "3m":
            startDate.setMonth(today.getMonth() - 3);
            break;
        case "6m":
            startDate.setMonth(today.getMonth() - 6);
            break;
        case "1y":
            startDate.setFullYear(today.getFullYear() - 1);
            break;
        default:
            break;
    }
    return startDate.toISOString().slice(0, 10);
}

const chartConfig = {} as ChartConfig;

import { AssetType } from "@/types/asset";

export default function AssetComparison({ code, type = 'etf', standalone = true }: { code: string; type?: AssetType; standalone?: boolean }) {
    const t = useTranslations('Dashboard.MarketOverview');
    const currency = useCurrency();

    const ranges = [
        { key: "1w", label: t('w1') },
        { key: "1m", label: t('m1') },
        { key: "3m", label: t('m3') },
        { key: "6m", label: t('m6') },
        { key: "1y", label: t('y1') },
    ]

    const [selectedAssets, setSelectedAssets] = useState<Array<AssetSearchResult>>([
        { symbol: code, name: '', type: type, icon_url: '', exchange_icon_url: '' },
        { symbol: 'XAU', name: 'GOLD', type: 'commodity', icon_url: '', exchange_icon_url: '' },
        { symbol: 'XAG', name: 'SILVER', type: 'commodity', icon_url: '', exchange_icon_url: '' },
        { symbol: 'XU100', name: 'BIST 100', type: 'index', icon_url: '', exchange_icon_url: '' },
        { symbol: 'IXIC', name: 'NASDAQ', type: 'index', icon_url: '', exchange_icon_url: '' },
        { symbol: 'GSPC', name: 'S&P 500', type: 'index', icon_url: '', exchange_icon_url: '' },
    ]);

    const assets = useMemo(() => selectedAssets
        .filter(asset => asset.symbol !== "")
        .map(asset => ({ type: (asset.type || 'etf') as AssetType, symbol: asset.symbol })), [selectedAssets]);

    const [timeRange, setTimeRange] = useState("1y");

    const startDate = getStartDateFromRange(timeRange);

    const { assetComparisonData, loading } = useAssetDetailComparsion(assets, startDate, currency);

    // Ensure assetComparisonData is always an array, even if empty or null initially
    const chartData = useMemo(() => {
        return Array.isArray(assetComparisonData) ? assetComparisonData : [];
    }, [assetComparisonData]);

    const renderContent = () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    {ranges.map(({ key, label }) => (
                        <Button
                            key={key}
                            variant={timeRange === key ? "default" : "outline"}
                            size="sm"
                            className={`cursor-pointer ${timeRange === key ? 'border-transparent border' : ''}`}
                            onClick={() => {
                                setTimeRange(key)
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="cursor-pointer"><CirclePlus /> {t('addAssets')}</Button>
                    </DialogTrigger>
                    <DialogContent className="md:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{t('addAssets')}</DialogTitle>
                        </DialogHeader>
                        <AssetSearchPanel
                            selectedAssets={selectedAssets}
                            setSelectedAssets={setSelectedAssets}
                            currentAssetSymbol={code}
                        />
                        <DialogFooter>
                            <Button>{t('saveChanges')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div>
                <ChartContainer config={chartConfig} className="-ms-8 max-h-[400px] md:w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            interval={0}
                            tick={({ x, y, payload }) => {
                                const label = payload.value;
                                const isTooLong = label.length > 15;
                                const item = chartData.find(d => d.name === label);
                                const display = isTooLong && item ? item.symbol : label;

                                return (
                                    <text
                                        x={x}
                                        y={y + 10}
                                        textAnchor="middle"
                                        fontSize={12}
                                        fill="#666"
                                    >
                                        {display}
                                    </text>
                                );
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const { name, percentChangeFromStart } = payload[0].payload;
                                    return (
                                        <div className="bg-white p-2 rounded shadow text-sm border">
                                            <div className="font-medium text-black">{name}</div>
                                            <div className={percentChangeFromStart >= 0 ? "text-green-600" : "text-red-600"}>
                                                {percentChangeFromStart >= 0 ? "+" : ""}
                                                {percentChangeFromStart.toFixed(2)}%
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <YAxis axisLine={false} />
                        <Bar dataKey="percentChangeFromStart" fill="var(--color-value)" radius={8} >
                            {chartData.map((entry) => (
                                <Cell
                                    key={entry.symbol || entry.name}
                                    fill={entry.percentChangeFromStart >= 0 ? '#22c55e' : '#ef4444'} // Tailwind green-500 / red-500
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
    )

    if (loading || !currency) {
        if (!standalone) {
            return (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            {ranges.map(({ key }) => (
                                <Skeleton key={key} className="h-8 w-20" />
                            ))}
                        </div>
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <Skeleton className="h-[300px] w-full" />
                </div>
            )
        }
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2 mb-2" />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                {ranges.map(({ key }) => (
                                    <Skeleton key={key} className="h-8 w-20" />
                                ))}
                            </div>
                            <Skeleton className="h-8 w-32" />
                        </div>
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Return the empty state if data is not available after loading
    if (chartData.length === 0) {
        if (!standalone) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                    {t('noDataAvailable')}
                </div>
            )
        }
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('assetComparisonTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                        {t('noDataAvailable')}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!standalone) {
        return renderContent();
    }

    return (
        <div>
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        {t('assetComparisonTitle')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
}
