// src/services/api.ts
import { FundUmbrellaType } from '@/types/fundUmbrellaType';
import { TefasFund } from '../types/fund';
import { FundPrices } from '@/types/fundPrices';
import { FundDetail } from '@/types/fundDetail';
import { AssetGraphComparison } from '@/types/assetGraphComparison';
import { AssetSearchApiResponse } from '@/types/assetSearchResult';
import { FundDetailGrowth } from '@/types/fundDetailGrowth';
import { FundAllocation } from '@/types/fundAllocation';
import { AssetDetailComparison } from '@/types/assetDetailComparsion';
import { AssetTopMovers } from '@/types/assetTopMovers';
import { FundTypePerformance } from '@/types/fundTypePerformance';
import { Etf } from '@/types/etf';
import { EtfMetadata } from '@/types/etfMetada';
import { AssetPriceChanges } from '@/types/assetPriceChanges';
import { Currency } from '@/types/currency';
import { AssetIdentifier } from '@/types/asset';
import { StockMetadata } from '@/types/stockMetadata';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 10000 // 10 seconds default
): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    return fetch(url, { ...options, signal: controller.signal }).finally(() => {
        clearTimeout(id);
    });
}

async function fetchData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetchWithTimeout(url, options);

    if (!response.ok) {
        throw new ApiError(
            response.status >= 500 ? `Server error: ${response.statusText}` : `API error: ${response.statusText}`,
            response.status
        );
    }

    return response.json();
}

interface FundsResponse {
    content: TefasFund[];
    totalElements: number;
    totalPages: number;
}

interface EtfResponse {
    content: Etf[];
    totalElements: number;
    totalPages: number;
}

export const fundsApi = {
    getAllFunds: async (): Promise<TefasFund[]> => {
        return fetchData<TefasFund[]>('/funds');
    },

    getFundDetails: async (code: string): Promise<FundDetail> => {
        return fetchData<FundDetail>(`/fund/detail/${code}`);
    },

    getAllUmbrellaTypes: async (): Promise<FundUmbrellaType[]> => {
        return fetchData<FundUmbrellaType[]>('/fund-umbrella-types');
    },

    getTefasFunds: async (currency: string | null): Promise<{ tefasFunds: TefasFund[]; totalCount: number, totalPages: number }> => {
        if (!currency) return { tefasFunds: [], totalCount: 0, totalPages: 0 };
        const data = await fetchData<TefasFund[]>(`/funds?currency=${currency}`);

        return {
            tefasFunds: data,
            totalCount: data.length,
            totalPages: 1
        };
    },

    getFundGraph: async (code: string, startDate: string, endDate: string, currency: string | null): Promise<FundPrices[]> => {
        if (!currency) return [];
        return fetchData<FundPrices[]>(`/fund/detail/graph?fundCode=${code}&startDate=${startDate}&endDate=${endDate}&currency=${currency}`);
    },

    getAssetGraphComparison: async (assets: AssetIdentifier[], fromDate: string, toDate: string, currency: string | null): Promise<AssetGraphComparison[]> => {
        if (!currency) return [];
        const keys = encodeURIComponent(assets.map(a => `${a.type}:${a.symbol}`).join(','));
        return fetchData<AssetGraphComparison[]>(`/asset/detail/graph/comparison?assetKeys=${keys}&fromDate=${fromDate}&toDate=${toDate}&currency=${currency}`);
    },

    getAssetSearch: async (searchTerms: string, type: string | null, page: number = 0, size: number = 10): Promise<AssetSearchApiResponse> => {
        const params = new URLSearchParams();
        params.append('searchTerms', searchTerms);
        if (type) params.append('type', type);
        params.append('page', page.toString());
        params.append('size', size.toString());

        return fetchData<AssetSearchApiResponse>(`/asset/search?${params.toString()}`);
    },

    getFundDetailGrowth: async (code: string): Promise<FundDetailGrowth> => {
        return fetchData<FundDetailGrowth>(`/fund/detail/fund_growth_detail?code=${code}`);
    },

    getFundAllocation: async (code: string): Promise<FundAllocation[]> => {
        return fetchData<FundAllocation[]>(`/fund/detail/allocations/${code}`);
    },

    getAssetDetailComparison: async (assets: AssetIdentifier[], fromDate: string, currency: string | null): Promise<AssetDetailComparison[]> => {
        if (!currency) return [];
        const keys = encodeURIComponent(assets.filter(Boolean).map(a => `${a.type}:${a.symbol}`).join(','));
        return fetchData<AssetDetailComparison[]>(`/asset/detail/comparison?assetKeys=${keys}&fromDate=${fromDate}&currency=${currency}`);
    },

    getAssetTopMovers: async (direction: 'ASC' | 'DESC', currency: string | null): Promise<AssetTopMovers[]> => {
        if (!currency) return [];
        return fetchData<AssetTopMovers[]>(`/asset/top-movers?direction=${direction}&currency=${currency}`);
    },

    getFundTypePerformance: async (currency: string | null): Promise<FundTypePerformance[]> => {
        if (!currency) return [];
        return fetchData<FundTypePerformance[]>(`/fund-type-performance?currency=${currency}`);
    },

    getEtfList: async (params?: {
        search?: string;
        umbrellaType?: string;
        sortBy?: string;
        sortDirection?: string;
        page?: number;
        size?: number;
        currency: string | null;
    }): Promise<{ etfs: Etf[]; totalCount: number, totalPages: number }> => {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append('search', params.search);
        if (params?.umbrellaType) queryParams.append('umbrellaType', params.umbrellaType);
        if (params?.sortBy && params?.sortDirection) {
            queryParams.append('sort', `${params.sortBy},${params.sortDirection}`);
        }
        if (params?.page != null) queryParams.append('page', params.page.toString());
        if (params?.size) queryParams.append('size', params.size.toString());
        if (params?.currency) queryParams.append('currency', params.currency);

        queryParams.append('type', 'etf');
        const endpoint = `/etfs?${queryParams.toString()}`;
        const data = await fetchData<EtfResponse>(endpoint);

        return {
            etfs: data.content,
            totalCount: data.totalElements,
            totalPages: data.totalPages
        };
    },

    getEtfMetadata: async (symbol: string): Promise<EtfMetadata> => {
        return fetchData<EtfMetadata>(`/etf/metadata/${symbol}`);
    },

    getAssetPriceChanges: async (type: string, symbol: string, currency: string | null): Promise<AssetPriceChanges> => {
        if (!currency) return {} as AssetPriceChanges;
        return fetchData<AssetPriceChanges>(`/asset/price-changes?type=${type}&symbol=${symbol}&currency=${currency}`);
    },

    getBulkPriceChanges: async (assets: AssetIdentifier[], currency: string | null): Promise<AssetPriceChanges[]> => {
        if (!currency || assets.length === 0) return [];
        const keys = encodeURIComponent(assets.map(a => `${a.type}:${a.symbol}`).join(','));
        return fetchData<AssetPriceChanges[]>(`/asset/price-changes/bulk?assetKeys=${keys}&currency=${currency}`);
    },

    getStockList: async (params?: {
        search?: string;
        umbrellaType?: string;
        sortBy?: string;
        sortDirection?: string;
        page?: number;
        size?: number;
        currency: string | null;
    }): Promise<{ stocks: Etf[]; totalCount: number, totalPages: number }> => {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append('search', params.search);
        if (params?.umbrellaType) queryParams.append('umbrellaType', params.umbrellaType);
        if (params?.sortBy && params?.sortDirection) {
            queryParams.append('sort', `${params.sortBy},${params.sortDirection}`);
        }
        if (params?.page != null) queryParams.append('page', params.page.toString());
        if (params?.size) queryParams.append('size', params.size.toString());
        if (params?.currency) queryParams.append('currency', params.currency);

        queryParams.append('type', 'stock');
        const endpoint = `/stocks?${queryParams.toString()}`;
        const data = await fetchData<EtfResponse>(endpoint);

        return {
            stocks: data.content,
            totalCount: data.totalElements,
            totalPages: data.totalPages
        };
    },

    getCryptoList: async (params?: {
        search?: string;
        umbrellaType?: string;
        sortBy?: string;
        sortDirection?: string;
        page?: number;
        size?: number;
        currency: string | null;
    }): Promise<{ cryptos: Etf[]; totalCount: number, totalPages: number }> => {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append('search', params.search);
        if (params?.umbrellaType) queryParams.append('umbrellaType', params.umbrellaType);
        if (params?.sortBy && params?.sortDirection) {
            queryParams.append('sort', `${params.sortBy},${params.sortDirection}`);
        }
        if (params?.page != null) queryParams.append('page', params.page.toString());
        if (params?.size) queryParams.append('size', params.size.toString());
        if (params?.currency) queryParams.append('currency', params.currency);

        queryParams.append('type', 'crypto');
        const endpoint = `/crypto?${queryParams.toString()}`;
        const data = await fetchData<EtfResponse>(endpoint);

        return {
            cryptos: data.content,
            totalCount: data.totalElements,
            totalPages: data.totalPages
        };
    },

    getStockMetadata: async (symbol: string): Promise<StockMetadata> => {
        return fetchData<StockMetadata>(`/stock/metadata/${symbol}`);
    },

    // Add more API methods as needed
};
