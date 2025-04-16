// src/services/api.ts
import { FundUmbrellaType } from '@/types/fundUmbrellaType';
import { Fund } from '../types/fund';
import { FundPrices } from '@/types/fundPrices';

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
  
  getFundDetails: async (code: string): Promise<Fund> => {
    return fetchData<Fund>(`/fund/detail/${code}`);
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

  getFundGraph: async (code: string, startDate: string, endDate: string): Promise<FundPrices[]> => {
    return fetchData<FundPrices[]>(`/fund/detail/graph?fundCode=${code}&startDate=${startDate}&endDate=${endDate}`);
  },
  
  // Add more API methods as needed
};