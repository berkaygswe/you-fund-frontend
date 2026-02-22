"use client";

import { fundsApi } from "@/services/api";
import { Etf } from "@/types/etf";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseCryptosParams {
    search?: string;
    umbrellaType?: string;
    sortBy?: string;
    sortDirection?: string;
    page?: number;
    size?: number;
    currency: string;
}

interface UseCryptosResult {
    cryptos: Etf[];
    totalCount: number;
    totalPages: number;
    isLoading: boolean;
    isFetching: boolean;
    error: Error | null;
    retry: () => void;
}

export function useCryptoList(params: UseCryptosParams): UseCryptosResult {
    const [cryptos, setCryptos] = useState<Etf[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const hasLoadedOnce = useRef(false);
    const requestIdRef = useRef(0);

    const fetchCryptos = useCallback(async (fetchParams: UseCryptosParams) => {
        const currentRequestId = ++requestIdRef.current;

        if (!hasLoadedOnce.current) {
            setIsLoading(true);
        }
        setIsFetching(true);
        setError(null);

        try {
            const { cryptos: data, totalCount: count, totalPages: pages } = await fundsApi.getCryptoList(fetchParams);

            if (currentRequestId !== requestIdRef.current) return;

            setCryptos(data);
            setTotalCount(count);
            setTotalPages(pages);
            hasLoadedOnce.current = true;
        } catch (err) {
            if (currentRequestId !== requestIdRef.current) return;
            setError(err instanceof Error ? err : new Error('Failed to fetch Cryptos'));
        } finally {
            if (currentRequestId === requestIdRef.current) {
                setIsLoading(false);
                setIsFetching(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchCryptos(params);
    }, [params, fetchCryptos]);

    const retry = useCallback(() => {
        setError(null);
        fetchCryptos(params);
    }, [params, fetchCryptos]);

    return { cryptos, totalCount, totalPages, isLoading, isFetching, error, retry };
}
