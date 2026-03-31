// src/hooks/useEtfMetada.ts
"use client";
import { useQuery } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { EtfMetadata } from "@/types/etfMetada";

export function useEtfMetada(symbol: string) {
  const { data, error, isLoading, refetch } = useQuery<EtfMetadata>({
    queryKey: ['etfMetada', symbol],
    queryFn: () => fundsApi.getEtfMetadata(symbol),
    enabled: !!symbol,
  });

  return {
    etfMetadata: data || null,
    loading: isLoading,
    error: error instanceof Error ? error : (error ? new Error(String(error)) : null),
    refetch
  };
}
