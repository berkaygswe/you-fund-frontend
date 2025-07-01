// src/services/api.ts
import { FundUmbrellaType } from '@/types/fundUmbrellaType';
import { Fund } from '../types/fund';
import { FundPrices } from '@/types/fundPrices';
import { FundDetail } from '@/types/fundDetail';
import { AssetGraphComparsion } from '@/types/assetGraphComparison';
import { AssetSearchApiResponse } from '@/types/assetSearchResult';
import { FundDetailGrowth } from '@/types/fundDetailGrowth';
import { FundAllocation } from '@/types/fundAllocation';
import { AssetDetailComparison } from '@/types/assetDetailComparsion';
import { AssetTopMovers } from '@/types/assetTopMovers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    throw new ApiError(`API error: ${response.statusText}`, response.status);
  }
  
  return response.json();
}

interface FundsResponse{
  content: Fund[];
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

    const response = await fetch(`${API_BASE_URL}/funds?${queryParams.toString()}`);

    if (!response.ok) {
      throw new ApiError(`API error: ${response.statusText}`, response.status);
    }
    
    const data: FundsResponse = await response.json();
    
    return {
      funds: data.content,
      totalCount: data.totalElements,
      totalPages: data.totalPages
    };
  },

  getFundGraph: async (code: string, startDate: string, endDate: string, currency: string): Promise<FundPrices[]> => {
    return fetchData<FundPrices[]>(`/fund/detail/graph?fundCode=${code}&startDate=${startDate}&endDate=${endDate}&currency=${currency}`);
  },

  getAssetGraphComparison: async (assetCodes: string[], fromDate: string, toDate: string): Promise<AssetGraphComparsion[]> => {
    const codes = encodeURIComponent(assetCodes.join(','));
    return fetchData<AssetGraphComparsion[]>(`/asset/detail/graph/comparison?assetCodes=${codes}&fromDate=${fromDate}&toDate=${toDate}`)
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
    const codes = encodeURIComponent(assetCodes.join(','));
    return fetchData<AssetDetailComparison[]>(`/asset/detail/comparison?assetCodes=${codes}&fromDate=${fromDate}&currency=${currency}`);
  },

  getAssetTopMovers: async (direction: string, currency: string): Promise<AssetTopMovers[]> => {
    return fetchData<AssetTopMovers[]>(`/asset/top-movers?direction=${direction}&currency=${currency}`);
  },
  
  // Add more API methods as needed
};