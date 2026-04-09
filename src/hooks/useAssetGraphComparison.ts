import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { AssetGraphComparison } from "@/types/assetGraphComparison";

import { AssetIdentifier } from "@/types/asset";

export function useAssetGraphComparison(assets: AssetIdentifier[], fromDate: string, toDate: string, currency: string | null) {
    const shouldFetch = assets.length > 0 && currency !== null;

    const { data, error, isLoading, refetch, isFetching, isPlaceholderData } = useQuery<AssetGraphComparison[]>({
        queryKey: ['assetGraphComparison', assets.map(a => `${a.type}:${a.symbol}`).join(','), fromDate, toDate, currency],
        queryFn: () => fundsApi.getAssetGraphComparison(assets, fromDate, toDate, currency),
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
