import { useCallback, useEffect, useState } from "react";
import { fundsApi } from "@/services/api";
import { AssetSearchResult, AssetSearchApiResponse } from "@/types/assetSearchResult";

export function useAssetSearch(searchTerms: string, type: string | null, size: number = 10) {
    const [page, setPage] = useState<number>(0);
    const [searchResults, setSearchResults] = useState<AssetSearchResult[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchSearchResults = useCallback(async () => {
        if (!searchTerms.trim() || isLastPage) return;

        setLoading(true);
        setError(null);
        try {
            const data: AssetSearchApiResponse = await fundsApi.getAssetSearch(searchTerms, type, page, size);
            setCurrentPage(data.number);
            setIsLastPage(data.last);

            // Append if page > 0, otherwise reset
            setSearchResults(prev =>
                data.number === 0 ? data.content : [...prev, ...data.content]
            );
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Unknown error occurred"));
        } finally {
            setLoading(false);
        }
    }, [searchTerms, type, page, size, isLastPage]);

    useEffect(() => {
        // Reset when search term changes
        setSearchResults([]);
        setPage(0);
        setIsLastPage(false);
    }, [searchTerms, type]);

    useEffect(() => {
        fetchSearchResults();
    }, [fetchSearchResults]);

    const fetchNextPage = useCallback(() => {
        if (!loading && !isLastPage) {
            setPage(prev => prev + 1);
        }
    }, [loading, isLastPage]);

    return {
        searchResults,
        currentPage,
        isLastPage,
        loading,
        error,
        fetchNextPage,
    };
}
