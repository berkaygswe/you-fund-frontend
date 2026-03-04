// src/hooks/useEtfPriceChanges.ts
"use client";
import { fundsApi } from "@/services/api";
import { useApiData } from "./useApiData";
import { Currency } from "@/types/currency";
import { EtfPriceChanges } from "@/types/etfPriceChanges";

export function useEtfPriceChanges(symbol: string, currency: Currency | null) {
  const { data, loading, error, refetch } = useApiData<EtfPriceChanges>(
    () => {
      if (!currency) {
        // If currency is null, return an empty EtfPriceChanges object
        // or handle as appropriate for your application's null state.
        // This prevents the API call from being made with a null currency.
        return Promise.resolve({} as EtfPriceChanges);
      }
      return fundsApi.getEtfPriceChanges(symbol, currency);
    },
    [symbol, currency]
  );

  return {
    etfPriceChanges: data,
    loading,
    error,
    refetch
  };
}