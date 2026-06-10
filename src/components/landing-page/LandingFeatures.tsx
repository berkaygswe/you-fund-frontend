'use client';

import React from 'react';
import {
    TrendingUp,
    BarChart3,
    PieChart,
    Wallet,
    Zap,
    Briefcase,
    Sparkles
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import FloatingCard from './FloatingCard';

interface Feature {
    icon: React.ReactNode;
    titleKey: string;
    descKey: string;
    colorClass: string;
    soon?: boolean;
}

const features: Feature[] = [
    {
        icon: <TrendingUp className="w-5 h-5" />,
        titleKey: 'feature1Title',
        descKey: 'feature1Desc',
        colorClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/10'
    },
    {
        icon: <BarChart3 className="w-5 h-5" />,
        titleKey: 'feature2Title',
        descKey: 'feature2Desc',
        colorClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/10'
    },
    {
        icon: <PieChart className="w-5 h-5" />,
        titleKey: 'feature3Title',
        descKey: 'feature3Desc',
        colorClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/10',
        soon: true
    },
    {
        icon: <Wallet className="w-5 h-5" />,
        titleKey: 'feature4Title',
        descKey: 'feature4Desc',
        colorClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/10'
    },
    {
        icon: <Briefcase className="w-5 h-5" />,
        titleKey: 'feature5Title',
        descKey: 'feature5Desc',
        colorClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 dark:border-violet-500/10'
    },
    {
        icon: <Zap className="w-5 h-5" />,
        titleKey: 'feature6Title',
        descKey: 'feature6Desc',
        colorClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/10'
    }
];

export function LandingFeatures() {
    const t = useTranslations('Landing.Features');

    return (
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 border-primary/20 dark:bg-primary/20 dark:border-primary/30 border rounded-full px-4 py-1.5 mb-6 shadow-xs">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-semibold tracking-wider text-foreground/90">{t('badge')}</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black mb-6 text-foreground tracking-tight">
                        {t('title')}
                    </h2>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => (
                        <FloatingCard key={feature.titleKey} className="group hover:-translate-y-1 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300">
                            <div className="mb-6 flex justify-between items-center">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-xs ${feature.colorClass}`}>
                                    {feature.icon}
                                </div>
                                {feature.soon && (
                                    <div className="inline-flex items-center space-x-1.5 bg-amber-500/15 border border-amber-500/20 rounded-full px-3 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                        <div className="w-1.5 h-1.5 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse"></div>
                                        <span>{t('feature3Soon')}</span>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">{t(feature.titleKey)}</h3>
                            <p className="text-muted-foreground text-sm font-medium leading-relaxed">{t(feature.descKey)}</p>
                        </FloatingCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

