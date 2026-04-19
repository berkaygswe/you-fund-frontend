import { authRequest } from '@/lib/auth-client';
import { Currency } from '@/types/currency';
import { CreateWatchlistRequest, WatchlistResponse, WatchlistItemResponse, WatchlistAssetWithPriceResponse } from '@/types/watchlist';
import { UUID } from 'crypto';

export const watchlistApi = {
    createWatchlist: (data: CreateWatchlistRequest) =>
        authRequest<WatchlistResponse>('/watchlists', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getUserWatchlists: () =>
        authRequest<WatchlistResponse[]>('/watchlists', {
            method: 'GET',
        }),

    deleteWatchlist: (id: number) =>
        authRequest<void>(`/watchlists/${id}`, {
            method: 'DELETE',
        }),

    getWatchlistItems: (id: number) =>
        authRequest<WatchlistItemResponse[]>(`/watchlists/${id}/items`, {
            method: 'GET',
        }),

    getWatchlistAssetsWithPrices: (id: number, currency: Currency = 'USD') =>
        authRequest<WatchlistAssetWithPriceResponse[]>(`/watchlists/${id}/assets?currency=${currency}`, {
            method: 'GET',
        }),

    addAssetToWatchlist: (id: number, assetId: UUID) =>
        authRequest<WatchlistItemResponse>(`/watchlists/${id}/items/${assetId}`, {
            method: 'POST',
        }),

    removeAssetFromWatchlist: (id: number, assetId: UUID) =>
        authRequest<void>(`/watchlists/${id}/items/${assetId}`, {
            method: 'DELETE',
        }),
};
