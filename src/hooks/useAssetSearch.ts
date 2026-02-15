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



    const fetchSearchResults = useCallback(async (resetPage: boolean = false) => {
        if (!searchTerms.trim()) {
            setSearchResults([]);
            return;
        }

        const currentPageToFetch = resetPage ? 0 : page;

        // Don't fetch if we're at the end and not resetting
        if (!resetPage && isLastPage && page > 0) return;

        setLoading(true);
        setError(null);
        try {
            const data: AssetSearchApiResponse = await fundsApi.getAssetSearch(searchTerms, type, currentPageToFetch, size);
            setCurrentPage(data.number);
            setIsLastPage(data.last);

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
        // When search terms or type change, reset and fetch page 0
        setPage(0);
        setSearchResults([]);
        setIsLastPage(false);
        // We use a small timeout or immediate call depending on how we want to handle type changes
        // But simply calling fetch with a flag is safer
        // Actually, since we essentially want to 'restart', we can just rely on the page 0 state
        // created by the setPage(0) above? No, state updates are async.

        // Creating a dedicated effect for search term changes that handles the fetch explicitly
        // avoids the race condition of waiting for state to update.
    }, [searchTerms, type]);

    useEffect(() => {
        // This effect handles pagination mostly, but also initial load if we don't block it
        // Check if we are in a 'reset' state
        fetchSearchResults(page === 0);
    }, [page, fetchSearchResults]);

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
