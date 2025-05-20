// src/hooks/useFunds.ts
"use client";

import { useState, useEffect } from 'react';
import { fundsApi, ApiError } from '../services/api';
import { FundDetail } from '@/types/fundDetail';

interface UseFundsResult {
  fund: FundDetail;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFundDetails(code: string): UseFundsResult {
  const [fund, setFund] = useState<FundDetail>({} as FundDetail);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fundsApi.getFundDetails(code);
      setFund(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  return { fund, loading, error, refetch: fetchFunds };
}