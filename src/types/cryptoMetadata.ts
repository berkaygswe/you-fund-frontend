export type CryptoFreshnessStatus = 'FRESH' | 'DELAYED' | 'STALE' | 'UNKNOWN';

export interface CryptoPlatformContract {
    providerPlatformId: string;
    contractAddress: string;
    decimals: number | null;
}

export interface CryptoMetadata {
    assetId: string;
    assetKey: string;
    symbol: string;
    name: string;
    exchange: string;
    iconUrl: string | null;
    provider: string;
    providerAssetId: string;
    fetchedAt: string;
    evaluatedAt: string;
    freshness: CryptoFreshnessStatus;

    // Metadata specific fields
    description: string | null;
    categories: string[] | null;
    websiteUrls: string[] | null;
    explorerUrls: string[] | null;
    sourceCodeUrls: string[] | null;
    whitepaperUrl: string | null;
    platforms: CryptoPlatformContract[] | null;
    genesisDate: string | null;
    maxSupplyInfinite: boolean | null;
}

export interface CryptoMarketStats {
    assetId: string;
    assetKey: string;
    symbol: string;
    name: string;
    exchange: string;
    iconUrl: string | null;
    provider: string;
    providerAssetId: string;
    fetchedAt: string;
    evaluatedAt: string;
    freshness: CryptoFreshnessStatus;

    // Market statistics specific fields
    currency: string;
    marketCapRank: number | null;
    marketCap: number | null;
    fullyDilutedValuation: number | null;
    volume24h: number | null;
    circulatingSupply: number | null;
    totalSupply: number | null;
    maxSupply: number | null;
    athPriceUsd: number | null;
    athAt: string | null;
    providerUpdatedAt: string | null;
    fxRateDate: string | null;
}
