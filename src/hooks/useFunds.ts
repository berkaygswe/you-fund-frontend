// src/hooks/useFunds.ts
"use client";

import { useState, useEffect } from 'react';
import { Fund } from '../types/fund';
import { fundsApi } from '../services/api';

interface UseFundsResult {
  funds: Fund[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFunds(): UseFundsResult {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fundsApi.getAllFunds();
      setFunds(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error fetching funds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  return { funds, loading, error, refetch: fetchFunds };
}