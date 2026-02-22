"use client";

import { fundsApi } from "@/services/api";
import { TefasFund } from "@/types/fund";
import { useEffect, useState, useRef } from "react";

interface UseTefasFundsResult {
    tefasFunds: TefasFund[];
    totalCount: number;
    totalPages: number;
    loading: boolean;
    error: Error | null;
}

export function useTefasFunds(currency: string): UseTefasFundsResult {
    const [tefasFunds, setTefasFunds] = useState<TefasFund[]>([]);
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
                // Call getTefasFunds with currency
                const { tefasFunds: data, totalCount: count, totalPages: pages } = await fundsApi.getTefasFunds(currency);

                if (currentRequestId !== requestIdRef.current) return;

                setTefasFunds(data);
                setTotalCount(count);
                setTotalPages(pages);
            } catch (err) {
                if (currentRequestId !== requestIdRef.current) return;
                setError(err instanceof Error ? err : new Error('Failed to fetch tefas funds'));
            } finally {
                if (currentRequestId === requestIdRef.current) {
                    setLoading(false);
                }
            }
        };

        fetchFunds();
    }, [currency]);

    return { tefasFunds, totalCount, totalPages, loading, error };
}