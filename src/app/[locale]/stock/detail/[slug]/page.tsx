"use client"

import AssetDetailGraph from '@/components/asset-detail/AssetDetailGraph';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'next/navigation';
import { useCurrency } from '@/hooks/useCurrency';
import { StockDetailsTab } from '@/components/stock/detail/StockDetailsTab';
import { StockHeader } from '@/components/stock/detail/StockHeader';
import { StockPriceCard } from '@/components/stock/detail/StockPriceCard';
import { StockKeyMetrics } from '@/components/stock/detail/StockKeyMetrics';
import { StockFinancialsTab } from '@/components/stock/detail/StockFinancialsTab';
import { StockPerformanceTab } from '@/components/stock/detail/StockPerformanceTab';
import { CompanyOverviewTab } from '@/components/stock/detail/CompanyOverviewTab';
import { useStockMetadata } from '@/hooks/useStockMetadata';
import { useAssetPriceChanges } from '@/hooks/useAssetPriceChanges';

export default function StockDetailPage() {
    const currency = useCurrency();
    const params = useParams();
    const slug = (params.slug || params.symbol) as string;

    const { stockMetadata, loading: stockLoading } = useStockMetadata(slug);
    const { assetPriceChanges: stockPriceChanges, loading: stockPriceChangeLoading } = useAssetPriceChanges(slug, currency, 'stock');

    const loading = stockLoading || !stockMetadata;

    if (loading || stockPriceChangeLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <StockHeader
                symbol={stockMetadata.symbol}
                name={stockMetadata.name}
                sector={stockMetadata.sector}
                industry={stockMetadata.industry}
                primaryExchange={stockMetadata.exchange}
                assetId={stockMetadata.assetId}
                iconUrl={stockMetadata.iconUrl}
            />

            <StockPriceCard
                closePrice={stockPriceChanges?.price || 0}
                dailyChangePercent={stockPriceChanges?.dailyChangePercent || 0}
                marketCap={stockMetadata.marketCap}
            />

            <StockKeyMetrics
                marketCap={stockMetadata.marketCap}
                peRatio={stockMetadata.trailingPe}
                dividendYield={stockMetadata.dividendYield}
                sharesOutstanding={stockMetadata.sharesOutstanding}
                employees={stockMetadata.fullTimeEmployees}
            />

            <div className='mb-8'>
                <AssetDetailGraph className="border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md" code={slug} assetId={stockMetadata.assetId} type='stock'/>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full md:w-auto flex md:inline-flex justify-start md:justify-center overflow-x-auto bg-gray-100 dark:bg-slate-800/60 p-1 rounded-xl h-auto gap-1">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-md dark:data-[state=active]:text-white dark:text-gray-400 text-sm py-2 flex-shrink-0">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="financials" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-md dark:data-[state=active]:text-white dark:text-gray-400 text-sm py-2 flex-shrink-0">
                        Financials
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-md dark:data-[state=active]:text-white dark:text-gray-400 text-sm py-2 flex-shrink-0">
                        Performance
                    </TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-md dark:data-[state=active]:text-white dark:text-gray-400 text-sm py-2 flex-shrink-0">
                        Company Details
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <CompanyOverviewTab
                        description={stockMetadata.description}
                        headquarters={stockMetadata.city && stockMetadata.country ? `${stockMetadata.city}, ${stockMetadata.country}` : undefined}
                        fiftyTwoWeekHigh={stockMetadata.fiftyTwoWeekHigh}
                        fiftyTwoWeekLow={stockMetadata.fiftyTwoWeekLow}
                        avgVolume={stockPriceChanges?.volume}
                        beta={stockMetadata.beta}
                    />
                </TabsContent>

                <TabsContent value="financials" className="mt-6">
                    <StockFinancialsTab
                        revenueGrowth={stockMetadata.revenueGrowth}
                        profitMargin={stockMetadata.profitMargins}
                        roe={stockMetadata.returnOnEquity}
                        roa={stockMetadata.returnOnAssets}
                    />
                </TabsContent>

                <TabsContent value="performance" className="mt-6">
                    <StockPerformanceTab
                        dailyChangePercent={stockPriceChanges?.dailyChangePercent}
                        oneMonthChangePercent={stockPriceChanges?.monthlyChangePercent}
                        threeMonthChangePercent={stockPriceChanges?.ytdChangePercent}
                        oneYearChangePercent={stockPriceChanges?.yearlyChangePercent}
                        beta={stockMetadata.beta}
                    />
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                    <StockDetailsTab
                        sector={stockMetadata.sector}
                        industry={stockMetadata.industry}
                        employees={stockMetadata.fullTimeEmployees}
                        website={stockMetadata.website}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
