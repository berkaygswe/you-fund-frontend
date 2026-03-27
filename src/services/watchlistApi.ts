import { authRequest } from '@/lib/auth-client';
import { CreateWatchlistRequest, WatchlistResponse, WatchlistItemResponse, WatchlistAssetWithPriceResponse } from '@/types/watchlist';

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

    getWatchlistAssetsWithPrices: (id: number) =>
        authRequest<WatchlistAssetWithPriceResponse[]>(`/watchlists/${id}/assets`, {
            method: 'GET',
        }),

    addAssetToWatchlist: (id: number, symbol: string) =>
        authRequest<WatchlistItemResponse>(`/watchlists/${id}/items/${symbol}`, {
            method: 'POST',
        }),

    removeAssetFromWatchlist: (id: number, symbol: string) =>
        authRequest<void>(`/watchlists/${id}/items/${symbol}`, {
            method: 'DELETE',
        }),
};
