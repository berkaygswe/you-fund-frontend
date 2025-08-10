// src/services/api.ts
import { FundUmbrellaType } from '@/types/fundUmbrellaType';
import { Fund } from '../types/fund';
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
import { EtfPriceChanges } from '@/types/etfPriceChanges';
import { Currency } from '@/types/currency';

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

// Retry wrapper for transient failures (e.g. network errors)
async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retries = 3,
  timeout = 100000
): Promise<Response> {
  let lastError: Error | ApiError | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, timeout);

      if (!response.ok) {
        // Retry on 5xx errors
        if (response.status >= 500 && response.status < 600 && attempt < retries) {
          lastError = new ApiError(`Server error: ${response.statusText}`, response.status);
          continue;
        } else {
          throw new ApiError(`API error: ${response.statusText}`, response.status);
        }
      }

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        lastError = error;
      } else {
        lastError = new Error(String(error));
      }

      if (
        (lastError.name === 'AbortError' || lastError instanceof TypeError) &&
        attempt < retries
      ) {
        await new Promise(res => setTimeout(res, 1500 * Math.pow(2, attempt)));
        continue;
      }
      throw lastError;
    }
  }
  throw lastError;
}

async function fetchData<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetchWithRetry(url);
  
  if (!response.ok) {
      // Attempt to parse the response body as JSON
      let errorMessage = `API error: ${response.status} ${response.statusText || 'Unknown Error'}`;
      
      try {
          const errorBody = await response.json(); // Read the response body as JSON
          if (errorBody && errorBody.message) {
              errorMessage = `API Error: ${errorBody.message}`;
          } else {
              // Fallback if the JSON structure is unexpected
              errorMessage = `API Error: ${response.status} - ${JSON.stringify(errorBody)}`;
          }
      } catch (e) {
          // If the response body is not valid JSON (e.g., plain text, HTML)
          // You could also try response.text() here if you expect non-JSON error messages
          errorMessage = `API Error: ${response.status} ${response.statusText || 'Unknown Error'}.`;
      }

      throw new ApiError(errorMessage, response.status);
  }

  return response.json();
}

interface FundsResponse{
  content: Fund[];
  totalElements: number;
  totalPages: number;
}

interface EtfResponse{
  content: Etf[];
  totalElements: number;
  totalPages: number;
}

export const fundsApi = {
  getAllFunds: async (): Promise<Fund[]> => {
    return fetchData<Fund[]>('/funds');
  },
  
  getFundDetails: async (code: string): Promise<FundDetail> => {
    return fetchData<FundDetail>(`/fund/detail/${code}`);
  },

  getAllUmbrellaTypes: async (): Promise<FundUmbrellaType[]> => {
    return fetchData<FundUmbrellaType[]>('/fund-umbrella-types');
  },

  getFundsTest: async (params?: {
    search?: string;
    umbrellaType?: string;
    sortBy?: string;
    sortDirection?: string;
    page?: number;
    size?: number;
  }): Promise<{ funds: Fund[]; totalCount: number, totalPages: number }> => {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.umbrellaType) queryParams.append('umbrellaType', params.umbrellaType);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());

    const endpoint = `/funds?${queryParams.toString()}`;
    const data = await fetchData<FundsResponse>(endpoint);
    
    return {
      funds: data.content,
      totalCount: data.totalElements,
      totalPages: data.totalPages
    };
  },

  getFundGraph: async (code: string, startDate: string, endDate: string, currency: string): Promise<FundPrices[]> => {
    return fetchData<FundPrices[]>(`/fund/detail/graph?fundCode=${code}&startDate=${startDate}&endDate=${endDate}&currency=${currency}`);
  },

  getAssetGraphComparison: async (assetCodes: string[], fromDate: string, toDate: string, currency: string): Promise<AssetGraphComparison[]> => {
    const codes = encodeURIComponent(assetCodes.join(','));
    return fetchData<AssetGraphComparison[]>(`/asset/detail/graph/comparison?assetCodes=${codes}&fromDate=${fromDate}&toDate=${toDate}&currency=${currency}`);
  },

  getAssetSearch: async (searchTerms: string, type: string | null, page: number = 0, size: number = 10): Promise<AssetSearchApiResponse> => {
    const params = new URLSearchParams();
    params.append('searchTerms', searchTerms);
    if (type) params.append('type', type);
    params.append('page', page.toString());
    params.append('size', size.toString());

    const responseJson = fetchData<AssetSearchApiResponse>(`/asset/search?${params.toString()}`);

    console.log("API Response:", responseJson);
    
    return responseJson;
  },

  getFundDetailGrowth: async (code: string): Promise<FundDetailGrowth> => {
    return fetchData<FundDetailGrowth>(`/fund/detail/fund_growth_detail?code=${code}`);
  },

  getFundAllocation: async (code: string): Promise<FundAllocation[]> => {
    return fetchData<FundAllocation[]>(`/fund/detail/allocations/${code}`);
  },

  getAssetDetailComparison: async (assetCodes: string[], fromDate: string, currency: string): Promise<AssetDetailComparison[]> => {
    const codes = encodeURIComponent(assetCodes.filter(Boolean).join(','));
    return fetchData<AssetDetailComparison[]>(`/asset/detail/comparison?assetCodes=${codes}&fromDate=${fromDate}&currency=${currency}`);
  },

  getAssetTopMovers: async (direction: string, currency: string): Promise<AssetTopMovers[]> => {
    return fetchData<AssetTopMovers[]>(`/asset/top-movers?direction=${direction}&currency=${currency}`);
  },

  getFundTypePerformance: async (currency: string): Promise<FundTypePerformance[]> => {
    return fetchData<FundTypePerformance[]>(`/fund-type-performance?currency=${currency}`);
  },

  getEtfList: async (params?: {
    search?: string;
    umbrellaType?: string;
    sortBy?: string;
    sortDirection?: string;
    page?: number;
    size?: number;
    currency: string;
  }): Promise<{ etfs: Etf[]; totalCount: number, totalPages: number }> => {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.umbrellaType) queryParams.append('umbrellaType', params.umbrellaType);
    if (params?.sortBy && params?.sortDirection) {
      queryParams.append('sort', `${params.sortBy},${params.sortDirection}`);
    }
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.currency) queryParams.append('currency', params.currency);

    const endpoint = `/etfs?${queryParams.toString()}`;
    const data = await fetchData<EtfResponse>(endpoint);
    
    return {
      etfs: data.content,
      totalCount: data.totalElements,
      totalPages: data.totalPages
    };
  },

  getEtfMetadata: async (symbol: string): Promise<EtfMetadata> => {
    return fetchData<EtfMetadata>(`/etf/detail/${symbol}`);
  },

  getEtfPriceChanges: async (symbol: string, currency: Currency): Promise<EtfPriceChanges> => {
    return fetchData<EtfPriceChanges>(`/etf/price-changes?symbol=${symbol}&currency=${currency}`)
  }
  
  // Add more API methods as needed
};