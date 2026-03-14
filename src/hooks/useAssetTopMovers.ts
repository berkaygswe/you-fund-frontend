"use client";
import { fundsApi } from "@/services/api";
import { useApiData } from "./useApiData";
import { AssetTopMovers } from "@/types/assetTopMovers";

export function useAssetTopMovers(direction: 'ASC' | 'DESC', currency: string | null) {
  const { data, loading, error, refetch } = useApiData<AssetTopMovers[] | null>(
    async () => {
      if (!currency) return null; // Return null instead of []
      return fundsApi.getAssetTopMovers(direction, currency);
    },
    [direction, currency]
  );

  return {
    assets: data,
    loading: loading || !currency,
    error,
    refetch
  };
}