import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '@/services/portfolioApi';
import { CreatePortfolioRequest, CreateTransactionRequest } from '@/types/portfolio';
import { useAuth } from './useAuth';
import { Currency } from '@/types/currency';

export function usePortfolios() {
  const { status } = useAuth();
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: () => portfolioApi.getPortfolios(),
    enabled: status === 'authenticated'
  });
}

export function usePortfolioHoldings(portfolioId: number | null, currency: Currency | null = 'TRY') {
  const { status } = useAuth();
  return useQuery({
    queryKey: ['portfolioHoldings', portfolioId, currency],
    queryFn: () => portfolioId ? portfolioApi.getHoldings(portfolioId, currency) : null,
    enabled: status === 'authenticated' && !!portfolioId,
  });
}

export function usePortfolioTransactions(portfolioId: number | null) {
  const { status } = useAuth();
  return useQuery({
    queryKey: ['portfolioTransactions', portfolioId],
    queryFn: () => portfolioId ? portfolioApi.getTransactions(portfolioId) : null,
    enabled: status === 'authenticated' && !!portfolioId,
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePortfolioRequest) => portfolioApi.createPortfolio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

export function useCreateTransaction(portfolioId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => portfolioApi.createTransaction(portfolioId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioHoldings', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioTransactions', portfolioId] });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => portfolioApi.deletePortfolio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}
