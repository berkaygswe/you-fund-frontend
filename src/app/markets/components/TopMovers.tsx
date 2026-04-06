import { ArrowDownRight, ArrowUpRight, Flame, Snowflake } from "lucide-react"

interface Mover {
    symbol: string;
    name: string;
    type: string;
    price: number;
    change: number;
}

export function TopMovers({ gainers, losers }: { gainers: Mover[], losers: Mover[] }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Gainers */}
            <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Top Gainers</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {gainers.map((g, i) => (
                        <div key={i} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors group cursor-pointer relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <div className="font-bold text-foreground">{g.symbol}</div>
                                <div className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full border border-border/50">{g.type}</div>
                            </div>
                            <div className="text-xs text-muted-foreground mb-4 relative z-10 line-clamp-1">{g.name}</div>
                            <div className="flex justify-between items-end relative z-10">
                                <div className="font-mono font-medium text-foreground">{g.price < 10 ? g.price.toPrecision(4) : g.price.toLocaleString()}</div>
                                <div className="flex items-center text-xs font-mono font-bold text-emerald-500">
                                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> {g.change}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Losers */}
            <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                    <Snowflake className="h-4 w-4 text-rose-500" />
                    <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Top Losers</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {losers.map((l, i) => (
                        <div key={i} className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-colors group cursor-pointer relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <div className="font-bold text-foreground">{l.symbol}</div>
                                <div className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full border border-border/50">{l.type}</div>
                            </div>
                            <div className="text-xs text-muted-foreground mb-4 relative z-10 line-clamp-1">{l.name}</div>
                            <div className="flex justify-between items-end relative z-10">
                                <div className="font-mono font-medium text-foreground">{l.price < 10 ? l.price.toPrecision(4) : l.price.toLocaleString()}</div>
                                <div className="flex items-center text-xs font-mono font-bold text-rose-500">
                                    <ArrowDownRight className="h-3 w-3 mr-0.5" /> {Math.abs(l.change)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
