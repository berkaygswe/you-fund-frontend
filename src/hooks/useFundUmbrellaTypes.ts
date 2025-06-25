// src/hooks/useFundUmbrellaTypes.ts
"use client";

import { useState, useEffect } from 'react';
import { FundUmbrellaType } from '../types/fundUmbrellaType';
import { fundsApi } from '../services/api';

interface UseFundUmbrellaTypesResult {
  umbrellaTypes: FundUmbrellaType[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFundUmbrellaTypes(): UseFundUmbrellaTypesResult {
  const [umbrellaTypes, setUmbrellaTypes] = useState<FundUmbrellaType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUmbrellaTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fundsApi.getAllUmbrellaTypes();
      setUmbrellaTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error fetching umbrella types:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUmbrellaTypes();
  }, []);

  return { umbrellaTypes, loading, error, refetch: fetchUmbrellaTypes };
}