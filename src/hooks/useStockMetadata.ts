// src/hooks/useStockMetadata.ts
"use client";
import { useQuery } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { StockMetadata } from "@/types/stockMetadata";

export function useStockMetadata(symbol: string) {
  const { data, error, isLoading, refetch } = useQuery<StockMetadata>({
    queryKey: ['stockMetadata', symbol],
    queryFn: () => fundsApi.getStockMetadata(symbol),
    enabled: !!symbol,
  });

  return {
    stockMetadata: data || null,
    loading: isLoading,
    error: error instanceof Error ? error : (error ? new Error(String(error)) : null),
    refetch
  };
}
