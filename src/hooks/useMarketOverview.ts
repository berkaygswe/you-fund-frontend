"use client";
import { useQuery } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { MarketOverviewData } from "@/types/marketOverview";

export function useMarketOverview() {
    const { data, error, isLoading, refetch } = useQuery<MarketOverviewData>({
        queryKey: ['marketOverview'],
        queryFn: () => fundsApi.getMarketOverview(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
        refetchInterval: 15 * 60 * 1000, // 15 minutes fallback
    });

    return {
        marketOverview: data || null,
        loading: isLoading,
        error: error instanceof Error ? error : (error ? new Error(String(error)) : null),
        refetch
    };
}
