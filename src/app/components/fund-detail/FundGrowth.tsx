"use client"

import { useFundDetailGrowth } from "@/hooks/useFundDetailGrowth";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";

const chartConfig = {
    value: {
        label: "Value",
        color: "#2563eb",
    }
} satisfies ChartConfig

export default function FundGrowth({ code }: { code: string }) {

    const { fundGrowth, loading, error } = useFundDetailGrowth(code);

    const marketCapChart = fundGrowth.marketCap;
    const shareNumberChart = fundGrowth.shareNumber;

    console.log("Fund Growth Data:", fundGrowth);

    return (
        <div>
            {loading ? <div></div> : (
                <Card>
                    <CardHeader>
                        <CardTitle>Fund Growth Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-1">
                            <div className="text-md font-semibold ml-3 mb-2">
                                <p>Fon Toplam Değeri</p>
                                <p className="text-muted-foreground">{marketCapChart.length > 0 ? marketCapChart[marketCapChart.length - 1].value : "N/A"}</p>
                            </div>
                            <ChartContainer config={chartConfig} className="max-h-[300px] md:w-full">
                                <BarChart accessibilityLayer data={marketCapChart}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(date) => {
                                            const d = new Date(date);
                                            return new Intl.DateTimeFormat(undefined, {
                                                month: 'short',
                                            }).format(d);
                                        }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="value" fill="var(--color-value)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        </div>
                        <Separator className="my-2"/>
                        <div className="p-1">
                            <div className="text-md font-semibold ml-3 mb-2">
                                <p>Dolaşımdaki Pay Adedi</p>
                                <p className="text-muted-foreground">{shareNumberChart.length > 0 ? shareNumberChart[shareNumberChart.length - 1].value : "N/A"} adet</p>
                            </div>
                            <ChartContainer config={chartConfig} className="max-h-[300px] md:w-full">
                                <BarChart accessibilityLayer data={shareNumberChart}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(date) => {
                                            const d = new Date(date);
                                            return new Intl.DateTimeFormat(undefined, {
                                                month: 'short',
                                            }).format(d);
                                        }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="value" fill="var(--color-value)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}