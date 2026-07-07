import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFormatCurrency } from '@/utils/formatCurrency';
import { formatPercent } from '@/utils/formatPercent';

interface StockPriceCardProps {
    closePrice: number;
    dailyChangePercent: number;
    marketCap: number;
}

export function StockPriceCard({ closePrice, dailyChangePercent, marketCap }: StockPriceCardProps) {
    const formatCurrency = useFormatCurrency();

    return (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
            <CardContent className="p-8">
                <div className="flex text-center md:text-left gap-4 flex-col md:flex-row items-center justify-between">
                    <div>
                        <div className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
                            {formatCurrency(closePrice)}
                        </div>
                        <div className={`flex items-center gap-3 text-xl font-medium ${dailyChangePercent >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            }`}>
                            {dailyChangePercent >= 0 ? (
                                <ArrowUpRight className="h-6 w-6" />
                            ) : (
                                <ArrowDownRight className="h-6 w-6" />
                            )}
                            <span>
                                {dailyChangePercent >= 0 ? "+" : ""}
                                {formatPercent(dailyChangePercent)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-lg">Today</span>
                        </div>
                    </div>
                    <div className="md:text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Market Capitalization</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(marketCap, true)}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
