export type TransactionType = 'BUY' | 'SELL';

export interface AssetSummary {
  id: string; // UUID
  symbol: string;
  name: string;
  type: string;
}

export interface Portfolio {
  id: number;
  name: string;
  baseCurrency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  assetId: string;
  assetSymbol: string;
  assetName: string;
  assetType: string;
  transactionType: TransactionType;
  quantity: number;
  pricePerUnit: number;
  fee: number;
  totalCost: number;
  currency: string;
  transactionDate: string; // ISO format
  notes: string | null;
  createdAt: string;
}

export interface Position {
  assetId: string;
  assetSymbol: string;
  assetName: string;
  assetType: string;
  iconUrl: string | null;
  totalQuantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  currency: string;
}

export interface PortfolioHoldings {
  portfolioId: number;
  portfolioName: string;
  baseCurrency: string;
  totalMarketValue: number;
  totalUnrealizedPnl: number;
  totalUnrealizedPnlPercent: number;
  positions: Position[];
}

// Request Types
export interface CreatePortfolioRequest {
  name: string;
  baseCurrency: string; // e.g., 'USD', 'TRY'
}

export interface CreateTransactionRequest {
  assetId: string;
  transactionType: TransactionType;
  quantity: number;
  pricePerUnit: number;
  fee: number;
  currency: string;
  transactionDate: string;
  notes?: string;
}
