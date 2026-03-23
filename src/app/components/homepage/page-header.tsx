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
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 py-4 border-b border-border/40 mb-2 relative z-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Market Overview</h1>
                <p className="text-muted-foreground text-sm font-medium">
                    Real-time financial intelligence & global asset trends
                </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-md border border-border/50 backdrop-blur-sm">
                <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Clock className="h-3.5 w-3.5" />
                <span suppressHydrationWarning>SYNCED: {lastUpdated}</span>
            </div>
        </div>
    );
}
