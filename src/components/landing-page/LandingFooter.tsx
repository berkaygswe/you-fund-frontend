'use client';

import React from 'react';
import { TrendingUp, Globe, Activity, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

import { FnancalLogo } from '@/components/layout/FnancalLogo';

export function LandingFooter() {
    const t = useTranslations('Landing.Footer');

    return (
        <footer className="bg-card/10 dark:bg-card/5 backdrop-blur-md border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <div>
                        <div className="flex justify-center items-center space-x-3 mb-4">
                            <FnancalLogo className="w-9 h-9 text-primary" />
                            <span className="text-lg font-black tracking-tight text-foreground">
                                Fnancal
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm font-semibold mb-6">
                            {t('desc')}
                        </p>
                        <div className="flex justify-center space-x-4">
                            <div className="w-8 h-8 bg-secondary/50 border border-border/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer">
                                <Globe className="w-4 h-4" />
                            </div>
                            <div className="w-8 h-8 bg-secondary/50 border border-border/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer">
                                <Activity className="w-4 h-4" />
                            </div>
                            <div className="w-8 h-8 bg-secondary/50 border border-border/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mb-6 text-center text-[10px] text-muted-foreground/60 leading-relaxed">
                    {t('disclaimer')}
                </div>

                <div className="border-t border-border/40 pt-8 text-center text-muted-foreground text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-2">
                    <p>© {new Date().getFullYear()} Fnancal. {t('allRightsReserved')}</p>
                    <span className="hidden sm:inline text-border/60">|</span>
                    <div className="flex gap-2">
                        <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                            {t('privacyPolicy')}
                        </Link>
                        <span className="text-border/60">|</span>
                        <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
                            {t('termsOfService')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

