"use client";

import { fundsApi } from "@/services/api";
import { Fund } from "@/types/fund";
import { useEffect, useState } from "react";

// src/hooks/useFunds.ts
interface UseFundsParams {
    search?: string;
    umbrellaType?: string;
    sortBy?: string;
    sortDirection?: string;
    page?: number;
    size?: number;
}
  
interface UseFundsResult {
    funds: Fund[];
    totalCount: number;
    totalPages: number;
    loading: boolean;
    error: Error | null;
}
  
export function useFundsTest(params: UseFundsParams): UseFundsResult {
    const [funds, setFunds] = useState<Fund[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchFunds = async () => {
        try {
            setLoading(true);
            const { funds: data, totalCount: count, totalPages: pages } = await fundsApi.getFundsTest(params);
            setFunds(data);
            setTotalCount(count);
            setTotalPages(pages);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch funds'));
        } finally {
            setLoading(false);
        }
        };

        fetchFunds();
    }, [params]);

    return { funds, totalCount, totalPages, loading, error };
}