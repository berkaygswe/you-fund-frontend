"use client";
import { useQuery } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { AssetTopMovers } from "@/types/assetTopMovers";

export function useAssetTopMovers(direction: 'ASC' | 'DESC', currency: string | null) {
  const shouldFetch = currency !== null;

  const { data, error, isLoading, refetch } = useQuery<AssetTopMovers[]>({
    queryKey: ['assetTopMovers', direction, currency],
    queryFn: () => fundsApi.getAssetTopMovers(direction, currency),
    enabled: shouldFetch,
  });

  return {
    assets: data || null,
    loading: isLoading || !currency,
    error: error instanceof Error ? error : (error ? new Error(String(error)) : null),
    refetch
  };
}