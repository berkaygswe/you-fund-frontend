// src/hooks/useFunds.ts
"use client";

import { useState, useEffect } from 'react';
import { Fund } from '../types/fund';
import { fundsApi, ApiError } from '../services/api';

interface UseFundsResult {
  fund: Fund;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFundDetails(code: string): UseFundsResult {
  const [fund, setFund] = useState<Fund>({} as Fund);
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