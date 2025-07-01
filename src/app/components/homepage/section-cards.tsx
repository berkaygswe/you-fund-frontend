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
import { useFetchFundGraph } from "@/hooks/useFetchFundPrice";
import { useCurrencyStore } from "@/stores/currency-store";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { Info, TrendingDown, TrendingUp } from "lucide-react"
import { useMemo } from "react";
import { Line, LineChart, XAxis, YAxis } from "recharts";


const chartConfig = {
  price: {
    label: "Price",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig


export function SectionCards({code}: {code: string}) {
    const formatCurrency = useFormatCurrency()
    const currency = useCurrencyStore((s) => s.currency)

    const today = new Date();
    const sDate = new Date(today);
    sDate.setDate(today.getDate() - 7);
    const startDate = sDate.toISOString().slice(0, 10);

    const assetCodes = useMemo(() => [code], [code]);

    const { prices, loading: graphLoading, error: graphError } = useFetchFundGraph(code, startDate, today.toISOString().slice(0, 10), currency);
    const {assetComparisonData, loading: comparisonLoading, error: comparisonError} = useAssetDetailComparsion(assetCodes, startDate, currency);

    // Show skeleton while loading
    if (comparisonLoading || graphLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap justify-between items-center">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-[70px] w-[70px]" />
                        </div>
                        <Skeleton className="h-4 w-full mt-4" />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center gap-1.5 text-sm">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                </CardFooter>
            </Card>
        );
    }

    // Handle error state
    if (comparisonError || graphError) {
        return <Card className="p-4 text-red-500">Error loading data. Please try again.</Card>;
    }

    // Only render the card if assetComparisonData has data and prices has data
    if (!assetComparisonData || assetComparisonData.length === 0 || !prices || prices.length === 0) {
        return <Card className="p-4 text-gray-500">No data available for this asset.</Card>;
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    <div>{assetComparisonData[0].name}</div>
                    <Info />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="text-xl font-semibold">{formatCurrency(prices[prices.length - 1].price)}</div>
                        <ChartContainer config={chartConfig} className="h-[50px] w-[65px] ms-1">
                            <LineChart
                                data={prices}
                            >
                                <XAxis dataKey="date" hide /> 
                                <YAxis dataKey="price" hide domain={['dataMin - 20', 'dataMax + 20']} /> 
                                <Line
                                    dataKey="price"
                                    type="linear"
                                    stroke={`${assetComparisonData[0].percentChangeFromStart >= 0 ? 'var(--color-green-600)' : 'var(--color-red-600)'}`} 
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium text-muted-foreground">
                    Since Last Week
                </div>
                <div className={`${assetComparisonData[0].percentChangeFromStart >= 0 ? 'text-green-600' : 'text-red-600'} font-semibold flex gap-1`}>
                    <span>{assetComparisonData[0].percentChangeFromStart.toFixed(2)}%</span> 
                    {assetComparisonData[0].percentChangeFromStart >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                </div>
            </CardFooter>
        </Card>
    )
}