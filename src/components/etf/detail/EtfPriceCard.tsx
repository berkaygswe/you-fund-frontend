import React from 'react';
import { CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useFormatCurrency } from '@/utils/formatCurrency';
import { formatPercent } from '@/utils/formatPercent';
import { useTranslations } from 'next-intl';

interface EtfPriceCardProps {
    price: number;
    dailyChangePercent?: number | null;
    currency?: string;
    aum?: number;
}

export function EtfPriceCard({
    price,
    dailyChangePercent,
    currency = 'TRY',
    aum
}: EtfPriceCardProps) {
    const t = useTranslations('EtfDetail');
    const formatCurrency = useFormatCurrency();

    const hasValue = dailyChangePercent !== null && dailyChangePercent !== undefined;
    const isUp = hasValue && dailyChangePercent! >= 0;

    return (
        <GlassCard className="mb-8 overflow-hidden relative">
            {/* Visual texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-indigo-50/30 to-purple-50/30 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 mix-blend-overlay"></div>

            <CardContent className="p-8 md:p-10 relative z-10">
                <div className="flex text-center md:text-left gap-8 flex-col md:flex-row items-center justify-between">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            {t('currentPrice')} ({currency})
                        </div>
                        <div className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-4">
                            {formatCurrency(price)}
                        </div>
                        {hasValue ? (
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-bold backdrop-blur-md border ${isUp
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                                }`}>
                                {isUp ? (
                                    <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
                                ) : (
                                    <ArrowDownRight className="h-5 w-5 stroke-[2.5]" />
                                )}
                                <span>
                                    {isUp ? "+" : ""}
                                    {formatPercent(dailyChangePercent!)}
                                </span>
                                <span className="text-slate-600 dark:text-slate-400 ml-1 text-sm font-medium tracking-wide opacity-80 uppercase">{t('today')}</span>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-bold backdrop-blur-md border bg-slate-500/10 border-slate-500/20 text-slate-500 dark:text-slate-400">
                                <span>N/A</span>
                                <span className="text-slate-600 dark:text-slate-400 ml-1 text-sm font-medium tracking-wide opacity-80 uppercase">{t('today')}</span>
                            </div>
                        )}
                    </div>
                    <div className="h-px w-full md:w-px md:h-32 bg-slate-200 dark:bg-slate-800"></div>
                    <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                        <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-2 text-right">
                            {t('totalAssets')}
                        </div>
                        <div className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                            {aum ? formatCurrency(aum, true) : 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <Wallet className="w-4 h-4" /> {t('capitalAllocation')}
                        </div>
                    </div>
                </div>
            </CardContent>
        </GlassCard>
    );
}
