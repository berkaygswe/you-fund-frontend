export interface AssetTopMovers {
    symbol: string;
    name: string;
    type: string;
    exchange?: string;
    country?: string;
    percentageChange: number;
    currentClose: number;
}
