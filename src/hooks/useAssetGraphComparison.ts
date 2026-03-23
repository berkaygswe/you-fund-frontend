import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { AssetGraphComparison } from "@/types/assetGraphComparison";

export function useAssetGraphComparison(assetCodes: string[], fromDate: string, toDate: string, currency: string | null) {
    const shouldFetch = assetCodes.length > 1 && currency !== null;

    const { data, error, isLoading, refetch } = useQuery<AssetGraphComparison[]>({
        queryKey: ['assetGraphComparison', assetCodes.join(','), fromDate, toDate, currency],
        queryFn: () => fundsApi.getAssetGraphComparison(assetCodes, fromDate, toDate, currency),
        enabled: shouldFetch,
        placeholderData: keepPreviousData,
    });

    return { 
        assetComparisonData: data || [], 
        loading: isLoading, 
        error: error instanceof Error ? error : (error ? new Error(String(error)) : null), 
        refetch 
    };
}