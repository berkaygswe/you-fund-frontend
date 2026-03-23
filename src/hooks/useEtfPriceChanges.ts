// src/hooks/useEtfPriceChanges.ts
"use client";
import { useQuery } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { Currency } from "@/types/currency";
import { EtfPriceChanges } from "@/types/etfPriceChanges";

export function useEtfPriceChanges(symbol: string, currency: Currency | null) {
  const shouldFetch = symbol && currency !== null;

  const { data, error, isLoading, refetch } = useQuery<EtfPriceChanges>({
    queryKey: ['etfPriceChanges', symbol, currency],
    queryFn: () => fundsApi.getEtfPriceChanges(symbol, currency),
    enabled: !!shouldFetch,
  });

  return {
    etfPriceChanges: data || ({} as EtfPriceChanges),
    loading: isLoading,
    error: error instanceof Error ? error : (error ? new Error(String(error)) : null),
    refetch
  };
}