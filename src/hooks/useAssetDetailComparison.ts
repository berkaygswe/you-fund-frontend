import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { AssetDetailComparison } from "@/types/assetDetailComparsion";
import { AssetIdentifier } from '@/types/asset';

export function useAssetDetailComparsion(assets: AssetIdentifier[], fromDate: string, currency: string | null) {
    const shouldFetch = assets.length > 0 && currency !== null;

    const { data, error, isLoading, refetch, isFetching, isPlaceholderData } = useQuery<AssetDetailComparison[]>({
        queryKey: ['assetDetailComparison', assets.map(a => `${a.type}:${a.symbol}`).join(','), fromDate, currency],
        queryFn: () => fundsApi.getAssetDetailComparison(assets, fromDate, currency),
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
