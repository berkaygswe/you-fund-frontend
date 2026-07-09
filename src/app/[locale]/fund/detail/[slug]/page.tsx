"use client";

import AssetComparison from '@/components/asset-detail/AssetComparison';
import FundAllocation from '@/components/asset-detail/FundAllocation';
import AssetDetailGraph from '@/components/asset-detail/AssetDetailGraph';
import FundGrowth from '@/components/asset-detail/FundGrowth';
import FundInfo from '@/components/asset-detail/FundInfo';
import RiskScale from '@/components/asset-detail/Risk';
import ImageWrap from '@/components/shared/ImageWrap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddToWatchlistButton from '@/components/watchlist/AddToWatchlistButton';
import { AddToPortfolioButton } from '@/components/portfolio/AddToPortfolioButton';
import { useFundDetails } from '@/hooks/useFundDetails';
import { FundDetail } from '@/types/fundDetail';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Page() {
    const params = useParams();
    const slug = (params.slug || params.symbol) as string;
    const { fund, loading, error } = useFundDetails(slug);
    const tCommon = useTranslations('Common');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!fund) return <p>Fund not found</p>;

    const priceChangeLabels: { key: keyof FundDetail["priceChanges"]; labelKey: string }[] = [
        { key: "weekly", labelKey: "weekly" },
        { key: "monthly", labelKey: "monthly" },
        { key: "threeMonth", labelKey: "threeMonth" },
        { key: "sixMonth", labelKey: "sixMonth" },
        { key: "yearly", labelKey: "yearly" },
    ];

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col md:grid md:grid-cols-3 gap-6'>
                <div className='flex items-start col-span-2 gap-4 w-full'>
                    <div className="shrink-0">
                        {fund.founderLogoUrl ? (
                            <ImageWrap
                                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/logo/fund/${fund.founderLogoUrl}`}
                                width={72}
                                height={72}
                                className='rounded-xl border border-slate-100 dark:border-slate-800'
                                alt="Founder logo"
                            />
                        ) : (
                            <Image
                                src="/window.svg"
                                width={72}
                                height={72}
                                className='rounded-xl border border-slate-100 dark:border-slate-800'
                                alt="Default logo"
                            />
                        )}
                    </div>
                    <div className="w-full flex-1 flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className='text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>{slug}</span>
                                <span className='text-sm text-slate-500 dark:text-slate-400 font-medium'>{fund.founderName}</span>
                            </div>
                            <div className="mt-1 text-sm text-slate-700 dark:text-slate-300 font-medium leading-snug">{fund.name}</div>
                            
                            <div className='flex flex-wrap text-xs md:text-sm gap-2 mt-3 text-slate-500 dark:text-slate-400'>
                                {priceChangeLabels.map(({ key, labelKey }) => {
                                    const value = fund.priceChanges[key];
                                    return (
                                        <div key={key} className='flex items-center gap-1 bg-slate-50 dark:bg-slate-800/40 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800/50 shadow-sm'>
                                            <span>{tCommon(labelKey)}</span>
                                            <span className={`flex items-center font-semibold ${value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                {value >= 0 ? (
                                                    <ArrowUp className="inline h-3.5 w-3.5 mr-0.5" />
                                                ) : (
                                                    <ArrowDown className="inline h-3.5 w-3.5 mr-0.5" />
                                                )}{Math.abs(value).toFixed(2)}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap mt-1 md:mt-0 shrink-0">
                            <AddToPortfolioButton 
                                asset={{
                                    id: fund.assetId,
                                    symbol: slug,
                                    name: fund.name,
                                    type: 'fund'
                                }}
                                variant="outline"
                            />
                            <AddToWatchlistButton symbol={slug} assetId={fund.assetId} />
                        </div>
                    </div>
                </div>
                <div className='col-span-1'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Fund Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-6 font-semibold text-lg">
                                <span>{fund.currentPrice.toFixed(4)}</span>
                                <span className={`flex items-center ${fund.priceChanges.daily >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {fund.priceChanges.daily >= 0 ? (
                                        <ArrowUp className="inline h-4 w-4 mr-1" />
                                    ) : (
                                        <ArrowDown className="inline h-4 w-4 mr-1" />
                                    )}{fund.priceChanges.daily.toFixed(2)}%
                                </span>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className='flex flex-col md:grid md:grid-cols-3 gap-6'>
                <div className='col-span-2 flex flex-col gap-4'>
                    <AssetDetailGraph chartClassName='-ms-5' code={slug} assetId={fund.assetId} type="fund"></AssetDetailGraph>
                    <RiskScale riskLevel={fund.risk}></RiskScale>
                    <AssetComparison code={slug} type='fund'></AssetComparison>
                </div>
                <div className='col-span-1 flex flex-col gap-4'>
                    <FundInfo fund={fund}></FundInfo>
                    <FundGrowth code={slug}></FundGrowth>
                    <FundAllocation code={slug}></FundAllocation>
                </div>
            </div>
        </div>
    );
}
