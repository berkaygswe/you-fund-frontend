// src/components/crypto/detail/CryptoKeyMetrics.tsx
"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Coins, BarChart3, TrendingUp, Layers, Flame, Calendar, Trophy } from 'lucide-react';
import { useFormatCurrency } from '@/utils/formatCurrency';
import { useTranslations } from 'next-intl';

const colorThemes = {
    indigo: "bg-indigo-50/70 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30",
    emerald: "bg-emerald-50/70 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30",
    amber: "bg-amber-50/70 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30",
    violet: "bg-violet-50/70 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-800/30",
    rose: "bg-rose-50/70 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/30",
    slate: "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

type ColorKey = keyof typeof colorThemes;

function MetricCard({
    title,
    value,
    subValue,
    icon: Icon,
    color = 'indigo',
}: {
    title: string;
    value: React.ReactNode;
    subValue?: string | null;
    icon: React.ElementType;
    color?: ColorKey;
}) {
    return (
        <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-[12px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                        {title}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorThemes[color]}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                    {value}
                </div>
                {subValue ? (
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                        {subValue}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}

interface CryptoKeyMetricsProps {
    symbol: string;
    marketCap?: number | null;
    volume24h?: number | null;
    fullyDilutedValuation?: number | null;
    circulatingSupply?: number | null;
    totalSupply?: number | null;
    athPriceUsd?: number | null;
    marketCapRank?: number | null;
    genesisDate?: string | null;
}

export function CryptoKeyMetrics({
    symbol,
    marketCap,
    volume24h,
    fullyDilutedValuation,
    circulatingSupply,
    totalSupply,
    athPriceUsd,
    marketCapRank,
    genesisDate,
}: CryptoKeyMetricsProps) {
    const t = useTranslations('CryptoDetail');
    const formatCurrency = useFormatCurrency();

    const formatTokenAmount = (amount?: number | null) => {
        if (amount == null || isNaN(amount)) return '—';
        if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B ${symbol}`;
        if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M ${symbol}`;
        if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K ${symbol}`;
        return `${amount.toLocaleString()} ${symbol}`;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <MetricCard
                title={t('marketCapShort')}
                value={marketCap != null ? formatCurrency(marketCap, true) : '—'}
                subValue={marketCapRank ? `#${marketCapRank} in Markets` : null}
                icon={Coins}
                color="indigo"
            />

            <MetricCard
                title={t('volume24h')}
                value={volume24h != null ? formatCurrency(volume24h, true) : '—'}
                subValue="Aggregate Traded"
                icon={BarChart3}
                color="emerald"
            />

            <MetricCard
                title={t('fdvShort')}
                value={fullyDilutedValuation != null ? formatCurrency(fullyDilutedValuation, true) : '—'}
                subValue="Theoretical Diluted"
                icon={TrendingUp}
                color="violet"
            />

            <MetricCard
                title={t('circulatingSupply')}
                value={formatTokenAmount(circulatingSupply)}
                subValue={totalSupply ? `Total: ${formatTokenAmount(totalSupply)}` : null}
                icon={Layers}
                color="amber"
            />

            <MetricCard
                title={t('athPrice')}
                value={athPriceUsd != null ? `$${athPriceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}` : '—'}
                subValue="Historical Peak"
                icon={Flame}
                color="rose"
            />

            {genesisDate ? (
                <MetricCard
                    title={t('genesisDate')}
                    value={genesisDate}
                    subValue="Launch Date"
                    icon={Calendar}
                    color="slate"
                />
            ) : (
                <MetricCard
                    title={t('marketRank')}
                    value={marketCapRank != null ? `#${marketCapRank}` : '—'}
                    subValue="Global Standing"
                    icon={Trophy}
                    color="slate"
                />
            )}
        </div>
    );
}
