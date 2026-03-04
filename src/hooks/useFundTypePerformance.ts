// src/hooks/useFundTypePerformance.ts
"use client";

import { fundsApi } from '../services/api';
import { useApiData } from './useApiData';
import { FundTypePerformance } from '@/types/fundTypePerformance';

export function useFundTypePerformance(currency: string | null) {
  const { data, loading, error, refetch } = useApiData<FundTypePerformance[]>(
    () => fundsApi.getFundTypePerformance(currency),
    [currency]
  );

  return { fundTypePerformance: data, loading, error, refetch };
}