import React, { useState } from 'react';
import { Building2, Target, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import { AddToPortfolioButton } from '@/components/portfolio/AddToPortfolioButton';
import { AssetSummary } from '@/types/portfolio';

interface StockHeaderProps {
    symbol: string;
    name: string;
    sector: string;
    industry: string;
    primaryExchange: string;
    assetId?: string; // Add assetId prop
    iconUrl?: string; // Add iconUrl prop
}

export function StockHeader({ symbol, name, sector, industry, primaryExchange, assetId, iconUrl }: StockHeaderProps) {
    const [imgError, setImgError] = useState(false);

    const hasIcon = iconUrl && !imgError;
    const imageSrc = iconUrl ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${iconUrl}.webp` : '';

    return (
        <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    {hasIcon ? (
                        <Image
                            src={imageSrc}
                            width={64}
                            height={64}
                            className="rounded-2xl object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
                            alt={`${name} logo`}
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                                {symbol}
                            </h1>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                                <Target className="w-3 h-3 mr-1" />
                                Active
                            </Badge>
                        </div>
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">{name}</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                    {assetId && (
                        <AddToPortfolioButton 
                            asset={{
                                id: assetId as unknown as AssetSummary['id'],
                                symbol: symbol,
                                name: name,
                                type: 'stock'
                            }}
                            variant="default"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        />
                    )}
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Watchlist
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30">
                    {sector}
                </Badge>
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700/50">
                    {industry}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30">
                    {primaryExchange}
                </Badge>
            </div>
        </div>
    );
}
