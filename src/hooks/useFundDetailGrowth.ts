// src/hooks/useFundDetailGrowth.ts
"use client";

import { useQuery } from '@tanstack/react-query';
import { fundsApi } from '../services/api';
import { FundDetailGrowth } from '@/types/fundDetailGrowth';

export function useFundDetailGrowth(code: string) {
  const { data, error, isLoading, refetch } = useQuery<FundDetailGrowth>({
    queryKey: ['fundDetailGrowth', code],
    queryFn: () => fundsApi.getFundDetailGrowth(code),
    enabled: !!code,
  });

  return { 
      fundGrowth: data || null, 
      loading: isLoading, 
      error: error instanceof Error ? error : (error ? new Error(String(error)) : null), 
      refetch 
  };
}
