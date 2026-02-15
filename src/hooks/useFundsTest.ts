"use client";

import { fundsApi } from "@/services/api";
import { Fund } from "@/types/fund";
import { useEffect, useState, useRef } from "react";

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

    // Track the latest request to avoid race conditions
    const requestIdRef = useRef(0);

    useEffect(() => {
        const fetchFunds = async () => {
            const currentRequestId = ++requestIdRef.current;

            try {
                setLoading(true);
                const { funds: data, totalCount: count, totalPages: pages } = await fundsApi.getFundsTest(params);

                if (currentRequestId !== requestIdRef.current) return;

                setFunds(data);
                setTotalCount(count);
                setTotalPages(pages);
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

    return { funds, totalCount, totalPages, loading, error };
}