"use client";

import { useMemo, useState } from "react";
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
import { AssetSummary, TransactionType } from "@/types/portfolio";
import { usePortfolios, useCreateTransaction } from "@/hooks/usePortfolios";
import { useQueryClient } from "@tanstack/react-query";
import { useAssetSearch } from "@/hooks/useAssetSearch";
import { AssetSearchResult } from "@/types/assetSearchResult";
import { Loader2, Search, Plus, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import debounce from "lodash.debounce";
import { useTranslations } from "next-intl";
import { useFetchFundGraph } from "@/hooks/useFetchFundPrice";
import { TradingViewChart } from "@/components/asset-detail/TradingViewChart";
import { InsufficientCashDialog } from "./InsufficientCashDialog";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { useCurrency } from "@/hooks/useCurrency";
import { Money } from "@/lib/format/Money";
import { useFormatters } from "@/lib/format/use-formatters";
import {
  computeTradeTotals,
  resolveQuoteCurrency,
  validateTradeForm,
  type TradeFieldErrorCode,
  type TradeFormValues,
  type TradeValidationContext,
} from "@/features/portfolio/trade-intake/trade-form";
import { findTradeDayPriceRange } from "@/features/portfolio/trade-intake/price-range";
import { useTradeIntake } from "@/features/portfolio/trade-intake/use-trade-intake";
import type { TradeSubmitError } from "@/features/portfolio/trade-intake/submit-error";

const PRICE_HISTORY_YEARS = 5;

const nowAsPickerValue = () => format(new Date(), "yyyy-MM-dd'T'HH:mm");

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
  const formatters = useFormatters();
  const queryClient = useQueryClient();
  const { data: portfolios } = usePortfolios(useCurrency());

  const [portfolioId, setPortfolioId] = useState<string>(initialPortfolioId?.toString() || "");
  const [transactionType, setTransactionType] = useState<TransactionType>("BUY");
  const [selectedAsset, setSelectedAsset] = useState<AssetSummary | null>(fixedAsset || null);
  const [quantity, setQuantity] = useState<string>("");
  const [pricePerUnit, setPricePerUnit] = useState<string>("");
  const [fee, setFee] = useState<string>("0");
  const [transactionDate, setTransactionDate] = useState<string>(nowAsPickerValue);
  const [notes, setNotes] = useState<string>("");
  const [showChart, setShowChart] = useState(false);

  // Asset Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { searchResults, loading: searchLoading } = useAssetSearch(debouncedSearchTerm, null, 15);
  const createTransaction = useCreateTransaction(Number(portfolioId));

  const selectedPortfolio = useMemo(() =>
    portfolios?.find(p => p.id.toString() === portfolioId),
    [portfolios, portfolioId]
  );

  // Null when the asset has no known currency: trading is blocked rather than guessed.
  const quoteCurrency = selectedAsset ? resolveQuoteCurrency(selectedAsset) : null;

  const priceHistoryWindow = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setFullYear(end.getFullYear() - PRICE_HISTORY_YEARS);
    return { start: format(start, "yyyy-MM-dd"), end: format(end, "yyyy-MM-dd") };
  }, []);

  const { prices, loading: loadingPrices } = useFetchFundGraph(
    selectedAsset?.id || "",
    priceHistoryWindow.start,
    priceHistoryWindow.end,
    quoteCurrency
  );

  const priceRange = useMemo(
    () => (transactionDate && prices?.length ? findTradeDayPriceRange(prices, transactionDate.substring(0, 10)) : null),
    [prices, transactionDate]
  );

  const formValues: TradeFormValues = {
    portfolioId: portfolioId ? Number(portfolioId) : null,
    asset: selectedAsset,
    transactionType,
    quantity,
    pricePerUnit,
    fee,
    transactionDate,
    notes,
  };
  const validationContext: TradeValidationContext = {
    now: new Date(),
    priceRange,
    portfolioRevision: selectedPortfolio?.revision,
  };
  const validation = validateTradeForm(formValues, validationContext);
  const fieldErrors = validation.ok ? {} : validation.errors;
  const totals = computeTradeTotals(formValues);

  const resetForm = () => {
    if (!fixedAsset) setSelectedAsset(null);
    setQuantity("");
    setPricePerUnit("");
    setFee("0");
    setNotes("");
    setTransactionDate(nowAsPickerValue());
  };

  const intake = useTradeIntake({
    submitTrade: (request, idempotencyKey) => createTransaction.mutateAsync({ data: request, idempotencyKey }),
    onSuccess: () => {
      onOpenChange(false);
      resetForm();
    },
    onStaleRevision: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolioOverview', Number(portfolioId)] });
      queryClient.invalidateQueries({ queryKey: ['portfolioHoldings', Number(portfolioId)] });
    },
  });

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
      type: asset.type,
      currency: asset.currency
    });
    setSearchTerm("");
    setDebouncedSearchTerm("");
    intake.clearError();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void intake.submit(formValues, validationContext);
  };

  const submitErrorText = (error: TradeSubmitError | null): string | null => {
    if (!error) return null;
    switch (error.kind) {
      case "staleRevision": return t("staleRevisionNotice");
      case "insufficientHoldings": return t("insufficientHoldingsError");
      case "settlementUnavailable": return t("settlementUnavailableError");
      case "unknownOutcome": return t("unknownOutcomeError");
      case "rejected": return error.message ?? t("generalError");
      case "insufficientCash": return t("generalError");
    }
  };

  // Field errors appear once the user has typed something; empty required
  // fields only disable the submit button. Price-range errors have their own panel.
  const fieldErrorText = (code: TradeFieldErrorCode | undefined, rawValue: string): string | null => {
    if (!code || code === "required" || code === "outsidePriceRange" || rawValue.trim() === "") return null;
    return t(`fieldErrors.${code}`);
  };

  const formatQuotePrice = (amount: number) =>
    formatters.money(amount, { currency: quoteCurrency ?? undefined, unitPrice: true });

  const isFundingStep = intake.status === "awaitingFundingDecision" || intake.status === "submittingWithFunding";
  const canSubmit = validation.ok && !intake.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background backdrop-blur-xl border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              {transactionType === 'BUY' ? t("addPositionTitle") : t("recordSaleTitle")}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Portfolio Selection */}
              <div className="space-y-2 col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("portfolioLabel")}</Label>
                <Select value={portfolioId} onValueChange={(val) => {
                  setPortfolioId(val);
                  intake.clearError();
                }}>
                  <SelectTrigger className="bg-muted/50 border-white/5 h-11">
                    <SelectValue placeholder={t("selectPortfolioPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios?.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {/* Trades settle against base-currency cash, so show the base amount here. */}
                        {p.name} ({p.baseCurrency}) - {t("cashPrefix")}: <Money amount={p.cashBalance} currency={p.baseCurrency} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Asset Selection */}
              <div className="space-y-2 col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("assetLabel")}</Label>
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
                        className="h-7 px-2.5 text-[10px] flex items-center gap-1 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all active:scale-[0.98] font-bold cursor-pointer"
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
                          className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          {t("changeAsset")}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={t("searchPlaceholder")} 
                      className="pl-10 h-11 bg-muted/50 border-white/5 focus-visible:ring-primary/30"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    {debouncedSearchTerm && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="max-h-60 overflow-y-auto overscroll-contain">
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
                                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer"
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
                            <div className="p-8 text-center text-xs text-muted-foreground">{t("noAssetsFound")}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedAsset && fieldErrors.asset === "currencyUnknown" && (
                <div className="col-span-2">
                  <FieldError message={t("fieldErrors.currencyUnknown")} />
                </div>
              )}

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
                  onClick={() => {
                    setTransactionType("BUY");
                    intake.clearError();
                  }}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                    transactionType === "BUY" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t("buyAdd")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTransactionType("SELL");
                    intake.clearError();
                  }}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                    transactionType === "SELL" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t("sellRemove")}
                </button>
              </div>

              {/* Quantity & Price */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("quantityLabel")}</Label>
                <Input 
                  type="number" 
                  step="any"
                  placeholder="0.00" 
                  className="h-11 bg-muted/50 border-white/5"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    intake.clearError();
                  }}
                  aria-invalid={!!fieldErrorText(fieldErrors.quantity, quantity)}
                />
                <FieldError message={fieldErrorText(fieldErrors.quantity, quantity)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("pricePerUnitLabel")}</Label>
                  {selectedAsset && (
                    <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 border-white/10 text-muted-foreground">
                      {quoteCurrency ?? "—"}
                    </Badge>
                  )}
                </div>
                <div className="relative">
                  <Input 
                    type="number" 
                    step="any"
                    placeholder="0.00" 
                    className="pr-12 h-11 bg-muted/50 border-white/5"
                    value={pricePerUnit}
                    onChange={(e) => {
                      setPricePerUnit(e.target.value);
                      intake.clearError();
                    }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground font-mono pointer-events-none">
                    {quoteCurrency ?? "—"}
                  </span>
                </div>
                <FieldError message={fieldErrorText(fieldErrors.pricePerUnit, pricePerUnit)} />
              </div>

              {/* Trade-day price range: the price must fall inside the day's low-high */}
              {priceRange && (() => {
                const span = priceRange.high - priceRange.low;
                const enteredPrice = Number(pricePerUnit);
                const sliderValue = pricePerUnit && Number.isFinite(enteredPrice) ? enteredPrice : priceRange.close;
                const percent = span > 0
                  ? Math.min(Math.max(((sliderValue - priceRange.low) / span) * 100, 0), 100)
                  : 50;
                const isOutOfRange = fieldErrors.pricePerUnit === "outsidePriceRange";

                return (
                  <div className="space-y-4 col-span-2 p-4 rounded-xl bg-muted/30 border border-white/5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-medium">
                        {t("historicalRange", {
                          symbol: selectedAsset?.symbol || "",
                          date: priceRange.date,
                          range: `${formatQuotePrice(priceRange.low)} - ${formatQuotePrice(priceRange.high)}`,
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPricePerUnit(priceRange.close.toString());
                          intake.clearError();
                        }}
                        className="text-primary hover:text-primary/80 transition-colors text-xs font-semibold cursor-pointer"
                      >
                        {t("useClosePrice", { price: formatQuotePrice(priceRange.close) })}
                      </button>
                    </div>

                    <div className="relative pt-6 pb-2">
                      <div className="relative h-2 w-full rounded-full bg-muted/80 overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      </div>

                      <input
                        type="range"
                        min={priceRange.low}
                        max={priceRange.high}
                        step="any"
                        value={sliderValue}
                        onChange={(e) => {
                          setPricePerUnit(e.target.value);
                          intake.clearError();
                        }}
                        aria-label={t("pricePerUnitLabel")}
                        className="absolute top-5 left-0 w-full h-4 opacity-0 cursor-pointer z-20 touch-none"
                        style={{ touchAction: 'none' }}
                      />

                      <div
                        className="absolute top-5 -translate-x-1/2 -translate-y-1 z-10 pointer-events-none"
                        style={{ left: `${percent}%` }}
                      >
                        <div className="w-11 h-11 -mt-[14px] -ml-[14px] rounded-full bg-transparent flex items-center justify-center pointer-events-none">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 bg-background shadow-lg transition-transform scale-100 hover:scale-110",
                              isOutOfRange
                                ? "border-destructive shadow-destructive/50"
                                : "border-emerald-500 shadow-emerald-500/50"
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-emerald-500 font-semibold font-mono mt-4 px-1">
                      <span>{t("lowLabel")}: {formatQuotePrice(priceRange.low)}</span>
                      <span className="text-muted-foreground">{t("closeLabel")}: {formatQuotePrice(priceRange.close)}</span>
                      <span>{t("highLabel")}: {formatQuotePrice(priceRange.high)}</span>
                    </div>

                    {isOutOfRange && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2 animate-in fade-in duration-200">
                        <Info className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{t("invalidPriceWarningHistorical")}</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Date */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("dateLabel")}</Label>
                <DateTimePicker 
                  value={transactionDate}
                  onChange={(val) => {
                    setTransactionDate(val);
                    intake.clearError();
                  }}
                />
                <FieldError message={fieldErrorText(fieldErrors.transactionDate, transactionDate)} />
              </div>

              {/* Fees */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("feesLabel")}</Label>
                  {selectedAsset && (
                    <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 border-white/10 text-muted-foreground">
                      {quoteCurrency ?? "—"}
                    </Badge>
                  )}
                </div>
                <div className="relative">
                  <Input 
                    type="number" 
                    step="any"
                    placeholder="0.00" 
                    className="pr-12 h-11 bg-muted/50 border-white/5"
                    value={fee}
                    onChange={(e) => {
                      setFee(e.target.value);
                      intake.clearError();
                    }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground font-mono pointer-events-none">
                    {quoteCurrency ?? "—"}
                  </span>
                </div>
                <FieldError message={fieldErrorText(fieldErrors.fee, fee)} />
              </div>

              {/* Notes */}
              <div className="space-y-2 col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("notesLabel")}</Label>
                <Input 
                  placeholder={t("notesPlaceholder")} 
                  className="h-11 bg-muted/50 border-white/5"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Total Price Summary (preview; the backend settles the authoritative amount) */}
              {totals && quoteCurrency && (
                <div className="col-span-2 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                    <span>{t("subtotal")}</span>
                    <Money amount={totals.subtotal} currency={quoteCurrency} />
                  </div>
                  {totals.fee > 0 && (
                    <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                      <span>{transactionType === "BUY" ? t("feesAdded") : t("feesDeducted")}</span>
                      <span>
                        {transactionType === "BUY" ? "+" : "-"} <Money amount={totals.fee} currency={quoteCurrency} />
                      </span>
                    </div>
                  )}
                  <div className="h-px bg-primary/10 my-1" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {transactionType === "BUY" ? t("totalCost") : t("totalProceeds")}
                    </span>
                    <Money amount={totals.total} currency={quoteCurrency} className="text-lg font-bold text-primary" />
                  </div>
                </div>
              )}
            </div>

            {!isFundingStep && intake.error && (
              <div role="alert" className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-2 items-start animate-in slide-in-from-top-1">
                <Info className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive">
                  {submitErrorText(intake.error)}
                </p>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
                disabled={!canSubmit}
              >
                {intake.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {transactionType === 'BUY' ? t("submitBuy") : t("submitSell")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <InsufficientCashDialog
        open={isFundingStep}
        onOpenChange={(isOpen) => {
          if (!isOpen) intake.declineAutoDeposit();
        }}
        errorData={intake.shortfall}
        onConfirmAutoDeposit={() => void intake.confirmAutoDeposit()}
        isRetrying={intake.status === "submittingWithFunding"}
        errorMessage={isFundingStep ? submitErrorText(intake.error) : null}
      />
    </>
  );
}

function FieldError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p role="alert" className="text-[11px] text-destructive">{message}</p>;
}
