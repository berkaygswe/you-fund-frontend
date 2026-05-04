import { AssetSearchResult } from "@/types/assetSearchResult";
import ImageWrap from "@/components/ImageWrap";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type AssetSearchResultItemProps = {
    asset: AssetSearchResult;
    /** Optional action element rendered on the right side (e.g. +/- button, arrow icon) */
    renderAction?: (asset: AssetSearchResult) => React.ReactNode;
    /** Optional click handler for the entire row */
    onClick?: (asset: AssetSearchResult) => void;
    /** Whether the row is interactive (shows hover state and cursor pointer) */
    isInteractive?: boolean;
    /** Whether to show the asset type badge */
    showTypeBadge?: boolean;
    className?: string;
};

const ASSET_TYPE_LABELS: Record<string, string> = {
    fund: "Fund",
    etf: "ETF",
    stock: "Stock",
    cryptocurrency: "Crypto",
    commodity: "Commodity",
    index: "Index",
};

/**
 * Shared presentational component for rendering a single asset search result row.
 *
 * Used by both the header search (navigation mode) and the comparison panel
 * (multi-select mode). Each consumer provides its own action/click behavior.
 */
export function AssetSearchResultItem({
    asset,
    renderAction,
    onClick,
    isInteractive = true,
    showTypeBadge = false,
    className = "",
}: AssetSearchResultItemProps) {
    const typeLabel = ASSET_TYPE_LABELS[asset.type] ?? asset.type;

    return (
        <div
            className={`flex items-center gap-3 px-2 sm:px-3 py-2.5 rounded-lg transition-colors ${isInteractive ? "hover:bg-accent/60 cursor-pointer" : ""
                } ${className}`}
            onClick={isInteractive && onClick ? () => onClick(asset) : undefined}
            role={isInteractive ? "button" : undefined}
            tabIndex={isInteractive ? 0 : undefined}
            onKeyDown={
                isInteractive && onClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onClick(asset);
                        }
                    }
                    : undefined
            }
        >
            {/* Asset Icon */}
            <div className="flex-shrink-0">
                {asset.icon_url ? (
                    <ImageWrap
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/logo/${asset.type.toLowerCase()}/${asset.icon_url}`}
                        width={28}
                        height={28}
                        className="rounded-md"
                        alt={`${asset.name} logo`}
                    />
                ) : (
                    <Image
                        src="/bank.jpg"
                        width={28}
                        height={28}
                        className="rounded-md"
                        alt="Default asset logo"
                    />
                )}
            </div>

            {/* Asset Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground truncate">
                        {asset.name}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-mono">
                        {asset.symbol}
                    </span>
                    {asset.exchange_icon_url ? (
                        <ImageWrap
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/logos/${asset.exchange_icon_url}`}
                            width={14}
                            height={14}
                            className="rounded-sm"
                            alt="Exchange logo"
                        />
                    ) : null}
                </div>
            </div>

            {/* Type Badge */}
            {showTypeBadge ? (
                <Badge
                    variant="secondary"
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 flex-shrink-0"
                >
                    {typeLabel}
                </Badge>
            ) : null}

            {/* Action Slot */}
            {renderAction ? (
                <div className="flex-shrink-0">{renderAction(asset)}</div>
            ) : null}
        </div>
    );
}
