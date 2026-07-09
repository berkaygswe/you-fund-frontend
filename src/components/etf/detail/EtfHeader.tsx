import React, { useState } from 'react';
import { BarChart3, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { AddToPortfolioButton } from '@/components/portfolio/AddToPortfolioButton';
import AddToWatchlistButton from '@/components/watchlist/AddToWatchlistButton';
import { AssetSummary } from '@/types/portfolio';
import { useTranslations } from 'next-intl';
import type { UUID } from 'crypto';

interface EtfHeaderProps {
    symbol: string;
    name: string;
    managementCompany?: string;
    etfType?: string;
    iconUrl?: string;
    currency?: string;
    primaryExchange?: string;
    assetId?: string;
}

export function EtfHeader({
    symbol,
    name,
    managementCompany,
    etfType,
    iconUrl,
    currency,
    primaryExchange,
    assetId
}: EtfHeaderProps) {
    const t = useTranslations('EtfDetail');
    const [imgError, setImgError] = useState(false);

    const hasIcon = iconUrl && !imgError;
    const imageSrc = iconUrl ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${iconUrl}.webp` : '';

    return (
        <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        {hasIcon ? (
                            <Image
                                src={imageSrc}
                                width={72}
                                height={72}
                                className="rounded-2xl object-contain mix-blend-multiply dark:mix-blend-screen dark:invert border border-white/20 shadow-sm"
                                alt={`${name} logo`}
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-[72px] h-[72px] bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
                                <BarChart3 className="w-9 h-9 text-white/90" />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-1.5">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {symbol}
                            </h1>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                                <Target className="w-3 h-3 mr-1" />
                                Active
                            </Badge>
                        </div>
                        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium tracking-wide">
                            {managementCompany || 'N/A'} &middot; <span className="font-semibold text-slate-800 dark:text-slate-300">{etfType || 'N/A'}</span>
                        </p>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                    {assetId && (
                        <>
                            <AddToPortfolioButton 
                                asset={{
                                    id: assetId as unknown as AssetSummary['id'],
                                    symbol: symbol,
                                    name: name,
                                    type: 'etf'
                                }}
                                variant="default"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            />
                            <AddToWatchlistButton 
                                symbol={symbol}
                                assetId={assetId as UUID}
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col mb-4 gap-1">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight leading-snug max-w-4xl">
                    {name}
                </h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
                <Badge variant="secondary" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg">
                    {etfType || "N/A"}
                </Badge>
                <Badge variant="secondary" className="bg-indigo-50/60 dark:bg-indigo-500/10 backdrop-blur-md border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg">
                    {currency || 'N/A'}
                </Badge>
                <Badge variant="secondary" className="bg-blue-50/60 dark:bg-blue-500/10 backdrop-blur-md border border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg">
                    {primaryExchange || 'N/A'}
                </Badge>
            </div>
        </div>
    );
}
