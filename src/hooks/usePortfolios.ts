import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '@/services/portfolioApi';
import { 
  CreatePortfolioRequest, 
  CreateTransactionRequest, 
  CreateCashMovementRequest,
  PortfolioPerformanceTimeframe 
} from '@/types/portfolio';
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

export function usePortfolioOverview(portfolioId: number | null, currency: Currency | null = 'TRY') {
  const { status } = useAuth();
  return useQuery({
    queryKey: ['portfolioOverview', portfolioId, currency],
    queryFn: () => portfolioId ? portfolioApi.getOverview(portfolioId, currency) : null,
    enabled: status === 'authenticated' && !!portfolioId,
  });
}

export function usePortfolioPerformance(
  portfolioId: number | null,
  timeframe: PortfolioPerformanceTimeframe = '1M',
  currency: Currency | null = 'TRY'
) {
  const { status } = useAuth();
  return useQuery({
    queryKey: ['portfolioPerformance', portfolioId, timeframe, currency],
    queryFn: () => portfolioId ? portfolioApi.getPerformance(portfolioId, timeframe, currency) : null,
    enabled: status === 'authenticated' && !!portfolioId,
    retry: (failureCount, error: unknown) => {
      const err = error as { status?: number };
      if (err?.status === 503) {
        return failureCount < 1;
      }
      return failureCount < 2;
    }
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

export function usePortfolioCashBalance(portfolioId: number | null) {
  const { status } = useAuth();
  return useQuery({
    queryKey: ['portfolioCashBalance', portfolioId],
    queryFn: () => portfolioId ? portfolioApi.getCashBalance(portfolioId) : null,
    enabled: status === 'authenticated' && !!portfolioId,
  });
}

export function usePortfolioCashMovements(portfolioId: number | null) {
  const { status } = useAuth();
  return useQuery({
    queryKey: ['portfolioCashMovements', portfolioId],
    queryFn: () => portfolioId ? portfolioApi.getCashMovements(portfolioId) : null,
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

export function useCreateCashMovement(portfolioId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, idempotencyKey }: { data: CreateCashMovementRequest; idempotencyKey?: string }) => 
      portfolioApi.createCashMovement(portfolioId, data, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioOverview', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioPerformance', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioCashBalance', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioCashMovements', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioHoldings', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioTransactions', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

export function useCreateTransaction(portfolioId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, idempotencyKey }: { data: CreateTransactionRequest; idempotencyKey?: string }) => 
      portfolioApi.createTransaction(portfolioId, data, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioOverview', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioPerformance', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioHoldings', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioTransactions', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioCashBalance', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioCashMovements', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => portfolioApi.deletePortfolio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolioPerformance'] });
    },
  });
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string } }) =>
      portfolioApi.updatePortfolio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

