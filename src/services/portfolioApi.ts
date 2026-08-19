import { authRequest } from '@/lib/auth-client';
import { Currency } from '@/types/currency';
import { 
  Portfolio, 
  PortfolioOverview,
  PortfolioHoldings, 
  Transaction, 
  TransactionResponse,
  CashMovement,
  CashBalanceResponse,
  CreatePortfolioRequest, 
  CreateCashMovementRequest,
  CreateTransactionRequest 
} from '@/types/portfolio';

export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const portfolioApi = {
  // Portfolio Management
  getPortfolios: () =>
    authRequest<Portfolio[]>('/portfolios', {
      method: 'GET',
    }),

  createPortfolio: (data: CreatePortfolioRequest) =>
    authRequest<Portfolio>('/portfolios', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePortfolio: (id: number, data: { name: string }) =>
    authRequest<Portfolio>(`/portfolios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deletePortfolio: (id: number) =>
    authRequest<void>(`/portfolios/${id}`, {
      method: 'DELETE',
    }),

  // Portfolio Overview (Single source of truth for total value & cash)
  getOverview: (portfolioId: number, currency: Currency | null = 'TRY') =>
    authRequest<PortfolioOverview>(`/portfolios/${portfolioId}/overview?currency=${currency || 'TRY'}`, {
      method: 'GET',
    }),

  // Cash Ledger
  getCashBalance: (portfolioId: number) =>
    authRequest<CashBalanceResponse>(`/portfolios/${portfolioId}/cash-balance`, {
      method: 'GET',
    }),

  getCashMovements: (portfolioId: number) =>
    authRequest<CashMovement[]>(`/portfolios/${portfolioId}/cash-movements`, {
      method: 'GET',
    }),

  createCashMovement: (portfolioId: number, data: CreateCashMovementRequest, idempotencyKey?: string) =>
    authRequest<CashMovement>(`/portfolios/${portfolioId}/cash-movements`, {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey || generateIdempotencyKey(),
      },
      body: JSON.stringify(data),
    }),

  // Transactions (Trades)
  getTransactions: (portfolioId: number) =>
    authRequest<Transaction[]>(`/portfolios/${portfolioId}/transactions`, {
      method: 'GET',
    }),

  createTransaction: (portfolioId: number, data: CreateTransactionRequest, idempotencyKey?: string) =>
    authRequest<TransactionResponse>(`/portfolios/${portfolioId}/transactions`, {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey || generateIdempotencyKey(),
      },
      body: JSON.stringify(data),
    }),

  // Real-time Holdings & Positions
  getHoldings: (portfolioId: number, currency: Currency | null = 'TRY') =>
    authRequest<PortfolioHoldings>(`/portfolios/${portfolioId}/holdings?currency=${currency || 'TRY'}`, {
      method: 'GET',
    }),
};
