// src/components/crypto/detail/CryptoPriceCard.tsx
"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, BarChart2, Coins } from 'lucide-react';
import { useFormatCurrency } from '@/utils/formatCurrency';
import { formatPercent } from '@/utils/formatPercent';
import { useTranslations } from 'next-intl';

interface CryptoPriceCardProps {
    price?: number | null;
    dailyChangePercent?: number | null;
    currency?: string;
    volume24h?: number | null;
    marketCap?: number | null;
    fullyDilutedValuation?: number | null;
}

export function CryptoPriceCard({
    price,
    dailyChangePercent,
    currency = 'USD',
    volume24h,
    marketCap,
    fullyDilutedValuation,
}: CryptoPriceCardProps) {
    const t = useTranslations('CryptoDetail');
    const formatCurrency = useFormatCurrency();

    const hasPrice = price != null && !isNaN(price);
    const hasChange = dailyChangePercent != null && !isNaN(dailyChangePercent);
    const isUp = hasChange && dailyChangePercent! >= 0;

    return (
        <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md mb-8 overflow-hidden relative">
            {/* Subtle aesthetic gradient glow behind card */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/10 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

            <CardContent className="p-6 md:p-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Primary Live Price & Change */}
                    <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="text-[12px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            {t('currentPrice')} ({currency})
                        </div>

                        <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
                            {hasPrice ? formatCurrency(price!) : '—'}
                        </div>

                        {hasChange ? (
                            <div
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-base font-bold border transition-colors ${
                                    isUp
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40"
                                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40"
                                }`}
                            >
                                {isUp ? (
                                    <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4 stroke-[2.5]" />
                                )}
                                <span>
                                    {isUp ? "+" : ""}
                                    {formatPercent(dailyChangePercent!)}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 ml-1 text-xs font-semibold uppercase">
                                    {t('today')}
                                </span>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                <span>—</span>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block md:col-span-1 h-20 w-px bg-slate-200 dark:bg-slate-800 mx-auto" />

                    {/* Secondary Metrics: 24h Volume, Market Cap, FDV */}
                    <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                <BarChart2 className="w-3 h-3 text-indigo-500" />
                                {t('volume24h')}
                            </div>
                            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                                {volume24h != null ? formatCurrency(volume24h, true) : '—'}
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                <Coins className="w-3 h-3 text-amber-500" />
                                {t('marketCapShort')}
                            </div>
                            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                                {marketCap != null ? formatCurrency(marketCap, true) : '—'}
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1 bg-gray-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                <Coins className="w-3 h-3 text-blue-500" />
                                {t('fdvShort')}
                            </div>
                            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                                {fullyDilutedValuation != null ? formatCurrency(fullyDilutedValuation, true) : '—'}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
