"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Globe, LineChart, TrendingUp, RefreshCw } from "lucide-react";
import { useMarketOverview } from "@/hooks/useMarketOverview";
import { useTranslations } from 'next-intl';
import { FearGreedSpeedometer } from "./fear-greed-speedometer";
import { MarketBreadthBar } from "./market-breadth-bar";

export function QuickStats() {
  const t = useTranslations('Dashboard.MarketOverview');
  const { marketOverview, loading, error, refetch } = useMarketOverview();

  // Helper mappings for localized key translations
  const getFearGreedKey = (label: string): string => {
    const normalized = label.toLowerCase().replace(/\s+/g, '');
    if (normalized.includes('extremefear')) return 'extremeFear';
    if (normalized.includes('extremegreed')) return 'extremeGreed';
    if (normalized.includes('fear')) return 'fear';
    if (normalized.includes('greed')) return 'greed';
    return 'neutral';
  };

  const getCategoryKey = (cat: string): string => {
    const normalized = cat.toLowerCase();
    if (normalized === 'stocks' || normalized === 'stock') return 'stocks';
    if (normalized === 'commodities' || normalized === 'commodity') return 'commodities';
    if (normalized === 'crypto' || normalized === 'cryptocurrency') return 'crypto';
    if (normalized === 'forex') return 'forex';
    if (normalized === 'indices' || normalized === 'index') return 'indices';
    if (normalized === 'funds' || normalized === 'fund') return 'fund';
    return cat;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-0 border-border/40 bg-card/40 animate-pulse h-[196px]">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div className="h-3 w-24 bg-muted rounded"></div>
                <div className="h-4 w-4 bg-muted rounded-full"></div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="h-10 w-16 bg-muted rounded"></div>
              </div>
              <div className="h-3 w-32 bg-muted rounded mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !marketOverview) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 p-6 flex flex-col items-center justify-center text-center">
        <p className="text-sm font-medium text-destructive">{t('errorLoadingStats')}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-xs font-semibold hover:bg-destructive/20 text-destructive-foreground transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </Card>
    );
  }

  const { fearGreed, breadth, hotCategory, markets } = marketOverview;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Fear & Greed Card */}
      <Card hoverable className="p-0 border border-border/40 bg-card/30 backdrop-blur-sm h-[196px] flex flex-col">
        <CardContent className="p-5 flex flex-col justify-between flex-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
              {t('fearGreedIndex')}
            </span>
            <LineChart className="h-4 w-4 text-amber-500" />
          </div>
          <div className="my-1.5">
            <FearGreedSpeedometer score={fearGreed.score} />
          </div>
          <div className="text-center">
            <div className="text-xs font-bold" style={{ color: getZoneColor(fearGreed.score) }}>
              {t(getFearGreedKey(fearGreed.label))}
            </div>
            <div className="text-[9px] text-muted-foreground/80 line-clamp-1 mt-0.5">
              {fearGreed.description}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Market Breadth Card */}
      <Card hoverable className="p-0 border border-border/40 bg-card/30 backdrop-blur-sm h-[196px] flex flex-col">
        <CardContent className="p-5 flex flex-col justify-between flex-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
              {t('marketBreadth')}
            </span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-mono font-bold text-emerald-500">
              {breadth.advancingPercent.toFixed(1)}%
            </div>
            <div className="text-[10px] font-medium text-muted-foreground/80 mt-0.5">
              {breadth.label ? breadth.label : t('strongParticipation')}
            </div>
          </div>
          <div>
            <MarketBreadthBar 
              advancing={breadth.advancingCount} 
              declining={breadth.decliningCount} 
              unchanged={breadth.unchangedCount} 
            />
            <div className="flex justify-between font-mono text-[9px] text-muted-foreground mt-2 border-t border-border/20 pt-1.5">
              <span className="text-emerald-500 font-semibold">▲ {breadth.advancingCount}</span>
              <span className="text-muted-foreground/60">◆ {breadth.unchangedCount}</span>
              <span className="text-rose-500 font-semibold">▼ {breadth.decliningCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Hot Category Card */}
      <Card hoverable className="p-0 border border-border/40 bg-card/30 backdrop-blur-sm h-[196px] flex flex-col">
        <CardContent className="p-5 flex flex-col justify-between flex-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
              {t('hotCategory')}
            </span>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {/* Leader */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <div>
                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-wider block">
                  {t('leader')}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {t(getCategoryKey(hotCategory.leader.category))}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-500">
                +{hotCategory.leader.medianChange.toFixed(2)}%
              </span>
            </div>
            {/* Weakest */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/5 border border-rose-500/10">
              <div>
                <span className="text-[8px] font-bold text-rose-500 uppercase tracking-wider block">
                  {t('weakest')}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {t(getCategoryKey(hotCategory.weakest.category))}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-rose-500">
                {hotCategory.weakest.medianChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Open Markets Card */}
      <Card hoverable className="p-0 border border-border/40 bg-card/30 backdrop-blur-sm h-[196px] flex flex-col">
        <CardContent className="p-5 flex flex-col justify-between flex-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
              {t('openMarkets')}
            </span>
            <Globe className="h-4 w-4 text-purple-500" />
          </div>
          <div className="flex flex-col justify-center flex-1 divide-y divide-border/20">
            {markets.markets.map((m, idx) => {
              const isOpen = m.status === 'OPEN';
              return (
                <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <span className="text-xs font-medium text-foreground">{m.market}</span>
                  <span className={`text-[10px] font-bold flex items-center gap-1.5 ${isOpen ? 'text-emerald-500' : 'text-muted-foreground/60'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/40'}`} />
                    {isOpen ? t('open') : t('closed')}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getZoneColor(val: number): string {
  if (val <= 25) return 'rgb(239, 68, 68)'; // Red
  if (val <= 45) return 'rgb(249, 115, 22)'; // Orange
  if (val <= 55) return 'rgb(234, 179, 8)'; // Yellow
  if (val <= 75) return 'rgb(34, 197, 94)'; // Green
  return 'rgb(16, 185, 129)'; // Emerald
}
