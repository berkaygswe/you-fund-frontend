"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useFetchFundGraph } from "@/hooks/useFetchFundPrice";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { CalendarIcon, GitCompare } from "lucide-react";
import { useAssetGraphComparsion } from "@/hooks/useAssetGraphComparsion";
import { AssetGraphComparsion } from "@/types/assetGraphComparison";
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
import { useCurrencyStore } from "@/stores/currency-store";

// Colors for different assets in comparison chart
const COLORS = [
    "#8884d8", // Purple (main fund)
    "#82ca9d", // Green
    "#ffc658", // Yellow
    "#ff8042", // Orange
    "#0088fe", // Blue
    "#00C49F", // Teal
    "#d88484", // Soft Red
    "#a064d8"  // Lavender Purple
];

// Component for single fund price chart
function SingleFundChart({ config, prices, code }: {config: ChartConfig, prices: Array<object>, code: string}) {

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
            <XAxis dataKey="date" tickFormatter={(date) => {
                    const d = new Date(date);
                    return new Intl.DateTimeFormat(undefined, {
                        day: 'numeric',
                        month: 'short',
                    }).format(d);
                }}
            axisLine={false} />
            <YAxis domain={[(dataMin: number) => dataMin * 0.99, 'dataMax']} axisLine={false} tickFormatter={(price) => price.toFixed(2)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(label) => {
                        const d = new Date(label);
                        return new Intl.DateTimeFormat(undefined, {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        }).format(d);
                    }} />
                } 
            />
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

export interface MergedChartDataPoint {
  date: string;
  // This index signature allows for dynamic properties where the key is a string (asset name)
  // and the value is either a number (the asset's value) or null (if no data for that date/asset).
  // We also include 'string' as a possible type for `this[key]` to cover the 'date' property itself.
  [assetName: string]: number | null | string;
}


function mergeComparisonData(assetComparisonData: AssetGraphComparsion[]) {
    if (!assetComparisonData || assetComparisonData.length === 0) return [];

    // Get all unique dates
    const allDates = new Set<string>();
    assetComparisonData.forEach(asset => {
        asset.data.forEach(item => allDates.add(item.date));
    });

    // Sort dates
    const sortedDates = Array.from(allDates).sort();

    // Create merged data array
    return sortedDates.map(date => {
        const dataPoint: MergedChartDataPoint = { date };
        
        assetComparisonData.forEach(asset => {
        const assetDataPoint = asset.data.find(item => item.date === date);
        dataPoint[asset.name] = assetDataPoint ? assetDataPoint.value : null;
        });
        
        return dataPoint;
    });
}

// Component for multi-asset comparison chart
function ComparisonChart({ config, assetComparisonData }: {config: ChartConfig, assetComparisonData: AssetGraphComparsion[]}) {
    const mergedData = useMemo(() => mergeComparisonData(assetComparisonData), [assetComparisonData]);
    return (
        <ChartContainer config={config} className="aspect-auto h-[400px] -ms-5 w-full">
        <AreaChart
        data={mergedData}
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
        <XAxis dataKey="date" tickFormatter={(date) => {
                const d = new Date(date);
                return new Intl.DateTimeFormat(undefined, {
                    day: 'numeric',
                    month: 'short',
                }).format(d);
            }} axisLine={false} 
        />
        <YAxis 
            domain={['dataMin', 'dataMax']} 
            axisLine={false} 
            tickFormatter={(value) => `${value.toFixed(2)}%`} 
        />
        <ChartTooltip cursor={false} content={    
                <ChartTooltipContent
                    formatter={(value, name) => {
                        if (typeof value === 'number') {
                            const formatted = `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
                            const colorClass =
                                value > 0 ? 'text-green-600' :
                                value < 0 ? 'text-red-600' :
                                'text-gray-600';

                            return (
                                <span className={`font-mono}`}>
                                    {name}: <span className={`${colorClass}`}>{formatted}</span>
                                </span>
                            );
                        }

                        return <span>{name}: {String(value)}</span>;
                    }}
                    
                    labelFormatter={(label) => {
                        const d = new Date(label);
                        return new Intl.DateTimeFormat(undefined, {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        }).format(d);
                    }}
                />
            } 
        />
        <Legend />
        {assetComparisonData.map((asset, index) => (
            <Area
            key={asset.name}
            type="natural"
            dataKey={asset.name}
            name={asset.name}
            stroke={COLORS[index % COLORS.length]}
            fillOpacity={0.4}
            fill={`url(#color-${asset.name})`}
            connectNulls={false}
            />
        ))}
        </AreaChart>
        </ChartContainer>
    );
}

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

type FundGraphProps = {
    code: string;
}

export default function FundDetailGraph({ code }: FundGraphProps) {

    const currency = useCurrencyStore((s) => s.currency)

    const [timeRange, setTimeRange] = useState("1y");
    const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);
    const [selectedAssets, setSelectedAssets] = useState<Array<AssetSearchResult>>([{ symbol: code, name: '', type: '', icon_url: '', exchange_icon_url: '' }]); // Start with minimal info if needed
    const assetCodes = useMemo(() => {
        return selectedAssets.map(asset => asset.symbol);
    }, [selectedAssets]); 

    // derive ISO dates based on “custom” vs preset
    const startDate =
        timeRange === "custom" && customRange?.from
            ? customRange.from.toISOString().slice(0, 10)
            : getStartDateFromRange(timeRange);

    const endDate =
        timeRange === "custom" && customRange?.to
            ? customRange.to.toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10);
    const { prices } = useFetchFundGraph(code, startDate, endDate, currency);
    const { assetComparisonData } = useAssetGraphComparsion(assetCodes, startDate, endDate, currency);

    const isComparisonMode = assetCodes.length > 1 || (assetCodes.length === 1 && assetCodes[0] !== code);

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
        { key: "6m", label: "6 months" },
        { key: "1y", label: "1 year" },
    ]

    const popularAssets = [
        { symbol: 'XAU', name: 'GOLD', type: 'commodity', icon_url : '', exchange_icon_url: '' },
        { symbol: 'XAG', name: 'SILVER', type: 'commodity', icon_url : '', exchange_icon_url: '' },
        { symbol: 'XU100', name: 'BIST 100', type: 'index', icon_url : '', exchange_icon_url: '' },
        { symbol: 'IXIC', name: 'NASDAQ', type: 'index', icon_url : '', exchange_icon_url: '' },
        { symbol: 'GSPC', name: 'S&P 500', type: 'index', icon_url : '', exchange_icon_url: '' },
    ]

    return(
        <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
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
                            mode="range"
                            selected={customRange}
                            defaultMonth={customRange?.from}
                            onSelect={setCustomRange}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {isComparisonMode && assetComparisonData?.length > 1 ? (
                <ComparisonChart config={chartConfig} assetComparisonData={assetComparisonData} />
            ) : (
                <SingleFundChart config={chartConfig} prices={prices} code={code} />
            )}

            <div className="flex flex-wrap items-center gap-2 mb-4 mt-4">
                {popularAssets.map((asset) => (
                    <Button
                        key={asset.symbol}
                        className="cursor-pointer"
                        size="sm"
                        variant={selectedAssets.some(a => a.symbol === asset.symbol) ? "default" : "outline"}
                        onClick={() => {
                            const isSelected = selectedAssets.some(a => a.symbol === asset.symbol);

                            if (!isSelected && selectedAssets.length >= 6) {
                                alert("You can only compare up to 6 assets at a time.");
                                return;
                            }

                            setSelectedAssets((prev) =>
                                isSelected
                                ? prev.filter((a) => a.symbol !== asset.symbol)
                                : [...prev, asset]
                            );
                        }}
                    >
                        {asset.name}
                    </Button>
                ))}

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="cursor-pointer"><GitCompare /> Compare Assets</Button>
                    </DialogTrigger>
                    <DialogContent className="md:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Compare Assets</DialogTitle>
                        </DialogHeader>
                        <AssetSearchPanel selectedAssets={selectedAssets} setSelectedAssets={setSelectedAssets} currentAssetSymbol={code}/>
                        <DialogFooter>
                            <Button>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}