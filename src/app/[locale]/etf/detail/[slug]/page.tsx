"use client"

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    TrendingUp, Globe, Building2, Calendar, DollarSign, BarChart3, 
    PieChart, Info, ExternalLink, Shield, Zap, Target, ArrowUpRight, 
    ArrowDownRight, Star, Layers, Wallet, Activity, Percent, ArrowRight,
    BookOpen
} from 'lucide-react';
import { useFormatCurrency } from '@/utils/formatCurrency';
import { formatPercent } from '@/utils/formatPercent';
import FundDetailGraph from '@/components/fund-detail/FundDetailGraph';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEtfMetada } from '@/hooks/useEtfMetada';
import { useParams } from 'next/navigation';
import { useEtfPriceChanges } from '@/hooks/useEtfPriceChanges';
import { useCurrency } from '@/hooks/useCurrency';
import ImageWrap from '@/components/ImageWrap';

const GlassCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <Card className={`border border-white/40 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${className}`}>
        {children}
    </Card>
);

const colors = {
    blue: "bg-blue-50/50 dark:bg-blue-500/10 border-blue-100/50 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/20 group-hover:text-blue-700 dark:group-hover:text-blue-300",
    emerald: "bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-100/50 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/20 group-hover:text-emerald-700 dark:group-hover:text-emerald-300",
    indigo: "bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-100/50 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-700 dark:group-hover:text-indigo-300",
    violet: "bg-violet-50/50 dark:bg-violet-500/10 border-violet-100/50 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 group-hover:bg-violet-50 dark:group-hover:bg-violet-500/20 group-hover:text-violet-700 dark:group-hover:text-violet-300",
    amber: "bg-amber-50/50 dark:bg-amber-500/10 border-amber-100/50 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/20 group-hover:text-amber-700 dark:group-hover:text-amber-300",
    rose: "bg-rose-50/50 dark:bg-rose-500/10 border-rose-100/50 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 group-hover:bg-rose-50 dark:group-hover:bg-rose-500/20 group-hover:text-rose-700 dark:group-hover:text-rose-300",
    slate: "bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 group-hover:text-slate-800 dark:group-hover:text-slate-200"
};

type ColorKey = keyof typeof colors;

const MetricCard = ({ title, value, icon: Icon, color = 'blue' }: { title: string, value: string | React.ReactNode, icon: any, color?: ColorKey }) => {
    return (
        <GlassCard className="transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group overflow-hidden relative">
            {/* Subtle glow effect */}
            <div className={`absolute -right-8 -top-8 w-24 h-24 blur-3xl opacity-[0.15] dark:opacity-10 pointer-events-none rounded-full bg-${color}-500`} />
            
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                        {title}
                    </div>
                    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center transition-all duration-500 ${colors[color]}`}>
                        <Icon className="w-5 h-5 transition-colors duration-300" />
                    </div>
                </div>
                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate">
                    {value}
                </div>
            </CardContent>
        </GlassCard>
    );
};

export default function EtfDetailPage() {
    const currency = useCurrency();
    const params = useParams();
    const slug = params.slug as string;

    const { etfMetadata, loading } = useEtfMetada(slug);
    const { etfPriceChanges, loading: etfPriceChangeLoading } = useEtfPriceChanges(slug, currency);

    const formatCurrency = useFormatCurrency();

    const sectors = useMemo(() => {
        if (!etfMetadata?.sectorAllocation) return [];
        return Object.entries(etfMetadata.sectorAllocation)
            .map(([sector, weight]) => ({ sector, weight }))
            .filter(s => s.weight > 0)
            .sort((a, b) => b.weight - a.weight);
    }, [etfMetadata]);

    if (loading || etfPriceChangeLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative flex items-center justify-center w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-r-2 border-blue-400 animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
                </div>
            </div>
        );
    }

    if (!etfMetadata || !etfPriceChanges) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <GlassCard className="max-w-md p-10 flex flex-col items-center border border-red-100/50 dark:border-red-500/20 bg-white/40">
                    <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-center justify-center mb-6">
                        <Activity className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Data Unavailable</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                        We couldn&apos;t retrieve the quantitative metrics for this instrument. It may be temporarily unavailable or the ticker might be unrecognized.
                    </p>
                    <Button 
                        variant="default"
                        className="rounded-xl px-8 h-12 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 transition-all font-medium"
                        onClick={() => window.location.reload()}
                    >
                        Reinitialize Data
                    </Button>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-[1400px]">
            {/* Contextual Header */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            {etfMetadata.iconUrl ? (
                                <ImageWrap
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/logo/etf/${etfMetadata.iconUrl}`}
                                    width={72}
                                    height={72}
                                    className='rounded-2xl shadow-sm border border-white/20'
                                    alt={`${etfMetadata.managementCompany} logo`}
                                />
                            ) : (
                                <div className="w-[72px] h-[72px] bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
                                    <BarChart3 className="w-9 h-9 text-white/90" />
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-white"></span>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex items-center gap-3 mb-1.5">
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    {etfMetadata.symbol}
                                </h1>
                            </div>
                            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium tracking-wide">
                                {etfMetadata.managementCompany} &middot; <span className="font-semibold text-slate-800 dark:text-slate-300">{etfMetadata.etfType}</span>
                            </p>
                        </div>
                    </div>
                    
                    <Button className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all font-medium flex gap-2 w-full md:w-auto">
                        <Star className="w-4 h-4 fill-white/20" />
                        Add to Watchlist
                    </Button>
                </div>

                <div className="flex flex-col mb-4 gap-1">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight leading-snug max-w-4xl">
                        {etfMetadata.name}
                    </h2>
                </div>

                <div className="flex flex-wrap gap-2.5">
                    <Badge variant="secondary" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg">
                        {etfMetadata.etfType || "N/A"}
                    </Badge>
                    <Badge variant="secondary" className="bg-indigo-50/60 dark:bg-indigo-500/10 backdrop-blur-md border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg">
                        {etfMetadata.currency}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-50/60 dark:bg-blue-500/10 backdrop-blur-md border border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg">
                        {etfMetadata.primaryExchange}
                    </Badge>
                </div>
            </div>

            {/* Core Snapshot Header Card */}
            <GlassCard className="mb-8 overflow-hidden relative">
                {/* Visual texture overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-indigo-50/30 to-purple-50/30 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 mix-blend-overlay"></div>
                
                <CardContent className="p-8 md:p-10 relative z-10">
                    <div className="flex text-center md:text-left gap-8 flex-col md:flex-row items-center justify-between">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-2">
                                Current Price ({etfMetadata.currency})
                            </div>
                            <div className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-4">
                                {formatCurrency(etfPriceChanges.price)}
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-bold backdrop-blur-md border ${
                                etfPriceChanges.dailyChangePercent >= 0 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                                : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                            }`}>
                                {etfPriceChanges.dailyChangePercent >= 0 ? (
                                    <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
                                ) : (
                                    <ArrowDownRight className="h-5 w-5 stroke-[2.5]" />
                                )}
                                <span>
                                    {etfPriceChanges.dailyChangePercent >= 0 ? "+" : ""}
                                    {formatPercent(etfPriceChanges.dailyChangePercent)}
                                </span>
                                <span className="text-slate-600 dark:text-slate-400 ml-1 text-sm font-medium tracking-wide opacity-80 uppercase">Today</span>
                            </div>
                        </div>
                        <div className="h-px w-full md:w-px md:h-32 bg-slate-200 dark:bg-slate-800"></div>
                        <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                            <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-2 text-right">
                                Total Assets (AUM)
                            </div>
                            <div className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                                {formatCurrency(etfMetadata.aum, true)}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <Wallet className="w-4 h-4" /> Capital allocation
                            </div>
                        </div>
                    </div>
                </CardContent>
            </GlassCard>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
                <MetricCard 
                    title="Expense Ratio" 
                    value={etfMetadata.expenseRatio ? formatPercent(etfMetadata.expenseRatio * 100) : 'N/A'} 
                    icon={Percent} 
                    color="indigo"
                />
                <MetricCard 
                    title="Dividend Yield" 
                    value={etfMetadata.dividendYield ? formatPercent(etfMetadata.dividendYield * 100) : 'N/A'} 
                    icon={TrendingUp} 
                    color="emerald"
                />
                <MetricCard 
                    title="P/E Ratio" 
                    value={etfMetadata.peRatio ? etfMetadata.peRatio.toFixed(2) : 'N/A'} 
                    icon={Activity} 
                    color="amber"
                />
                <MetricCard 
                    title="Holdings" 
                    value={etfMetadata.holdingsCount ? etfMetadata.holdingsCount.toLocaleString() : 'N/A'} 
                    icon={Building2} 
                    color="violet"
                />
                <MetricCard 
                    title="P/B Ratio" 
                    value={etfMetadata.pbRatio ? etfMetadata.pbRatio.toFixed(2) : 'N/A'} 
                    icon={Shield} 
                    color="rose"
                />
                <MetricCard 
                    title="Inception" 
                    value={etfMetadata.inceptionDate ? new Date(etfMetadata.inceptionDate).getFullYear().toString() : 'N/A'} 
                    icon={Calendar} 
                    color="slate"
                />
            </div>

            {/* Price Action Chart Area */}
            <div className="mb-10 w-full overflow-hidden rounded-3xl border border-white/40 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5 dark:ring-white/5">
                <div className="p-4 border-b border-white/40 dark:border-slate-800 bg-white/20 dark:bg-transparent">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Price Action</h3>
                </div>
                <FundDetailGraph className="border-0 bg-transparent" code={slug} />
            </div>

            {/* Deep Dive Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/50 dark:border-slate-800/80 shadow-sm w-full md:w-auto inline-flex overflow-x-auto">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-xl px-6 py-2.5 font-medium transition-all duration-300">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="holdings" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-xl px-6 py-2.5 font-medium transition-all duration-300">
                        Holdings & Segments
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-xl px-6 py-2.5 font-medium transition-all duration-300">
                        Performance Analytics
                    </TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-xl px-6 py-2.5 font-medium transition-all duration-300">
                        Fund Specifics
                    </TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid gap-6">
                        <GlassCard>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
                                        <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    Objective & Strategy
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[15px] mb-8">{etfMetadata.description}</p>
                                
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Structure Profiling</h4>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-white/60 transition-colors">
                                        <div className="text-sm text-slate-500 mb-1">Legal Structure</div>
                                        <div className="font-semibold text-slate-900 dark:text-white text-lg">{etfMetadata.legalStructure}</div>
                                    </div>
                                    <div className="p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-white/60 transition-colors">
                                        <div className="text-sm text-slate-500 mb-1">Fund Type</div>
                                        <div className="font-semibold text-slate-900 dark:text-white text-lg">{etfMetadata.etfType || 'N/A'}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </GlassCard>
                    </div>
                </TabsContent>

                {/* HOLDINGS & SEGMENTS TAB */}
                <TabsContent value="holdings" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <GlassCard>
                            <CardHeader className="pb-6 border-b border-slate-100 dark:border-slate-800/50 mb-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                                            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        Top 10 Holdings
                                    </CardTitle>
                                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                        {etfMetadata.holdingsCount.toLocaleString()} Total
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 px-6 pb-6">
                                {etfMetadata.topHoldings?.map((holding: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-700/30 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 flex justify-center text-sm font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                                                {idx + 1}
                                            </div>
                                            <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{holding.Name}</div>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div className="font-bold text-lg text-slate-900 dark:text-white">{formatPercent(holding['Holding Percent'] * 100)}</div>
                                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full hidden sm:block overflow-hidden">
                                                 <div 
                                                    className="h-full bg-blue-500 rounded-full" 
                                                    style={{ width: `${Math.min(holding['Holding Percent'] * 100 * 3, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!etfMetadata.topHoldings || etfMetadata.topHoldings.length === 0) && (
                                    <div className="py-8 text-center text-slate-500">No holdings data available</div>
                                )}
                            </CardContent>
                        </GlassCard>

                        <GlassCard>
                            <CardHeader className="pb-6 border-b border-slate-100 dark:border-slate-800/50 mb-4">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                    <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-100 dark:border-purple-500/20">
                                        <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    Sector Exposure
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 space-y-5">
                                {sectors.map((sector: any) => (
                                    <div key={sector.sector} className="group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">{sector.sector}</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatPercent(sector.weight * 100)}</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-out overlay-shine"
                                                style={{ width: `${sector.weight * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {sectors.length === 0 && (
                                    <div className="py-8 text-center text-slate-500">No sector data available</div>
                                )}
                            </CardContent>
                        </GlassCard>
                    </div>
                </TabsContent>

                {/* PERFORMANCE TAB */}
                <TabsContent value="performance" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid gap-8 max-w-4xl mx-auto">
                        <GlassCard>
                            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50 mb-4">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                                        <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    Historical Returns
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 px-6 pb-6">
                                {[{ label: 'Daily Return', val: etfPriceChanges.dailyChangePercent },
                                  { label: 'Monthly Return', val: etfPriceChanges.monthlyChangePercent },
                                  { label: 'YTD Return', val: etfPriceChanges.ytdChangePercent },
                                  { label: '1 Year Return', val: etfPriceChanges.yearlyChangePercent }
                                 ].map((item) => (
                                    <div key={item.label} className={`flex justify-between items-center p-5 rounded-2xl border transition-colors ${
                                        item.val >= 0 
                                            ? "bg-emerald-50/40 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-500/20 hover:bg-emerald-50" 
                                            : "bg-rose-50/40 border-rose-100 dark:bg-rose-900/10 dark:border-rose-500/20 hover:bg-rose-50"
                                    }`}>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                                        <span className={`font-bold text-xl ${item.val >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                            {item.val >= 0 ? "+" : ""}
                                            {formatPercent(item.val)}
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </GlassCard>
                    </div>
                </TabsContent>

                {/* DETAILS TAB */}
                <TabsContent value="details" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid lg:grid-cols-2 gap-8">
                        <GlassCard>
                            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50 mb-4">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                        <Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    Fund Blueprint
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8 px-6 pb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl">
                                        <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Inception Date</div>
                                        <div className="font-bold text-slate-900 dark:text-white text-lg">{new Date(etfMetadata.inceptionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}</div>
                                    </div>
                                    <div className="p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl">
                                        <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Exchange</div>
                                        <div className="font-bold text-slate-900 dark:text-white text-lg">{etfMetadata.primaryExchange}</div>
                                    </div>
                                    <div className="p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl">
                                        <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Benchmark</div>
                                        <div className="font-bold text-slate-900 dark:text-white text-lg">{etfMetadata.benchmarkIndex || 'N/A'}</div>
                                    </div>
                                    <div className="p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl">
                                        <div className="text-[13px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Dist. Frequency</div>
                                        <div className="font-bold text-slate-900 dark:text-white text-lg">{etfMetadata.distributionFrequency || 'N/A'}</div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Structure Classifications</h4>
                                    <div className="flex flex-wrap gap-3">
                                        <div className={`px-4 py-2 rounded-xl border text-sm font-bold ${etfMetadata.isLeveraged ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                                            {etfMetadata.isLeveraged ? 'Leveraged' : 'Not Leveraged'}
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl border text-sm font-bold ${etfMetadata.isInverse ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                                            {etfMetadata.isInverse ? 'Inverse' : 'Not Inverse'}
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl border text-sm font-bold ${etfMetadata.isActivelyManaged ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
                                            {etfMetadata.isActivelyManaged ? 'Actively Managed' : 'Passively Managed'}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </GlassCard>

                        <GlassCard>
                            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50 mb-4">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                                        <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    Knowledge Center
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 px-6 pb-6">
                                <button className="w-full flex items-center justify-between p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl hover:bg-blue-50/50 dark:hover:bg-blue-900/10 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300 group">
                                    <div className="text-left">
                                        <div className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">Fund Prospectus</div>
                                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Download official disclosure documents</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ArrowRight className="w-5 h-5 text-blue-500" />
                                    </div>
                                </button>

                                <button className="w-full flex items-center justify-between p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all duration-300 group">
                                    <div className="text-left">
                                        <div className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">Annual Report</div>
                                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">View latest comprehensive financials</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ArrowRight className="w-5 h-5 text-emerald-500" />
                                    </div>
                                </button>
                                
                                <button className="w-full flex items-center justify-between p-5 bg-white/40 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl hover:bg-purple-50/50 dark:hover:bg-purple-900/10 hover:border-purple-200 dark:hover:border-purple-900/50 transition-all duration-300 group">
                                    <div className="text-left">
                                        <div className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">Holdings Breakdown</div>
                                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Export complete portfolio dataset</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ArrowRight className="w-5 h-5 text-purple-500" />
                                    </div>
                                </button>
                            </CardContent>
                        </GlassCard>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
