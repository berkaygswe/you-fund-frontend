// src/hooks/useFundAllocation.ts
"use client";
import { fundsApi } from "@/services/api";
import { FundAllocation } from "@/types/fundAllocation";
import { useApiData } from "./useApiData";

export function useFundAllocation(code: string) {
  const { data, loading, error, refetch } = useApiData<FundAllocation[]>(
    () => fundsApi.getFundAllocation(code),
    [code]
  );

  return {
    fundAllocation: data,
    loading,
    error,
    refetch
  };
}