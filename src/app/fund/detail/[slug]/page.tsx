"use client";

import FundDetailGraph from '@/app/components/fund-detail/FundDetailGraph';
import { useFundDetails } from '@/hooks/useFundDetails';
import { Fund } from '@/types/fund';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function Page() {

    const params = useParams();
    const slug = params.slug as string;
    const { fund, loading, error } = useFundDetails(slug);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    const priceChangeLabels: { key: keyof Fund["priceChanges"]; label: string }[] = [
        { key: "weekly", label: "Weekly" },
        { key: "monthly", label: "Monthly" },
        { key: "threeMonth", label: "3M" },
        { key: "sixMonth", label: "6M" },
        { key: "yearly", label: "1Y" },
    ];

    return (
        <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-8'>
                <div>
                    <div>{slug}</div>
                    <div>{fund.name}</div>
                    <div className='flex text-sm gap-6'>
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
                <FundDetailGraph code={slug}></FundDetailGraph>
            </div>
            <div className='col-span-4'>
                
            </div>
        </div>
    );
}