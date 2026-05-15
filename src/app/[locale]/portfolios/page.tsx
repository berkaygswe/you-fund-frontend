"use client";

import { useState } from "react";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart, 
  History, 
  MoreVertical,
  Trash2,
  Edit2,
  ChevronRight,
  DollarSign
} from "lucide-react";
import { usePortfolios, usePortfolioHoldings, usePortfolioTransactions, useDeletePortfolio } from "@/hooks/usePortfolios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionDialog } from "@/components/portfolio/TransactionDialog";
import { CreatePortfolioDialog } from "@/components/portfolio/CreatePortfolioDialog";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { formatPercent } from "@/utils/formatPercent";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useCurrency } from "@/hooks/useCurrency";

export default function PortfoliosPage() {
  const { status } = useAuth();
  const { data: portfolios, isLoading: loadingPortfolios } = usePortfolios();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isCreatePortfolioOpen, setIsCreatePortfolioOpen] = useState(false);

  const currency = useCurrency();

  // Move state update to useEffect to avoid render-phase state updates
  useEffect(() => {
    if (!selectedPortfolioId && portfolios && portfolios.length > 0) {
      setSelectedPortfolioId(portfolios[0].id);
    }
  }, [selectedPortfolioId, portfolios]);

  const { data: holdings, isLoading: loadingHoldings } = usePortfolioHoldings(selectedPortfolioId, currency);
  const { data: transactions, isLoading: loadingTransactions } = usePortfolioTransactions(selectedPortfolioId);
  const deletePortfolio = useDeletePortfolio();
  
  const formatCurrency = useFormatCurrency();

  const activePortfolio = portfolios?.find(p => p.id === selectedPortfolioId);

  // If we're redirected back here or status is unauthenticated, the middleware should handle it,
  // but we can also show a friendly message here if needed.
  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-xl font-bold mb-2">Access Denied</h3>
        <p className="text-muted-foreground mb-6">Please log in to view your portfolios.</p>
      </div>
    );
  }

  const handleDeletePortfolio = async (id: number) => {
    if (confirm("Are you sure you want to delete this portfolio and all its transactions?")) {
      await deletePortfolio.mutateAsync(id);
      if (selectedPortfolioId === id) {
        setSelectedPortfolioId(null);
      }
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
            My Portfolios
          </h1>
          <p className="text-muted-foreground mt-1">Manage and track your investment performance.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsCreatePortfolioOpen(true)}
            variant="outline"
            className="border-primary/20 hover:bg-primary/5"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Portfolio
          </Button>
          <Button 
            onClick={() => setIsAddTransactionOpen(true)}
            disabled={!selectedPortfolioId}
            className="shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {loadingPortfolios ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>
      ) : portfolios && portfolios.length > 0 ? (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-white/5 rounded-3xl overflow-hidden relative group transition-all hover:border-primary/20">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="h-16 w-16" />
              </div>
              <CardHeader className="pb-2">
                <CardDescription className="uppercase text-[10px] font-bold tracking-widest opacity-60">Total Market Value</CardDescription>
                <CardTitle className="text-3xl font-black">
                  {holdings ? formatCurrency(holdings.totalMarketValue) : '--'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="font-medium">{activePortfolio?.baseCurrency || 'USD'}</span>
                  <span>• Base Currency</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 border-white/5 rounded-3xl transition-all hover:border-white/10">
              <CardHeader className="pb-2">
                <CardDescription className="uppercase text-[10px] font-bold tracking-widest opacity-60">Unrealized PnL</CardDescription>
                <CardTitle className={cn(
                  "text-3xl font-black flex items-center gap-2",
                  (holdings?.totalUnrealizedPnl || 0) >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {holdings ? (
                    <>
                      {holdings.totalUnrealizedPnl >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                      {formatCurrency(holdings.totalUnrealizedPnl)}
                    </>
                  ) : '--'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full w-fit",
                  (holdings?.totalUnrealizedPnlPercent || 0) >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                  {holdings ? formatPercent(holdings.totalUnrealizedPnlPercent) : '--'}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 border-white/5 rounded-3xl">
              <CardHeader className="pb-2">
                <CardDescription className="uppercase text-[10px] font-bold tracking-widest opacity-60">Asset Allocation</CardDescription>
                <CardTitle className="text-3xl font-black">{holdings?.positions.length || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <PieChart className="h-3 w-3" />
                  <span>Diversified across {holdings?.positions.length} assets</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Selector & Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">Your Portfolios</div>
              <div className="space-y-2">
                {portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    onClick={() => setSelectedPortfolioId(portfolio.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all border text-left group cursor-pointer",
                      selectedPortfolioId === portfolio.id 
                        ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20" 
                        : "bg-muted/30 border-transparent hover:bg-muted/50"
                    )}
                  >
                    <div>
                      <div className="font-bold text-sm">{portfolio.name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{portfolio.baseCurrency}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        selectedPortfolioId === portfolio.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:opacity-50"
                      )} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-xs">
                            <Edit2 className="h-3 w-3 mr-2" /> Edit Name
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-xs text-red-500 focus:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePortfolio(portfolio.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <Tabs defaultValue="holdings" className="w-full">
                <TabsList className="bg-muted/30 p-1 rounded-xl mb-6">
                  <TabsTrigger value="holdings" className="rounded-lg px-6">Positions</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-lg px-6">History</TabsTrigger>
                </TabsList>

                <TabsContent value="holdings" className="m-0">
                  <Card className="border-white/5 bg-background/50 rounded-3xl overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow className="border-white/5 hover:bg-transparent">
                          <TableHead className="text-[10px] font-bold uppercase py-4">Asset</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4 text-right">Quantity</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4 text-right">Avg Cost</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4 text-right">Market Value</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4 text-right">PnL</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingHoldings ? (
                          [...Array(3)].map((_, i) => (
                            <TableRow key={i} className="border-white/5">
                              <TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell>
                            </TableRow>
                          ))
                        ) : holdings?.positions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-64 text-center">
                              <div className="flex flex-col items-center justify-center opacity-40">
                                <Wallet className="h-10 w-10 mb-4" />
                                <p className="text-sm font-medium">No positions yet</p>
                                <p className="text-xs">Add your first transaction to see holdings</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          holdings?.positions.map((position) => (
                            <TableRow key={position.assetId} className="border-white/5 hover:bg-white/5 transition-colors group">
                              <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                                    {position.assetSymbol[0]}
                                  </div>
                                  <div>
                                    <div className="font-bold text-sm">{position.assetSymbol}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">{position.assetType}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium">{position.totalQuantity}</TableCell>
                              <TableCell className="text-right text-muted-foreground">{formatCurrency(position.averageCost)}</TableCell>
                              <TableCell className="text-right font-bold">{formatCurrency(position.marketValue)}</TableCell>
                              <TableCell className="text-right">
                                <div className={cn(
                                  "font-bold text-sm",
                                  position.unrealizedPnl >= 0 ? "text-green-500" : "text-red-500"
                                )}>
                                  {formatCurrency(position.unrealizedPnl)}
                                </div>
                                <div className={cn(
                                  "text-[10px] font-bold",
                                  position.unrealizedPnlPercent >= 0 ? "text-green-500/70" : "text-red-500/70"
                                )}>
                                  {formatPercent(position.unrealizedPnlPercent)}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="m-0">
                  <Card className="border-white/5 bg-background/50 rounded-3xl overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow className="border-white/5 hover:bg-transparent">
                          <TableHead className="text-[10px] font-bold uppercase py-4">Date</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4">Asset</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4">Type</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4 text-right">Quantity</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4 text-right">Price</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase py-4 text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingTransactions ? (
                          [...Array(3)].map((_, i) => (
                            <TableRow key={i} className="border-white/5">
                              <TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell>
                            </TableRow>
                          ))
                        ) : transactions?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-64 text-center">
                              <div className="flex flex-col items-center justify-center opacity-40">
                                <History className="h-10 w-10 mb-4" />
                                <p className="text-sm font-medium">No transaction history</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          transactions?.map((tx) => (
                            <TableRow key={tx.id} className="border-white/5 hover:bg-white/5 transition-colors">
                              <TableCell className="py-4 text-xs text-muted-foreground">
                                {format(new Date(tx.transactionDate), 'MMM dd, yyyy HH:mm')}
                              </TableCell>
                              <TableCell>
                                <div className="font-bold text-xs">{tx.assetSymbol}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={cn(
                                  "text-[9px] uppercase font-bold",
                                  tx.transactionType === 'BUY' ? "border-green-500/30 text-green-500 bg-green-500/5" : "border-red-500/30 text-red-500 bg-red-500/5"
                                )}>
                                  {tx.transactionType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right text-xs font-medium">{tx.quantity}</TableCell>
                              <TableCell className="text-right text-xs text-muted-foreground">{formatCurrency(tx.pricePerUnit)}</TableCell>
                              <TableCell className="text-right text-xs font-bold">{formatCurrency(tx.totalCost)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-muted/10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No portfolios found</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-sm">
            Create your first portfolio to start tracking your investments and calculating PnL in real-time.
          </p>
          <Button onClick={() => setIsCreatePortfolioOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Portfolio
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <TransactionDialog 
        open={isAddTransactionOpen} 
        onOpenChange={setIsAddTransactionOpen}
        initialPortfolioId={selectedPortfolioId || undefined}
      />
      
      <CreatePortfolioDialog 
        open={isCreatePortfolioOpen} 
        onOpenChange={setIsCreatePortfolioOpen}
      />
    </div>
  );
}
