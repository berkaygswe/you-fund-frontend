import React, { useMemo } from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building2, PieChart } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { formatPercent } from '@/utils/formatPercent';
import { EtfTopHolding } from '@/types/etfMetada';
import { useTranslations } from 'next-intl';

interface EtfHoldingsTabProps {
    topHoldings?: EtfTopHolding[] | null;
    holdingsCount?: number | null;
    sectorAllocation?: Record<string, number> | null;
}

export function EtfHoldingsTab({
    topHoldings,
    holdingsCount,
    sectorAllocation
}: EtfHoldingsTabProps) {
    const t = useTranslations('EtfDetail');

    const sectors = useMemo(() => {
        if (!sectorAllocation) return [];
        return Object.entries(sectorAllocation)
            .map(([sector, weight]) => ({ sector, weight }))
            .filter(s => s.weight > 0)
            .sort((a, b) => b.weight - a.weight);
    }, [sectorAllocation]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard>
                <CardHeader className="pb-6 border-b border-slate-100 dark:border-slate-800/50 mb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold">
                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            {t('topHoldings')}
                        </CardTitle>
                        {holdingsCount !== null && holdingsCount !== undefined && (
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                {holdingsCount.toLocaleString()} {t('total')}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 px-6 pb-6">
                    {topHoldings?.map((holding: EtfTopHolding, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-700/30 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 group">
                            <div className="flex items-center gap-4">
                                <div className="w-8 flex justify-center text-sm font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                                    {idx + 1}
                                </div>
                                <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{holding.Name}</div>
                            </div>
                            <div className="text-right flex items-center gap-4">
                                <div className="font-bold text-lg text-slate-900 dark:text-white">{formatPercent(holding['Holding Percent'] * 100)}</div>
                                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full hidden sm:block overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${Math.min(holding['Holding Percent'] * 100 * 3, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!topHoldings || topHoldings.length === 0) && (
                        <div className="py-8 text-center text-slate-500">{t('noHoldings')}</div>
                    )}
                </CardContent>
            </GlassCard>

            <GlassCard>
                <CardHeader className="pb-6 border-b border-slate-100 dark:border-slate-800/50 mb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-100 dark:border-purple-500/20">
                            <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        {t('sectorExposure')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-5">
                    {sectors.map((sector: { sector: string; weight: number }) => (
                        <div key={sector.sector} className="group">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-700 dark:text-slate-300 font-medium">{sector.sector}</span>
                                <span className="font-bold text-slate-900 dark:text-white">{formatPercent(sector.weight * 100)}</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-out overlay-shine"
                                    style={{ width: `${sector.weight * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {sectors.length === 0 && (
                        <div className="py-8 text-center text-slate-500">{t('noSectors')}</div>
                    )}
                </CardContent>
            </GlassCard>
        </div>
    );
}
