import { authRequest } from '@/lib/auth-client';
import { Currency } from '@/types/currency';
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

    getWatchlistAssetsWithPrices: (id: number, currency: Currency = 'USD') =>
        authRequest<WatchlistAssetWithPriceResponse[]>(`/watchlists/${id}/assets?currency=${currency}`, {
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
