// src/hooks/useFunds.ts
"use client";

import { useQuery } from '@tanstack/react-query';
import { fundsApi } from '../services/api';
import { FundDetail } from '@/types/fundDetail';

export function useFundDetails(code: string) {
  const { data, error, isLoading, refetch } = useQuery<FundDetail>({
    queryKey: ['fundDetails', code],
    queryFn: () => fundsApi.getFundDetails(code),
    enabled: !!code,
  });

  return { 
      fund: data || null, 
      loading: isLoading, 
      error: error instanceof Error ? error : (error ? new Error(String(error)) : null), 
      refetch 
  };
}
