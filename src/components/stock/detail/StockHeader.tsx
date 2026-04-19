import React from 'react';
import { Building2, Target, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StockHeaderProps {
    symbol: string;
    name: string;
    sector: string;
    industry: string;
    primaryExchange: string;
}

export function StockHeader({ symbol, name, sector, industry, primaryExchange }: StockHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                {symbol}
                            </h1>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                                <Target className="w-3 h-3 mr-1" />
                                Active
                            </Badge>
                        </div>
                        <p className="text-xl text-gray-600 font-medium">{name}</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Watchlist
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {sector}
                </Badge>
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {industry}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {primaryExchange}
                </Badge>
            </div>
        </div>
    );
}
