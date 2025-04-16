"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useFetchFundGraph } from "@/hooks/useFetchFundPrice";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"

export default function FundDetailGraph() {
    const { prices, loading, error } = useFetchFundGraph('AAK', '2023-10-10', '2024-10-10');

    console.log(prices);

    const chartConfig = {
        title: {
            label: "Fund Price History",
        },
        description: {
            label: "BGP fund price between 2021 and 2024",
        },
        xAxis: {
            label: "Date",
        },
        yAxis: {
            label: "Price",
        },
    };

    return(
        <div>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <AreaChart
                    data={prices}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => date.slice(2)} />
                    <YAxis domain={['dataMin', 'dataMax']} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Area
                        type="natural"
                        dataKey="price"
                        stroke="#8884d8"
                        fillOpacity={0.4}
                        fill="url(#colorPrice)"
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}