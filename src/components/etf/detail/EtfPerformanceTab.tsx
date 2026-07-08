import React from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { formatPercent } from '@/utils/formatPercent';
import { useTranslations } from 'next-intl';

interface EtfPerformanceTabProps {
    dailyChangePercent?: number | null;
    monthlyChangePercent?: number | null;
    ytdChangePercent?: number | null;
    yearlyChangePercent?: number | null;
}

export function EtfPerformanceTab({
    dailyChangePercent,
    monthlyChangePercent,
    ytdChangePercent,
    yearlyChangePercent
}: EtfPerformanceTabProps) {
    const t = useTranslations('EtfDetail');

    const returnItems = [
        { label: t('dailyReturn'), val: dailyChangePercent },
        { label: t('monthlyReturn'), val: monthlyChangePercent },
        { label: t('ytdReturn'), val: ytdChangePercent },
        { label: t('yearlyReturn'), val: yearlyChangePercent }
    ];

    return (
        <div className="grid gap-8 max-w-4xl mx-auto">
            <GlassCard>
                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50 mb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        {t('historicalReturns')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                    {returnItems.map((item) => {
                        const hasValue = item.val !== null && item.val !== undefined;
                        const isPositive = hasValue && item.val! >= 0;
                        const cardClass = !hasValue
                            ? "bg-slate-50/40 border-slate-200 dark:bg-slate-900/10 dark:border-slate-800 hover:bg-slate-50"
                            : isPositive
                                ? "bg-emerald-50/40 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-500/20 hover:bg-emerald-50"
                                : "bg-rose-50/40 border-rose-100 dark:bg-rose-900/10 dark:border-rose-500/20 hover:bg-rose-50";
                        const textClass = !hasValue
                            ? "text-slate-500 dark:text-slate-400"
                            : isPositive
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400";
                        return (
                            <div key={item.label} className={`flex justify-between items-center p-5 rounded-2xl border transition-colors ${cardClass}`}>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                                <span className={`font-bold text-xl ${textClass}`}>
                                    {hasValue && isPositive ? "+" : ""}
                                    {hasValue ? formatPercent(item.val!) : 'N/A'}
                                </span>
                            </div>
                        );
                    })}
                </CardContent>
            </GlassCard>
        </div>
    );
}
