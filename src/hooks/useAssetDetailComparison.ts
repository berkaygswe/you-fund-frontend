import { fundsApi } from "@/services/api";
import { AssetDetailComparison } from "@/types/assetDetailComparsion";
import { useApiData } from "./useApiData";

export function useAssetDetailComparsion(assetCodes: string[], fromDate: string){
    const { data, loading, error, refetch } = useApiData<AssetDetailComparison[]>(
        () => fundsApi.getAssetDetailComparison(assetCodes, fromDate),
        [assetCodes, fromDate]
    );
    
    return { assetComparisonData: data, loading, error, refetch }
}