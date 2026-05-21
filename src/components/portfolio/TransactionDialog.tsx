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
import { FundPrices } from "@/types/fundPrices";
import { useAssetSearch } from "@/hooks/useAssetSearch";
import { AssetSearchResult } from "@/types/assetSearchResult";
import { Loader2, Search, Plus, Calendar as CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import debounce from "lodash.debounce";
import { SUPPORTED_CURRENCIES, Currency } from "@/types/currency";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useFetchFundGraph } from "@/hooks/useFetchFundPrice";
import { TradingViewChart } from "@/components/fund-detail/TradingViewChart";


interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixedAsset?: AssetSummary;
  initialPortfolioId?: number;
}

export function TransactionDialog({
  open,
  onOpenChange,
  fixedAsset,
  initialPortfolioId,
}: TransactionDialogProps) {
  const t = useTranslations("Portfolio.TransactionDialog");
  const { data: portfolios, isLoading: loadingPortfolios } = usePortfolios();
  
  const [portfolioId, setPortfolioId] = useState<string>(initialPortfolioId?.toString() || "");
  const [transactionType, setTransactionType] = useState<TransactionType>("BUY");
  const [selectedAsset, setSelectedAsset] = useState<AssetSummary | null>(fixedAsset || null);
  const [quantity, setQuantity] = useState<string>("");
  const [pricePerUnit, setPricePerUnit] = useState<string>("");
  const [fee, setFee] = useState<string>("0");
  const [transactionDate, setTransactionDate] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [notes, setNotes] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0].value);

  // Asset Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { searchResults, loading: searchLoading } = useAssetSearch(debouncedSearchTerm, null, 5);

  const createTransaction = useCreateTransaction(Number(portfolioId));

  const selectedPortfolio = useMemo(() => 
    portfolios?.find(p => p.id.toString() === portfolioId),
    [portfolios, portfolioId]
  );

  useEffect(() => {
    if (selectedPortfolio) {
      setCurrency(selectedPortfolio.baseCurrency);
    }
  }, [selectedPortfolio]);

  const [showChart, setShowChart] = useState(false);

  // 5-year date calculations
  const startDateStr = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 5);
    return format(date, "yyyy-MM-dd");
  }, []);

  const endDateStr = useMemo(() => {
    return format(new Date(), "yyyy-MM-dd");
  }, []);

  const { prices, loading: loadingPrices } = useFetchFundGraph(
    selectedAsset?.id || "",
    startDateStr,
    endDateStr,
    selectedAsset ? (selectedPortfolio?.baseCurrency || currency || "USD") : null
  );

  const targetDateStr = useMemo(() => {
    if (!transactionDate) return null;
    return transactionDate.substring(0, 10);
  }, [transactionDate]);

  const activeDayPrice = useMemo(() => {
    if (!targetDateStr || !prices || prices.length === 0) return null;
    
    // Try exact match first
    const exactMatch = prices.find(p => p.date.startsWith(targetDateStr));
    if (exactMatch) return exactMatch;

    // Find the closest preceding trading day
    const targetTime = new Date(targetDateStr).getTime();
    let closestPreceding: FundPrices | null = null;
    let minDiff = Infinity;

    for (const price of prices) {
      const priceTime = new Date(price.date.substring(0, 10)).getTime();
      if (priceTime <= targetTime) {
        const diff = targetTime - priceTime;
        if (diff < minDiff) {
          minDiff = diff;
          closestPreceding = price;
        }
      }
    }

    return closestPreceding;
  }, [targetDateStr, prices]);

  const isToday = useMemo(() => {
    if (!targetDateStr) return false;
    const todayStr = format(new Date(), "yyyy-MM-dd");
    return targetDateStr === todayStr;
  }, [targetDateStr]);

  const bounds = useMemo(() => {
    if (!activeDayPrice) return null;
    const lowVal = activeDayPrice.low || activeDayPrice.close;
    const highVal = activeDayPrice.high || activeDayPrice.close;
    const closeVal = activeDayPrice.close;
    
    // Server limits are 10% for live date
    const minLimit = lowVal * 0.9;
    const maxLimit = highVal * 1.1;

    // Visual bounds: today allows 5% buffers; historical has 0% buffer (strict Low to High range)
    const minVal = isToday ? lowVal * 0.95 : lowVal;
    const maxVal = isToday ? highVal * 1.05 : highVal;

    return {
      low: lowVal,
      high: highVal,
      close: closeVal,
      min: minVal,
      max: maxVal,
      range: maxVal - minVal || 1,
      limitMin: isToday ? minLimit : lowVal,
      limitMax: isToday ? maxLimit : highVal
    };
  }, [activeDayPrice, isToday]);

  const isOutsideBounds = useMemo(() => {
    if (!bounds || !pricePerUnit) return false;
    const val = parseFloat(pricePerUnit);
    if (isNaN(val)) return false;
    return val < bounds.limitMin || val > bounds.limitMax;
  }, [bounds, pricePerUnit]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
      }, 300),
    []
  );

  const currencySymbol = useMemo(() => {
    return SUPPORTED_CURRENCIES.find(c => c.value === currency)?.symbol || "$";
  }, [currency]);

  const total = useMemo(() => {
    const qty = parseFloat(quantity);
    const price = parseFloat(pricePerUnit);
    if (isNaN(qty) || isNaN(price) || qty <= 0 || price <= 0) return null;
    return qty * price;
  }, [quantity, pricePerUnit]);

  const totalWithFees = useMemo(() => {
    if (total === null) return null;
    const f = parseFloat(fee);
    const feeVal = isNaN(f) || f < 0 ? 0 : f;
    return transactionType === "BUY" ? total + feeVal : total - feeVal;
  }, [total, fee, transactionType]);

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
      currency,
      transactionDate: new Date(transactionDate).toISOString(),
      notes: notes || undefined,
    };

    try {
      await createTransaction.mutateAsync(request);
      onOpenChange(false);
      resetForm();
    } catch (error) {
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

  const canSubmit = portfolioId && selectedAsset && quantity && pricePerUnit && !isOutsideBounds && !createTransaction.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background backdrop-blur-xl border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
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
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowChart(!showChart)}
                      className="h-7 px-2.5 text-[10px] flex items-center gap-1 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all active:scale-[0.98] font-bold"
                    >
                      <span>📈</span>
                      <span>{showChart ? t("hideChart") : t("viewChart")}</span>
                    </Button>
                    {!fixedAsset && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedAsset(null);
                          setShowChart(false);
                        }}
                        className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Change
                      </Button>
                    )}
                  </div>
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

            {/* Collapsible TradingView Chart drawer */}
            {selectedAsset && showChart && (
              <div className="col-span-2 p-1.5 rounded-xl border border-white/10 bg-muted/20 overflow-hidden animate-in slide-in-from-top duration-200">
                {loadingPrices ? (
                  <div className="h-[220px] flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <TradingViewChart
                    data={prices}
                    code={selectedAsset.symbol}
                    height={220}
                    theme="dark"
                  />
                )}
              </div>
            )}

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
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  {currencySymbol}
                </span>
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

            {/* Historical Price Bounds Slider */}
            {bounds && (
              <div className="space-y-4 col-span-2 p-4 rounded-xl bg-muted/30 border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">
                    {t("historicalRange", { 
                      symbol: selectedAsset?.symbol || "",
                      date: activeDayPrice ? format(new Date(activeDayPrice.date), "yyyy-MM-dd") : "",
                      range: `${currencySymbol}${bounds.low.toFixed(2)} - ${currencySymbol}${bounds.high.toFixed(2)}` 
                    })}
                  </span>
                  {activeDayPrice && (
                    <button
                      type="button"
                      onClick={() => setPricePerUnit(bounds.close.toString())}
                      className="text-primary hover:text-primary/80 transition-colors text-xs font-semibold"
                    >
                      {t("useClosePrice", { price: `${currencySymbol}${bounds.close.toFixed(2)}` })}
                    </button>
                  )}
                </div>

                {/* The Slider Component */}
                <div className="relative pt-6 pb-2">
                  {/* Labels for Slider min, max */}
                  {isToday ? (
                    <>
                      <div className="absolute top-0 left-0 text-[10px] text-amber-500/80 font-semibold font-mono">
                        -5% Buffer ({currencySymbol}{bounds.min.toFixed(2)})
                      </div>
                      <div className="absolute top-0 right-0 text-[10px] text-amber-500/80 font-semibold font-mono">
                        +5% Buffer ({currencySymbol}{bounds.max.toFixed(2)})
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute top-0 left-0 text-[10px] text-emerald-500/80 font-semibold font-mono">
                        {t("lowLabel")} ({currencySymbol}{bounds.min.toFixed(2)})
                      </div>
                      <div className="absolute top-0 right-0 text-[10px] text-emerald-500/80 font-semibold font-mono">
                        {t("highLabel")} ({currencySymbol}{bounds.max.toFixed(2)})
                      </div>
                    </>
                  )}

                  {/* Slider Track */}
                  <div className="relative h-2 w-full rounded-full bg-muted/80 overflow-hidden">
                    {/* Left Amber Buffer segment */}
                    <div 
                      className="absolute h-full bg-amber-500/20"
                      style={{ 
                        left: '0%', 
                        width: `${((bounds.low - bounds.min) / bounds.range) * 100}%` 
                      }}
                    />
                    {/* Center Green Range (actual High/Low bounds) */}
                    <div 
                      className="absolute h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      style={{ 
                        left: `${((bounds.low - bounds.min) / bounds.range) * 100}%`, 
                        width: `${((bounds.high - bounds.low) / bounds.range) * 100}%` 
                      }}
                    />
                    {/* Right Amber Buffer segment */}
                    <div 
                      className="absolute h-full bg-amber-500/20"
                      style={{ 
                        left: `${((bounds.high - bounds.min) / bounds.range) * 100}%`, 
                        width: `${((bounds.max - bounds.high) / bounds.range) * 100}%` 
                      }}
                    />
                  </div>

                  {/* Actual low and high tick marks on the track */}
                  <div 
                    className="absolute top-[22px] -translate-x-1/2 flex flex-col items-center pointer-events-none"
                    style={{ left: `${((bounds.low - bounds.min) / bounds.range) * 100}%` }}
                  >
                    <div className="w-0.5 h-1.5 bg-emerald-500" />
                  </div>

                  <div 
                    className="absolute top-[22px] -translate-x-1/2 flex flex-col items-center pointer-events-none"
                    style={{ left: `${((bounds.high - bounds.min) / bounds.range) * 100}%` }}
                  >
                    <div className="w-0.5 h-1.5 bg-emerald-500" />
                  </div>

                  {/* Styled range input layered over track for easy native dragging */}
                  <input
                    type="range"
                    min={bounds.min}
                    max={bounds.max}
                    step="any"
                    value={pricePerUnit ? parseFloat(pricePerUnit) || bounds.close : bounds.close}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                    className="absolute top-5 left-0 w-full h-4 opacity-0 cursor-pointer z-20 touch-none"
                    style={{ touchAction: 'none' }}
                  />

                  {/* Visible interactive handle that tracks the value */}
                  {(() => {
                    const val = pricePerUnit ? parseFloat(pricePerUnit) : bounds.close;
                    const percent = Math.min(Math.max(((val - bounds.min) / bounds.range) * 100, 0), 100);
                    const isOutOfTradingRange = val < bounds.low || val > bounds.high;
                    const isOutsideBuffers = val < bounds.min || val > bounds.max;

                    return (
                      <div 
                        className="absolute top-5 -translate-x-1/2 -translate-y-1 z-10 pointer-events-none"
                        style={{ left: `${percent}%` }}
                      >
                        {/* Expanded invisible touch bubble (44px) */}
                        <div className="w-11 h-11 -mt-[14px] -ml-[14px] rounded-full bg-transparent flex items-center justify-center pointer-events-none">
                          {/* Visible knob */}
                          <div 
                            className={cn(
                              "w-5 h-5 rounded-full border-2 bg-background shadow-lg transition-transform scale-100 hover:scale-110",
                              isOutsideBuffers
                                ? "border-destructive shadow-destructive/50"
                                : isOutOfTradingRange 
                                ? "border-amber-500 shadow-amber-500/50" 
                                : "border-emerald-500 shadow-emerald-500/50"
                            )}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Unified Range labels under the track to prevent overlap */}
                <div className="flex justify-between items-center text-[10px] text-emerald-500 font-semibold font-mono mt-4 px-1">
                  <span>{t("lowLabel")}: {currencySymbol}{bounds.low.toFixed(2)}</span>
                  <span className="text-muted-foreground">{t("closeLabel")}: {currencySymbol}{bounds.close.toFixed(2)}</span>
                  <span>{t("highLabel")}: {currencySymbol}{bounds.high.toFixed(2)}</span>
                </div>
                
                {/* Out of bounds warning display */}
                {(() => {
                  const val = pricePerUnit ? parseFloat(pricePerUnit) : null;
                  if (val === null || isNaN(val)) return null;
                  if (val < bounds.limitMin || val > bounds.limitMax) {
                    return (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2 animate-in fade-in duration-200">
                        <Info className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>
                          {isToday 
                            ? t("invalidPriceWarningLive") 
                            : t("invalidPriceWarningHistorical")}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}

            {/* Date */}
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

            {/* Currency Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Currency</Label>
              <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                <SelectTrigger className="bg-muted/50 border-white/5 h-11">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.value} - {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            {/* Total Price Summary */}
            {total !== null && (
              <div className="col-span-2 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                  <span>{t("subtotal")}</span>
                  <span>
                    {currencySymbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </span>
                </div>
                {parseFloat(fee) > 0 && (
                  <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                    <span>{transactionType === "BUY" ? t("feesAdded") : t("feesDeducted")}</span>
                    <span>
                      {transactionType === "BUY" ? "+" : "-"} {currencySymbol}{parseFloat(fee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </span>
                  </div>
                )}
                <div className="h-px bg-primary/10 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {transactionType === "BUY" ? t("totalCost") : t("totalProceeds")}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {currencySymbol}{totalWithFees?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {createTransaction.isError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-2 items-start animate-in slide-in-from-top-1">
              <Info className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">
                {(createTransaction.error as Error | null)?.message || "Failed to create transaction. Please check your inputs."}
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
