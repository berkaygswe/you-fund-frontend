"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { watchlistApi } from '@/services/watchlistApi';
import { WatchlistResponse } from '@/types/watchlist';
import { Bookmark, Plus, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface AddToWatchlistButtonProps {
    symbol: string;
    assetId: string;
}

export default function AddToWatchlistButton({ symbol, assetId }: AddToWatchlistButtonProps) {
    const { status } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [open, setOpen] = useState(false);
    const [watchlists, setWatchlists] = useState<WatchlistResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newWatchlistName, setNewWatchlistName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isAdding, setIsAdding] = useState<number | null>(null);
    const [addedWatchlistIds, setAddedWatchlistIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (open && status === 'authenticated') {
            loadWatchlists();
        }
    }, [open, status]);

    const loadWatchlists = async () => {
        setIsLoading(true);
        try {
            const data = await watchlistApi.getUserWatchlists();
            setWatchlists(data);

            // Fetch items for each watchlist to determine if the current asset is already added
            const addedIds = new Set<number>();
            await Promise.all(data.map(async (wl) => {
                try {
                    const items = await watchlistApi.getWatchlistItems(wl.id);
                    if (items.some(item => item.assetId === assetId || item.symbol === symbol)) {
                        addedIds.add(wl.id);
                    }
                } catch (err) {
                    console.error(`Failed to load items for watchlist ${wl.id}`, err);
                }
            }));
            
            setAddedWatchlistIds(addedIds);
        } catch (error) {
            console.error("Failed to load watchlists", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (newOpen && status !== 'authenticated') {
            // Redirect to login if unauthenticated
            // Usually login paths accept a callbackUrl or redirect
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }
        setOpen(newOpen);
        if (!newOpen) {
            setNewWatchlistName('');
        }
    };

    const handleCreateWatchlist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWatchlistName.trim() || isCreating) return;

        setIsCreating(true);
        try {
            const newWatchlist = await watchlistApi.createWatchlist({ name: newWatchlistName.trim() });
            setWatchlists([...watchlists, newWatchlist]);
            setNewWatchlistName('');

            // Automatically add the item to the new watchlist
            await handleAddToWatchlist(newWatchlist.id);
        } catch (error) {
            console.error("Failed to create watchlist", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleAddToWatchlist = async (watchlistId: number) => {
        if (isAdding === watchlistId || addedWatchlistIds.has(watchlistId)) return;
        setIsAdding(watchlistId);
        try {
            await watchlistApi.addAssetToWatchlist(watchlistId, symbol);
            setAddedWatchlistIds(prev => {
                const newSet = new Set(prev);
                newSet.add(watchlistId);
                return newSet;
            });
            // We could optionally close the popover here or just show a checkmark
            // setTimeout(() => setOpen(false), 1000);
        } catch (error) {
            console.error("Failed to add to watchlist", error);
        } finally {
            setIsAdding(null);
        }
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Bookmark className="h-4 w-4" />
                    <span>Watchlist</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
                <div className="flex flex-col gap-4">
                    <h4 className="font-semibold text-sm leading-none">Add to Watchlist</h4>

                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                            {watchlists.length === 0 ? (
                                <p className="text-sm text-center text-muted-foreground p-2">
                                    No watchlists found. Create one below.
                                </p>
                            ) : (
                                watchlists.map((wl) => {
                                    const isAdded = addedWatchlistIds.has(wl.id);
                                    return (
                                        <div key={wl.id} className="flex items-center justify-between gap-2 p-1">
                                            <span className="text-sm truncate" title={wl.name}>{wl.name}</span>
                                            <Button
                                                variant={isAdded ? "secondary" : "ghost"}
                                                size="sm"
                                                className="h-7 px-2"
                                                onClick={() => handleAddToWatchlist(wl.id)}
                                                disabled={isAdded || isAdding === wl.id}
                                            >
                                                {isAdding === wl.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : isAdded ? (
                                                    <><Check className="h-3 w-3 mr-1" /> Added</>
                                                ) : (
                                                    <><Plus className="h-3 w-3 mr-1" /> Add</>
                                                )}
                                            </Button>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    )}

                    <div className="pt-2 border-t">
                        <form onSubmit={handleCreateWatchlist} className="flex gap-2">
                            <Input
                                placeholder="New watchlist name"
                                value={newWatchlistName}
                                onChange={(e) => setNewWatchlistName(e.target.value)}
                                className="h-8 text-sm"
                                disabled={isCreating}
                            />
                            <Button type="submit" size="sm" className="h-8" disabled={isCreating || !newWatchlistName.trim()}>
                                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
                            </Button>
                        </form>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
