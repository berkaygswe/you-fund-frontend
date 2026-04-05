"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Globe, Building2, Calendar, DollarSign, BarChart3, PieChart, Info, ExternalLink, Shield, Zap, Target, ArrowUpRight, ArrowDownRight, Star, Factory, Users } from 'lucide-react';
import { useFormatCurrency } from '@/utils/formatCurrency';
import { formatPercent } from '@/utils/formatPercent';
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

// Mock data for US stock
const stockData = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod.',
    currentPrice: 175.23,
    priceChange: 2.45,
    priceChangePercent: 1.42,
    marketCap: 2800000000000,
    peRatio: 29.8,
    pbRatio: 36.2,
    dividendYield: 0.55,
    eps: 5.88,
    beta: 1.29,
    fiftyTwoWeekHigh: 198.23,
    fiftyTwoWeekLow: 124.17,
    avgVolume: 58392000,
    sharesOutstanding: 15980000000,
    revenue: 383295000000,
    netIncome: 96958000000,
    sector: 'Technology',
    industry: 'Consumer Electronics',
    headquarters: 'Cupertino, California',
    founded: 1976,
    ceo: 'Timothy D. Cook',
    employees: 164000,
    website: 'https://www.apple.com',
    primaryExchange: 'NASDAQ',
    currency: 'USD',
    topCompetitors: [
        { name: 'Microsoft Corporation', symbol: 'MSFT' },
        { name: 'Alphabet Inc.', symbol: 'GOOGL' },
        { name: 'Amazon.com Inc.', symbol: 'AMZN' },
        { name: 'Tesla Inc.', symbol: 'TSLA' },
        { name: 'Meta Platforms Inc.', symbol: 'META' }
    ],
    institutionalHolders: [
        { name: 'Vanguard Group Inc', stake: 8.09 },
        { name: 'BlackRock Inc', stake: 5.92 },
        { name: 'Berkshire Hathaway Inc', stake: 5.83 },
        { name: 'State Street Corp', stake: 3.91 },
        { name: 'Fidelity Management & Research Co', stake: 1.93 }
    ],
    financials: {
        revenueGrowth: 2.8,
        profitMargin: 25.3,
        roe: 148.7,
        roa: 22.1,
        debtToEquity: 160.3,
        currentRatio: 0.94
    }
};

export default function StockDetailPage() {
    const currency = useCurrency();
    const params = useParams();
    const slug = params.slug as string;

    // For now we'll use mock data, but in a real implementation these would come from API hooks
    const stockMetadata = stockData;
    const stockPriceChanges = {
        closePrice: stockData.currentPrice,
        dailyChangePercent: stockData.priceChangePercent,
        oneMonthChangePercent: 3.24,
        threeMonthChangePercent: 8.72,
        oneYearChangePercent: 12.45,
        fiveYearChangePercent: 156.78
    };

    const loading = false;
    const stockPriceChangeLoading = false;

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
                primaryExchange={stockMetadata.primaryExchange}
            />

            <StockPriceCard
                closePrice={stockPriceChanges.closePrice}
                dailyChangePercent={stockPriceChanges.dailyChangePercent}
                marketCap={stockMetadata.marketCap}
            />

            <StockKeyMetrics
                marketCap={stockMetadata.marketCap}
                peRatio={stockMetadata.peRatio}
                dividendYield={stockMetadata.dividendYield}
                eps={stockMetadata.eps}
                sharesOutstanding={stockMetadata.sharesOutstanding}
                employees={stockMetadata.employees}
            />

            <div className='mb-8'>
                <FundDetailGraph className="border-0 bg-white shadow-md" code={slug} />
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
                        ceo={stockMetadata.ceo}
                        founded={stockMetadata.founded}
                        headquarters={stockMetadata.headquarters}
                        fiftyTwoWeekHigh={stockMetadata.fiftyTwoWeekHigh}
                        fiftyTwoWeekLow={stockMetadata.fiftyTwoWeekLow}
                        avgVolume={stockMetadata.avgVolume}
                        beta={stockMetadata.beta}
                    />
                </TabsContent>

                <TabsContent value="financials" className="mt-6">
                    <StockFinancialsTab
                        revenue={stockMetadata.revenue}
                        netIncome={stockMetadata.netIncome}
                        revenueGrowth={stockMetadata.financials.revenueGrowth}
                        profitMargin={stockMetadata.financials.profitMargin}
                        roe={stockMetadata.financials.roe}
                        roa={stockMetadata.financials.roa}
                        debtToEquity={stockMetadata.financials.debtToEquity}
                        currentRatio={stockMetadata.financials.currentRatio}
                    />
                </TabsContent>

                <TabsContent value="performance" className="mt-6">
                    <StockPerformanceTab
                        dailyChangePercent={stockPriceChanges.dailyChangePercent}
                        oneMonthChangePercent={stockPriceChanges.oneMonthChangePercent}
                        threeMonthChangePercent={stockPriceChanges.threeMonthChangePercent}
                        oneYearChangePercent={stockPriceChanges.oneYearChangePercent}
                        beta={stockMetadata.beta}
                    />
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                    <StockDetailsTab
                        sector={stockMetadata.sector}
                        industry={stockMetadata.industry}
                        employees={stockMetadata.employees}
                        website={stockMetadata.website}
                        institutionalHolders={stockMetadata.institutionalHolders}
                        topCompetitors={stockMetadata.topCompetitors}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
