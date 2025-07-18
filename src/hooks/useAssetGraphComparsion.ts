import { fundsApi } from "@/services/api";
import { AssetGraphComparsion } from "@/types/assetGraphComparison";
import { useCallback, useEffect, useState } from "react";

export function useAssetGraphComparsion(assetCodes: string[], fromDate: string, toDate: string, currency: string) {
    const [assetComparisonData, setData] = useState<AssetGraphComparsion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchComparison = useCallback( async () => {
        if (assetCodes.length <= 1) return; // Skip fetching
        setLoading(true);
        setError(null);
        try{
            const data = await fundsApi.getAssetGraphComparison(assetCodes, fromDate, toDate, currency);
            setData(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        } finally {
            setLoading(false);
        }
    }, [assetCodes, fromDate, toDate, currency]);

    useEffect(() => {
        if (assetCodes.length > 1) {
            fetchComparison();
        } else {
            setData([]); // clear previous comparison data if now not comparing
        }
    }, [fetchComparison, assetCodes.length]);

    return { assetComparisonData, loading, error, refetch: fetchComparison }
}