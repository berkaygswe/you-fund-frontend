"use client"

import React from 'react';
import { Activity } from 'lucide-react';
import AssetDetailGraph from '@/components/asset-detail/AssetDetailGraph';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEtfMetada } from '@/hooks/useEtfMetada';
import { useParams } from 'next/navigation';
import { useAssetPriceChanges } from '@/hooks/useAssetPriceChanges';
import { useCurrency } from '@/hooks/useCurrency';
import { useTranslations } from 'next-intl';

// Modular Components
import { GlassCard } from '@/components/etf/detail/GlassCard';
import { EtfHeader } from '@/components/etf/detail/EtfHeader';
import { EtfPriceCard } from '@/components/etf/detail/EtfPriceCard';
import { EtfKeyMetrics } from '@/components/etf/detail/EtfKeyMetrics';
import { EtfOverviewTab } from '@/components/etf/detail/EtfOverviewTab';
import { EtfHoldingsTab } from '@/components/etf/detail/EtfHoldingsTab';
import { EtfPerformanceTab } from '@/components/etf/detail/EtfPerformanceTab';
import { EtfDetailsTab } from '@/components/etf/detail/EtfDetailsTab';

export default function EtfDetailPage() {
    const currency = useCurrency();
    const t = useTranslations('EtfDetail');
    const params = useParams();
    const slug = (params.slug || params.symbol) as string;

    const { etfMetadata, loading } = useEtfMetada(slug);
    const { assetPriceChanges: etfPriceChanges, loading: etfPriceChangeLoading } = useAssetPriceChanges(slug, currency);

    if (loading || etfPriceChangeLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative flex items-center justify-center w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-r-2 border-blue-400 animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
                </div>
            </div>
        );
    }

    if (!etfMetadata || !etfPriceChanges) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <GlassCard className="max-w-md p-10 flex flex-col items-center border border-red-100/50 dark:border-red-500/20 bg-white/40">
                    <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-center justify-center mb-6">
                        <Activity className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">{t('dataUnavailable')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                        {t('dataUnavailableDesc')}
                    </p>
                    <Button
                        variant="default"
                        className="rounded-xl px-8 h-12 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 transition-all font-medium"
                        onClick={() => window.location.reload()}
                    >
                        {t('reinitializeData')}
                    </Button>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-[1400px]">
            <EtfHeader
                symbol={etfMetadata.symbol}
                name={etfMetadata.name}
                managementCompany={etfMetadata.managementCompany}
                etfType={etfMetadata.etfType}
                iconUrl={etfMetadata.iconUrl}
                currency={etfMetadata.currency}
                primaryExchange={etfMetadata.primaryExchange}
                assetId={etfMetadata.assetId}
            />

            <EtfPriceCard
                price={etfPriceChanges.price}
                dailyChangePercent={etfPriceChanges.dailyChangePercent}
                currency={etfMetadata.currency}
                aum={etfMetadata.aum}
            />

            <EtfKeyMetrics
                expenseRatio={etfMetadata.expenseRatio}
                dividendYield={etfMetadata.dividendYield}
                peRatio={etfMetadata.peRatio}
                holdingsCount={etfMetadata.holdingsCount}
                pbRatio={etfMetadata.pbRatio}
                inceptionDate={etfMetadata.inceptionDate}
            />

            {/* Price Action Chart Area */}
            <div className="mb-10 w-full overflow-hidden rounded-3xl border border-white/40 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5 dark:ring-white/5">
                <AssetDetailGraph className="border-0 bg-transparent" code={slug} assetId={etfMetadata.assetId} type="etf" />
            </div>

            {/* Deep Dive Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/50 dark:border-slate-800/80 shadow-sm w-full md:w-auto flex md:inline-flex justify-start md:justify-center overflow-x-auto h-auto gap-1.5">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-300 flex-shrink-0">
                        {t('tabOverview')}
                    </TabsTrigger>
                    <TabsTrigger value="holdings" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-300 flex-shrink-0">
                        {t('tabHoldings')}
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-300 flex-shrink-0">
                        {t('tabPerformance')}
                    </TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-300 flex-shrink-0">
                        {t('tabDetails')}
                    </TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <EtfOverviewTab
                        description={etfMetadata.description}
                        legalStructure={etfMetadata.legalStructure}
                        etfType={etfMetadata.etfType}
                    />
                </TabsContent>

                {/* HOLDINGS & SEGMENTS TAB */}
                <TabsContent value="holdings" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <EtfHoldingsTab
                        topHoldings={etfMetadata.topHoldings}
                        holdingsCount={etfMetadata.holdingsCount}
                        sectorAllocation={etfMetadata.sectorAllocation}
                    />
                </TabsContent>

                {/* PERFORMANCE TAB */}
                <TabsContent value="performance" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <EtfPerformanceTab
                        dailyChangePercent={etfPriceChanges.dailyChangePercent}
                        monthlyChangePercent={etfPriceChanges.monthlyChangePercent}
                        ytdChangePercent={etfPriceChanges.ytdChangePercent}
                        yearlyChangePercent={etfPriceChanges.yearlyChangePercent}
                    />
                </TabsContent>

                {/* DETAILS TAB */}
                <TabsContent value="details" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <EtfDetailsTab
                        inceptionDate={etfMetadata.inceptionDate}
                        primaryExchange={etfMetadata.primaryExchange}
                        benchmarkIndex={etfMetadata.benchmarkIndex}
                        distributionFrequency={etfMetadata.distributionFrequency}
                        isLeveraged={etfMetadata.isLeveraged}
                        isInverse={etfMetadata.isInverse}
                        isActivelyManaged={etfMetadata.isActivelyManaged}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
