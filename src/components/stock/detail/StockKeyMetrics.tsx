import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Zap, TrendingUp, BarChart3, Factory, Users } from 'lucide-react';
import { useFormatCurrency } from '@/utils/formatCurrency';
import { formatPercent } from '@/utils/formatPercent';

interface StockKeyMetricsProps {
    marketCap: number;
    peRatio: number;
    dividendYield: number;
    eps?: number;
    sharesOutstanding?: number;
    employees?: number;
}

export function StockKeyMetrics({
    marketCap,
    peRatio,
    dividendYield,
    eps,
    sharesOutstanding,
    employees
}: StockKeyMetricsProps) {
    const formatCurrency = useFormatCurrency();

    return (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{marketCap ? formatCurrency(marketCap, true) : 'Unknown'}</div>
                    <div className="text-sm text-gray-600 font-medium">Market Cap</div>
                </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{peRatio ? peRatio.toFixed(2) : 'Unknown'}</div>
                    <div className="text-sm text-gray-600 font-medium">P/E Ratio</div>
                </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{dividendYield ? formatPercent(dividendYield) : 'Unknown'}</div>
                    <div className="text-sm text-gray-600 font-medium">Dividend Yield</div>
                </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{eps ? `$${eps.toFixed(2)}` : 'Unknown'}</div>
                    <div className="text-sm text-gray-600 font-medium">EPS</div>
                </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Factory className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{sharesOutstanding ? (sharesOutstanding / 1000000000).toFixed(1) + 'B' : 'Unknown'}</div>
                    <div className="text-sm text-gray-600 font-medium">Shares</div>
                </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{employees ? (employees / 1000).toFixed(0) + 'K' : 'Unknown'}</div>
                    <div className="text-sm text-gray-600 font-medium">Employees</div>
                </CardContent>
            </Card>
        </div>
    );
}
