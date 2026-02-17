"use client";

import { Clock } from "lucide-react";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => { };
const getSnapshot = () => new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString();
const getServerSnapshot = () => "--:--:--";

export default function PageHeader() {
  const lastUpdated = useSyncExternalStore(
    emptySubscribe,
    getSnapshot,
    getServerSnapshot
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
        <p className="text-muted-foreground">
          Rich market data, trends, and financial insights
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span suppressHydrationWarning>Last updated: {lastUpdated}</span>
      </div>
    </div>
  );
}
