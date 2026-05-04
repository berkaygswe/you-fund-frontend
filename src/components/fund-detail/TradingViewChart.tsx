"use client";

import React, { useEffect, useRef, useMemo } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries, CandlestickData, HistogramData, Time } from 'lightweight-charts';
import { FundPrices } from '@/types/fundPrices';

interface TradingViewChartProps {
    data: FundPrices[];
    code: string;
    className?: string;
    theme?: 'light' | 'dark';
}

/**
 * Advanced TradingView Lightweight Chart component
 * Features:
 * - Candlestick series for price action
 * - Volume series as a separate pane (histogram)
 * - Responsive resizing
 * - Auto-formatting for different data types
 */
export const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
    data, 
    code, 
    className = "",
    theme = 'light' 
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | any>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | any>(null);

    // Prepare chart data
    const { candlestickData, volumeData, isOnlyClose } = useMemo(() => {
        if (!data || data.length === 0) return { candlestickData: [], volumeData: [], isOnlyClose: false };

        // Check if we only have close prices (O, H, L are 0 or same as C)
        const checkOnlyClose = data.every(d => 
            (d.open === 0 || d.open === d.close) && 
            (d.high === 0 || d.high === d.close) && 
            (d.low === 0 || d.low === d.close)
        );

        const candlesticks: CandlestickData<Time>[] = data.map(d => ({
            time: d.date as Time,
            open: d.open || d.close,
            high: d.high || d.close,
            low: d.low || d.close,
            close: d.close,
        }));

        const volumes: HistogramData<Time>[] = data.map(d => ({
            time: d.date as Time,
            value: d.volume,
            color: d.close >= (d.open || d.close) ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        }));

        return { 
            candlestickData: candlesticks, 
            volumeData: volumes,
            isOnlyClose: checkOnlyClose 
        };
    }, [data]);

    const [legendData, setLegendData] = React.useState<{
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
        isUp: boolean;
    } | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ 
                    width: chartContainerRef.current.clientWidth 
                });
            }
        };

        const isDark = theme === 'dark';
        const textColor = isDark ? '#D1D5DB' : '#374151';
        const borderColor = isDark ? '#374151' : '#E5E7EB';

        // Initialize Chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: textColor,
            },
            grid: {
                vertLines: { color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.5)' },
                horzLines: { color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.5)' },
            },
            rightPriceScale: {
                borderColor: borderColor,
            },
            timeScale: {
                borderColor: borderColor,
                timeVisible: true,
                secondsVisible: false,
            },
            crosshair: {
                mode: 0, // Normal
            },
            handleScroll: true,
            handleScale: true,
            width: chartContainerRef.current.clientWidth,
            height: 400,
        });

        chartRef.current = chart;

        // Add Candlestick Series
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        });
        candlestickSeries.setData(candlestickData);
        candlestickSeriesRef.current = candlestickSeries;

        // Add Volume Series (Histogram)
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '', // overlay
        });
        
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.8, // volume at bottom 20%
                bottom: 0,
            },
        });

        volumeSeries.setData(volumeData);
        volumeSeriesRef.current = volumeSeries;

        // Subscribe to crosshair move for legend
        chart.subscribeCrosshairMove((param) => {
            if (
                param.point === undefined ||
                !param.time ||
                param.point.x < 0 ||
                param.point.x > chartContainerRef.current!.clientWidth ||
                param.point.y < 0 ||
                param.point.y > chartContainerRef.current!.clientHeight
            ) {
                // Set to last data point by default or null
                const last = data[data.length - 1];
                setLegendData({
                    open: last.open || last.close,
                    high: last.high || last.close,
                    low: last.low || last.close,
                    close: last.close,
                    volume: last.volume,
                    isUp: last.close >= (last.open || last.close)
                });
            } else {
                const candle = param.seriesData.get(candlestickSeries) as any;
                const volume = param.seriesData.get(volumeSeries) as any;
                
                if (candle) {
                    setLegendData({
                        open: candle.open,
                        high: candle.high,
                        low: candle.low,
                        close: candle.close,
                        volume: volume?.value || 0,
                        isUp: candle.close >= candle.open
                    });
                }
            }
        });

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [candlestickData, volumeData, theme, data]);

    if (!data || data.length === 0) {
        return (
            <div className={`w-full h-[400px] flex items-center justify-center border border-dashed rounded-lg text-muted-foreground ${className}`}>
                No price data available for the selected range.
            </div>
        );
    }

    return (
        <div className={`relative w-full ${className}`}>
            <div className="absolute top-2 left-4 z-10 pointer-events-none flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold opacity-80">{code}</span>
                    {isOnlyClose && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase font-bold">
                            Close Only
                        </span>
                    )}
                </div>
                {legendData && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono">
                        <div className="flex gap-1">
                            <span className="opacity-50">O</span>
                            <span className={legendData.isUp ? "text-green-600" : "text-red-600"}>{legendData.open.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="opacity-50">H</span>
                            <span className={legendData.isUp ? "text-green-600" : "text-red-600"}>{legendData.high.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="opacity-50">L</span>
                            <span className={legendData.isUp ? "text-green-600" : "text-red-600"}>{legendData.low.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="opacity-50">C</span>
                            <span className={legendData.isUp ? "text-green-600" : "text-red-600"}>{legendData.close.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-1">
                            <span className="opacity-50">V</span>
                            <span className="text-slate-500">{legendData.volume.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
            <div ref={chartContainerRef} className="w-full h-[400px]" />
        </div>
    );
};
