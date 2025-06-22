// src/hooks/useFunds.ts
"use client";

import { fundsApi } from '../services/api';
import { FundDetail } from '@/types/fundDetail';
import { useApiData } from './useApiData';

export function useFundDetails(code: string) {
  const { data, loading, error, refetch } = useApiData<FundDetail>(
    () => fundsApi.getFundDetails(code),
    []
  );

  return { fund: data, loading, error, refetch };
}