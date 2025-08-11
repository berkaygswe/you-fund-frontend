"use client";

import { useFundTypePerformance } from "@/hooks/useFundTypePerformance";
import { useCurrencyStore } from "@/stores/currency-store";
import { BarChart3 } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  avgReturn: {
    label: "Getiri",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function FundTypePerformance() {
    const currency = useCurrencyStore((s) => s.currency)
    const { fundTypePerformance, loading, error } = useFundTypePerformance(currency);
    
    if (loading) {
        return (
            <Card>
                <CardHeader className="items-center">
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    TEFAS Fund Type Performance
                </CardTitle>
                <CardDescription>
                    Showing TEFAS funds with average returns in one year
                </CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                <div className="mx-auto aspect-square w-full max-h-[200px] md:max-h-[300px] flex items-center justify-center">
                    <Skeleton className="h-4/5 w-4/5 rounded-full" />
                </div>
                </CardContent>
            </Card>
        );
    }
    
    if (error) {
        return (
            <Card>
                <CardHeader className="items-center">
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    TEFAS Fund Type Performance
                </CardTitle>
                <CardDescription>
                    Showing TEFAS funds with average returns in one year
                </CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                    <div>Error: {error.message}</div>
                </CardContent>
            </Card>
        );
    }

    const sortedData = [...fundTypePerformance].sort((a, b) =>
        a.umbrellaType.localeCompare(b.umbrellaType)
    );
    
    return (
        <Card>
        <CardHeader className="items-center">
            <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                TEFAS Fund Type Performance
            </CardTitle>
            <CardDescription>
                Showing TEFAS funds with average returns in one year
            </CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full max-h-[200px] md:max-h-[300px]"
            >
            <RadarChart data={sortedData}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <PolarAngleAxis
                    dataKey="umbrellaType"
                    tick={(props) => {
                        const { x, y, payload, cx, cy } = props;

                        // Calculate vector from center to label position
                        const dx = x - cx;
                        const dy = y - cy;

                        // Shift amount (adjust this number to push labels farther)
                        const shift = 15;

                        // New label position, shifted outward
                        const newX = x + (dx * shift) / Math.sqrt(dx * dx + dy * dy);
                        const newY = y + (dy * shift) / Math.sqrt(dx * dx + dy * dy);

                        return (
                        <text
                            x={newX}
                            y={newY}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={12}
                        >
                            {payload.value.length > 15
                            ? payload.value.slice(0, 15) + "..."
                            : payload.value}
                        </text>
                        );
                    }}
                />

                <PolarGrid />
                <Radar
                dataKey="avgReturn"
                fill="var(--color-avgReturn)"
                fillOpacity={0.6}
                dot={{
                    r: 4,
                    fillOpacity: 1,
                }}
                />
            </RadarChart>
            </ChartContainer>
        </CardContent>
        {/* 
        <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
            January - June 2024
            </div>
        </CardFooter>
        */}
        </Card>
    )
}