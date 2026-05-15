import { UUID } from "crypto";
import { Currency } from "./currency";

export type TransactionType = 'BUY' | 'SELL';

export interface AssetSummary {
  id: UUID; // UUID
  symbol: string;
  name: string;
  type: string;
}

export interface Portfolio {
  id: number;
  name: string;
  baseCurrency: Currency;
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
  currency: Currency;
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
  currency: Currency;
}

export interface PortfolioHoldings {
  portfolioId: number;
  portfolioName: string;
  baseCurrency: Currency;
  totalMarketValue: number;
  totalUnrealizedPnl: number;
  totalUnrealizedPnlPercent: number;
  positions: Position[];
}

// Request Types
export interface CreatePortfolioRequest {
  name: string;
  baseCurrency: Currency; // e.g., 'USD', 'TRY'
}

export interface CreateTransactionRequest {
  assetId: UUID;
  transactionType: TransactionType;
  quantity: number;
  pricePerUnit: number;
  fee: number;
  currency: Currency;
  transactionDate: string;
  notes?: string;
}
