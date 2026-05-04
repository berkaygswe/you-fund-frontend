"use client"

import FundDetailGraph from '@/components/fund-detail/FundDetailGraph';
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
                <FundDetailGraph className="border-0 bg-white shadow-md" code={slug} assetId={stockMetadata.assetId} type='stock'/>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="financials" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                        Financials
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                        Performance
                    </TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
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
