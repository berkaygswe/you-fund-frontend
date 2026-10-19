// src/components/crypto/detail/CryptoTokenomicsTab.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Infinity as InfinityIcon, ShieldCheck, Scale, AlertTriangle, TrendingUp } from 'lucide-react';
import { useFormatCurrency } from '@/utils/formatCurrency';
import { formatPercent } from '@/utils/formatPercent';
import { useTranslations } from 'next-intl';

interface CryptoTokenomicsTabProps {
    symbol: string;
    circulatingSupply?: number | null;
    totalSupply?: number | null;
    maxSupply?: number | null;
    maxSupplyInfinite?: boolean | null;
    marketCap?: number | null;
    fullyDilutedValuation?: number | null;
    currency?: string;
}

export function CryptoTokenomicsTab({
    symbol,
    circulatingSupply,
    totalSupply,
    maxSupply,
    maxSupplyInfinite,
    marketCap,
    fullyDilutedValuation,
    currency = 'USD',
}: CryptoTokenomicsTabProps) {
    const t = useTranslations('CryptoDetail');
    const formatCurrency = useFormatCurrency();

    // Calculate circulation ratio
    const referenceMax = maxSupply || totalSupply;
    const circulatingPercentage = React.useMemo(() => {
        if (!circulatingSupply || !referenceMax || referenceMax <= 0) return null;
        const pct = (circulatingSupply / referenceMax) * 100;
        return Math.min(100, Math.max(0, pct));
    }, [circulatingSupply, referenceMax]);

    // Calculate Mcap / FDV ratio
    const mcapFdvRatio = React.useMemo(() => {
        if (!marketCap || !fullyDilutedValuation || fullyDilutedValuation <= 0) return null;
        return (marketCap / fullyDilutedValuation) * 100;
    }, [marketCap, fullyDilutedValuation]);

    // Unlocked or yet to be emitted tokens
    const unmintedTokens = React.useMemo(() => {
        if (maxSupplyInfinite) return null;
        if (maxSupply && circulatingSupply && maxSupply > circulatingSupply) {
            return maxSupply - circulatingSupply;
        }
        return null;
    }, [maxSupply, circulatingSupply, maxSupplyInfinite]);

    const formatTokenAmount = (amount?: number | null) => {
        if (amount == null || isNaN(amount)) return '—';
        return `${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${symbol}`;
    };

    return (
        <div className="space-y-6">
            {/* Signature Card: Supply Dynamics Architecture */}
            <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/5 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Layers className="w-5 h-5 text-indigo-500" />
                                {t('tokenomicsTitle')}
                            </CardTitle>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {t('tokenomicsSubtitle')}
                            </p>
                        </div>

                        {/* Supply Policy Badge */}
                        <div>
                            {maxSupplyInfinite === true ? (
                                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40 text-xs px-3 py-1 font-semibold gap-1.5">
                                    <InfinityIcon className="w-3.5 h-3.5" />
                                    {t('infinite')}
                                </Badge>
                            ) : maxSupplyInfinite === false || maxSupply != null ? (
                                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40 text-xs px-3 py-1 font-semibold gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    {t('finite')}
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-slate-600 dark:text-slate-400 text-xs px-3 py-1">
                                    {t('supplyPolicy')}
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8 space-y-8">
                    {/* Visual Progress Gauge */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                {t('circulatingSupply')}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                                {circulatingPercentage != null ? (
                                    <span className="text-indigo-600 dark:text-indigo-400">
                                        {circulatingPercentage.toFixed(1)}% {t('supplyCirculatingPercent', { percent: '' }).trim()}
                                    </span>
                                ) : maxSupplyInfinite ? (
                                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                        <InfinityIcon className="w-3.5 h-3.5 inline" /> {t('unlimited')}
                                    </span>
                                ) : (
                                    '—'
                                )}
                            </span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: `${circulatingPercentage ?? (maxSupplyInfinite ? 100 : 0)}%`,
                                }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                            <span>0 {symbol}</span>
                            <span>
                                {maxSupply != null
                                    ? `Max: ${formatTokenAmount(maxSupply)}`
                                    : maxSupplyInfinite
                                    ? `Infinite Max Supply`
                                    : totalSupply != null
                                    ? `Total: ${formatTokenAmount(totalSupply)}`
                                    : '—'}
                            </span>
                        </div>
                    </div>

                    {/* Supply Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider block mb-1">
                                {t('circulatingSupply')}
                            </span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white block truncate">
                                {formatTokenAmount(circulatingSupply)}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                                Currently available in market
                            </span>
                        </div>

                        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider block mb-1">
                                {t('totalSupply')}
                            </span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white block truncate">
                                {formatTokenAmount(totalSupply)}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                                Minted tokens minus burned
                            </span>
                        </div>

                        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider block mb-1">
                                {t('maxSupply')}
                            </span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white block truncate">
                                {maxSupplyInfinite ? (
                                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                                        <InfinityIcon className="w-4 h-4" /> {t('infinite')}
                                    </span>
                                ) : maxSupply != null ? (
                                    formatTokenAmount(maxSupply)
                                ) : (
                                    '—'
                                )}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                                {unmintedTokens != null
                                    ? `${formatTokenAmount(unmintedTokens)} yet to be issued`
                                    : 'Protocol upper bound'}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Valuation Analysis: Mcap vs FDV */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
                    <CardHeader className="pb-3 border-b border-gray-100 dark:border-slate-800">
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Scale className="w-4 h-4 text-indigo-500" />
                            Valuation Dilution Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {t('marketCap')}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white text-base">
                                {marketCap != null ? formatCurrency(marketCap) : '—'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {t('fdv')}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white text-base">
                                {fullyDilutedValuation != null ? formatCurrency(fullyDilutedValuation) : '—'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <div>
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                                    {t('valuationRatio')}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Circulating valuation coverage
                                </span>
                            </div>
                            <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                                {mcapFdvRatio != null ? `${mcapFdvRatio.toFixed(2)}%` : '—'}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Supply Policy Explanation */}
                <Card className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
                    <CardHeader className="pb-3 border-b border-gray-100 dark:border-slate-800">
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            Emission & Supply Mechanics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                        {maxSupplyInfinite === true ? (
                            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-300">
                                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                                <div className="space-y-1 text-xs sm:text-sm">
                                    <strong className="block font-semibold">Variable / Infinite Emission Model</strong>
                                    <p className="leading-relaxed">
                                        This cryptocurrency operates on an elastic or inflationary emission schedule with no fixed hard cap. Protocol governance or staking rewards govern new token creation.
                                    </p>
                                </div>
                            </div>
                        ) : maxSupply != null ? (
                            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300">
                                <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                                <div className="space-y-1 text-xs sm:text-sm">
                                    <strong className="block font-semibold">Strict Hard-Cap Scarcity</strong>
                                    <p className="leading-relaxed">
                                        The protocol enforces a cryptographic limit of {formatTokenAmount(maxSupply)}. No further units can ever be minted, establishing verifiable algorithmic scarcity.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                                Token issuance rules are determined by the underlying smart contract or consensus layer. Check the official whitepaper for granular distribution schedules.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
