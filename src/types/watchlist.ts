export interface CreateWatchlistRequest {
    name: string;
}

export interface WatchlistItemResponse {
    id: number;
    assetId: string; // UUID maps well to string in TS
    symbol: string;
    assetName: string;
    assetType: string;
    addedAt: string; // ISO 8601 string for LocalDateTime
}

export interface WatchlistResponse {
    id: number;
    name: string;
    itemCount: number;
    createdAt: string;
    updatedAt: string;
}
