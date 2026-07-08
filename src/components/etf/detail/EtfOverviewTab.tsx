import React from 'react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useTranslations } from 'next-intl';

interface EtfOverviewTabProps {
    description?: string | null;
    legalStructure?: string | null;
    etfType?: string | null;
}

export function EtfOverviewTab({
    description,
    legalStructure,
    etfType
}: EtfOverviewTabProps) {
    const t = useTranslations('EtfDetail');

    return (
        <div className="grid gap-6">
            <GlassCard>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
                            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        {t('objectiveStrategy')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[15px] mb-8">
                        {description || t('noDescription')}
                    </p>

                    <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">{t('structureProfiling')}</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-white/60 transition-colors">
                            <div className="text-sm text-slate-500 mb-1">{t('legalStructure')}</div>
                            <div className="font-semibold text-slate-900 dark:text-white text-lg">{legalStructure || 'N/A'}</div>
                        </div>
                        <div className="p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-white/60 transition-colors">
                            <div className="text-sm text-slate-500 mb-1">{t('fundType')}</div>
                            <div className="font-semibold text-slate-900 dark:text-white text-lg">{etfType || 'N/A'}</div>
                        </div>
                    </div>
                </CardContent>
            </GlassCard>
        </div>
    );
}
