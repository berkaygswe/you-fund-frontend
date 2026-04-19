"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { watchlistApi } from "@/services/watchlistApi";
import { WatchlistResponse } from "@/types/watchlist";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import WatchlistTable from "./watchlist-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrencyStore } from "@/stores/currency-store";
import { useAuth } from "@/hooks/useAuth";
import { UUID } from "crypto";

function WatchlistSection({ watchlist, period }: { watchlist: WatchlistResponse; period: string }) {
    const queryClient = useQueryClient();
    const currency = useCurrencyStore((s) => s.currency);
    const { status } = useAuth();

    const { data: assets, isLoading } = useQuery({
        queryKey: ['watchlist-assets', watchlist.id, currency],
        queryFn: () => watchlistApi.getWatchlistAssetsWithPrices(watchlist.id, currency),
        enabled: status === 'authenticated'
    });

    const removeAssetMutation = useMutation({
        mutationFn: (assetId: UUID) => watchlistApi.removeAssetFromWatchlist(watchlist.id, assetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist-assets', watchlist.id] });
            queryClient.invalidateQueries({ queryKey: ['watchlists'] }); // To update item count
        }
    });

    const handleRemoveAsset = (assetId: UUID) => {
        if (window.confirm(`Are you sure you want to remove ${assetId} from this watchlist?`)) {
            removeAssetMutation.mutate(assetId);
        }
    };

    return <WatchlistTable assets={assets} isLoading={isLoading} period={period} onRemoveAsset={handleRemoveAsset} isRemoving={removeAssetMutation.isPending} />;
}

export default function WatchlistDashboard() {
    const [activePeriod, setActivePeriod] = useState<string>("1d");
    const [isCreatingWatchlist, setIsCreatingWatchlist] = useState(false);
    const [newWatchlistName, setNewWatchlistName] = useState("");
    const queryClient = useQueryClient();
    const { status } = useAuth();

    const { data: watchlists, isLoading: isLoadingWatchlists } = useQuery({
        queryKey: ['watchlists'],
        queryFn: () => watchlistApi.getUserWatchlists(),
        enabled: status === 'authenticated'
    });

    const createMutation = useMutation({
        mutationFn: () => watchlistApi.createWatchlist({ name: newWatchlistName }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlists'] });
            setIsCreatingWatchlist(false);
            setNewWatchlistName("");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => watchlistApi.deleteWatchlist(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlists'] });
        }
    });

    const handleCreate = () => {
        if (!newWatchlistName.trim() || createMutation.isPending) return;
        createMutation.mutate();
    };

    const handleDeleteWatchlist = (e: React.MouseEvent, id: number, name: string) => {
        e.stopPropagation();
        e.preventDefault();
        if (window.confirm(`Are you sure you want to delete the watchlist "${name}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleCreate();
        if (e.key === 'Escape') setIsCreatingWatchlist(false);
    };

    const defaultOpen = watchlists?.map(w => w.id.toString()) || [];

    // Show skeletons while either the auth is loading or the watchlists are loading
    const showLoading = status === 'loading' || isLoadingWatchlists;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/30 pb-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Watchlists</h2>
                    <p className="text-[13px] text-muted-foreground/80">Monitor and manage your favorite assets across personalized lists.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Tabs value={activePeriod} onValueChange={setActivePeriod} className="w-auto">
                        <TabsList className="h-8 bg-muted/50 border border-border/30">
                            <TabsTrigger value="1d" className="text-[11px] font-medium px-3 h-6 rounded-sm">1D</TabsTrigger>
                            <TabsTrigger value="1m" className="text-[11px] font-medium px-3 h-6 rounded-sm">1M</TabsTrigger>
                            <TabsTrigger value="1y" className="text-[11px] font-medium px-3 h-6 rounded-sm">1Y</TabsTrigger>
                            <TabsTrigger value="ytd" className="text-[11px] font-medium px-3 h-6 rounded-sm">YTD</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCreatingWatchlist(true)}
                        className="h-8 gap-2 text-xs border-border/30 shadow-none hover:bg-muted/50"
                        disabled={status !== 'authenticated'}
                    >
                        <Plus className="h-3.5 w-3.5" />
                        New
                    </Button>
                </div>
            </div>

            {isCreatingWatchlist && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border border-border/40 rounded-xl bg-muted/10 animate-in slide-in-from-top-2">
                    <input
                        autoFocus
                        placeholder="Watchlist name..."
                        value={newWatchlistName}
                        onChange={(e) => setNewWatchlistName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex h-9 w-full sm:w-[250px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={createMutation.isPending}
                    />
                    <div className="flex items-center gap-2">
                        <Button size="sm" onClick={handleCreate} disabled={!newWatchlistName.trim() || createMutation.isPending} className="h-9 transition-all">
                            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsCreatingWatchlist(false)} disabled={createMutation.isPending} className="h-9">
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {showLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-14 w-full rounded-xl bg-muted/30" />
                    <Skeleton className="h-48 w-full rounded-xl bg-muted/30" />
                </div>
            ) : status === 'unauthenticated' ? (
                <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl border-dashed border-border/50 bg-muted/10">
                    <h3 className="text-sm font-semibold tracking-tight">Authentication Required</h3>
                    <p className="text-[13px] text-muted-foreground max-w-xs mx-auto mt-1 mb-6">
                        Please sign in to view and manage your watchlists.
                    </p>
                </div>
            ) : watchlists && watchlists.length > 0 ? (
                <Accordion type="multiple" defaultValue={defaultOpen} className="w-full space-y-6">
                    {watchlists.map((wl) => (
                        <AccordionItem key={wl.id} value={wl.id.toString()} className="border border-border/40 rounded-xl bg-card shadow-sm overflow-hidden transition-all hover:border-border/60">
                            <div className="flex items-center justify-between bg-muted/10 pr-4">
                                <AccordionTrigger className="px-6 py-4 hover:no-underline flex-1 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-sm font-semibold text-foreground tracking-tight">{wl.name}</h3>
                                        <span className="text-[10px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-full font-medium border border-border/40">{wl.itemCount || 0}</span>
                                    </div>
                                </AccordionTrigger>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                                    onClick={(e) => handleDeleteWatchlist(e, wl.id, wl.name)}
                                    disabled={deleteMutation.isPending}
                                >
                                    {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                </Button>
                            </div>
                            <AccordionContent className="pt-0 pb-0 border-t border-border/40">
                                <div className="bg-background">
                                    <WatchlistSection watchlist={wl} period={activePeriod} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl border-dashed border-border/50 bg-muted/10">
                    <div className="p-3 rounded-xl bg-background border border-border/50 shadow-sm mb-4">
                        <Plus className="h-6 w-6 text-muted-foreground/60" />
                    </div>
                    <h3 className="text-sm font-semibold tracking-tight">No watchlists yet</h3>
                    <p className="text-[13px] text-muted-foreground max-w-xs mx-auto mt-1 mb-6">
                        Create your first watchlist to start tracking assets.
                    </p>
                    {isCreatingWatchlist ? null : (
                        <Button variant="default" size="sm" onClick={() => setIsCreatingWatchlist(true)} className="gap-2 text-xs shadow-sm">
                            <Plus className="h-3.5 w-3.5" />
                            Create Watchlist
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
