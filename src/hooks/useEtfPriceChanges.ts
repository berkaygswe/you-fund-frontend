// src/hooks/useEtfPriceChanges.ts
"use client";
import { useQuery } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { Currency } from "@/types/currency";
import { EtfPriceChanges } from "@/types/etfPriceChanges";
import { AssetType } from '@/types/asset';

export function useEtfPriceChanges(symbol: string, currency: Currency | null, type: AssetType = 'etf') {
  const shouldFetch = symbol && currency !== null;

  const { data, error, isLoading, refetch } = useQuery<EtfPriceChanges>({
    queryKey: ['assetPriceChanges', type, symbol, currency],
    queryFn: () => fundsApi.getAssetPriceChanges(type, symbol, currency),
    enabled: !!shouldFetch,
  });

  return {
    etfPriceChanges: data || ({} as EtfPriceChanges),
    loading: isLoading,
    error: error instanceof Error ? error : (error ? new Error(String(error)) : null),
    refetch
  };
}
