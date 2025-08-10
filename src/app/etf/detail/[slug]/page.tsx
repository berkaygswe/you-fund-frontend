"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Globe, Building2, Calendar, DollarSign, BarChart3, PieChart, Info, ExternalLink, Shield, Zap, Target, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import { useFormatCurrency } from '@/utils/formatCurrency';
import { formatPercent } from '@/utils/formatPercent';
import FundDetailGraph from '@/app/components/fund-detail/FundDetailGraph';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEtfMetada } from '@/hooks/useEtfMetada';
import { useParams } from 'next/navigation';
import { useEtfPriceChanges } from '@/hooks/useEtfPriceChanges';
import { useCurrencyStore } from '@/stores/currency-store';
import ImageWrap from '@/app/components/ImageWrap';

export default function EtfDetailPage() {

    //const [activeTab, setActiveTab] = useState('overview');

    const currency = useCurrencyStore((s) => s.currency)

    const params = useParams();
    const slug = params.slug as string;

    const { etfMetadata, loading } = useEtfMetada(slug);
    const { etfPriceChanges, loading: etfPriceChangeLoading } = useEtfPriceChanges(slug, currency);

    const formatCurrency = useFormatCurrency();

    const etfData = {
        symbol: 'VXUS',
        name: 'Vanguard Total International Stock ETF',
        description: 'Seeks to track the performance of the FTSE Global All Cap ex US Index, which measures the investment return of stocks issued by companies located in developed and emerging markets, excluding the United States.',
        currentPrice: 64.23,
        priceChange: 1.24,
        priceChangePercent: 1.97,
        aum: 45600000000,
        expenseRatio: 0.08,
        dividendYield: 3.12,
        peRatio: 13.45,
        pbRatio: 1.67,
        inceptionDate: '2011-01-26',
        holdingsCount: 7842,
        managementCompany: 'Vanguard',
        benchmarkIndex: 'FTSE Global All Cap ex US Index',
        primaryExchange: 'NASDAQ',
        currency: 'USD',
        isLeveraged: false,
        isInverse: false,
        isActivelyManaged: false,
        distributionFrequency: 'Quarterly',
        legalStructure: 'Open-End Fund',
        etfType: 'Equity',
        investmentStrategy: 'Passive Index Tracking',
        topHoldings: [
        { name: 'Taiwan Semiconductor Manufacturing Co Ltd', weight: 3.2, country: 'Taiwan' },
        { name: 'ASML Holding NV', weight: 1.8, country: 'Netherlands' },
        { name: 'Samsung Electronics Co Ltd', weight: 1.6, country: 'South Korea' },
        { name: 'Nestlé SA', weight: 1.4, country: 'Switzerland' },
        { name: 'Tencent Holdings Ltd', weight: 1.2, country: 'China' }
        ],
        sectorAllocation: [
        { sector: 'Technology', weight: 18.5 },
        { sector: 'Financials', weight: 16.2 },
        { sector: 'Industrials', weight: 13.8 },
        { sector: 'Consumer Discretionary', weight: 12.1 },
        { sector: 'Health Care', weight: 9.7 },
        { sector: 'Materials', weight: 8.9 },
        { sector: 'Consumer Staples', weight: 8.3 },
        { sector: 'Energy', weight: 5.8 },
        { sector: 'Communication Services', weight: 4.2 },
        { sector: 'Utilities', weight: 2.5 }
        ],
        geographicAllocation: [
        { region: 'Japan', weight: 22.1 },
        { region: 'United Kingdom', weight: 9.8 },
        { region: 'China', weight: 8.7 },
        { region: 'Canada', weight: 6.9 },
        { region: 'France', weight: 6.2 },
        { region: 'Germany', weight: 5.8 },
        { region: 'India', weight: 4.3 },
        { region: 'South Korea', weight: 3.9 },
        { region: 'Other', weight: 32.3 }
        ]
    };

    if(loading || etfPriceChangeLoading){
        return (
            <div>
                
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        {etfMetadata.iconUrl ? (
                            <ImageWrap
                                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/logo/etf/${etfMetadata.iconUrl}`}
                                width={70}
                                height={70}
                                className='rounded-md'
                                alt="Founder logo"
                            />
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
                                    <BarChart3 className="w-8 h-8 text-white" />
                                </div>
                            )
                        }
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    {etfMetadata.symbol}
                                </h1>
                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                                    <Target className="w-3 h-3 mr-1" />
                                    Active
                                </Badge>
                            </div>
                            <p className="text-xl text-gray-600 font-medium">{etfMetadata.managementCompany}</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Watchlist
                    </Button>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 leading-tight">
                    {etfMetadata.name}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {etfMetadata.etfType}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {etfMetadata.currency}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {etfMetadata.primaryExchange}
                    </Badge>
                </div>
            </div>

            {/* Price Card */}
            <Card className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-md">
                <CardContent className="p-8">
                    <div className="flex text-center md:text-left gap-4 flex-col md:flex-row items-center justify-between">
                        <div>
                            <div className="text-5xl font-bold text-gray-900 mb-3">
                                {formatCurrency(etfPriceChanges.closePrice)}
                            </div>
                            <div className={`flex items-center gap-3 text-xl font-medium ${
                                etfData.priceChange >= 0 ? "text-green-600" : "text-red-600"
                            }`}>
                                {etfData.priceChange >= 0 ? (
                                    <ArrowUpRight className="h-6 w-6" />
                                ) : (
                                    <ArrowDownRight className="h-6 w-6" />
                                )}
                                <span>
                                    {etfData.priceChange >= 0 ? "+" : ""}{formatCurrency(etfPriceChanges.dailyChangePercent)}
                                </span>
                                <span>
                                    ({etfPriceChanges.dailyChangePercent >= 0 ? "+" : ""}
                                    {formatPercent(etfPriceChanges.dailyChangePercent)})
                                </span>
                                <span className="text-gray-500 text-lg">Today</span>
                            </div>
                        </div>
                        <div className="md:text-right">
                            <div className="text-sm text-gray-600 mb-2 font-medium">Assets Under Management</div>
                            <div className="text-3xl font-bold text-gray-900">{formatCurrency(etfMetadata.aum, true)}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(etfMetadata.aum, true)}</div>
                        <div className="text-sm text-gray-600 font-medium">AUM</div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{formatPercent(etfMetadata.expenseRatio)}</div>
                        <div className="text-sm text-gray-600 font-medium">Expense Ratio</div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{formatPercent(etfMetadata.dividendYield)}</div>
                        <div className="text-sm text-gray-600 font-medium">Dividend Yield</div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{etfMetadata.peRatio}</div>
                        <div className="text-sm text-gray-600 font-medium">P/E Ratio</div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{etfMetadata.holdingsCount.toLocaleString()}</div>
                        <div className="text-sm text-gray-600 font-medium">Holdings</div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{new Date(etfMetadata.inceptionDate).getFullYear()}</div>
                        <div className="text-sm text-gray-600 font-medium">Inception</div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart Section */}
            <div className='mb-8'>
                <FundDetailGraph className="border-0 bg-white shadow-md" code={slug} />
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="holdings" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                        Holdings
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                        Performance
                    </TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                        Details
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <div className="grid gap-6">
                        <Card className="border-0 shadow-md bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                        <Info className="w-5 h-5 text-white" />
                                    </div>
                                    Fund Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed text-lg mb-6">{etfMetadata.description}</p>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 font-medium">Investment Strategy</span>
                                        <span className="font-semibold text-gray-900">{etfMetadata.investmentStrategy}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 font-medium">Benchmark Index</span>
                                        <span className="font-semibold text-gray-900">{etfMetadata.benchmarkIndex}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 font-medium">Distribution Frequency</span>
                                        <span className="font-semibold text-gray-900">{etfMetadata.distributionFrequency}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {etfMetadata.geographicAllocation && etfMetadata.geographicAllocation.length && (
                            <Card className="border-0 shadow-md bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-white" />
                                        </div>
                                        Geographic Allocation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {etfData.geographicAllocation.slice(0, 6).map((region, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-gray-700 font-medium">{region.region}</span>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min(region.weight * 3, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-bold text-gray-900 min-w-[4rem] text-right">{formatPercent(region.weight)}</span>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="holdings" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-md bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                    Top Holdings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {etfMetadata.topHoldings.map((holding, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200">
                                        <div>
                                            <div className="font-semibold text-gray-900">{holding.Name}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-xl text-gray-900">{formatPercent(holding['Holding Percent'] * 100)}</div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <PieChart className="w-5 h-5 text-white" />
                                    </div>
                                    Sector Allocation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {etfMetadata.sectorAllocation.sort((a, b) => b.weight - a.weight).map((sector, index) => (
                                    <div key={index} className="gap-4 grid grid-cols-2 md:flex md:justify-between md:items-center">
                                        <span className="text-gray-700 font-medium">{sector.sector}</span>
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-300"
                                                style={{ width: `${sector.weight * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-bold text-gray-900 min-w-[4rem] text-right">{formatPercent(sector.weight * 100)}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="performance" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-md bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    Performance Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                    <span className="font-medium">YTD Return</span>
                                    <span className="font-bold text-green-600 text-lg">+{formatPercent(etfPriceChanges.dailyChangePercent)}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                    <span className="font-medium">1 Year Return</span>
                                    <span className="font-bold text-green-600 text-lg">+18.7%</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                    <span className="font-medium">3 Year Return (Annualized)</span>
                                    <span className="font-bold text-green-600 text-lg">+9.2%</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                    <span className="font-medium">5 Year Return (Annualized)</span>
                                    <span className="font-bold text-green-600 text-lg">+11.8%</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    Risk Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Beta</span>
                                    <span className="font-bold text-gray-900">1.02</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Standard Deviation</span>
                                    <span className="font-bold text-gray-900">16.8%</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Sharpe Ratio</span>
                                    <span className="font-bold text-gray-900">0.68</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                                    <span className="font-medium">Max Drawdown</span>
                                    <span className="font-bold text-red-600 text-lg">-23.1%</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-md bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    Fund Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-600 mb-1">Inception Date</div>
                                        <div className="font-semibold text-gray-900">{new Date(etfMetadata.inceptionDate).toLocaleDateString()}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-600 mb-1">Primary Exchange</div>
                                        <div className="font-semibold text-gray-900">{etfMetadata.primaryExchange}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-600 mb-1">Legal Structure</div>
                                        <div className="font-semibold text-gray-900">{etfMetadata.legalStructure}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-600 mb-1">P/B Ratio</div>
                                        <div className="font-semibold text-gray-900">{etfMetadata.pbRatio}</div>
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t">
                                    <h4 className="font-semibold mb-4 text-lg">Fund Characteristics</h4>
                                    <div className="flex flex-wrap gap-3">
                                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                            Not Leveraged
                                        </Badge>
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                            Not Inverse
                                        </Badge>
                                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                            Actively Managed
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                        <ExternalLink className="w-5 h-5 text-white" />
                                    </div>
                                    Resources
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <button className="w-full p-6 text-left bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all duration-200 hover:scale-105">
                                    <div className="font-semibold text-blue-900 text-lg">Fund Prospectus</div>
                                    <div className="text-sm text-blue-700">Download official fund documents</div>
                                </button>
                                
                                <button className="w-full p-6 text-left bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all duration-200 hover:scale-105">
                                    <div className="font-semibold text-green-900 text-lg">Annual Report</div>
                                    <div className="text-sm text-green-700">View latest annual report</div>
                                </button>
                                
                                <button className="w-full p-6 text-left bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all duration-200 hover:scale-105">
                                    <div className="font-semibold text-purple-900 text-lg">Holdings Report</div>
                                    <div className="text-sm text-purple-700">Complete holdings breakdown</div>
                                </button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}