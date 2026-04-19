import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart } from 'lucide-react';
import { useFormatCurrency } from '@/utils/formatCurrency';
import { formatPercent } from '@/utils/formatPercent';

interface StockFinancialsTabProps {
    revenue?: number;
    netIncome?: number;
    revenueGrowth?: number;
    profitMargin?: number;
    roe?: number;
    roa?: number;
    debtToEquity?: number;
    currentRatio?: number;
}

export function StockFinancialsTab({
    revenue,
    netIncome,
    revenueGrowth,
    profitMargin,
    roe,
    roa,
    debtToEquity,
    currentRatio
}: StockFinancialsTabProps) {
    const formatCurrency = useFormatCurrency();

    return (
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
                    {revenue != null && (
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Revenue</span>
                            <span className="font-bold text-gray-900">{formatCurrency(revenue, true)}</span>
                        </div>
                    )}
                    {netIncome != null && (
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Net Income</span>
                            <span className="font-bold text-gray-900">{formatCurrency(netIncome, true)}</span>
                        </div>
                    )}
                    {revenueGrowth != null && (
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Revenue Growth</span>
                            <span className={`font-bold ${revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {revenueGrowth >= 0 ? "+" : ""}
                                {formatPercent(revenueGrowth)}
                            </span>
                        </div>
                    )}
                    {profitMargin != null && (
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Profit Margin</span>
                            <span className="font-bold text-gray-900">{formatPercent(profitMargin)}</span>
                        </div>
                    )}
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
                    {roe != null && (
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Return on Equity (ROE)</span>
                            <span className="font-bold text-green-600">{formatPercent(roe)}</span>
                        </div>
                    )}
                    {roa != null && (
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Return on Assets (ROA)</span>
                            <span className="font-bold text-green-600">{formatPercent(roa)}</span>
                        </div>
                    )}
                    {debtToEquity != null && (
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Debt to Equity</span>
                            <span className="font-bold text-gray-900">{debtToEquity.toFixed(1)}%</span>
                        </div>
                    )}
                    {currentRatio != null && (
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Current Ratio</span>
                            <span className={`font-bold ${currentRatio >= 1 ? "text-green-600" : "text-red-600"}`}>
                                {currentRatio.toFixed(2)}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
