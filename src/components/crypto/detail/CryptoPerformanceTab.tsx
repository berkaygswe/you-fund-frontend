// src/components/crypto/detail/CryptoPerformanceTab.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Calendar, ArrowUpRight, ArrowDownRight, Trophy, Info, BarChart3 } from 'lucide-react';
import { formatPercent } from '@/utils/formatPercent';
import { useFormatCurrency } from '@/utils/formatCurrency';
import { useTranslations, useLocale } from 'next-intl';

interface CryptoPerformanceTabProps {
    symbol: string;
    currentPrice?: number | null;
    currency?: string;
    athPriceUsd?: number | null;
    athAt?: string | null;
    dailyChangePercent?: number | null;
    monthlyChangePercent?: number | null;
    yearlyChangePercent?: number | null;
    ytdChangePercent?: number | null;
    marketCapRank?: number | null;
    volume24h?: number | null;
}

export function CryptoPerformanceTab({
    symbol,
    currentPrice,
    currency = 'USD',
    athPriceUsd,
    athAt,
    dailyChangePercent,
    monthlyChangePercent,
    yearlyChangePercent,
    ytdChangePercent,
    marketCapRank,
    volume24h,
}: CryptoPerformanceTabProps) {
    const t = useTranslations('CryptoDetail');
    const locale = useLocale();
    const formatCurrency = useFormatCurrency();

    // ATH date formatted
    const formattedAthDate = React.useMemo(() => {
        if (!athAt) return null;
        try {
            const date = new Date(athAt);
            if (isNaN(date.getTime())) return null;
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(date);
        } catch {
            return null;
        }
    }, [athAt, locale]);

    // Drawdown from ATH calculation (when current price is in USD)
    const drawdownAth = React.useMemo(() => {
        if (!athPriceUsd || athPriceUsd <= 0 || !currentPrice || currency !== 'USD') return null;
        const drawdown = ((currentPrice - athPriceUsd) / athPriceUsd) * 100;
        return drawdown;
    }, [currentPrice, athPriceUsd, currency]);

    const returnPeriods = [
        { label: '24 Hours', value: dailyChangePercent },
        { label: '30 Days', value: monthlyChangePercent },
        { label: 'YTD Return', value: ytdChangePercent },
        { label: '1 Year', value: yearlyChangePercent },
    ];

    return (
        <div className="space-y-6">
            {/* ATH & Historical High Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
                    <CardHeader className="pb-3 border-b border-gray-100 dark:border-slate-800">
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Flame className="w-5 h-5 text-rose-500" />
                            {t('athPrice')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-5">
                        <div className="flex items-baseline justify-between flex-wrap gap-2">
                            <span className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                                {athPriceUsd != null
                                    ? `$${athPriceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
                                    : '—'}
                            </span>

                            {drawdownAth != null ? (
                                <div
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-sm font-bold border ${
                                        drawdownAth >= 0
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400'
                                    }`}
                                >
                                    {drawdownAth >= 0 ? (
                                        <ArrowUpRight className="w-4 h-4" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4" />
                                    )}
                                    <span>{drawdownAth.toFixed(2)}% from Peak</span>
                                </div>
                            ) : null}
                        </div>

                        {formattedAthDate ? (
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>
                                    {t('athDate')}: <strong className="font-semibold text-slate-700 dark:text-slate-200">{formattedAthDate}</strong>
                                </span>
                            </div>
                        ) : null}

                        <div className="flex items-start gap-2 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                            <Info className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
                            <span>
                                {t('athNotice')}. ATH is recorded in reference USD currency to ensure immutable historical peak observation regardless of exchange rate fluctuations.
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Market Standing & Volume Card */}
                <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
                    <CardHeader className="pb-3 border-b border-gray-100 dark:border-slate-800">
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Market Rank & Liquidity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                Global Market Cap Rank
                            </span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                {marketCapRank != null ? `#${marketCapRank}` : '—'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {t('volume24h')}
                            </span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                {volume24h != null ? formatCurrency(volume24h) : '—'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                Active Base Currency
                            </span>
                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                {currency}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Historical Returns Grid */}
            <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
                <CardHeader className="pb-3 border-b border-gray-100 dark:border-slate-800">
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                        Multi-Horizon Returns
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {returnPeriods.map((period) => {
                            const hasVal = period.value != null && !isNaN(period.value);
                            const isPositive = hasVal && period.value! >= 0;

                            return (
                                <div
                                    key={period.label}
                                    className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 text-center"
                                >
                                    <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider block mb-2">
                                        {period.label}
                                    </span>
                                    <div
                                        className={`text-xl font-bold flex items-center justify-center gap-1 ${
                                            hasVal
                                                ? isPositive
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : 'text-rose-600 dark:text-rose-400'
                                                : 'text-slate-400'
                                        }`}
                                    >
                                        {hasVal ? (
                                            <>
                                                {isPositive ? (
                                                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                                ) : (
                                                    <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                                                )}
                                                {isPositive ? '+' : ''}
                                                {formatPercent(period.value!)}
                                            </>
                                        ) : (
                                            '—'
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
