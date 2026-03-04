"use client";

import { fundsApi } from "@/services/api";
import { Etf } from "@/types/etf";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseEtfsParams {
    search?: string;
    umbrellaType?: string;
    sortBy?: string;
    sortDirection?: string;
    page?: number;
    size?: number;
    currency: string | null;
}

interface UseEtfsResult {
    etfs: Etf[];
    totalCount: number;
    totalPages: number;
    /** True only on initial load when no data has been fetched yet */
    isLoading: boolean;
    /** True when refetching (search, sort, paginate) while previous data is still visible */
    isFetching: boolean;
    error: Error | null;
    retry: () => void;
}

export function useEtfList(params: UseEtfsParams): UseEtfsResult {
    const [etfs, setEtfs] = useState<Etf[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Track whether initial data has been loaded
    const hasLoadedOnce = useRef(false);
    // Track the latest request to avoid race conditions
    const requestIdRef = useRef(0);
    // Track previous currency to detect changes and clear stale data
    const prevCurrencyRef = useRef(params.currency);

    // Clear stale data immediately when currency changes to prevent
    // the UI from showing old prices formatted with the new currency symbol.
    useEffect(() => {
        if (prevCurrencyRef.current !== params.currency && params.currency) {
            setEtfs([]);
            setIsLoading(true);
            hasLoadedOnce.current = false;
        }
        prevCurrencyRef.current = params.currency;
    }, [params.currency]);

    const fetchEtfs = useCallback(async (fetchParams: UseEtfsParams) => {
        const currentRequestId = ++requestIdRef.current;

        // Show full skeleton only on first load; show subtle indicator on subsequent fetches
        if (!hasLoadedOnce.current) {
            setIsLoading(true);
        }
        setIsFetching(true);
        setError(null);

        try {
            const { etfs: data, totalCount: count, totalPages: pages } = await fundsApi.getEtfList(fetchParams);

            // Only apply results if this is still the latest request (prevents race conditions)
            if (currentRequestId !== requestIdRef.current) return;

            setEtfs(data);
            setTotalCount(count);
            setTotalPages(pages);
            hasLoadedOnce.current = true;
        } catch (err) {
            if (currentRequestId !== requestIdRef.current) return;
            setError(err instanceof Error ? err : new Error('Failed to fetch ETFs'));
        } finally {
            if (currentRequestId === requestIdRef.current) {
                setIsLoading(false);
                setIsFetching(false);
            }
        }
    }, []);

    useEffect(() => {
        if (!params.currency) return;
        fetchEtfs(params);
    }, [params, fetchEtfs]);

    const retry = useCallback(() => {
        setError(null);
        fetchEtfs(params);
    }, [params, fetchEtfs]);

    return { etfs, totalCount, totalPages, isLoading, isFetching, error, retry };
}