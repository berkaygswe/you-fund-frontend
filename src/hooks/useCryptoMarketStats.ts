// src/hooks/useCryptoMarketStats.ts
"use client";

import { useQuery } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { CryptoMarketStats } from "@/types/cryptoMetadata";
import { Currency } from "@/types/currency";

export function useCryptoMarketStats(symbol: string, currency: Currency | null, exchange?: string) {
    const trimmedSymbol = symbol?.trim() ?? '';
    const trimmedExchange = exchange?.trim();
    const shouldFetch = !!trimmedSymbol && currency !== null;

    const { data, error, isLoading, refetch } = useQuery<CryptoMarketStats>({
        queryKey: ['cryptoMarketStats', trimmedSymbol, currency, trimmedExchange],
        queryFn: () => fundsApi.getCryptoMarketStats(trimmedSymbol, currency, trimmedExchange),
        enabled: shouldFetch,
        staleTime: 30 * 1000, // 30 seconds client freshness
    });

    return {
        marketStats: data || null,
        loading: isLoading,
        error: error instanceof Error ? error : (error ? new Error(String(error)) : null),
        refetch,
    };
}
