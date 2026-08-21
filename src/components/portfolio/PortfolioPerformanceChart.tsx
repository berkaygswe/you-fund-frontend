"use client";

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  RefreshCw, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Layers,
  HelpCircle,
  Info
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePortfolioPerformance } from '@/hooks/usePortfolios';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  PortfolioPerformanceTimeframe, 
  PerformanceEvent, 
  PerformanceDataPoint 
} from '@/types/portfolio';
import { Currency } from '@/types/currency';
import { cn } from '@/lib/utils';
import { formatPercent } from '@/utils/formatPercent';

interface PortfolioPerformanceChartProps {
  portfolioId: number;
  currency?: Currency | null;
  className?: string;
}

const TIMEFRAMES: Array<{ key: PortfolioPerformanceTimeframe; labelKey: string }> = [
  { key: '1W', labelKey: '1W' },
  { key: '1M', labelKey: '1M' },
  { key: '3M', labelKey: '3M' },
  { key: '6M', labelKey: '6M' },
  { key: '1Y', labelKey: '1Y' },
  { key: 'YTD', labelKey: 'YTD' },
  { key: 'ALL', labelKey: 'ALL' },
];

function formatValueWithCurrency(
  value: number | null | undefined, 
  currency: string = 'TRY', 
  fractionDigits: number = 2
): string {
  if (value == null || isNaN(value)) return '—';
  const symbol = currency === 'USD' ? '$' : currency === 'TRY' ? '₺' : currency;
  const numStr = value.toLocaleString(undefined, { 
    minimumFractionDigits: fractionDigits, 
    maximumFractionDigits: fractionDigits 
  });
  if (currency === 'USD' || symbol === '$') {
    return `${symbol}${numStr}`;
  }
  return `${numStr} ${symbol}`;
}

interface TimelinePoint {
  date: string;
  totalValue: number;
  cashValue: number;
  positionsValue: number;
  pnlAmount: number;
  pnlPercent: number | null;
  events: PerformanceEvent[];
  hasBuy: boolean;
  hasSell: boolean;
}

export function PortfolioPerformanceChart({ 
  portfolioId, 
  currency: propCurrency, 
  className 
}: PortfolioPerformanceChartProps) {
  const t = useTranslations('Portfolio.Performance');
  const tTimeframes = useTranslations('Portfolio.Performance.timeframes');
  
  const globalCurrency = useCurrency();
  const [timeframe, setTimeframe] = useState<PortfolioPerformanceTimeframe>('1M');
  const [activeEventIndex, setActiveEventIndex] = useState<number | null>(null);

  const currentCurrency: Currency = propCurrency || globalCurrency || 'TRY';

  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isFetching 
  } = usePortfolioPerformance(portfolioId, timeframe, currentCurrency);

  // Directly map authoritative EOD dataPoints and attach event markers from API
  const { chartData, yDomain } = useMemo(() => {
    if (!data || !data.dataPoints || data.dataPoints.length === 0) {
      return { chartData: [] as TimelinePoint[], yDomain: [0, 100] };
    }

    const events = data.events || [];
    const evMap = new Map<string, PerformanceEvent[]>();
    for (const ev of events) {
      const existing = evMap.get(ev.chartDate);
      if (existing) {
        existing.push(ev);
      } else {
        evMap.set(ev.chartDate, [ev]);
      }
    }

    let minVal = Number.POSITIVE_INFINITY;
    let maxVal = Number.NEGATIVE_INFINITY;

    const chartData: TimelinePoint[] = data.dataPoints.map((dp) => {
      const evs = evMap.get(dp.date) || [];
      const hasBuy = evs.some(e => e.type === 'BUY');
      const hasSell = evs.some(e => e.type === 'SELL');

      if (dp.totalValue < minVal) minVal = dp.totalValue;
      if (dp.totalValue > maxVal) maxVal = dp.totalValue;

      return {
        date: dp.date,
        totalValue: dp.totalValue,
        cashValue: dp.cashValue,
        positionsValue: dp.positionsValue,
        pnlAmount: dp.pnlAmount,
        pnlPercent: dp.pnlPercent,
        events: evs,
        hasBuy,
        hasSell,
      };
    });

    if (!Number.isFinite(minVal)) minVal = 0;
    if (!Number.isFinite(maxVal)) maxVal = 100;
    const padding = (maxVal - minVal) * 0.08 || 10;
    const yMin = Math.max(0, Math.floor(minVal - padding));
    const yMax = Math.ceil(maxVal + padding);

    return { chartData, yDomain: [yMin, yMax] };
  }, [data]);

  // Determine period return direction and colors
  const periodSummary = data?.periodSummary;
  const isPeriodPositive = (periodSummary?.changeAmount ?? 0) >= 0;
  const strokeColor = isPeriodPositive ? '#10b981' : '#f43f5e';
  const gradientId = `perf-gradient-${portfolioId}-${timeframe}-${currentCurrency}`;

  // Error inspection
  const errorObj = error as { status?: number; data?: { code?: string; error?: string; message?: string } } | null;
  const isTimeoutError = errorObj?.status === 503 && (
    errorObj?.data?.code === 'PERFORMANCE_CALCULATION_TIMEOUT' ||
    errorObj?.data?.error?.includes('TIMEOUT') ||
    errorObj?.data?.message?.includes('timeout')
  );
  const isUnavailableError = errorObj?.status === 503 && (
    errorObj?.data?.code === 'PERFORMANCE_DATA_UNAVAILABLE' ||
    errorObj?.data?.error?.includes('UNAVAILABLE') ||
    errorObj?.data?.message?.includes('unavailable')
  );

  return (
    <Card className={cn(
      "bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md rounded-3xl overflow-hidden transition-all",
      className
    )}>
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-slate-100">
                {t('title')}
              </CardTitle>
              <Badge 
                variant="outline" 
                className="bg-primary/5 text-primary border-primary/20 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5"
              >
                <Clock className="w-3 h-3 mr-1 inline" />
                {t('eodBadge')}
              </Badge>
              {data?.granularity ? (
                <Badge 
                  variant="secondary" 
                  className="text-[10px] font-mono px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300"
                >
                  <Layers className="w-3 h-3 mr-1 inline opacity-70" />
                  {data.granularity === 'DAILY' ? t('dailyGranularity') : t('weeklyGranularity')}
                </Badge>
              ) : null}
            </div>
            <CardDescription className="text-xs text-gray-600 dark:text-gray-400">
              {data?.valuedThrough ? (
                <span>
                  {t('valuedThrough', { 
                    date: format(parseISO(data.valuedThrough), 'MMM dd, yyyy') 
                  })}
                </span>
              ) : (
                t('subtitle')
              )}
            </CardDescription>
          </div>

          {/* Controls: Timeframe Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Timeframe Selector */}
            <div className="inline-flex bg-gray-100 dark:bg-slate-800/80 p-1 rounded-xl border border-gray-200/60 dark:border-slate-700/60">
              {TIMEFRAMES.map(({ key, labelKey }) => (
                <button
                  key={key}
                  onClick={() => setTimeframe(key)}
                  disabled={isLoading && isFetching}
                  className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer",
                    timeframe === key 
                      ? "bg-white dark:bg-slate-900 text-primary shadow-sm ring-1 ring-black/5 dark:ring-white/10" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50"
                  )}
                >
                  {tTimeframes(labelKey as Parameters<typeof tTimeframes>[0])}
                </button>
              ))}
            </div>

            {isFetching && !isLoading ? (
              <RefreshCw className="w-4 h-4 text-primary animate-spin" />
            ) : null}
          </div>
        </div>

        {/* Headline Summary Section - uses periodSummary strictly */}
        {!isLoading && !isError && data && periodSummary ? (
          <div className="mt-4 pt-4 border-t border-gray-100/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Period Return Headline */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t('periodReturn')}
              </span>
              <div className={cn(
                "text-lg font-black flex items-center gap-1.5",
                isPeriodPositive ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
              )}>
                {isPeriodPositive ? (
                  <TrendingUp className="w-4 h-4 shrink-0" />
                ) : (
                  <TrendingDown className="w-4 h-4 shrink-0" />
                )}
                <span>
                  {isPeriodPositive ? '+' : ''}
                  {formatValueWithCurrency(periodSummary.changeAmount, data.displayCurrency)}
                </span>
                {periodSummary.changePercent != null ? (
                  <span className="text-xs font-bold opacity-85">
                    ({formatPercent(periodSummary.changePercent)})
                  </span>
                ) : null}
              </div>
            </div>

            {/* Start Value */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t('startValue')}
              </span>
              <div className="text-sm font-bold text-gray-900 dark:text-slate-100">
                {formatValueWithCurrency(periodSummary.startValue, data.displayCurrency)}
              </div>
            </div>

            {/* End Value */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t('endValue')}
              </span>
              <div className="text-sm font-bold text-gray-900 dark:text-slate-100">
                {formatValueWithCurrency(periodSummary.endValue, data.displayCurrency)}
              </div>
            </div>

            {/* Capital Baseline */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t('baseline')}
              </span>
              <div className="text-sm font-bold text-gray-900 dark:text-slate-100">
                {formatValueWithCurrency(data.capitalBaseline, data.displayCurrency)}
              </div>
            </div>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="space-y-4 py-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-6 w-24 rounded-lg" />
            </div>
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>
        ) : isError ? (
          /* Error State - Never show fake zero points */
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">
              {isTimeoutError 
                ? t('timeoutError') 
                : isUnavailableError 
                  ? t('unavailableError') 
                  : t('genericError')}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mb-5">
              {isTimeoutError 
                ? t('timeoutError')
                : isUnavailableError 
                  ? t('unavailableError') 
                  : errorObj?.data?.message || t('genericError')}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="gap-2 cursor-pointer border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t('retry')}
            </Button>
          </div>
        ) : chartData.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl bg-gray-50/50 dark:bg-slate-900/40">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">
              {t('noData')}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">
              {t('noDataSubtitle')}
            </p>
          </div>
        ) : (
          /* Chart Render */
          <div className="space-y-6">
            <div className="w-full h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={chartData} 
                  margin={{ top: 16, right: 12, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={strokeColor} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke="rgba(156, 163, 175, 0.2)" 
                  />

                  <XAxis 
                    dataKey="date" 
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(156, 163, 175, 0.2)' }}
                    tickFormatter={(val: string) => {
                      try {
                        const parsed = parseISO(val);
                        if (timeframe === '1W' || timeframe === '1M') {
                          return format(parsed, 'MMM dd');
                        }
                        if (timeframe === 'ALL' || timeframe === '1Y') {
                          return format(parsed, 'MMM yyyy');
                        }
                        return format(parsed, 'MMM dd');
                      } catch {
                        return val;
                      }
                    }}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    minTickGap={30}
                  />

                  <YAxis 
                    domain={yDomain}
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val: number) => {
                      return formatValueWithCurrency(val, data?.displayCurrency, 0);
                    }}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                  />

                  <Tooltip 
                    content={<CustomTooltip displayCurrency={data?.displayCurrency || currentCurrency} t={t} />}
                  />

                  {data?.capitalBaseline ? (
                    <ReferenceLine 
                      y={data.capitalBaseline} 
                      stroke="#94a3b8" 
                      strokeDasharray="4 4" 
                      strokeOpacity={0.6}
                    />
                  ) : null}

                  <Area
                    type="monotone"
                    dataKey="totalValue"
                    stroke={strokeColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#${gradientId})`}
                    activeDot={{
                      r: 6,
                      fill: strokeColor,
                      stroke: '#ffffff',
                      strokeWidth: 2,
                    }}
                    dot={(dotProps: { cx?: number; cy?: number; payload?: TimelinePoint; index?: number }) => {
                      const { cx, cy, payload } = dotProps;
                      if (!payload || !payload.events || payload.events.length === 0) {
                        return <React.Fragment key={`empty-dot-${dotProps.index}`} />;
                      }

                      const hasBuy = payload.hasBuy;
                      const hasSell = payload.hasSell;
                      const isBuyOnly = hasBuy && !hasSell;
                      const isSellOnly = hasSell && !hasBuy;

                      const pinFill = isBuyOnly ? '#10b981' : isSellOnly ? '#ef4444' : '#8b5cf6';

                      return (
                        <g key={`event-dot-${dotProps.index}`} transform={`translate(${cx},${cy})`}>
                          <circle
                            r="8"
                            fill={pinFill}
                            stroke="#ffffff"
                            strokeWidth="2"
                            className="cursor-pointer drop-shadow-md hover:scale-125 transition-transform"
                          />
                          {isBuyOnly ? (
                            <path
                              d="M-3 1.5 L0 -2 L3 1.5 Z"
                              fill="#ffffff"
                            />
                          ) : isSellOnly ? (
                            <path
                              d="M-3 -1.5 L0 2 L3 -1.5 Z"
                              fill="#ffffff"
                            />
                          ) : (
                            <circle r="2" fill="#ffffff" />
                          )}
                        </g>
                      );
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Events List Breakdown if events exist in the period */}
            {data?.events && data.events.length > 0 ? (
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      {t('events')} ({data.events.length})
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                      {timeframe}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.events.map((ev, idx) => (
                    <div
                      key={ev.transactionId || idx}
                      onClick={() => setActiveEventIndex(activeEventIndex === idx ? null : idx)}
                      className={cn(
                        "p-3 rounded-2xl border transition-all text-xs cursor-pointer flex items-center justify-between gap-3",
                        activeEventIndex === idx 
                          ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20" 
                          : "bg-gray-50/70 dark:bg-slate-800/40 border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs",
                          ev.type === 'BUY' 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        )}>
                          {ev.type === 'BUY' ? (
                            <ArrowUpCircle className="w-4 h-4" />
                          ) : (
                            <ArrowDownCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold truncate text-gray-900 dark:text-slate-100">
                              {ev.symbol}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-[9px] px-1 py-0 font-bold",
                                ev.type === 'BUY' 
                                  ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                                  : "text-rose-600 dark:text-rose-400 border-rose-500/20"
                              )}
                            >
                              {ev.type === 'BUY' ? t('buy') : t('sell')}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {format(parseISO(ev.occurredAt), 'MMM dd, HH:mm')} • {ev.quantity} units @ {formatValueWithCurrency(ev.pricePerUnit, ev.tradeCurrency)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-bold text-gray-900 dark:text-slate-100">
                          {formatValueWithCurrency(ev.grossAmountDisplay, ev.displayCurrency)}
                        </div>
                        {ev.feeDisplay > 0 ? (
                          <div className="text-[10px] text-gray-500 dark:text-gray-400">
                            {t('fee')}: {formatValueWithCurrency(ev.feeDisplay, ev.displayCurrency)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TimelinePoint; value?: number; name?: string }>;
  label?: string;
  displayCurrency: string;
  t: ReturnType<typeof useTranslations>;
}

function CustomTooltip({ active, payload, label, displayCurrency, t }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const dataPoint: TimelinePoint = payload[0].payload;
  if (!dataPoint) return null;

  const formattedDate = (() => {
    try {
      return format(parseISO(dataPoint.date), 'MMMM dd, yyyy');
    } catch {
      return dataPoint.date;
    }
  })();

  const isPnlPositive = (dataPoint.pnlAmount ?? 0) >= 0;

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-gray-200 dark:border-slate-700 shadow-xl rounded-2xl p-3.5 min-w-[240px] max-w-sm text-xs space-y-3 z-50 animate-in fade-in-50 duration-150">
      {/* Date Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
        <span className="font-bold text-gray-900 dark:text-slate-100">{formattedDate}</span>
        <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-gray-200 dark:border-slate-700 text-gray-500">
          EOD
        </Badge>
      </div>

      {/* Primary Metrics */}
      <div className="space-y-1.5 font-medium">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">{t('totalValue')}:</span>
          <span className="font-bold text-sm text-gray-900 dark:text-slate-100">
            {formatValueWithCurrency(dataPoint.totalValue, displayCurrency)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-500 dark:text-gray-400">{t('positionsValue')}:</span>
          <span className="font-semibold text-gray-700 dark:text-slate-300">
            {formatValueWithCurrency(dataPoint.positionsValue, displayCurrency)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-500 dark:text-gray-400">{t('cashValue')}:</span>
          <span className="font-semibold text-gray-700 dark:text-slate-300">
            {formatValueWithCurrency(dataPoint.cashValue, displayCurrency)}
          </span>
        </div>

        {dataPoint.pnlAmount != null ? (
          <div className="flex items-center justify-between pt-1 border-t border-gray-100/60 dark:border-slate-800 text-[11px]">
            <span className="text-gray-500 dark:text-gray-400">{t('pnl')}:</span>
            <span className={cn(
              "font-bold",
              isPnlPositive ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
            )}>
              {isPnlPositive ? '+' : ''}{formatValueWithCurrency(dataPoint.pnlAmount, displayCurrency)}
              {dataPoint.pnlPercent != null ? ` (${formatPercent(dataPoint.pnlPercent)})` : ''}
            </span>
          </div>
        ) : null}
      </div>

      {/* Events on this Day */}
      {dataPoint.events && dataPoint.events.length > 0 ? (
        <div className="pt-2 border-t border-gray-100 dark:border-slate-800 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {t('events')} ({dataPoint.events.length})
          </div>
          {dataPoint.events.map((ev, idx) => (
            <div 
              key={ev.transactionId || idx}
              className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 space-y-1 text-[11px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-900 dark:text-slate-100">{ev.symbol}</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[9px] px-1 py-0 font-bold",
                      ev.type === 'BUY' 
                        ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5" 
                        : "text-rose-600 dark:text-rose-400 border-rose-500/20 bg-rose-500/5"
                    )}
                  >
                    {ev.type === 'BUY' ? t('buy') : t('sell')}
                  </Badge>
                </div>
                <span className="font-bold text-gray-900 dark:text-slate-100">
                  {formatValueWithCurrency(ev.grossAmountDisplay, ev.displayCurrency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                <span>{t('quantity')}: {ev.quantity}</span>
                <span>{t('tradePrice')}: {formatValueWithCurrency(ev.pricePerUnit, ev.tradeCurrency)}</span>
              </div>

              <div className="flex items-center justify-between text-[9px] text-gray-400 pt-0.5 border-t border-gray-200/40 dark:border-slate-700/40">
                <span>{t('executedAt')}: {format(parseISO(ev.occurredAt), 'HH:mm:ss')}</span>
                {ev.feeDisplay > 0 ? (
                  <span>{t('fee')}: {formatValueWithCurrency(ev.feeDisplay, ev.displayCurrency)}</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
