"use client";

import { useState, useMemo } from "react";
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
import { useCreateCashMovement } from "@/hooks/usePortfolios";
import { CashMovementType } from "@/types/portfolio";
import { Currency, SUPPORTED_CURRENCIES } from "@/types/currency";
import { ArrowDownLeft, ArrowUpRight, Loader2, Sparkles, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { AuthApiError } from "@/lib/auth-client";
import { generateIdempotencyKey } from "@/services/portfolioApi";

interface CashMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioId: number;
  currentCashBalance?: number;
  currency?: Currency;
}

export function CashMovementDialog({
  open,
  onOpenChange,
  portfolioId,
  currentCashBalance = 0,
  currency = "USD",
}: CashMovementDialogProps) {
  const t = useTranslations("Portfolio.CashMovementDialog");
  const [type, setType] = useState<CashMovementType>("DEPOSIT");
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currencySymbol = useMemo(() => {
    return SUPPORTED_CURRENCIES.find(c => c.value === currency)?.symbol || "$";
  }, [currency]);

  const createCashMovement = useCreateCashMovement(portfolioId);

  const resetForm = () => {
    setType("DEPOSIT");
    setAmount("");
    setNotes("");
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (type === "WITHDRAWAL" && parsedAmount > currentCashBalance) {
      setErrorMsg(t("insufficientCashForWithdrawal"));
      return;
    }

    const idempotencyKey = generateIdempotencyKey();

    try {
      await createCashMovement.mutateAsync({
        data: {
          type,
          amount: parsedAmount,
          notes: notes.trim() || undefined,
        },
        idempotencyKey,
      });

      onOpenChange(false);
      resetForm();
    } catch (error: unknown) {
      console.error("Failed to record cash movement", error);
      if (error instanceof AuthApiError) {
        setErrorMsg(error.data?.message || error.message || "Failed to process capital movement");
      } else if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Failed to process capital movement");
      }
    }
  };

  const parsedAmount = parseFloat(amount);
  const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0;
  const isWithdrawalExceeding = type === "WITHDRAWAL" && isAmountValid && parsedAmount > currentCashBalance;
  const canSubmit = isAmountValid && !isWithdrawalExceeding && !createCashMovement.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-background backdrop-blur-xl border-white/10 shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            {t("manageCapitalTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          {/* Movement Type Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-muted/40 p-1.5 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                setType("DEPOSIT");
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                type === "DEPOSIT"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowDownLeft className="h-4 w-4" />
              {t("addCapitalOption")}
            </button>

            <button
              type="button"
              onClick={() => {
                setType("WITHDRAWAL");
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                type === "WITHDRAWAL"
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowUpRight className="h-4 w-4" />
              {t("withdrawCapitalOption")}
            </button>
          </div>

          <div className="space-y-4">
            {/* Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <Label className="font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("amountLabel")}
                </Label>
                <span className="text-muted-foreground">
                  {t("availableSimulationCash", { 
                    amount: `${currentCashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}` 
                  })}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground select-none pointer-events-none">
                  {currencySymbol}
                </span>
                <Input
                  type="number"
                  step="any"
                  min="0.01"
                  placeholder="0.00"
                  className="h-11 pl-9 bg-muted/50 border-white/5 focus-visible:ring-primary/30"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
              </div>

              {isWithdrawalExceeding && (
                <p className="text-[11px] text-red-500 font-medium mt-1">
                  {t("insufficientCashForWithdrawal")}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("notesLabel")}
              </Label>
              <Input
                placeholder={t("notesPlaceholder")}
                className="h-11 bg-muted/50 border-white/5 focus-visible:ring-primary/30"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Simulation Model Hint */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {t("simulationHint")}
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              className={`w-full h-12 text-sm font-bold shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
                type === "DEPOSIT"
                  ? "shadow-primary/20"
                  : "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20"
              }`}
              disabled={!canSubmit}
            >
              {createCashMovement.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("submitting")}
                </>
              ) : type === "DEPOSIT" ? (
                <>
                  <ArrowDownLeft className="h-4 w-4 mr-2" />
                  {t("submitAddCapital")}
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  {t("submitWithdrawCapital")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
