"use client";

import { useState, useEffect } from "react";
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
import { useUpdatePortfolio } from "@/hooks/usePortfolios";
import { Loader2, Save } from "lucide-react";
import { useTranslations } from "next-intl";

interface EditPortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioId: number;
  initialName: string;
}

export function EditPortfolioDialog({
  open,
  onOpenChange,
  portfolioId,
  initialName,
}: EditPortfolioDialogProps) {
  const t = useTranslations("Portfolio.EditPortfolioDialog");
  const [name, setName] = useState(initialName);
  const updatePortfolio = useUpdatePortfolio();

  // Reset to initialName when dialog opens or changes
  useEffect(() => {
    if (open) {
      setName(initialName);
    }
  }, [open, initialName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await updatePortfolio.mutateAsync({
        id: portfolioId,
        data: { name: name.trim() }
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update portfolio name", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-background backdrop-blur-xl border-white/10 shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("nameLabel")}
              </Label>
              <Input 
                placeholder={t("placeholder")} 
                className="h-11 bg-muted/50 border-white/5 focus-visible:ring-primary/30"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              disabled={!name.trim() || updatePortfolio.isPending}
            >
              {updatePortfolio.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {updatePortfolio.isPending ? t("saving") : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
