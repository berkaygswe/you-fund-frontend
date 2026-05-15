import { authRequest } from '@/lib/auth-client';
import { Currency } from '@/types/currency';
import { 
  Portfolio, 
  PortfolioHoldings, 
  Transaction, 
  CreatePortfolioRequest, 
  CreateTransactionRequest 
} from '@/types/portfolio';

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

  updatePortfolio: (id: number, data: Partial<CreatePortfolioRequest>) =>
    authRequest<Portfolio>(`/portfolios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deletePortfolio: (id: number) =>
    authRequest<void>(`/portfolios/${id}`, {
      method: 'DELETE',
    }),

  // Transactions
  getTransactions: (portfolioId: number) =>
    authRequest<Transaction[]>(`/portfolios/${portfolioId}/transactions`, {
      method: 'GET',
    }),

  createTransaction: (portfolioId: number, data: CreateTransactionRequest) =>
    authRequest<Transaction>(`/portfolios/${portfolioId}/transactions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Real-time Holdings & PnL
  getHoldings: (portfolioId: number, currency: Currency | null = 'TRY') =>
    authRequest<PortfolioHoldings>(`/portfolios/${portfolioId}/holdings?currency=${currency}`, {
      method: 'GET',
    }),
};
