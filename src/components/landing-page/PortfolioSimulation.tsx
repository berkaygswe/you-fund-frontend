'use client';

import React from 'react';
import { Target, CheckCircle, ChevronRight, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import FloatingCard from './FloatingCard';

export function PortfolioSimulation() {
    const t = useTranslations('Landing.Simulation');

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-card/20 dark:bg-card/5 rounded-3xl p-8 lg:p-12 border border-border/40 dark:border-border/10 backdrop-blur-md transition-colors duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center space-x-1.5 bg-amber-500/15 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6 text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                <Target className="w-3.5 h-3.5" />
                                <span>{t('badge')}</span>
                            </div>

                            <h2 className="text-4xl font-black mb-6 text-foreground tracking-tight leading-tight">
                                {t('title')}
                                <br />
                                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{t('subtitle')}</span>
                            </h2>

                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed font-medium">
                                {t('desc')}
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center space-x-3 text-foreground/80 text-sm font-semibold">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                    <span>{t('check1')}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-foreground/80 text-sm font-semibold">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                    <span>{t('check2')}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-foreground/80 text-sm font-semibold">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                    <span>{t('check3')}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-foreground/80 text-sm font-semibold">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                    <span>{t('check4')}</span>
                                </div>
                            </div>

                            <button className="bg-primary hover:bg-primary/95 text-primary-foreground px-6 py-3 rounded-full font-bold transition-all duration-200 flex items-center space-x-2 shadow-sm cursor-pointer">
                                <span>{t('btn')}</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <FloatingCard>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-bold text-foreground">{t('cardTitle')}</span>
                                    <span className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center text-sm">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        +12.4%
                                    </span>
                                </div>
                                <div className="text-3xl font-black mb-4 text-foreground tracking-tight">$124,567</div>
                                <div className="space-y-3 font-semibold text-sm">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>{t('cardStocks')} (60%)</span>
                                        <span className="text-foreground">$74,740</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>{t('cardEtfs')} (25%)</span>
                                        <span className="text-foreground">$31,142</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>{t('cardCrypto')} (15%)</span>
                                        <span className="text-foreground">$18,685</span>
                                    </div>
                                </div>
                            </FloatingCard>

                            <FloatingCard>
                                <div className="text-center">
                                    <div className="text-sm font-bold text-muted-foreground mb-2">{t('cardRisk')}</div>
                                    <div className="text-3xl font-black text-amber-500 dark:text-amber-400">7.2/10</div>
                                    <div className="text-xs font-bold text-muted-foreground mt-2">{t('cardRiskLevel')}</div>
                                    <div className="w-full bg-secondary rounded-full h-1.5 mt-3 overflow-hidden">
                                        <div className="bg-amber-500 dark:bg-amber-400 h-1.5 rounded-full" style={{ width: '72%' }}></div>
                                    </div>
                                </div>
                            </FloatingCard>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

