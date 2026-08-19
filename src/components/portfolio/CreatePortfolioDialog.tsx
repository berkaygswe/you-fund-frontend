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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useCreatePortfolio } from "@/hooks/usePortfolios";
import { Loader2, Plus, Globe, Sparkles } from "lucide-react";
import { SUPPORTED_CURRENCIES, Currency } from "@/types/currency";
import { useTranslations } from "next-intl";

interface CreatePortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePortfolioDialog({
  open,
  onOpenChange,
}: CreatePortfolioDialogProps) {
  const t = useTranslations("Portfolio.CreatePortfolioDialog");
  const [name, setName] = useState("");
  const [baseCurrency, setBaseCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0].value);
  const [initialCash, setInitialCash] = useState<string>("0");
  
  const currencySymbol = useMemo(() => {
    return SUPPORTED_CURRENCIES.find(c => c.value === baseCurrency)?.symbol || "$";
  }, [baseCurrency]);

  const createPortfolio = useCreatePortfolio();

  const resetForm = () => {
    setName("");
    setBaseCurrency(SUPPORTED_CURRENCIES[0].value);
    setInitialCash("0");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCash = parseFloat(initialCash);
    if (!name.trim() || !baseCurrency || isNaN(parsedCash) || parsedCash < 0) return;

    try {
      await createPortfolio.mutateAsync({ 
        name: name.trim(), 
        baseCurrency,
        initialCash: parsedCash,
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create portfolio", error);
    }
  };

  const isCashValid = !isNaN(parseFloat(initialCash)) && parseFloat(initialCash) >= 0;
  const canSubmit = name.trim().length > 0 && baseCurrency && isCashValid && !createPortfolio.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden bg-background backdrop-blur-xl border-white/10 shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          <div className="space-y-4">
            {/* Portfolio Name */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("nameLabel")}
              </Label>
              <Input 
                placeholder={t("namePlaceholder")} 
                className="h-11 bg-muted/50 border-white/5 focus-visible:ring-primary/30"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            {/* Base Currency */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("baseCurrencyLabel")}
              </Label>
              <Select value={baseCurrency} onValueChange={(value) => setBaseCurrency(value as Currency)}>
                <SelectTrigger className="bg-muted/50 border-white/5 h-11">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.value} - {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-1">
                <Globe className="h-3 w-3 text-primary/70 shrink-0" />
                {t("currencyNotice")}
              </p>
            </div>

            {/* Starting Capital */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>{t("startingCapitalLabel")}</span>
                <span className="text-[10px] text-muted-foreground font-normal">({baseCurrency})</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground select-none pointer-events-none">
                  {currencySymbol}
                </span>
                <Input 
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  className="h-11 pl-9 bg-muted/50 border-white/5 focus-visible:ring-primary/30"
                  value={initialCash}
                  onChange={(e) => setInitialCash(e.target.value)}
                />
              </div>
            </div>

            {/* Simulation Model Callout */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {t("simulationHint")}
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
              disabled={!canSubmit}
            >
              {createPortfolio.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("creating")}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("submit")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
