import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { AssetDetailComparison } from "@/types/assetDetailComparsion";

export function useAssetDetailComparsion(assetCodes: string[], fromDate: string, currency: string | null) {
    const shouldFetch = assetCodes.length > 0 && currency !== null;

    const { data, error, isLoading, refetch, isFetching, isPlaceholderData } = useQuery<AssetDetailComparison[]>({
        queryKey: ['assetDetailComparison', assetCodes.join(','), fromDate, currency],
        queryFn: () => fundsApi.getAssetDetailComparison(assetCodes, fromDate, currency),
        enabled: shouldFetch,
        placeholderData: keepPreviousData,
    });

    return { 
        assetComparisonData: data || [], 
        loading: isLoading, 
        error: error instanceof Error ? error : (error ? new Error(String(error)) : null), 
        refetch,
        isFetching,
        isPlaceholderData
    };
}
