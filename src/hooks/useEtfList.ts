"use client";

import { fundsApi } from "@/services/api";
import { Etf } from "@/types/etf";
import { useEffect, useState } from "react";

// src/hooks/useFunds.ts
interface UseEtfsParams {
    search?: string;
    umbrellaType?: string;
    sortBy?: string;
    sortDirection?: string;
    page?: number;
    size?: number;
    currency: string;
}
  
interface UseEtfsResult {
    etfs: Etf[];
    totalCount: number;
    totalPages: number;
    loading: boolean;
    error: Error | null;
}
  
export function useEtfList(params: UseEtfsParams): UseEtfsResult {
    const [etfs, setFunds] = useState<Etf[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchFunds = async () => {
        try {
            setLoading(true);
            const { etfs: data, totalCount: count, totalPages: pages } = await fundsApi.getEtfList(params);
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

    return { etfs, totalCount, totalPages, loading, error };
}