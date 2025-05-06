"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useFetchFundGraph } from "@/hooks/useFetchFundPrice";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"
import { addDays } from "date-fns/addDays";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

type FundGraphProps = {
    code: string;
}

const getStartDateFromRange = (range: string) => {
    const today = new Date();
    let startDate = new Date(today);
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
        case "1y":
            startDate.setFullYear(today.getFullYear() - 1);
            break;
        default:
            break;
    }
    return startDate.toISOString().slice(0, 10);
}

export default function FundDetailGraph({ code }: FundGraphProps) {

    
    const [timeRange, setTimeRange] = useState("1y");
    const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);
    // derive ISO dates based on “custom” vs preset
    const startDate =
        timeRange === "custom" && customRange?.from
            ? customRange.from.toISOString().slice(0, 10)
            : getStartDateFromRange(timeRange);

    const endDate =
        timeRange === "custom" && customRange?.to
            ? customRange.to.toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10);
    const { prices, loading, error } = useFetchFundGraph(code, startDate, endDate);

    console.log(prices, timeRange)

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

    const ranges = [
        { key: "1w", label: "7 days" },
        { key: "1m", label: "30 days" },
        { key: "3m", label: "3 months" },
        { key: "1y", label: "1 year" },
    ]

    return(
        <div className="mt-4">
            <div className="flex items-center gap-2 mb-4">
                {ranges.map(({ key, label }) => (
                    <Button
                        key={key}
                        variant={timeRange === key ? "default" : "outline"}
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => {
                            setTimeRange(key)
                            //setCustomRange(undefined)
                        }}
                    >
                        {label}
                    </Button>
                ))}

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={timeRange === "custom" ? "default" : "outline"}
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => setTimeRange("custom")}
                        >
                            <CalendarIcon />
                            {customRange && customRange.from ? (
                                customRange.to ? (
                                    `${customRange.from.toLocaleDateString()} – ${customRange.to.toLocaleDateString()}`
                                    ) : customRange.from.toLocaleDateString()
                                ) : "Custom…"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            initialFocus
                            mode="range"
                            selected={customRange}
                            defaultMonth={customRange?.from}
                            onSelect={setCustomRange}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <ChartContainer config={chartConfig} className="aspect-auto h-[400px] -ms-5 w-full">
                <AreaChart
                    data={prices}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    className="h-[400px]"
                >
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => date.slice(2)} axisLine={false} />
                    <YAxis domain={[(dataMin: number) => dataMin * 0.99, 'dataMax']} axisLine={false} tickFormatter={(price) => price.toFixed(2)} />
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