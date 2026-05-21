"use client";

import { useState } from "react";
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
import { Loader2, Plus, Globe } from "lucide-react";
import { SUPPORTED_CURRENCIES, Currency } from "@/types/currency";

interface CreatePortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePortfolioDialog({
  open,
  onOpenChange,
}: CreatePortfolioDialogProps) {
  const [name, setName] = useState("");
  const [baseCurrency, setBaseCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0].value);
  const createPortfolio = useCreatePortfolio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !baseCurrency) return;

    try {
      await createPortfolio.mutateAsync({ name, baseCurrency });
      onOpenChange(false);
      setName("");
      setBaseCurrency(SUPPORTED_CURRENCIES[0].value);
    } catch (error) {
      console.error("Failed to create portfolio", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-background backdrop-blur-xl border-white/10 shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            New Portfolio
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Portfolio Name</Label>
              <Input 
                placeholder="e.g. Retirement, High Growth, Crypto" 
                className="h-11 bg-muted/50 border-white/5 focus-visible:ring-primary/30"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Base Currency</Label>
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
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                <Globe className="h-3 w-3" />
                This will be the default currency for PnL calculations.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              disabled={!name || createPortfolio.isPending}
            >
              {createPortfolio.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Portfolio
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
