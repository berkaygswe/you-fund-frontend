"use client";

import { WatchlistAssetWithPriceResponse } from "@/types/watchlist";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Search, ArrowRight, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFormatCurrency } from "@/utils/formatCurrency";

interface WatchlistTableProps {
    assets?: WatchlistAssetWithPriceResponse[];
    isLoading: boolean;
    period: string;
    onRemoveAsset?: (symbol: string) => void;
    isRemoving?: boolean;
}

export default function WatchlistTable({ assets, isLoading, period, onRemoveAsset, isRemoving }: WatchlistTableProps) {
    const formatCurrency = useFormatCurrency();

    if (isLoading) {
        return (
            <div className="p-0">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4 py-4 px-6 border-b border-border/30 last:border-0">
                        <Skeleton className="h-10 w-10 rounded-xl bg-muted/30" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[100px] bg-muted/30" />
                            <Skeleton className="h-3 w-[60px] bg-muted/30" />
                        </div>
                        <Skeleton className="h-6 w-[80px] bg-muted/30" />
                    </div>
                ))}
            </div>
        );
    }

    if (!assets || assets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-3 mb-4 rounded-xl border border-border/50 bg-muted/5">
                    <Search className="h-5 w-5 text-muted-foreground/40" />
                </div>
                <h3 className="text-sm font-medium">Empty List</h3>
                <p className="text-[13px] text-muted-foreground max-w-xs mx-auto mt-1">
                    Find assets and add them to this watchlist.
                </p>
                <Link href="/markets" className="mt-4 text-[13px] font-medium text-primary hover:underline">
                    Explore Markets
                </Link>
            </div>
        );
    }

    const getChangeData = (asset: WatchlistAssetWithPriceResponse) => {
        switch (period) {
            case "1m":
                return asset.monthlyChangePercent;
            case "1y":
                return asset.yearlyChangePercent;
            case "ytd":
                return asset.ytdChangePercent;
            case "1d":
            default:
                return asset.dailyChangePercent;
        }
    };

    return (
        <div className="overflow-x-auto w-full">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-background/80 backdrop-blur-md">
                    <TableRow className="hover:bg-transparent border-b border-border/30">
                        <TableHead className="w-[300px] h-10 px-6 font-medium text-[12px] text-muted-foreground">Asset</TableHead>
                        <TableHead className="h-10 px-6 font-medium text-[12px] text-muted-foreground text-right w-[180px]">Price</TableHead>
                        <TableHead className="h-10 px-6 font-medium text-[12px] text-muted-foreground text-right w-[150px]">Change ({period.toUpperCase()})</TableHead>
                        <TableHead className="h-10 px-6 font-medium text-[12px] text-muted-foreground text-right w-[150px]">Volume</TableHead>
                        <TableHead className="h-10 px-4 w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assets.map((asset) => {
                        const changePercent = getChangeData(asset);
                        const isPositive = (changePercent ?? 0) >= 0;
                        const formattedChange = changePercent !== undefined && changePercent !== null
                            ? Math.abs(changePercent).toFixed(2)
                            : "0.00";

                        return (
                            <TableRow key={asset.id} className="group hover:bg-muted/30 transition-colors border-border/30 border-b last:border-0 h-16">
                                <TableCell className="px-6 py-2">
                                    <Link href={`/${asset.assetType?.toLowerCase() || 'fund'}/detail/${asset.symbol}`} className="flex items-center gap-4">
                                        <div className="relative h-9 w-9 flex-shrink-0 bg-background rounded-lg border border-border/50 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                                            {asset.iconUrl ? (
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/logo/${asset.assetType?.toLowerCase() || 'fund'}/${asset.iconUrl}`}
                                                    alt={asset.assetName}
                                                    width={24}
                                                    height={24}
                                                    className="object-contain"
                                                />
                                            ) : (
                                                <div className="text-[10px] font-semibold text-muted-foreground/60">{asset.symbol.substring(0, 3)}</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-semibold tracking-tight truncate group-hover:text-primary transition-colors">{asset.symbol}</span>
                                            <span className="text-[12px] text-muted-foreground truncate">{asset.assetName}</span>
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell className="px-6 py-2 text-right">
                                    <span className="font-mono text-[13px] font-medium tracking-tight">
                                        {formatCurrency(asset.price)}
                                    </span>
                                </TableCell>
                                <TableCell className="px-6 py-2 text-right">
                                    <div className={cn(
                                        "inline-flex items-center justify-end gap-1.5 font-mono text-[13px] font-medium tracking-tight",
                                        isPositive ? "text-[#10B981]" : "text-[#EF4444]"
                                    )}>
                                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {isPositive ? '+' : '-'}{formattedChange}%
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-2 text-right">
                                    <span className="font-mono text-[13px] text-muted-foreground tracking-tight">
                                        {new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(asset.volume || 0)}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-2 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                                            onClick={() => onRemoveAsset?.(asset.symbol)}
                                            disabled={isRemoving}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Link href={`/${asset.assetType?.toLowerCase() || 'fund'}/detail/${asset.symbol}`} className="p-2 inline-flex items-center justify-center rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-muted/50 transition-colors">
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
