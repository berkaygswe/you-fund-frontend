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
import { CirclePlus } from "lucide-react";

const ranges = [
    { key: "1w", label: "7 days" },
    { key: "1m", label: "30 days" },
    { key: "3m", label: "3 months" },
    { key: "6m", label: "6 months" },
    { key: "1y", label: "1 year" },
]

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

export default function AssetComparison({code}: {code: string}) {

    const [selectedAssets, setSelectedAssets] = useState<Array<AssetSearchResult>>([
        { symbol: code, name: '', type: '', icon_url: '', exchange_icon_url: '' },
        { symbol: 'XAU', name: 'GOLD', type: 'commodity', icon_url: '', exchange_icon_url: '' },
        { symbol: 'XAG', name: 'SILVER', type: 'commodity', icon_url: '', exchange_icon_url: '' },
        { symbol: 'XU100', name: 'BIST 100', type: 'index', icon_url: '', exchange_icon_url: '' },
        { symbol: 'IXIC', name: 'NASDAQ', type: 'index', icon_url: '', exchange_icon_url: '' },
        { symbol: 'GSPC', name: 'S&P 500', type: 'index', icon_url: '', exchange_icon_url: '' },
    ]);

    const assetCodes = useMemo(() => selectedAssets.map(asset => asset.symbol), [selectedAssets]);

    const [timeRange, setTimeRange] = useState("1y");

    const startDate = getStartDateFromRange(timeRange);

    const {assetComparisonData, loading} = useAssetDetailComparsion(assetCodes, startDate);

    return (
        <div>
            {loading ? <div></div> : (
                <Card>
                    <CardHeader>
                        <CardTitle>Asset Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    {ranges.map(({ key, label }) => (
                                        <Button
                                            key={key}
                                            variant={timeRange === key ? "default" : "outline"}
                                            size="sm"
                                            className="cursor-pointer"
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
                                        <Button variant="outline" size="sm" className="cursor-pointer"><CirclePlus /> Add Assets</Button>
                                    </DialogTrigger>
                                    <DialogContent className="md:max-w-[600px]">
                                        <DialogHeader>
                                            <DialogTitle>Add Assets</DialogTitle>
                                        </DialogHeader>
                                        <AssetSearchPanel
                                            selectedAssets={selectedAssets}
                                            setSelectedAssets={setSelectedAssets}
                                            currentAssetSymbol={code}
                                        />
                                        <DialogFooter>
                                            <Button>Save changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div>
                                <ChartContainer config={chartConfig} className="-ms-8 max-h-[400px] md:w-full">
                                    <BarChart accessibilityLayer data={assetComparisonData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            interval={0}
                                            // Custom tick rendering to handle long labels
                                            tick={({ x, y, payload }) => {
                                                const label = payload.value;
                                                const isTooLong = label.length > 15;
                                                const item = assetComparisonData.find(d => d.name === label);
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
                                                            <div className="font-medium">{name}</div>
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
                                            {assetComparisonData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.percentChangeFromStart >= 0 ? '#22c55e' : '#ef4444'} // Tailwind green-500 / red-500
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}