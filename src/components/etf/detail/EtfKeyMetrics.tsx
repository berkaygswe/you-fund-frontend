import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Percent, TrendingUp, Activity, Building2, Shield, Calendar } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { formatPercent } from '@/utils/formatPercent';
import { useTranslations } from 'next-intl';

const colors = {
    blue: "bg-blue-50/50 dark:bg-blue-500/10 border-blue-100/50 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/20 group-hover:text-blue-700 dark:group-hover:text-blue-300",
    emerald: "bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-100/50 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/20 group-hover:text-emerald-700 dark:group-hover:text-emerald-300",
    indigo: "bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-100/50 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-700 dark:group-hover:text-indigo-300",
    violet: "bg-violet-50/50 dark:bg-violet-500/10 border-violet-100/50 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 group-hover:bg-violet-50 dark:group-hover:bg-violet-500/20 group-hover:text-violet-700 dark:group-hover:text-violet-300",
    amber: "bg-amber-50/50 dark:bg-amber-500/10 border-amber-100/50 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/20 group-hover:text-amber-700 dark:group-hover:text-amber-300",
    rose: "bg-rose-50/50 dark:bg-rose-500/10 border-rose-100/50 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 group-hover:bg-rose-50 dark:group-hover:bg-rose-500/20 group-hover:text-rose-700 dark:group-hover:text-rose-300",
    slate: "bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 group-hover:text-slate-800 dark:group-hover:text-slate-200"
};

type ColorKey = keyof typeof colors;

const MetricCard = ({ title, value, icon: Icon, color = 'blue' }: { title: string, value: string, icon: React.ElementType, color?: ColorKey }) => {
    return (
        <GlassCard className="transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group overflow-hidden relative">
            {/* Subtle glow effect */}
            <div className={`absolute -right-8 -top-8 w-24 h-24 blur-3xl opacity-[0.15] dark:opacity-10 pointer-events-none rounded-full bg-${color}-500`} />

            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                        {title}
                    </div>
                    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center transition-all duration-500 ${colors[color]}`}>
                        <Icon className="w-5 h-5 transition-colors duration-300" />
                    </div>
                </div>
                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate">
                    {value}
                </div>
            </CardContent>
        </GlassCard>
    );
};

interface EtfKeyMetricsProps {
    expenseRatio?: number | null;
    dividendYield?: number | null;
    peRatio?: number | null;
    holdingsCount?: number | null;
    pbRatio?: number | null;
    inceptionDate?: string | null;
}

export function EtfKeyMetrics({
    expenseRatio,
    dividendYield,
    peRatio,
    holdingsCount,
    pbRatio,
    inceptionDate
}: EtfKeyMetricsProps) {
    const t = useTranslations('EtfDetail');

    return (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
            <MetricCard
                title={t('expenseRatio')}
                value={expenseRatio ? formatPercent(expenseRatio * 100) : 'N/A'}
                icon={Percent}
                color="indigo"
            />
            <MetricCard
                title={t('dividendYield')}
                value={dividendYield ? formatPercent(dividendYield * 100) : 'N/A'}
                icon={TrendingUp}
                color="emerald"
            />
            <MetricCard
                title={t('peRatio')}
                value={peRatio ? peRatio.toFixed(2) : 'N/A'}
                icon={Activity}
                color="amber"
            />
            <MetricCard
                title={t('holdings')}
                value={holdingsCount ? holdingsCount.toLocaleString() : 'N/A'}
                icon={Building2}
                color="violet"
            />
            <MetricCard
                title={t('pbRatio')}
                value={pbRatio ? pbRatio.toFixed(2) : 'N/A'}
                icon={Shield}
                color="rose"
            />
            <MetricCard
                title={t('inception')}
                value={inceptionDate ? new Date(inceptionDate).getFullYear().toString() : 'N/A'}
                icon={Calendar}
                color="slate"
            />
        </div>
    );
}
