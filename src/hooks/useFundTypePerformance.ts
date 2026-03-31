// src/hooks/useFundTypePerformance.ts
"use client";

import { useQuery } from '@tanstack/react-query';
import { fundsApi } from '../services/api';
import { FundTypePerformance } from '@/types/fundTypePerformance';

export function useFundTypePerformance(currency: string | null) {
  const shouldFetch = currency !== null;

  const { data, error, isLoading, refetch } = useQuery<FundTypePerformance[]>({
    queryKey: ['fundTypePerformance', currency],
    queryFn: () => fundsApi.getFundTypePerformance(currency),
    enabled: shouldFetch,
  });

  return { 
      fundTypePerformance: data || [], 
      loading: isLoading, 
      error: error instanceof Error ? error : (error ? new Error(String(error)) : null), 
      refetch 
  };
}
