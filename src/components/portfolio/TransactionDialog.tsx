"use client";

import { useState, useTransition, useCallback, useMemo } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AssetSummary, 
  TransactionType, 
  CreateTransactionRequest 
} from "@/types/portfolio";
import { usePortfolios, useCreateTransaction } from "@/hooks/usePortfolios";
import { useAssetSearch } from "@/hooks/useAssetSearch";
import { AssetSearchResult } from "@/types/assetSearchResult";
import { Loader2, Search, Plus, Calendar as CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import debounce from "lodash.debounce";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixedAsset?: {
    id: string;
    symbol: string;
    name: string;
    type: string;
  };
  initialPortfolioId?: number;
}

export function TransactionDialog({
  open,
  onOpenChange,
  fixedAsset,
  initialPortfolioId,
}: TransactionDialogProps) {
  const { data: portfolios, isLoading: loadingPortfolios } = usePortfolios();
  
  const [portfolioId, setPortfolioId] = useState<string>(initialPortfolioId?.toString() || "");
  const [transactionType, setTransactionType] = useState<TransactionType>("BUY");
  const [selectedAsset, setSelectedAsset] = useState<AssetSummary | null>(fixedAsset || null);
  const [quantity, setQuantity] = useState<string>("");
  const [pricePerUnit, setPricePerUnit] = useState<string>("");
  const [fee, setFee] = useState<string>("0");
  const [transactionDate, setTransactionDate] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [notes, setNotes] = useState<string>("");

  // Asset Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { searchResults, loading: searchLoading } = useAssetSearch(debouncedSearchTerm, null, 5);

  const createTransaction = useCreateTransaction(Number(portfolioId));

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
      }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleAssetSelect = (asset: AssetSearchResult) => {
    setSelectedAsset({
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type
    });
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioId || !selectedAsset || !quantity || !pricePerUnit) return;

    const request: CreateTransactionRequest = {
      assetId: selectedAsset.id,
      transactionType,
      quantity: Number(quantity),
      pricePerUnit: Number(pricePerUnit),
      fee: Number(fee),
      currency: "USD", // Should ideally match portfolio or asset currency
      transactionDate: new Date(transactionDate).toISOString(),
      notes: notes || undefined,
    };

    try {
      await createTransaction.mutateAsync(request);
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      // Error handled by react-query or toast
      console.error("Transaction failed", error);
    }
  };

  const resetForm = () => {
    if (!fixedAsset) setSelectedAsset(null);
    setQuantity("");
    setPricePerUnit("");
    setFee("0");
    setNotes("");
    setTransactionDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  };

  const canSubmit = portfolioId && selectedAsset && quantity && pricePerUnit && !createTransaction.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-white/10 shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            {transactionType === 'BUY' ? 'Add Position' : 'Record Sale'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Portfolio Selection */}
            <div className="space-y-2 col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Portfolio</Label>
              <Select value={portfolioId} onValueChange={setPortfolioId}>
                <SelectTrigger className="bg-muted/50 border-white/5 h-11">
                  <SelectValue placeholder="Select Portfolio" />
                </SelectTrigger>
                <SelectContent>
                  {portfolios?.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.name} ({p.baseCurrency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Asset Selection */}
            <div className="space-y-2 col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Asset</Label>
              {selectedAsset ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                      {selectedAsset.symbol[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{selectedAsset.symbol}</div>
                      <div className="text-[10px] text-muted-foreground">{selectedAsset.name}</div>
                    </div>
                  </div>
                  {!fixedAsset && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedAsset(null)}
                      className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Change
                    </Button>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search symbol or name..." 
                    className="pl-10 h-11 bg-muted/50 border-white/5 focus-visible:ring-primary/30"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  {debouncedSearchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <ScrollArea className="max-h-[240px]">
                        {searchLoading ? (
                          <div className="p-8 flex justify-center">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          </div>
                        ) : searchResults.length > 0 ? (
                          <div className="p-2 space-y-1">
                            {searchResults.map((asset) => (
                              <button
                                key={asset.id}
                                type="button"
                                onClick={() => handleAssetSelect(asset)}
                                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                    {asset.symbol[0]}
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold">{asset.symbol}</div>
                                    <div className="text-[10px] text-muted-foreground">{asset.name}</div>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-[9px] uppercase">{asset.type}</Badge>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center text-xs text-muted-foreground">No assets found</div>
                        )}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Type Toggle */}
            <div className="col-span-2 flex p-1 rounded-xl bg-muted/50 border border-white/5">
              <button
                type="button"
                onClick={() => setTransactionType("BUY")}
                className={cn(
                  "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                  transactionType === "BUY" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Buy / Add
              </button>
              <button
                type="button"
                onClick={() => setTransactionType("SELL")}
                className={cn(
                  "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                  transactionType === "SELL" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Sell / Remove
              </button>
            </div>

            {/* Quantity & Price */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quantity</Label>
              <Input 
                type="number" 
                step="any"
                placeholder="0.00" 
                className="h-11 bg-muted/50 border-white/5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price Per Unit</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input 
                  type="number" 
                  step="any"
                  placeholder="0.00" 
                  className="pl-7 h-11 bg-muted/50 border-white/5"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                />
              </div>
            </div>

            {/* Date & Fee */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input 
                  type="datetime-local" 
                  className="pl-10 h-11 bg-muted/50 border-white/5"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fees</Label>
              <Input 
                type="number" 
                step="any"
                placeholder="0.00" 
                className="h-11 bg-muted/50 border-white/5"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2 col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes (Optional)</Label>
              <Input 
                placeholder="Optional notes..." 
                className="h-11 bg-muted/50 border-white/5"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {createTransaction.isError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-2 items-start animate-in slide-in-from-top-1">
              <Info className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">
                {(createTransaction.error as any)?.message || "Failed to create transaction. Please check your inputs."}
              </p>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              disabled={!canSubmit}
            >
              {createTransaction.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {transactionType === 'BUY' ? 'Add Transaction' : 'Record Sell'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
