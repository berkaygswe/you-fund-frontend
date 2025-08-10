// src/hooks/useEtfMetada.ts
"use client";
import { fundsApi } from "@/services/api";
import { useApiData } from "./useApiData";
import { EtfMetadata } from "@/types/etfMetada";

export function useEtfMetada(symbol: string) {
  const { data, loading, error, refetch } = useApiData<EtfMetadata>(
    () => fundsApi.getEtfMetadata(symbol),
    [symbol]
  );

  return {
    etfMetadata: data,
    loading,
    error,
    refetch
  };
}