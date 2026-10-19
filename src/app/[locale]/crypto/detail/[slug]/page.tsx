// src/app/[locale]/crypto/detail/[slug]/page.tsx
"use client";

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/hooks/useCurrency';
import { useCryptoMetadata } from '@/hooks/useCryptoMetadata';
import { useCryptoMarketStats } from '@/hooks/useCryptoMarketStats';
import { useAssetPriceChanges } from '@/hooks/useAssetPriceChanges';
import { useRealtimePrices } from '@/hooks/useRealtimePrices';
import AssetDetailGraph from '@/components/asset-detail/AssetDetailGraph';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Activity, AlertCircle } from 'lucide-react';

// Modular Crypto Detail Components
import { CryptoHeader } from '@/components/crypto/detail/CryptoHeader';
import { CryptoPriceCard } from '@/components/crypto/detail/CryptoPriceCard';
import { CryptoKeyMetrics } from '@/components/crypto/detail/CryptoKeyMetrics';
import { CryptoDataFreshnessBar } from '@/components/crypto/detail/CryptoDataFreshnessBar';
import { CryptoOverviewTab } from '@/components/crypto/detail/CryptoOverviewTab';
import { CryptoTokenomicsTab } from '@/components/crypto/detail/CryptoTokenomicsTab';
import { CryptoPerformanceTab } from '@/components/crypto/detail/CryptoPerformanceTab';
import { CryptoContractsTab } from '@/components/crypto/detail/CryptoContractsTab';

export default function CryptoDetailPage() {
    const params = useParams();
    const slug = decodeURIComponent((params.slug || params.symbol) as string || '');
    const currency = useCurrency();
    const t = useTranslations('CryptoDetail');

    // Fetch fundamental metadata and market statistics independently
    const { metadata, loading: metaLoading, error: metaError, refetch: refetchMeta } = useCryptoMetadata(slug);
    const { marketStats, loading: statsLoading, error: statsError, refetch: refetchStats } = useCryptoMarketStats(slug, currency);

    // Fetch live price changes from pricing service
    const { assetPriceChanges, loading: priceLoading } = useAssetPriceChanges(slug, currency, 'cryptocurrency');

    // Subscribe to real-time WebSocket pricing updates
    const realtimeAssets = useMemo(() => (slug ? [{ type: 'cryptocurrency' as const, symbol: slug }] : []), [slug]);
    const realtimePrices = useRealtimePrices(realtimeAssets, currency);

    // Derive active real-time or historical pricing
    const realtimeData = realtimePrices[slug];
    const displayPrice = realtimeData?.price ?? assetPriceChanges?.price ?? (currency === 'USD' ? marketStats?.athPriceUsd : undefined);
    const displayDailyChange = realtimeData?.dailyChangePercent ?? assetPriceChanges?.dailyChangePercent;

    const isLoading = (metaLoading || statsLoading || priceLoading) && !metadata && !marketStats;

    // Both endpoints failed or returned 404
    const isCompletelyUnavailable = !isLoading && !metadata && !marketStats;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative flex items-center justify-center w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-r-2 border-emerald-400 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
                </div>
            </div>
        );
    }

    if (isCompletelyUnavailable) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <Card className="max-w-md p-10 flex flex-col items-center border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg">
                    <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-center justify-center mb-6">
                        <Activity className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                        {t('dataUnavailable')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm">
                        {t('dataUnavailableDesc')}
                    </p>
                    <Button
                        variant="default"
                        className="rounded-xl px-8 h-12 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white shadow-lg transition-all font-medium"
                        onClick={() => {
                            refetchMeta();
                            refetchStats();
                        }}
                    >
                        {t('reinitializeData')}
                    </Button>
                </Card>
            </div>
        );
    }

    // Consolidated attributes from either source
    const assetId = metadata?.assetId || marketStats?.assetId || '';
    const name = metadata?.name || marketStats?.name || slug;
    const exchange = metadata?.exchange || marketStats?.exchange || 'BINANCE';
    const iconUrl = metadata?.iconUrl || marketStats?.iconUrl;
    const freshness = marketStats?.freshness || metadata?.freshness || 'UNKNOWN';
    const provider = marketStats?.provider || metadata?.provider;
    const providerUpdatedAt = marketStats?.providerUpdatedAt;
    const fetchedAt = marketStats?.fetchedAt || metadata?.fetchedAt;
    const fxRateDate = marketStats?.fxRateDate;

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px]">
            {/* Header: Title, Rank, Taxonomy & Action buttons */}
            <CryptoHeader
                symbol={slug}
                name={name}
                exchange={exchange}
                assetId={assetId}
                iconUrl={iconUrl}
                marketCapRank={marketStats?.marketCapRank}
                categories={metadata?.categories}
                currency={currency || 'USD'}
            />

            {/* Freshness & Institutional Provenance Bar */}
            <CryptoDataFreshnessBar
                freshness={freshness}
                providerUpdatedAt={providerUpdatedAt}
                fetchedAt={fetchedAt}
                provider={provider}
                currency={currency}
                fxRateDate={fxRateDate}
                className="mb-6"
            />

            {/* Graceful Single-Source Notice Pill (if one is absent) */}
            {!marketStats && metadata ? (
                <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>{t('statsUnavailableNotice')}</span>
                </div>
            ) : null}

            {!metadata && marketStats ? (
                <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-xs text-blue-800 dark:text-blue-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>{t('metadataUnavailableNotice')}</span>
                </div>
            ) : null}

            {/* High Impact Live Price & Volume Card */}
            <CryptoPriceCard
                price={displayPrice}
                dailyChangePercent={displayDailyChange}
                currency={currency || 'USD'}
                volume24h={marketStats?.volume24h}
                marketCap={marketStats?.marketCap}
                fullyDilutedValuation={marketStats?.fullyDilutedValuation}
            />

            {/* 6-Metric Highlights Grid */}
            <CryptoKeyMetrics
                symbol={slug}
                marketCap={marketStats?.marketCap}
                volume24h={marketStats?.volume24h}
                fullyDilutedValuation={marketStats?.fullyDilutedValuation}
                circulatingSupply={marketStats?.circulatingSupply}
                totalSupply={marketStats?.totalSupply}
                athPriceUsd={marketStats?.athPriceUsd}
                marketCapRank={marketStats?.marketCapRank}
                genesisDate={metadata?.genesisDate}
            />

            {/* Historical Price Chart Area */}
            {assetId ? (
                <div className="mb-8">
                    <AssetDetailGraph
                        className="border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md"
                        code={slug}
                        assetId={assetId}
                        type="cryptocurrency"
                    />
                </div>
            ) : null}

            {/* Comprehensive Detail Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full md:w-auto flex md:inline-flex justify-start md:justify-center overflow-x-auto bg-gray-100 dark:bg-slate-800/60 p-1 rounded-xl h-auto gap-1">
                    <TabsTrigger
                        value="overview"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-md dark:data-[state=active]:text-white dark:text-gray-400 text-sm py-2 flex-shrink-0"
                    >
                        {t('tabOverview')}
                    </TabsTrigger>

                    <TabsTrigger
                        value="tokenomics"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-md dark:data-[state=active]:text-white dark:text-gray-400 text-sm py-2 flex-shrink-0"
                    >
                        {t('tabTokenomics')}
                    </TabsTrigger>

                    <TabsTrigger
                        value="performance"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-md dark:data-[state=active]:text-white dark:text-gray-400 text-sm py-2 flex-shrink-0"
                    >
                        {t('tabPerformance')}
                    </TabsTrigger>

                    <TabsTrigger
                        value="contracts"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-md dark:data-[state=active]:text-white dark:text-gray-400 text-sm py-2 flex-shrink-0"
                    >
                        {t('tabContracts')}
                    </TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="mt-6">
                    <CryptoOverviewTab
                        symbol={slug}
                        name={name}
                        description={metadata?.description}
                        categories={metadata?.categories}
                        websiteUrls={metadata?.websiteUrls}
                        explorerUrls={metadata?.explorerUrls}
                        sourceCodeUrls={metadata?.sourceCodeUrls}
                        whitepaperUrl={metadata?.whitepaperUrl}
                        genesisDate={metadata?.genesisDate}
                    />
                </TabsContent>

                {/* TOKENOMICS TAB */}
                <TabsContent value="tokenomics" className="mt-6">
                    <CryptoTokenomicsTab
                        symbol={slug}
                        circulatingSupply={marketStats?.circulatingSupply}
                        totalSupply={marketStats?.totalSupply}
                        maxSupply={marketStats?.maxSupply}
                        maxSupplyInfinite={metadata?.maxSupplyInfinite}
                        marketCap={marketStats?.marketCap}
                        fullyDilutedValuation={marketStats?.fullyDilutedValuation}
                        currency={currency || 'USD'}
                    />
                </TabsContent>

                {/* PERFORMANCE TAB */}
                <TabsContent value="performance" className="mt-6">
                    <CryptoPerformanceTab
                        symbol={slug}
                        currentPrice={displayPrice}
                        currency={currency || 'USD'}
                        athPriceUsd={marketStats?.athPriceUsd}
                        athAt={marketStats?.athAt}
                        dailyChangePercent={displayDailyChange}
                        monthlyChangePercent={assetPriceChanges?.monthlyChangePercent}
                        yearlyChangePercent={assetPriceChanges?.yearlyChangePercent}
                        ytdChangePercent={assetPriceChanges?.ytdChangePercent}
                        marketCapRank={marketStats?.marketCapRank}
                        volume24h={marketStats?.volume24h}
                    />
                </TabsContent>

                {/* NETWORK & CONTRACTS TAB */}
                <TabsContent value="contracts" className="mt-6">
                    <CryptoContractsTab
                        symbol={slug}
                        platforms={metadata?.platforms}
                        explorerUrls={metadata?.explorerUrls}
                        sourceCodeUrls={metadata?.sourceCodeUrls}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
