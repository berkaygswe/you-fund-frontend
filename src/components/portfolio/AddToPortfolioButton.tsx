"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Plus } from "lucide-react";
import { TransactionDialog } from "./TransactionDialog";
import { AssetSummary } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface AddToPortfolioButtonProps {
  asset: AssetSummary;
  variant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
  showIconOnly?: boolean;
}

export function AddToPortfolioButton({
  asset,
  variant = "outline",
  className,
  showIconOnly = false,
}: AddToPortfolioButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={showIconOnly ? "icon" : "sm"}
        className={cn("gap-2 shadow-sm", className)}
        onClick={() => setIsOpen(true)}
      >
        <Wallet className="h-4 w-4" />
        {!showIconOnly && <span>Add to Portfolio</span>}
      </Button>

      <TransactionDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        fixedAsset={asset}
      />
    </>
  );
}
