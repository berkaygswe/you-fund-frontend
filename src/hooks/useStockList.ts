"use client";

import { fundsApi } from "@/services/api";
import { Etf } from "@/types/etf";
import { useEffect, useState, useRef } from "react";

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
    stocks: Etf[];
    totalCount: number;
    totalPages: number;
    loading: boolean;
    error: Error | null;
}

export function useStockList(params: UseEtfsParams): UseEtfsResult {
    const [stocks, setStocks] = useState<Etf[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Track whether initial data has been loaded
    const hasLoadedOnce = useRef(false);
    // Track the latest request to avoid race conditions
    const requestIdRef = useRef(0);

    useEffect(() => {
        const fetchFunds = async () => {
            const currentRequestId = ++requestIdRef.current;

            try {
                if (!hasLoadedOnce.current) {
                    setLoading(true);
                }

                const { stocks: data, totalCount: count, totalPages: pages } = await fundsApi.getStockList(params);

                // Only apply results if this is still the latest request
                if (currentRequestId !== requestIdRef.current) return;

                setStocks(data);
                setTotalCount(count);
                setTotalPages(pages);
                hasLoadedOnce.current = true;
            } catch (err) {
                if (currentRequestId !== requestIdRef.current) return;
                setError(err instanceof Error ? err : new Error('Failed to fetch funds'));
            } finally {
                if (currentRequestId === requestIdRef.current) {
                    setLoading(false);
                }
            }
        };

        fetchFunds();
    }, [params]);

    return { stocks, totalCount, totalPages, loading, error };
}