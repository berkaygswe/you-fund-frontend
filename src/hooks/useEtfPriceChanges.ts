// src/hooks/useEtfPriceChanges.ts
"use client";
import { fundsApi } from "@/services/api";
import { useApiData } from "./useApiData";
import { Currency } from "@/types/currency";
import { EtfPriceChanges } from "@/types/etfPriceChanges";

export function useEtfPriceChanges(symbol: string, currency: Currency) {
  const { data, loading, error, refetch } = useApiData<EtfPriceChanges>(
    () => fundsApi.getEtfPriceChanges(symbol, currency),
    [symbol, currency]
  );

  return {
    etfPriceChanges: data,
    loading,
    error,
    refetch
  };
}