import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatPercent } from '@/utils/formatPercent';

interface InstitutionalHolder {
    name: string;
    stake: number;
}

interface Competitor {
    name: string;
    symbol: string;
}

interface StockDetailsTabProps {
    sector?: string;
    industry?: string;
    employees?: number;
    website?: string;
    institutionalHolders?: InstitutionalHolder[];
    topCompetitors?: Competitor[];
}

export function StockDetailsTab({
    sector,
    industry,
    employees,
    website,
    institutionalHolders,
    topCompetitors
}: StockDetailsTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-gray-100 dark:border-slate-700 shadow-md bg-white dark:bg-slate-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl dark:text-slate-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        Company Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {sector && (
                            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sector</div>
                                <div className="font-semibold text-gray-900 dark:text-slate-100">{sector}</div>
                            </div>
                        )}
                        {industry && (
                            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Industry</div>
                                <div className="font-semibold text-gray-900 dark:text-slate-100">{industry}</div>
                            </div>
                        )}
                        {employees != null && (
                            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Employees</div>
                                <div className="font-semibold text-gray-900 dark:text-slate-100">{employees?.toLocaleString()}</div>
                            </div>
                        )}
                        {website && (
                            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Website</div>
                                <div className="font-semibold text-blue-600 dark:text-blue-400">{website}</div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-gray-100 dark:border-slate-700 shadow-md bg-white dark:bg-slate-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl dark:text-slate-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        Major Shareholders & Competitors
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {institutionalHolders && institutionalHolders.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-4 text-lg dark:text-slate-200">Institutional Holders</h4>
                            <div className="space-y-3">
                                {institutionalHolders.map((holder) => (
                                    <div key={holder.name} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800/50 dark:to-slate-850/30 rounded-lg">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{holder.name}</span>
                                        <span className="font-semibold text-gray-900 dark:text-slate-100">{formatPercent(holder.stake)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {topCompetitors && topCompetitors.length > 0 && (
                        <div className={institutionalHolders && institutionalHolders.length > 0 ? "pt-4 border-t dark:border-slate-800" : ""}>
                            <h4 className="font-semibold mb-4 text-lg dark:text-slate-200">Key Competitors</h4>
                            <div className="space-y-3">
                                {topCompetitors.map((competitor) => (
                                    <div key={competitor.symbol} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800/50 dark:to-slate-850/30 rounded-lg">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{competitor.name}</span>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30">
                                            {competitor.symbol}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
