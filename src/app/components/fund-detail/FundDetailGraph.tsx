"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useFetchFundGraph } from "@/hooks/useFetchFundPrice";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts"
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useAssetGraphComparsion } from "@/hooks/useAssetGraphComparsion";
import { AssetGraphComparsion } from "@/types/assetGraphComparison";

// Colors for different assets in comparison chart
const COLORS = [
  "#8884d8", // Purple (main fund)
  "#82ca9d", // Green
  "#ffc658", // Yellow
  "#ff8042", // Orange
  "#0088fe", // Blue
  "#00C49F", // Teal
];

// Component for single fund price chart
function SingleFundChart({ config, prices, code }: {config: ChartConfig, prices: Array<Object>, code: string}) {
    console.log(prices)
    console.log('e');
    if (!prices || prices.length === 0) return null;
  return (
    <ChartContainer config={config} className="aspect-auto h-[400px] -ms-5 w-full">
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
        <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} axisLine={false} />
        <YAxis domain={[(dataMin: number) => dataMin * 0.99, 'dataMax']} axisLine={false} tickFormatter={(price) => price.toFixed(2)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
            type="natural"
            dataKey="price"
            stroke="#8884d8"
            fillOpacity={0.4}
            fill="url(#colorPrice)"
            name={code}
        />
        </AreaChart>
    </ChartContainer>
  );
}

// Component for multi-asset comparison chart
function ComparisonChart({ config, assetComparisonData }: {config: ChartConfig, assetComparisonData: AssetGraphComparsion[]}) {
  return (
    <ChartContainer config={config} className="aspect-auto h-[400px] -ms-5 w-full">
    <AreaChart
      data={assetComparisonData[0]?.data || []}
      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      className="h-[400px]"
    >
      <defs>
        {assetComparisonData.map((asset, index) => (
          <linearGradient 
            key={`gradient-${asset.name}`} 
            id={`color-${asset.name}`} 
            x1="0" y1="0" x2="0" y2="1"
          >
            <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0}/>
          </linearGradient>
        ))}
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} axisLine={false} />
      <YAxis 
        domain={['dataMin', 'dataMax']} 
        axisLine={false} 
        tickFormatter={(value) => `${value.toFixed(2)}%`} 
      />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
      <Legend />
      {assetComparisonData.map((asset, index) => (
        <Area
          key={asset.name}
          type="natural"
          dataKey="value"
          data={asset.data}
          name={asset.name}
          stroke={COLORS[index % COLORS.length]}
          fillOpacity={0.4}
          fill={`url(#color-${asset.name})`}
        />
      ))}
    </AreaChart>
    </ChartContainer>
  );
}

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
    const [assetCodes, setAssetCodes] = useState<Array<string>>([code]);
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
    const { assetComparisonData } = useAssetGraphComparsion(assetCodes, '2025-01-01', '2025-04-04');

    const isComparisonMode = assetCodes.length > 1 || (assetCodes.length === 1 && assetCodes[0] !== code);
    
    useEffect(() => {
        console.log(assetComparisonData);
    }, [assetComparisonData]);

    const chartConfig = {
        title: {
            label: isComparisonMode ? "Asset Performance Comparison" : "Fund Price History",
        },
        description: {
            label: isComparisonMode 
                ? "Comparing performance of selected assets" 
                : `${code} fund price history`,
        },
        xAxis: {
            label: "Date",
        },
        yAxis: {
            label: isComparisonMode ? "Performance (%)" : "Price",
        },
    };

    const ranges = [
        { key: "1w", label: "7 days" },
        { key: "1m", label: "30 days" },
        { key: "3m", label: "3 months" },
        { key: "1y", label: "1 year" },
    ]

    const testCodes = [
        'BGP',
        'AFT'
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

            {isComparisonMode && assetComparisonData?.length > 1 ? (
                <ComparisonChart config={chartConfig} assetComparisonData={assetComparisonData} />
            ) : (
                <SingleFundChart config={chartConfig} prices={prices} code={code} />
            )}

            <div className="flex items-center gap-2 mb-4">
                {testCodes.map((code) => (
                    <Button
                        key={code}
                        size="sm"
                        variant={assetCodes.includes(code) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                            setAssetCodes((prev) =>
                                prev.includes(code)
                                    ? prev.filter((c) => c !== code) // remove if present
                                    : [...prev, code] // add if not present
                            );
                        }}
                    >
                        {code}
                    </Button>
                ))}
            </div>
        </div>
    );
}