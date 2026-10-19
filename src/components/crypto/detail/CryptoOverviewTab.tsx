// src/components/crypto/detail/CryptoOverviewTab.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, Globe, Code2, Compass, Calendar, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CryptoOverviewTabProps {
    symbol: string;
    name: string;
    description?: string | null;
    categories?: string[] | null;
    websiteUrls?: string[] | null;
    explorerUrls?: string[] | null;
    sourceCodeUrls?: string[] | null;
    whitepaperUrl?: string | null;
    genesisDate?: string | null;
}

export function CryptoOverviewTab({
    symbol,
    name,
    description,
    categories,
    websiteUrls,
    explorerUrls,
    sourceCodeUrls,
    whitepaperUrl,
    genesisDate,
}: CryptoOverviewTabProps) {
    const t = useTranslations('CryptoDetail');

    const cleanWebsites = React.useMemo(
        () => (websiteUrls || []).filter(Boolean),
        [websiteUrls]
    );
    const cleanExplorers = React.useMemo(
        () => (explorerUrls || []).filter(Boolean),
        [explorerUrls]
    );
    const cleanSourceCode = React.useMemo(
        () => (sourceCodeUrls || []).filter(Boolean),
        [sourceCodeUrls]
    );

    // Format paragraphs from plain text description
    const paragraphs = React.useMemo(() => {
        if (!description) return [];
        return description
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter((p) => p.length > 0);
    }, [description]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Description & Categories */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
                    <CardHeader className="pb-3 border-b border-gray-100 dark:border-slate-800">
                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            {t('about', { name })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4">
                        {paragraphs.length > 0 ? (
                            paragraphs.map((p, idx) => (
                                <p
                                    key={idx}
                                    className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal"
                                >
                                    {p}
                                </p>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                {t('noDescription')}
                            </p>
                        )}

                        {/* Categories */}
                        {categories && categories.length > 0 ? (
                            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                                <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider block mb-2">
                                    {t('categories')}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <Badge
                                            key={category}
                                            variant="secondary"
                                            className="bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 text-xs font-medium rounded-lg"
                                        >
                                            {category}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Key Details & Official Resources */}
            <div className="space-y-6">
                {/* Genesis Date Card if present */}
                {genesisDate ? (
                    <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center shrink-0">
                                <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
                                    {t('genesisDate')}
                                </span>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">
                                    {genesisDate}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ) : null}

                {/* Official Resources */}
                <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
                    <CardHeader className="pb-3 border-b border-gray-100 dark:border-slate-800">
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                            {t('officialLinks')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-3">
                        {/* Official Website */}
                        {cleanWebsites.map((url, i) => (
                            <a
                                key={`site-${i}`}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 transition-all text-sm group"
                            >
                                <div className="flex items-center gap-2.5 truncate">
                                    <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
                                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                        {cleanWebsites.length > 1 ? `${t('website')} #${i + 1}` : t('website')}
                                    </span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 ml-2" />
                            </a>
                        ))}

                        {/* Whitepaper */}
                        {whitepaperUrl ? (
                            <a
                                href={whitepaperUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 transition-all text-sm group"
                            >
                                <div className="flex items-center gap-2.5 truncate">
                                    <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                        {t('whitepaper')}
                                    </span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 ml-2" />
                            </a>
                        ) : null}

                        {/* Source Code */}
                        {cleanSourceCode.map((url, i) => (
                            <a
                                key={`code-${i}`}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 transition-all text-sm group"
                            >
                                <div className="flex items-center gap-2.5 truncate">
                                    <Code2 className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                        {cleanSourceCode.length > 1 ? `${t('sourceCode')} #${i + 1}` : t('sourceCode')}
                                    </span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 shrink-0 ml-2" />
                            </a>
                        ))}

                        {/* Explorers */}
                        {cleanExplorers.slice(0, 3).map((url, i) => (
                            <a
                                key={`exp-${i}`}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 transition-all text-sm group"
                            >
                                <div className="flex items-center gap-2.5 truncate">
                                    <Compass className="w-4 h-4 text-blue-500 shrink-0" />
                                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                        {cleanExplorers.length > 1 ? `${t('explorers')} #${i + 1}` : t('explorers')}
                                    </span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 ml-2" />
                            </a>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
