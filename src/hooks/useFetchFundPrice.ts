// src/hooks/useFetchFundPrice.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { fundsApi } from '../services/api';
import { FundPrices } from '@/types/fundPrices';

interface UseResult {
  prices: FundPrices[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFetchFundGraph(code: string, startDate: string, endDate: string): UseResult {
  const [prices, setFundPrice] = useState<FundPrices[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFundGraph = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fundsApi.getFundGraph(code, startDate, endDate);
      setFundPrice(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [code, startDate, endDate]);

  useEffect(() => {
    fetchFundGraph();
  }, [fetchFundGraph]);

  return { prices, loading, error, refetch: fetchFundGraph };
}