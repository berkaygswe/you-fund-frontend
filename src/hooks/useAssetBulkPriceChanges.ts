import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fundsApi } from "@/services/api";
import { AssetIdentifier } from '@/types/asset';
import { AssetPriceChanges } from '@/types/assetPriceChanges';

export function useAssetBulkPriceChanges(assets: AssetIdentifier[], currency: string | null) {
    const shouldFetch = assets.length > 0 && currency !== null;

    const { data, error, isLoading, refetch, isFetching, isPlaceholderData } = useQuery<AssetPriceChanges[]>({
        queryKey: ['assetBulkPriceChanges', assets.map(a => `${a.type}:${a.symbol}`).join(','), currency],
        queryFn: () => fundsApi.getBulkPriceChanges(assets, currency),
        enabled: shouldFetch,
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000, // Optional: cache for 1 minute
    });

    return {
        priceChangesData: data || [],
        loading: isLoading,
        error: error instanceof Error ? error : (error ? new Error(String(error)) : null),
        refetch,
        isFetching,
        isPlaceholderData
    };
}
