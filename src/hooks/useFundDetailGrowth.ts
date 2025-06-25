// src/hooks/useFundDetailGrowth.ts
"use client";

import { fundsApi } from '../services/api';
import { FundDetailGrowth } from '@/types/fundDetailGrowth';
import { useApiData } from './useApiData';

export function useFundDetailGrowth(code: string) {
  const { data, loading, error, refetch } = useApiData<FundDetailGrowth>(
    () => fundsApi.getFundDetailGrowth(code),
    [code]
  );

  return { fundGrowth: data, loading, error, refetch};
}