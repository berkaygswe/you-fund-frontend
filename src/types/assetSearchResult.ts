export interface AssetSearchResult {
  symbol: string;
  name: string;
  type: string;
  icon_url: string;
  exchange_icon_url: string;
}

export interface AssetSearchApiResponse {
  content: AssetSearchResult[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}