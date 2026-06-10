"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAssetSearch } from "@/hooks/useAssetSearch";
import { AssetSearchResult } from "@/types/assetSearchResult";
import { AssetSearchResultItem } from "@/components/asset-search/AssetSearchResultItem";
import { getAssetDetailPath, hasDetailPage } from "@/utils/assetRoutes";
import { useRouter } from "@/i18n/routing";
import debounce from "lodash.debounce";
import { Loader2, Search, ArrowRight, Command } from "lucide-react";
import {
    startTransition,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const ASSET_TYPES = [
    { name: "All", type: null },
    { name: "Fund", type: "fund" },
    { name: "ETF", type: "etf" },
    { name: "Stock", type: "stock" },
    { name: "Crypto", type: "cryptocurrency" },
    { name: "Commodity", type: "commodity" },
    { name: "Index", type: "index" },
] as const;

/**
 * Global asset search component for the header.
 *
 * TradingView-style search dialog with:
 * - Cmd+K / Ctrl+K keyboard shortcut
 * - Asset type filter pills
 * - Click result → navigate to detail page
 * - Graceful handling of asset types without detail pages
 *
 * Follows Vercel best practices:
 * - rerender-transitions: startTransition for non-urgent search updates
 * - rendering-conditional-render: ternary over &&
 * - client-passive-event-listeners: passive keydown for shortcut
 * - rerender-use-deferred-value: debounced search instead of raw input
 */
export default function HeaderAssetSearch() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [type, setType] = useState<string | null>(null);
    const [showSpinner, setShowSpinner] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const {
        searchResults,
        loading: searchLoading,
        fetchNextPage,
        isLastPage,
    } = useAssetSearch(debouncedSearchTerm, type, 15);

    // ── Keyboard shortcut (Cmd+K / Ctrl+K) ────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // ── Debounced search ───────────────────────────────────────────────
    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                startTransition(() => {
                    setDebouncedSearchTerm(value);
                });
            }, 300),
        []
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    // ── Debounced infinite scroll ──────────────────────────────────────
    const debouncedFetchNextPage = useMemo(
        () =>
            debounce(() => {
                if (!searchLoading && !isLastPage) {
                    fetchNextPage();
                }
            }, 500),
        [fetchNextPage, searchLoading, isLastPage]
    );

    // ── Spinner min-display time ───────────────────────────────────────
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (searchLoading) {
            setShowSpinner(true);
        } else {
            timeout = setTimeout(() => setShowSpinner(false), 400);
        }
        return () => clearTimeout(timeout);
    }, [searchLoading]);

    // ── Infinite scroll observer ───────────────────────────────────────
    useEffect(() => {
        if (!bottomRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
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
    }, [debouncedFetchNextPage]);

    // ── Input handler ──────────────────────────────────────────────────
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setSearchTerm(value);
            debouncedSearch(value);
        },
        [debouncedSearch]
    );

    // ── Reset state on close ───────────────────────────────────────────
    const handleOpenChange = useCallback(
        (open: boolean) => {
            setIsOpen(open);
            if (!open) {
                // Delay reset so close animation completes
                setTimeout(() => {
                    setSearchTerm("");
                    setDebouncedSearchTerm("");
                    setType(null);
                    debouncedSearch.cancel();
                }, 200);
            }
        },
        [debouncedSearch]
    );

    // ── Navigate to asset detail ───────────────────────────────────────
    const handleAssetClick = useCallback(
        (asset: AssetSearchResult) => {
            const path = getAssetDetailPath(asset.type, asset.symbol);
            if (!path) return; // No detail page for this type
            setIsOpen(false);
            router.push(path);
        },
        [router]
    );

    // ── Detect platform for shortcut display ───────────────────────────
    const isMac = typeof navigator !== "undefined" && navigator.platform?.toUpperCase().includes("MAC");

    return (
        <>
            {/* Trigger Button */}
            <button
                id="header-search-trigger"
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center sm:justify-start gap-2 h-9 w-9 sm:w-auto sm:px-3 rounded-lg border border-border/60 bg-muted/40 hover:bg-muted/80 text-muted-foreground text-sm transition-all duration-200 hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[200px] lg:min-w-[240px]"
                title="Search assets (Cmd+K)"
            >
                <Search className="h-4 w-4 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <span className="hidden sm:inline-flex flex-1 text-left truncate">Search assets...</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-border/80 bg-background/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {isMac ? (
                        <>
                            <Command className="h-2.5 w-2.5" />K
                        </>
                    ) : (
                        "Ctrl+K"
                    )}
                </kbd>
            </button>

            {/* Search Dialog */}
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="p-0 gap-0 overflow-hidden max-w-[95vw] sm:max-w-[640px] h-[90vh] sm:h-auto sm:max-h-[700px] flex flex-col [&>button]:hidden border-none sm:border">
                    <VisuallyHidden>
                        <DialogTitle>Search Assets</DialogTitle>
                    </VisuallyHidden>

                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
                        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Input
                            ref={inputRef}
                            id="header-search-input"
                            placeholder="Search by name or symbol..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="border-0 bg-transparent p-0 h-auto text-base shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
                            autoFocus
                            autoComplete="off"
                            spellCheck={false}
                        />
                        {searchTerm.length > 0 ? (
                            <button
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded border border-border/60"
                                onClick={() => {
                                    setSearchTerm("");
                                    debouncedSearch("");
                                    inputRef.current?.focus();
                                }}
                            >
                                Clear
                            </button>
                        ) : (
                            <kbd className="text-[10px] font-mono text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">
                                ESC
                            </kbd>
                        )}
                    </div>

                    {/* Type Filter Pills */}
                    <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/40 overflow-x-auto">
                        {ASSET_TYPES.map((assetType) => (
                            <Button
                                key={assetType.type ?? "all"}
                                variant={assetType.type === type ? "default" : "outline"}
                                size="sm"
                                className="rounded-full h-7 text-xs px-3 flex-shrink-0"
                                onClick={() => setType(assetType.type)}
                            >
                                {assetType.name}
                            </Button>
                        ))}
                    </div>

                    {/* Results */}
                    <ScrollArea className="flex-1 overflow-y-auto">
                        <div className="p-2">
                            {/* Empty state — no search yet */}
                            {searchTerm.length === 0 && searchResults.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Search className="h-8 w-8 text-muted-foreground/30 mb-3" />
                                    <p className="text-sm text-muted-foreground">
                                        Start typing to search for assets
                                    </p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">
                                        Search by name, symbol, or ticker
                                    </p>
                                </div>
                            ) : null}

                            {/* No results found */}
                            {searchTerm.length > 0 &&
                                searchResults.length === 0 &&
                                !searchLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        No results found for &ldquo;{searchTerm}&rdquo;
                                    </p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">
                                        Try a different search term or filter
                                    </p>
                                </div>
                            ) : null}

                            {/* Search Results */}
                            {searchResults.length > 0 ? (
                                <div className="space-y-0.5">
                                    {searchResults.map((result) => {
                                        const isNavigable = hasDetailPage(result.type);

                                        return (
                                            <AssetSearchResultItem
                                                key={`search-${result.symbol}-${result.type}`}
                                                asset={result}
                                                onClick={isNavigable ? handleAssetClick : undefined}
                                                isInteractive={isNavigable}
                                                showTypeBadge
                                                className={
                                                    isNavigable
                                                        ? ""
                                                        : "opacity-60"
                                                }
                                                renderAction={() =>
                                                    isNavigable ? (
                                                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[9px] px-1.5 py-0 text-muted-foreground/60"
                                                        >
                                                            No page
                                                        </Badge>
                                                    )
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            ) : null}

                            {/* Loading spinner */}
                            {showSpinner ? (
                                <div className="flex justify-center items-center py-4">
                                    <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
                                </div>
                            ) : null}

                            {/* Infinite scroll sentinel */}
                            <div ref={bottomRef} className="h-1" />
                        </div>
                    </ScrollArea>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-border/40 bg-muted/20">
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <kbd className="border border-border/60 rounded px-1 py-0.5 bg-background/60 text-[10px]">↑↓</kbd>
                                Navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="border border-border/60 rounded px-1 py-0.5 bg-background/60 text-[10px]">↵</kbd>
                                Open
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="border border-border/60 rounded px-1 py-0.5 bg-background/60 text-[10px]">ESC</kbd>
                                Close
                            </span>
                        </div>
                        {searchResults.length > 0 ? (
                            <span className="text-[11px] text-muted-foreground">
                                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                            </span>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
