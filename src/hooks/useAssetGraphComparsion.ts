import { fundsApi } from "@/services/api";
import { AssetGraphComparsion } from "@/types/assetGraphComparison";
import { useCallback, useEffect, useState } from "react";

export function useAssetGraphComparsion(assetCodes: string[], fromDate: string, toDate: string){
    const [assetComparisonData, setData] = useState<AssetGraphComparsion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchComparison = useCallback( async () => {
        setLoading(true);
        setError(null);
        try{
            const data = await fundsApi.getAssetGraphComparison(assetCodes, fromDate, toDate);
            setData(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        } finally {
            setLoading(false);
        }
    }, [assetCodes, fromDate, toDate]);

    useEffect(() => {
        fetchComparison()
    }, [fetchComparison]);

    return { assetComparisonData, loading, error, refetch: fetchComparison }
}