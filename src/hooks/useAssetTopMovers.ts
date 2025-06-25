"use client";
import { fundsApi } from "@/services/api";
import { useApiData } from "./useApiData";
import { AssetTopMovers } from "@/types/assetTopMovers";

export function useAssetTopMovers(direction: string, currency: string) {
  const { data, loading, error, refetch } = useApiData<AssetTopMovers[]>(
    () => fundsApi.getAssetTopMovers(direction, currency),
    [direction, currency]
  );

  return {
    assets: data,
    loading,
    error,
    refetch
  };
}