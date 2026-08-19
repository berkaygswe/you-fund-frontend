"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InsufficientCashErrorData } from "@/types/portfolio";
import { useFormatCurrency } from "@/utils/formatCurrency";
import { AlertCircle, ArrowUpRight, Loader2, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

interface InsufficientCashDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorData: InsufficientCashErrorData | null;
  onConfirmAutoDeposit: () => void;
  isRetrying: boolean;
}

export function InsufficientCashDialog({
  open,
  onOpenChange,
  errorData,
  onConfirmAutoDeposit,
  isRetrying,
}: InsufficientCashDialogProps) {
  const t = useTranslations("Portfolio.InsufficientCashDialog");
  const formatCurrency = useFormatCurrency();

  if (!errorData) return null;

  const currency = errorData.currency || "USD";
  const formattedShortfall = `${errorData.shortfall.toFixed(2)} ${currency}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-background backdrop-blur-xl border-amber-500/20 shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {t("title")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {t("message", { currency })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-3 space-y-3">
          <div className="bg-muted/40 border border-white/5 rounded-2xl p-4 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5" />
                {t("availableSimulationCash")}
              </span>
              <span className="font-semibold text-foreground">
                {formatCurrency(errorData.available)} ({currency})
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">
                {t("required")}
              </span>
              <span className="font-semibold text-foreground">
                {formatCurrency(errorData.required)} ({currency})
              </span>
            </div>

            <div className="border-t border-white/10 pt-2.5 flex justify-between items-center">
              <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                <ArrowUpRight className="h-4 w-4" />
                {t("shortfall")}
              </span>
              <span className="text-sm font-black text-amber-500">
                {formatCurrency(errorData.shortfall)} ({currency})
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground px-1">
            {t("question", { shortfall: errorData.shortfall.toFixed(2), currency, formattedShortfall })}
          </p>
        </div>

        <DialogFooter className="p-6 pt-2 gap-2 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 rounded-xl text-xs font-semibold cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={isRetrying}
          >
            {t("cancel")}
          </Button>

          <Button
            type="button"
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
            onClick={onConfirmAutoDeposit}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ArrowUpRight className="h-4 w-4 mr-1.5" />
            )}
            {t("confirmAutoDeposit", { shortfall: errorData.shortfall.toFixed(2), currency, formattedShortfall })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
