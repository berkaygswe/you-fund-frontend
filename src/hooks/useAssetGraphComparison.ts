import { fundsApi } from "@/services/api";
import { AssetGraphComparison } from "@/types/assetGraphComparison";
import { useCallback, useEffect, useState } from "react";

export function useAssetGraphComparison(assetCodes: string[], fromDate: string, toDate: string, currency: string | null) {
    const [assetComparisonData, setData] = useState<AssetGraphComparison[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchComparison = useCallback(async () => {
        if (assetCodes.length <= 1 || !currency) return; // Skip fetching if not enough assets or currency is null
        setLoading(true);
        setError(null);
        try {
            const data = await fundsApi.getAssetGraphComparison(assetCodes, fromDate, toDate, currency);
            setData(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        } finally {
            setLoading(false);
        }
    }, [assetCodes, fromDate, toDate, currency]);

    useEffect(() => {
        if (!currency) {
            setData([]); // Clear data if currency is null, as no comparison can be made
            return;
        }
        if (assetCodes.length > 1) {
            fetchComparison();
        } else {
            setData([]); // clear previous comparison data if now not comparing
        }
    }, [fetchComparison, assetCodes.length, currency]);

    return { assetComparisonData, loading, error, refetch: fetchComparison }
}