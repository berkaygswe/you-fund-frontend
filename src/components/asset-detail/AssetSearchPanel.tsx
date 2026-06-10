import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAssetSearch } from "@/hooks/useAssetSearch";
import { AssetSearchResult } from "@/types/assetSearchResult";
import { AssetSearchResultItem } from "@/components/asset-search/AssetSearchResultItem";
import debounce from "lodash.debounce";
import { Loader2, Minus, Plus, Search } from "lucide-react";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";

type AssetSearchPanelProps = {
    selectedAssets: AssetSearchResult[];
    setSelectedAssets: React.Dispatch<React.SetStateAction<AssetSearchResult[]>>;
    currentAssetSymbol: string;
};

const asset_types = [
    { name: 'All', type: null },
    { name: 'Fund', type: 'fund' },
    { name: 'ETF', type: 'etf' },
    { name: 'Stock', type: 'stock' },
    { name: 'Crypto', type: 'cryptocurrency' },
    { name: 'Commodity', type: 'commodity' },
    { name: 'Index', type: 'index' },
]

export function AssetSearchPanel({ selectedAssets, setSelectedAssets, currentAssetSymbol }: AssetSearchPanelProps) {

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [type, setType] = useState<string | null>(null);
    const [showSpinner, setShowSpinner] = useState(false);
    const {
        searchResults,
        loading: searchLoading,
        fetchNextPage,
        isLastPage
    } = useAssetSearch(debouncedSearchTerm, type, 10);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    // Debounced function — memoized to avoid re-creating on every render
    const debouncedSearch = useMemo(() => {
        return debounce((value: string) => {
            console.log("Debounced search term:", value);
            startTransition(() => {
                setDebouncedSearchTerm(value);
            });
        }, 300);
    }, []);

    const debouncedFetchNextPage = useMemo(() => {
        return debounce(() => {
            if (!searchLoading && !isLastPage) {
                fetchNextPage();
            }
        }, 500);
    }, [fetchNextPage, searchLoading, isLastPage]);

    // Ensure we cancel debounce on unmount to avoid memory leaks
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (searchLoading) {
            setShowSpinner(true);
        } else {
            timeout = setTimeout(() => {
                setShowSpinner(false);
            }, 500); // spinner stays at least 500ms
        }

        return () => clearTimeout(timeout);
    }, [searchLoading]);

    useEffect(() => {
        if (!bottomRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                debouncedFetchNextPage();
            }
        });

        const target = bottomRef.current;
        observer.observe(target);

        return () => {
            if (target) observer.unobserve(target);
            debouncedFetchNextPage.cancel();
            observer.disconnect();
        };
    }, [debouncedFetchNextPage])

    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    }, [debouncedSearch]);

    return (
        <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
                <Search className="col-span-1" />
                <Input className="col-span-3" placeholder="Search asset" value={searchTerm} onChange={handleSearch} />
            </div>

            <div className="flex items-center gap-2">
                {asset_types.map((asset_type) => {
                    return (
                        <Button
                            key={asset_type.type}
                            className="rounded-2xl"
                            size="sm"
                            onClick={() => setType(asset_type.type)}
                            variant={asset_type.type === type ? "default" : "outline"}
                        >
                            {asset_type.name}
                        </Button>
                    );
                })}
            </div>

            <div>
                <ScrollArea className="h-[300px]">

                    {selectedAssets.length > 1 && <div className="text-xs text-muted-foreground px-2 py-1">Selected Assets</div>}

                    {selectedAssets?.map((asset) => {
                        if (asset.symbol === currentAssetSymbol) return null;

                        return (
                            <AssetSearchResultItem
                                key={`selected-${asset.symbol}`}
                                asset={asset}
                                isInteractive={false}
                                renderAction={() => (
                                    <Button
                                        className="cursor-pointer"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedAssets((prev) => prev.filter((c) => c.symbol !== asset.symbol));
                                        }}
                                    >
                                        <Minus />
                                    </Button>
                                )}
                            />
                        );
                    })}

                    {selectedAssets.length > 0 && searchResults.length > 0 && (
                        <div className="text-xs text-muted-foreground px-2 py-1 mt-2 border-t border-border/40 pt-2">
                            Search Results
                        </div>
                    )}

                    {searchResults
                        .filter((r) => !selectedAssets.some((a) => a.symbol === r.symbol))
                        .map((result) => (
                            <AssetSearchResultItem
                                key={`search-${result.symbol}`}
                                asset={result}
                                isInteractive={true}
                                showTypeBadge={true}
                                onClick={() => {
                                    if (selectedAssets.length >= 6) {
                                        alert("You can only compare up to 6 assets at a time.");
                                        return;
                                    }
                                    setSelectedAssets((prev) => [...prev, result]);
                                }}
                                renderAction={() => (
                                    <Button
                                        className="cursor-pointer"
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Plus />
                                    </Button>
                                )}
                            />
                        ))}

                    {showSpinner && (
                        <div className="flex justify-center items-center py-2">
                            <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    <div ref={bottomRef} className="h-1" />
                </ScrollArea>
            </div>
        </div>
    )
}
