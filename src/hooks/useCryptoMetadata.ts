// src/hooks/useCryptoMetadata.ts
"use client";

import { useQuery } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { CryptoMetadata } from "@/types/cryptoMetadata";

export function useCryptoMetadata(symbol: string, exchange?: string) {
    const trimmedSymbol = symbol?.trim() ?? '';
    const trimmedExchange = exchange?.trim();

    const { data, error, isLoading, refetch } = useQuery<CryptoMetadata>({
        queryKey: ['cryptoMetadata', trimmedSymbol, trimmedExchange],
        queryFn: () => fundsApi.getCryptoMetadata(trimmedSymbol, trimmedExchange),
        enabled: !!trimmedSymbol,
        staleTime: 60 * 1000, // 1 minute client freshness
    });

    return {
        metadata: data || null,
        loading: isLoading,
        error: error instanceof Error ? error : (error ? new Error(String(error)) : null),
        refetch,
    };
}
