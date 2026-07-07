import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Globe } from 'lucide-react';
import { useFormatCurrency } from '@/utils/formatCurrency';

interface CompanyOverviewTabProps {
    description?: string;
    ceo?: string;
    founded?: number;
    headquarters?: string;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    avgVolume?: number;
    beta?: number;
}

export function CompanyOverviewTab({
    description,
    ceo,
    founded,
    headquarters,
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    avgVolume,
    beta
}: CompanyOverviewTabProps) {
    const formatCurrency = useFormatCurrency();

    return (
        <div className="grid gap-6">
            <Card className="border border-gray-100 dark:border-slate-700 shadow-md bg-white dark:bg-slate-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl dark:text-slate-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Info className="w-5 h-5 text-white" />
                        </div>
                        Company Description
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">{description}</p>
                    <div className="space-y-4">
                        {ceo && (
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">CEO</span>
                                <span className="font-semibold text-gray-900 dark:text-slate-100">{ceo}</span>
                            </div>
                        )}
                        {founded && (
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Founded</span>
                                <span className="font-semibold text-gray-900 dark:text-slate-100">{founded}</span>
                            </div>
                        )}
                        {headquarters && (
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Headquarters</span>
                                <span className="font-semibold text-gray-900 dark:text-slate-100">{headquarters}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-gray-100 dark:border-slate-700 shadow-md bg-white dark:bg-slate-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl dark:text-slate-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                        </div>
                        Key Statistics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">52-Week High</span>
                            <span className="font-semibold text-gray-900 dark:text-slate-100">{formatCurrency(fiftyTwoWeekHigh)}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">52-Week Low</span>
                            <span className="font-semibold text-gray-900 dark:text-slate-100">{formatCurrency(fiftyTwoWeekLow)}</span>
                        </div>
                        {avgVolume != null && (
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Avg. Volume</span>
                                <span className="font-semibold text-gray-900 dark:text-slate-100">{(avgVolume / 1000000).toFixed(2)}M</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Beta</span>
                            <span className="font-semibold text-gray-900 dark:text-slate-100">{beta || 'Unknown'}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
