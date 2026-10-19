// src/components/crypto/detail/CryptoContractsTab.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, Cpu, ExternalLink, Compass, ShieldCheck } from 'lucide-react';
import { CryptoPlatformContract } from '@/types/cryptoMetadata';
import { useTranslations } from 'next-intl';

interface CryptoContractsTabProps {
    symbol: string;
    platforms?: CryptoPlatformContract[] | null;
    explorerUrls?: string[] | null;
    sourceCodeUrls?: string[] | null;
}

export function CryptoContractsTab({
    symbol,
    platforms,
    explorerUrls,
    sourceCodeUrls,
}: CryptoContractsTabProps) {
    const t = useTranslations('CryptoDetail');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (address: string, index: number) => {
        if (!navigator?.clipboard) return;
        navigator.clipboard.writeText(address);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const hasPlatforms = platforms && platforms.length > 0;
    const cleanExplorers = (explorerUrls || []).filter(Boolean);
    const cleanSource = (sourceCodeUrls || []).filter(Boolean);

    return (
        <div className="space-y-6">
            {/* Smart Contract Deployments */}
            <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
                <CardHeader className="pb-3 border-b border-gray-100 dark:border-slate-800">
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-indigo-500" />
                        {t('contracts')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {hasPlatforms ? (
                        <div className="space-y-3">
                            {platforms!.map((plat, idx) => (
                                <div
                                    key={`${plat.providerPlatformId}-${idx}`}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <Badge
                                            variant="secondary"
                                            className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/40 text-xs font-semibold uppercase px-2.5 py-1"
                                        >
                                            {plat.providerPlatformId}
                                        </Badge>

                                        {plat.decimals != null ? (
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                {plat.decimals} {t('decimals')}
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="flex items-center gap-2 max-w-full sm:max-w-md">
                                        <code className="text-xs font-mono bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 truncate select-all">
                                            {plat.contractAddress}
                                        </code>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopy(plat.contractAddress, idx)}
                                            className="h-8 px-2.5 text-xs gap-1 border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0"
                                            title={t('copyAddress')}
                                        >
                                            {copiedIndex === idx ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t('copied')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm">
                            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                            <span>{t('noContracts')}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Explorers and Repositories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Block Explorers */}
                <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
                    <CardHeader className="pb-3 border-b border-gray-100 dark:border-slate-800">
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Compass className="w-4 h-4 text-blue-500" />
                            {t('explorers')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-2.5">
                        {cleanExplorers.length > 0 ? (
                            cleanExplorers.map((url, idx) => (
                                <a
                                    key={`exp-${idx}`}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 transition-all text-xs font-medium text-slate-700 dark:text-slate-300 group truncate"
                                >
                                    <span className="truncate">{url}</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 ml-2" />
                                </a>
                            ))
                        ) : (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                No public block explorer links registered.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Open Source Repositories */}
                <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
                    <CardHeader className="pb-3 border-b border-gray-100 dark:border-slate-800">
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-amber-500" />
                            {t('sourceCode')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-2.5">
                        {cleanSource.length > 0 ? (
                            cleanSource.map((url, idx) => (
                                <a
                                    key={`src-${idx}`}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-amber-50/50 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 transition-all text-xs font-medium text-slate-700 dark:text-slate-300 group truncate"
                                >
                                    <span className="truncate">{url}</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 shrink-0 ml-2" />
                                </a>
                            ))
                        ) : (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                No public source code repositories registered.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
