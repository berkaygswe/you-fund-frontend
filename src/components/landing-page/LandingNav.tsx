'use client';

import React, { useState } from 'react';
import { TrendingUp, Menu, X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

import { FnancalLogo } from '@/components/layout/FnancalLogo';

export function LandingNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const t = useTranslations('Landing.Nav');

    return (
        <nav className="fixed top-0 w-full z-50 border-b backdrop-blur-md border-border/40 bg-background/60 transition-colors duration-300 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <FnancalLogo className="w-9 h-9 text-primary" />
                        <span className="text-xl font-black tracking-tight text-foreground">
                            Fnancal
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#features" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200">
                            {t('features')}
                        </a>
                        <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200">
                            {t('login')}
                        </Link>
                        <Link href="/signup">
                            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 shadow-sm cursor-pointer">
                                {t('signup')}
                            </button>
                        </Link>
                        <div className="h-4 w-px bg-border/60 mx-1"></div>
                        <div className="flex items-center gap-1">
                            <LanguageSwitcher />
                            <ThemeSwitcher />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 md:hidden">
                        <ThemeSwitcher />
                        <button
                            className="text-foreground focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/40 transition-colors duration-300">
                    <div className="px-4 py-5 space-y-4">
                        <a 
                            href="#features" 
                            className="block text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('features')}
                        </a>
                        <Link 
                            href="/login" 
                            className="block text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('login')}
                        </Link>
                        <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-full font-bold transition-all duration-200">
                                {t('signup')}
                            </button>
                        </Link>
                        <div className="pt-2 border-t border-border/40 flex justify-between items-center">
                            <span className="text-sm text-muted-foreground font-medium">Language</span>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

