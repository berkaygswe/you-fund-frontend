"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { TransactionDialog } from "./TransactionDialog";
import { AssetSummary } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Portfolio");

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && status !== "authenticated") {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setIsOpen(newOpen);
  };

  return (
    <>
      <Button
        variant={variant}
        size={showIconOnly ? "icon" : "sm"}
        className={cn("gap-2 shadow-sm cursor-pointer", className)}
        onClick={() => handleOpenChange(true)}
      >
        <Wallet className="h-4 w-4" />
        {!showIconOnly && <span>{t("addToPortfolio")}</span>}
      </Button>

      <TransactionDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        fixedAsset={asset}
      />
    </>
  );
}
