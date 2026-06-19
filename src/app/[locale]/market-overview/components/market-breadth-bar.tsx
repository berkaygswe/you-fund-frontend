"use client";
import React from 'react';

interface MarketBreadthBarProps {
  advancing: number;
  declining: number;
  unchanged: number;
}

export function MarketBreadthBar({ advancing, declining, unchanged }: MarketBreadthBarProps) {
  const total = advancing + declining + unchanged;
  const advancingPercent = total > 0 ? (advancing / total) * 100 : 0;
  const decliningPercent = total > 0 ? (declining / total) * 100 : 0;
  const unchangedPercent = total > 0 ? (unchanged / total) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-1.5 mt-2">
      <div className="h-2 w-full rounded-full overflow-hidden bg-muted flex">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500" 
          style={{ width: `${advancingPercent}%` }}
          title={`Advancing: ${advancing}`}
        />
        <div 
          className="h-full bg-muted-foreground/35 transition-all duration-500" 
          style={{ width: `${unchangedPercent}%` }}
          title={`Unchanged: ${unchanged}`}
        />
        <div 
          className="h-full bg-rose-500 transition-all duration-500" 
          style={{ width: `${decliningPercent}%` }}
          title={`Declining: ${declining}`}
        />
      </div>
    </div>
  );
}
