// src/components/crypto/detail/CryptoHeader.tsx
"use client";

import React, { useState } from 'react';
import { Coins, Trophy, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { AddToPortfolioButton } from '@/components/portfolio/AddToPortfolioButton';
import AddToWatchlistButton from '@/components/watchlist/AddToWatchlistButton';
import { AssetSummary } from '@/types/portfolio';
import { useTranslations } from 'next-intl';
import type { UUID } from 'crypto';

interface CryptoHeaderProps {
    symbol: string;
    name: string;
    exchange: string;
    assetId: string;
    iconUrl?: string | null;
    marketCapRank?: number | null;
    categories?: string[] | null;
    /** Display currency shown in the header badge. */
    currency?: string | null;
    /** Native quote currency from crypto metadata, used for trades. */
    quoteCurrency?: string | null;
}

export function CryptoHeader({
    symbol,
    name,
    exchange,
    assetId,
    iconUrl,
    marketCapRank,
    categories,
    currency = 'USD',
    quoteCurrency,
}: CryptoHeaderProps) {
    const t = useTranslations('CryptoDetail');
    const [imgError, setImgError] = useState(false);

    const hasIcon = iconUrl && !imgError;
    const imageSrc = iconUrl
        ? iconUrl.startsWith('http')
            ? iconUrl
            : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${iconUrl}.webp`
        : '';

    return (
        <div className="mb-8">
            {/* Breadcrumb / Back Navigation */}
            <div className="mb-4">
                <Link
                    href="/crypto"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Cryptocurrencies</span>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        {hasIcon ? (
                            <Image
                                src={imageSrc}
                                width={72}
                                height={72}
                                className="rounded-2xl object-contain mix-blend-multiply dark:mix-blend-screen dark:invert border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-1.5"
                                alt={`${name} logo`}
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-[72px] h-[72px] bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30">
                                <Coins className="w-9 h-9 text-white" />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {symbol}
                            </h1>

                            {marketCapRank != null ? (
                                <Badge
                                    variant="secondary"
                                    className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/40 font-semibold px-2.5 py-1 text-xs gap-1"
                                >
                                    <Trophy className="w-3 h-3" />
                                    {t('rank', { rank: marketCapRank })}
                                </Badge>
                            ) : null}

                            <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 font-semibold px-2.5 py-1 text-xs"
                            >
                                {t('active')}
                            </Badge>
                        </div>

                        <p className="text-lg md:text-xl font-semibold text-slate-700 dark:text-slate-300">
                            {name}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                    {assetId ? (
                        <>
                            <AddToPortfolioButton
                                asset={{
                                    id: assetId as unknown as AssetSummary['id'],
                                    symbol: symbol,
                                    name: name,
                                    type: 'cryptocurrency',
                                    currency: quoteCurrency ?? undefined,
                                }}
                                variant="default"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                            />
                            <AddToWatchlistButton
                                symbol={symbol}
                                assetId={assetId as UUID}
                            />
                        </>
                    ) : null}
                </div>
            </div>

            {/* Badges / Taxonomy */}
            <div className="flex flex-wrap items-center gap-2">
                <Badge
                    variant="secondary"
                    className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm"
                >
                    {exchange || 'BINANCE'}
                </Badge>
                <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg"
                >
                    {currency || 'USD'}
                </Badge>

                {categories?.slice(0, 4).map((cat) => (
                    <Badge
                        key={cat}
                        variant="outline"
                        className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-50/50 dark:bg-slate-800/30"
                    >
                        {cat}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
