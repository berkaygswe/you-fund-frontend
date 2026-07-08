import React from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Info, ExternalLink, ArrowRight } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useTranslations } from 'next-intl';

interface EtfDetailsTabProps {
    inceptionDate?: string | null;
    primaryExchange?: string | null;
    benchmarkIndex?: string | null;
    distributionFrequency?: string | null;
    isLeveraged?: boolean | null;
    isInverse?: boolean | null;
    isActivelyManaged?: boolean | null;
}

export function EtfDetailsTab({
    inceptionDate,
    primaryExchange,
    benchmarkIndex,
    distributionFrequency,
    isLeveraged,
    isInverse,
    isActivelyManaged
}: EtfDetailsTabProps) {
    const t = useTranslations('EtfDetail');

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <GlassCard>
                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50 mb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            <Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        {t('fundBlueprint')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 px-6 pb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl">
                            <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 mb-1">{t('inceptionDate')}</div>
                            <div className="font-bold text-slate-900 dark:text-white text-lg">
                                {inceptionDate ? new Date(inceptionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                            </div>
                        </div>
                        <div className="p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl">
                            <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 mb-1">{t('exchange')}</div>
                            <div className="font-bold text-slate-900 dark:text-white text-lg">{primaryExchange || 'N/A'}</div>
                        </div>
                        <div className="p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl">
                            <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 mb-1">{t('benchmark')}</div>
                            <div className="font-bold text-slate-900 dark:text-white text-lg">{benchmarkIndex || 'N/A'}</div>
                        </div>
                        <div className="p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl">
                            <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 mb-1">{t('distFrequency')}</div>
                            <div className="font-bold text-slate-900 dark:text-white text-lg">{distributionFrequency || 'N/A'}</div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">{t('structureClassifications')}</h4>
                        <div className="flex flex-wrap gap-3">
                            <div className={`px-4 py-2 rounded-xl border text-sm font-bold ${isLeveraged ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                                {isLeveraged ? t('leveraged') : t('notLeveraged')}
                            </div>
                            <div className={`px-4 py-2 rounded-xl border text-sm font-bold ${isInverse ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                                {isInverse ? t('inverse') : t('notInverse')}
                            </div>
                            <div className={`px-4 py-2 rounded-xl border text-sm font-bold ${isActivelyManaged ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                                {isActivelyManaged ? t('activelyManaged') : t('passivelyManaged')}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </GlassCard>

            <GlassCard>
                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50 mb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                            <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        {t('knowledgeCenter')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                    <button className="w-full flex items-center justify-between p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl hover:bg-blue-50/50 dark:hover:bg-blue-900/10 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300 group">
                        <div className="text-left">
                            <div className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{t('fundProspectus')}</div>
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('downloadDisclosure')}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowRight className="w-5 h-5 text-blue-500" />
                        </div>
                    </button>

                    <button className="w-full flex items-center justify-between p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all duration-300 group">
                        <div className="text-left">
                            <div className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{t('annualReport')}</div>
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('viewFinancials')}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowRight className="w-5 h-5 text-emerald-500" />
                        </div>
                    </button>

                    <button className="w-full flex items-center justify-between p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl hover:bg-purple-50/50 dark:hover:bg-purple-900/10 hover:border-purple-200 dark:hover:border-purple-900/50 transition-all duration-300 group">
                        <div className="text-left">
                            <div className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">{t('holdingsBreakdown')}</div>
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('exportDataset')}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowRight className="w-5 h-5 text-purple-500" />
                        </div>
                    </button>
                </CardContent>
            </GlassCard>
        </div>
    );
}
