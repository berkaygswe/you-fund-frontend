'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import AssetType from './AssetType';

export function LandingHero() {
    const t = useTranslations('Landing.Hero');

    return (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 dark:bg-primary/20 backdrop-blur-xs rounded-full px-6 py-2.5 mb-8 border border-primary/20 dark:border-primary/30 shadow-xs">
                        <div className="w-2.5 h-2.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold tracking-wide text-foreground/90">{t('badge')}</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 text-foreground tracking-tight leading-tight">
                        {t('titleLine1')}
                        <br />
                        <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{t('titleLine2')}</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
                        {t('subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <Link href="/market-overview">
                            <button className="bg-primary hover:bg-primary/95 text-primary-foreground px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 flex items-center space-x-3 shadow-md hover:shadow-lg cursor-pointer">
                                <span>{t('exploreBtn')}</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>

                <AssetType />
            </div>
        </section>
    );
}

