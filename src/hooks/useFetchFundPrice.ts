// src/hooks/useFetchFundPrice.ts
"use client";

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fundsApi } from '../services/api';
import { FundPrices } from '@/types/fundPrices';

interface UseResult {
  prices: FundPrices[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
}

export function useFetchFundGraph(assetId: string, startDate: string, endDate: string, currency: string | null): UseResult {
    const shouldFetch = currency !== null;

    const { data, error, isLoading, refetch } = useQuery<FundPrices[]>({
        queryKey: ['fundGraph', assetId, startDate, endDate, currency],
        queryFn: () => fundsApi.getFundGraph(assetId, startDate, endDate, currency),
        enabled: shouldFetch,
        placeholderData: keepPreviousData,
    });

    return { 
        prices: data || [], 
        loading: isLoading, 
        error: error instanceof Error ? error : (error ? new Error(String(error)) : null), 
        refetch 
    };
}
