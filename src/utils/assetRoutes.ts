/**
 * Centralized asset routing utility.
 *
 * Maps asset types to their detail page paths. Returns null for asset types
 * that don't have dedicated detail pages (e.g. commodity, index), allowing
 * consumers to decide how to handle unsupported types (disable link, show
 * tooltip, etc.).
 */

const ASSET_ROUTE_MAP: Record<string, string> = {
    fund: 'fund',
    etf: 'etf',
    stock: 'stocks',
};

/**
 * Returns the detail page path for an asset, or null if the type has no
 * dedicated detail page.
 */
export function getAssetDetailPath(type: string, symbol: string): string | null {
    const routeSegment = ASSET_ROUTE_MAP[type];
    if (!routeSegment) return null;
    return `/${routeSegment}/detail/${symbol}`;
}

/**
 * Checks whether an asset type has a navigable detail page.
 */
export function hasDetailPage(type: string): boolean {
    return type in ASSET_ROUTE_MAP;
}
