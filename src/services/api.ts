// src/services/api.ts
import { Fund } from '../types/fund';

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

export const fundsApi = {
  getAllFunds: async (): Promise<Fund[]> => {
    return fetchData<Fund[]>('/funds');
  },
  
  getFundById: async (id: string): Promise<Fund> => {
    return fetchData<Fund>(`/funds/${id}`);
  }
  
  // Add more API methods as needed
};