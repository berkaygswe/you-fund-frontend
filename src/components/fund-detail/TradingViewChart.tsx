"use client";

import React, { useEffect, useRef, useMemo } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries, CandlestickData, HistogramData, Time, LineSeries } from 'lightweight-charts';
import { FundPrices } from '@/types/fundPrices';
import { RSI, EMA, SMA, MACD, BollingerBands } from '@/indicator-core';

const AVAILABLE_INDICATORS = [
    { id: 'rsi', label: 'RSI (14)', type: 'oscillator' },
    { id: 'macd', label: 'MACD (12,26,9)', type: 'oscillator' },
    { id: 'sma', label: 'SMA (20)', type: 'overlay' },
    { id: 'ema', label: 'EMA (20)', type: 'overlay' },
    { id: 'bb', label: 'Bollinger Bands (20, 2)', type: 'overlay' }
] as const;

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

    const [activeIndicators, setActiveIndicators] = React.useState<Set<string>>(new Set());
    const [showMenu, setShowMenu] = React.useState(false);

    const toggleIndicator = (id: string) => {
        setActiveIndicators(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Prepare chart data
    const { candlestickData, volumeData, indicatorData, isOnlyClose } = useMemo(() => {
        if (!data || data.length === 0) return { candlestickData: [], volumeData: [], indicatorData: null, isOnlyClose: false };

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

        const rsiIndicator = activeIndicators.has('rsi') ? new RSI(14) : null;
        const macdIndicator = activeIndicators.has('macd') ? new MACD(12, 26, 9) : null;
        const smaIndicator = activeIndicators.has('sma') ? new SMA(20) : null;
        const emaIndicator = activeIndicators.has('ema') ? new EMA(20) : null;
        const bbIndicator = activeIndicators.has('bb') ? new BollingerBands(20, 2) : null;

        const rsiData: { time: Time; value: number }[] = [];
        const macdLineData: { time: Time; value: number }[] = [];
        const macdSignalData: { time: Time; value: number }[] = [];
        const macdHistData: { time: Time; value: number; color: string }[] = [];
        const smaData: { time: Time; value: number }[] = [];
        const emaData: { time: Time; value: number }[] = [];
        const bbUpperData: { time: Time; value: number }[] = [];
        const bbMiddleData: { time: Time; value: number }[] = [];
        const bbLowerData: { time: Time; value: number }[] = [];

        for (const candle of candlesticks) {
            const close = candle.close as number;
            
            if (rsiIndicator) {
                const val = rsiIndicator.update(close);
                if (val !== null) rsiData.push({ time: candle.time, value: val });
            }
            if (macdIndicator) {
                const val = macdIndicator.update(close);
                if (val !== null) {
                    macdLineData.push({ time: candle.time, value: val.macd });
                    macdSignalData.push({ time: candle.time, value: val.signal });
                    macdHistData.push({ 
                        time: candle.time, 
                        value: val.histogram,
                        color: val.histogram >= 0 ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'
                    });
                }
            }
            if (smaIndicator) {
                const val = smaIndicator.update(close);
                if (val !== null) smaData.push({ time: candle.time, value: val });
            }
            if (emaIndicator) {
                const val = emaIndicator.update(close);
                if (val !== null) emaData.push({ time: candle.time, value: val });
            }
            if (bbIndicator) {
                const val = bbIndicator.update(close);
                if (val !== null) {
                    bbUpperData.push({ time: candle.time, value: val.upper });
                    bbMiddleData.push({ time: candle.time, value: val.middle });
                    bbLowerData.push({ time: candle.time, value: val.lower });
                }
            }
        }

        return { 
            candlestickData: candlesticks, 
            volumeData: volumes,
            indicatorData: {
                rsi: rsiData,
                macdLine: macdLineData,
                macdSignal: macdSignalData,
                macdHist: macdHistData,
                sma: smaData,
                ema: emaData,
                bbUpper: bbUpperData,
                bbMiddle: bbMiddleData,
                bbLower: bbLowerData
            },
            isOnlyClose: checkOnlyClose 
        };
    }, [data, activeIndicators]);

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
        
        const activeOscillators = Array.from(activeIndicators).filter(id => id === 'rsi' || id === 'macd').length;
        const hasOscillators = activeOscillators > 0;

        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: hasOscillators ? 0.7 : 0.8, // volume above oscillators if shown
                bottom: hasOscillators ? 0.2 : 0,
            },
        });

        volumeSeries.setData(volumeData);
        volumeSeriesRef.current = volumeSeries;

        // Make room for oscillators on the main chart
        chart.priceScale('right').applyOptions({
            scaleMargins: {
                top: 0.1,
                bottom: hasOscillators ? 0.25 : 0.1,
            },
        });

        if (!indicatorData) return;

        // Add RSI Series
        if (activeIndicators.has('rsi') && indicatorData.rsi.length > 0) {
            const rsiSeries = chart.addSeries(LineSeries, { color: '#9333ea', lineWidth: 2, priceScaleId: 'rsi' });
            chart.priceScale('rsi').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
            rsiSeries.setData(indicatorData.rsi);
        }

        // Add MACD Series
        if (activeIndicators.has('macd') && indicatorData.macdLine.length > 0) {
            const histSeries = chart.addSeries(HistogramSeries, { priceScaleId: 'macd' });
            const macdSeries = chart.addSeries(LineSeries, { color: '#2563eb', lineWidth: 2, priceScaleId: 'macd' });
            const signalSeries = chart.addSeries(LineSeries, { color: '#f59e0b', lineWidth: 2, priceScaleId: 'macd' });
            chart.priceScale('macd').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
            histSeries.setData(indicatorData.macdHist);
            macdSeries.setData(indicatorData.macdLine);
            signalSeries.setData(indicatorData.macdSignal);
        }

        // Add SMA Overlay
        if (activeIndicators.has('sma') && indicatorData.sma.length > 0) {
            const smaSeries = chart.addSeries(LineSeries, { color: '#f59e0b', lineWidth: 2, priceScaleId: 'right' });
            smaSeries.setData(indicatorData.sma);
        }

        // Add EMA Overlay
        if (activeIndicators.has('ema') && indicatorData.ema.length > 0) {
            const emaSeries = chart.addSeries(LineSeries, { color: '#06b6d4', lineWidth: 2, priceScaleId: 'right' });
            emaSeries.setData(indicatorData.ema);
        }

        // Add Bollinger Bands Overlay
        if (activeIndicators.has('bb') && indicatorData.bbMiddle.length > 0) {
            const upper = chart.addSeries(LineSeries, { color: 'rgba(59, 130, 246, 0.5)', lineWidth: 1, priceScaleId: 'right' });
            const middle = chart.addSeries(LineSeries, { color: 'rgba(59, 130, 246, 0.8)', lineWidth: 2, priceScaleId: 'right' });
            const lower = chart.addSeries(LineSeries, { color: 'rgba(59, 130, 246, 0.5)', lineWidth: 1, priceScaleId: 'right' });
            upper.setData(indicatorData.bbUpper);
            middle.setData(indicatorData.bbMiddle);
            lower.setData(indicatorData.bbLower);
        }

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
    }, [candlestickData, volumeData, indicatorData, activeIndicators, theme, data]);

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
                    <div className="relative pointer-events-auto">
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className={`text-[10px] px-2 py-1 rounded font-bold transition-colors flex items-center gap-1 border ${showMenu ? 'bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                            Indicators {activeIndicators.size > 0 && `(${activeIndicators.size})`}
                        </button>

                        {showMenu && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
                                <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <span>Technical Indicators</span>
                                    <button onClick={() => setShowMenu(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                                </div>
                                <div className="max-h-64 overflow-y-auto p-1">
                                    {AVAILABLE_INDICATORS.map(ind => (
                                        <label 
                                            key={ind.id} 
                                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer text-xs"
                                        >
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                checked={activeIndicators.has(ind.id)}
                                                onChange={() => toggleIndicator(ind.id)}
                                            />
                                            <span className="font-medium text-slate-700">{ind.label}</span>
                                            <span className="ml-auto text-[9px] text-slate-400">{ind.type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
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
