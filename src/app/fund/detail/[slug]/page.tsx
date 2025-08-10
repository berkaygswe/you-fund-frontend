"use client";

import AssetComparison from '@/app/components/fund-detail/AssetComparsion';
import FundAllocation from '@/app/components/fund-detail/FundAllocation';
import FundDetailGraph from '@/app/components/fund-detail/FundDetailGraph';
import FundGrowth from '@/app/components/fund-detail/FundGrowth';
import FundInfo from '@/app/components/fund-detail/FundInfo';
import RiskScale from '@/app/components/fund-detail/Risk';
import ImageWrap from '@/app/components/ImageWrap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFundDetails } from '@/hooks/useFundDetails';
import { FundDetail } from '@/types/fundDetail';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function Page() {

    const params = useParams();
    const slug = params.slug as string;
    const { fund, loading, error } = useFundDetails(slug);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    const priceChangeLabels: { key: keyof FundDetail["priceChanges"]; label: string }[] = [
        { key: "weekly", label: "Weekly" },
        { key: "monthly", label: "Monthly" },
        { key: "threeMonth", label: "3M" },
        { key: "sixMonth", label: "6M" },
        { key: "yearly", label: "1Y" },
    ];

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col md:grid md:grid-cols-3 gap-6'>
                <div className='flex items-center col-span-2 gap-2'>
                    <div>
                        {fund.founderLogoUrl ? (
                            <ImageWrap
                                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/logo/fund/${fund.founderLogoUrl}`}
                                width={70}
                                height={70}
                                className='rounded-md'
                                alt="Founder logo"
                            />
                            ) : (
                            <Image
                                src="/window.svg"
                                width={70}
                                height={70}
                                className='rounded-md'
                                alt="Default logo"
                            />
                        )}
                    </div>
                    <div>   
                        <div>
                            <span className='text-2xl font-bold mr-2'>{slug}</span> 
                            {fund.founderName}
                        </div>
                        <div>{fund.name}</div>
                        <div className='md:flex text-sm gap-6'>
                            {priceChangeLabels.map(({ key, label }) => {
                                const value = fund.priceChanges[key];
                                return (
                                    <div key={key} className='flex gap-1'>
                                        <p>{label}</p>
                                        <p className={`flex items-center ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {value >= 0 ? (
                                                <ArrowUp className="inline h-4 w-4 mr-1" />
                                            ) : (
                                                <ArrowDown className="inline h-4 w-4 mr-1" />
                                            )}{value.toFixed(2)}%
                                        </p>
                                    </div>
                                );
                            })}
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
                    <FundDetailGraph chartClassName='-ms-5' code={slug}></FundDetailGraph>
                    <RiskScale riskLevel={fund.risk}></RiskScale>
                    <AssetComparison code={slug}></AssetComparison>
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