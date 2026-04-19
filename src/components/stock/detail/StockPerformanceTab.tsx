import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shield } from 'lucide-react';
import { formatPercent } from '@/utils/formatPercent';

interface StockPerformanceTabProps {
    dailyChangePercent?: number;
    oneMonthChangePercent?: number;
    threeMonthChangePercent?: number;
    oneYearChangePercent?: number;
    beta?: number;
}

export function StockPerformanceTab({
    dailyChangePercent,
    oneMonthChangePercent,
    threeMonthChangePercent,
    oneYearChangePercent,
    beta
}: StockPerformanceTabProps) {
    return (
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
                    {dailyChangePercent != null && (
                        <div className={`flex justify-between items-center p-4 rounded-lg ${dailyChangePercent >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                            <span className="font-medium">Daily Return</span>
                            <span className={`font-bold text-lg ${dailyChangePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {dailyChangePercent >= 0 ? "+" : ""}
                                {formatPercent(Math.abs(dailyChangePercent))}
                            </span>
                        </div>
                    )}
                    {oneMonthChangePercent != null && (
                        <div className={`flex justify-between items-center p-4 rounded-lg ${oneMonthChangePercent >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                            <span className="font-medium">1 Month Return</span>
                            <span className={`font-bold text-lg ${oneMonthChangePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {oneMonthChangePercent >= 0 ? "+" : ""}
                                {formatPercent(Math.abs(oneMonthChangePercent))}
                            </span>
                        </div>
                    )}
                    {threeMonthChangePercent != null && (
                        <div className={`flex justify-between items-center p-4 rounded-lg ${threeMonthChangePercent >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                            <span className="font-medium">3 Month Return</span>
                            <span className={`font-bold text-lg ${threeMonthChangePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {threeMonthChangePercent >= 0 ? "+" : ""}
                                {formatPercent(Math.abs(threeMonthChangePercent))}
                            </span>
                        </div>
                    )}
                    {oneYearChangePercent != null && (
                        <div className={`flex justify-between items-center p-4 rounded-lg ${oneYearChangePercent >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                            <span className="font-medium">1 Year Return</span>
                            <span className={`font-bold text-lg ${oneYearChangePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {oneYearChangePercent >= 0 ? "+" : ""}
                                {formatPercent(Math.abs(oneYearChangePercent))}
                            </span>
                        </div>
                    )}
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
                        <span className="font-bold text-gray-900">{beta || 'Unknown'}</span>
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
    );
}
