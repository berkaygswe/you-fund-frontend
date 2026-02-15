"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Globe, Building2, Calendar, DollarSign, BarChart3, PieChart, Info, ExternalLink, Shield, Zap, Target, ArrowUpRight, ArrowDownRight, Star, Factory, Users } from 'lucide-react';
import { useFormatCurrency } from '@/utils/formatCurrency';
import { formatPercent } from '@/utils/formatPercent';
import FundDetailGraph from '@/app/components/fund-detail/FundDetailGraph';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'next/navigation';
import { useCurrencyStore } from '@/stores/currency-store';
import ImageWrap from '@/app/components/ImageWrap';

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
  const currency = useCurrencyStore((s) => s.currency)
  const params = useParams();
  const slug = params.slug as string;
  
  const formatCurrency = useFormatCurrency();

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

  if(loading || stockPriceChangeLoading){
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {stockMetadata.symbol}
                </h1>
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                  <Target className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
              <p className="text-xl text-gray-600 font-medium">{stockMetadata.name}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
            <Star className="w-4 h-4" />
            Watchlist
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {stockMetadata.sector}
          </Badge>
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {stockMetadata.industry}
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {stockMetadata.primaryExchange}
          </Badge>
        </div>
      </div>

      {/* Price Card */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-md">
        <CardContent className="p-8">
          <div className="flex text-center md:text-left gap-4 flex-col md:flex-row items-center justify-between">
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-3">
                {formatCurrency(stockPriceChanges.closePrice)}
              </div>
              <div className={`flex items-center gap-3 text-xl font-medium ${
                stockPriceChanges.dailyChangePercent >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {stockPriceChanges.dailyChangePercent >= 0 ? (
                  <ArrowUpRight className="h-6 w-6" />
                ) : (
                  <ArrowDownRight className="h-6 w-6" />
                )}
                <span>
                  {stockPriceChanges.dailyChangePercent >= 0 ? "+" : ""}
                  {formatPercent(stockPriceChanges.dailyChangePercent)}
                </span>
                <span className="text-gray-500 text-lg">Today</span>
              </div>
            </div>
            <div className="md:text-right">
              <div className="text-sm text-gray-600 mb-2 font-medium">Market Capitalization</div>
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(stockMetadata.marketCap, true)}</div>
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
            <div className="text-2xl font-bold text-gray-900 mb-1">{stockMetadata.marketCap ? formatCurrency(stockMetadata.marketCap, true) : 'Unknown'}</div>
            <div className="text-sm text-gray-600 font-medium">Market Cap</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stockMetadata.peRatio ? stockMetadata.peRatio.toFixed(2) : 'Unknown'}</div>
            <div className="text-sm text-gray-600 font-medium">P/E Ratio</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stockMetadata.dividendYield ? formatPercent(stockMetadata.dividendYield) : 'Unknown'}</div>
            <div className="text-sm text-gray-600 font-medium">Dividend Yield</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stockMetadata.eps ? `$${stockMetadata.eps.toFixed(2)}` : 'Unknown'}</div>
            <div className="text-sm text-gray-600 font-medium">EPS</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stockMetadata.sharesOutstanding ? (stockMetadata.sharesOutstanding / 1000000000).toFixed(1) + 'B' : 'Unknown'}</div>
            <div className="text-sm text-gray-600 font-medium">Shares</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stockMetadata.employees ? (stockMetadata.employees / 1000).toFixed(0) + 'K' : 'Unknown'}</div>
            <div className="text-sm text-gray-600 font-medium">Employees</div>
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
          <div className="grid gap-6">
            <Card className="border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  Company Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">{stockMetadata.description}</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">CEO</span>
                    <span className="font-semibold text-gray-900">{stockMetadata.ceo}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Founded</span>
                    <span className="font-semibold text-gray-900">{stockMetadata.founded}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Headquarters</span>
                    <span className="font-semibold text-gray-900">{stockMetadata.headquarters}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  Key Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">52-Week High</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(stockMetadata.fiftyTwoWeekHigh)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">52-Week Low</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(stockMetadata.fiftyTwoWeekLow)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Avg. Volume</span>
                    <span className="font-semibold text-gray-900">{(stockMetadata.avgVolume / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Beta</span>
                    <span className="font-semibold text-gray-900">{stockMetadata.beta}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financials" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  Income Statement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Revenue</span>
                  <span className="font-bold text-gray-900">{formatCurrency(stockMetadata.revenue, true)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Net Income</span>
                  <span className="font-bold text-gray-900">{formatCurrency(stockMetadata.netIncome, true)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Revenue Growth</span>
                  <span className={`font-bold ${stockMetadata.financials.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stockMetadata.financials.revenueGrowth >= 0 ? "+" : ""}
                    {formatPercent(stockMetadata.financials.revenueGrowth)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Profit Margin</span>
                  <span className="font-bold text-gray-900">{formatPercent(stockMetadata.financials.profitMargin)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-white" />
                  </div>
                  Balance Sheet Ratios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Return on Equity (ROE)</span>
                  <span className="font-bold text-green-600">{formatPercent(stockMetadata.financials.roe)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Return on Assets (ROA)</span>
                  <span className="font-bold text-green-600">{formatPercent(stockMetadata.financials.roa)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Debt to Equity</span>
                  <span className="font-bold text-gray-900">{stockMetadata.financials.debtToEquity.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Current Ratio</span>
                  <span className={`font-bold ${stockMetadata.financials.currentRatio >= 1 ? "text-green-600" : "text-red-600"}`}>
                    {stockMetadata.financials.currentRatio.toFixed(2)}
                  </span>
                </div>
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
                  Stock Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex justify-between items-center p-4 rounded-lg ${stockPriceChanges.dailyChangePercent >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                  <span className="font-medium">Daily Return</span>
                  <span className={`font-bold text-lg ${stockPriceChanges.dailyChangePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stockPriceChanges.dailyChangePercent >= 0 ? "+" : ""}
                    {formatPercent(Math.abs(stockPriceChanges.dailyChangePercent))}
                  </span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-lg ${stockPriceChanges.oneMonthChangePercent >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                  <span className="font-medium">1 Month Return</span>
                  <span className={`font-bold text-lg ${stockPriceChanges.oneMonthChangePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stockPriceChanges.oneMonthChangePercent >= 0 ? "+" : ""}
                    {formatPercent(Math.abs(stockPriceChanges.oneMonthChangePercent))}
                  </span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-lg ${stockPriceChanges.threeMonthChangePercent >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                  <span className="font-medium">3 Month Return</span>
                  <span className={`font-bold text-lg ${stockPriceChanges.threeMonthChangePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stockPriceChanges.threeMonthChangePercent >= 0 ? "+" : ""}
                    {formatPercent(Math.abs(stockPriceChanges.threeMonthChangePercent))}
                  </span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-lg ${stockPriceChanges.oneYearChangePercent >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                  <span className="font-medium">1 Year Return</span>
                  <span className={`font-bold text-lg ${stockPriceChanges.oneYearChangePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stockPriceChanges.oneYearChangePercent >= 0 ? "+" : ""}
                    {formatPercent(Math.abs(stockPriceChanges.oneYearChangePercent))}
                  </span>
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
                  <span className="font-bold text-gray-900">{stockMetadata.beta}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Volatility (30-day)</span>
                  <span className="font-bold text-gray-900">21.4%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Sharpe Ratio</span>
                  <span className="font-bold text-gray-900">0.82</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <span className="font-medium">Max Drawdown (1Y)</span>
                  <span className="font-bold text-red-600 text-lg">-12.8%</span>
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
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Sector</div>
                    <div className="font-semibold text-gray-900">{stockMetadata.sector}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Industry</div>
                    <div className="font-semibold text-gray-900">{stockMetadata.industry}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Employees</div>
                    <div className="font-semibold text-gray-900">{stockMetadata.employees?.toLocaleString()}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Website</div>
                    <div className="font-semibold text-blue-600">{stockMetadata.website}</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-4 text-lg">Key Executives</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Timothy D. Cook</span>
                      <span className="text-sm text-gray-600">CEO & Director</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Luca Maestri</span>
                      <span className="text-sm text-gray-600">CFO & Senior Vice President</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Jeff Williams</span>
                      <span className="text-sm text-gray-600">Chief Operating Officer</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  Major Shareholders & Competitors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Institutional Holders</h4>
                  <div className="space-y-3">
                    {stockMetadata.institutionalHolders.map((holder, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                        <span className="font-medium">{holder.name}</span>
                        <span className="font-semibold">{formatPercent(holder.stake)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-4 text-lg">Key Competitors</h4>
                  <div className="space-y-3">
                    {stockMetadata.topCompetitors.map((competitor, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                        <span className="font-medium">{competitor.name}</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {competitor.symbol}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}