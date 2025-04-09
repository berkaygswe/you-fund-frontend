"use client";

import { useFundDetails } from '@/hooks/useFundDetails';
import { useParams } from 'next/navigation';

export default function Page() {

    const params = useParams(); 
    const slug = params.slug as string;
    const { fund, loading, error } = useFundDetails(slug);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    return (
        <div>
            <div>{slug}</div>
            <div>{fund.name}</div>
        </div>
    );
}