// src/hooks/useFetchFundPrice.ts
"use client";

import { useState, useEffect } from 'react';
import { fundsApi, ApiError } from '../services/api';
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

  const fetchFundGraph = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fundsApi.getFundGraph(code, startDate, endDate);
      setFundPrice(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundGraph();
  }, []);

  return { prices, loading, error, refetch: fetchFundGraph };
}