// src/hooks/useFundAllocation.ts
"use client";
import { useQuery } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { FundAllocation } from "@/types/fundAllocation";

export function useFundAllocation(code: string) {
  const { data, error, isLoading, refetch } = useQuery<FundAllocation[]>({
    queryKey: ['fundAllocation', code],
    queryFn: () => fundsApi.getFundAllocation(code),
    enabled: !!code,
  });

  return {
    fundAllocation: data || [],
    loading: isLoading,
    error: error instanceof Error ? error : (error ? new Error(String(error)) : null),
    refetch
  };
}