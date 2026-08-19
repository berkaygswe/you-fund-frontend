import { Currency } from "./currency";

export type TransactionType = 'BUY' | 'SELL';
export type CashMovementType = 'DEPOSIT' | 'WITHDRAWAL';
export type ValuationStatus = 'COMPLETE' | 'PARTIAL';

export interface AssetSummary {
  id: string;
  symbol: string;
  name: string;
  type: string;
}

export interface Portfolio {
  id: number;
  name: string;
  baseCurrency: Currency;
  cashBalance: number;
  revision: number;
  positionCount?: number;
  createdAt?: string;
  updatedAt?: string;
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

export interface TransactionResponse extends Transaction {
  portfolioRevision: number;
  cashImpactBase?: number;
  grossAmountBase?: number;
  feeBase?: number;
  marketDate?: string;
  fxRateToBase?: number;
  priceObservedAt?: string;
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

export interface PortfolioOverview {
  portfolioId: number;
  portfolioName: string;
  displayCurrency: Currency;
  cashBalance: number;
  positionsMarketValue: number;
  totalPortfolioValue: number;
  valuationStatus: ValuationStatus;
  unpricedAssetIds: string[];
  valuedAt: string;
  positions: Position[];
}

export interface CashMovement {
  id: number;
  portfolioId: number;
  type: CashMovementType;
  amount: number;
  effectiveAt: string;
  notes: string | null;
  createdAt: string;
  portfolioRevision: number;
}

export interface CashBalanceResponse {
  portfolioId: number;
  currency: Currency;
  cashBalance: number;
  revision: number;
}

// Request Types
export interface CreatePortfolioRequest {
  name: string;
  baseCurrency: Currency;
  initialCash: number;
  initialCashAt?: string; // Optional audit metadata
}

export interface CreateCashMovementRequest {
  type: CashMovementType;
  amount: number;
  notes?: string;
  effectiveAt?: string; // Optional audit metadata
}

export interface AutoDepositFunding {
  mode: 'AUTO_DEPOSIT_SHORTFALL';
  notes?: string;
}

export interface CreateTransactionRequest {
  assetId: string;
  transactionType: TransactionType;
  quantity: number;
  pricePerUnit: number;
  fee: number;
  currency: Currency;
  transactionDate: string;
  notes?: string;
  ifRevisionEquals?: number;
  funding?: AutoDepositFunding;
}

// Error payload interfaces
export interface InsufficientCashErrorData {
  code: 'INSUFFICIENT_CASH';
  available: number;
  required: number;
  shortfall: number;
  currency: Currency;
  portfolioRevision: number;
  message?: string;
}

export interface PortfolioApiErrorData {
  code?: string;
  message?: string;
  error?: string;
  available?: number;
  required?: number;
  shortfall?: number;
  currency?: Currency;
  portfolioRevision?: number;
}
