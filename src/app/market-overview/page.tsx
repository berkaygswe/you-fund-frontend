import Link from "next/link"
import AssetComparison from "../components/fund-detail/AssetComparsion"
import AssetTopMovers from "../components/homepage/asset-top-movers"
import FinanceNews from "../components/homepage/finance-news"
import FundTypePerformance from "../components/homepage/fund-type-performance"
import { SectionCards } from "../components/homepage/section-cards"
import { Search, Calendar, LineChart, TrendingUp, BarChart3, Globe, Activity, DollarSign, ArrowUpRight } from "lucide-react"
import PageHeader from "../components/homepage/page-header"
import { SlidingMarketTicker } from "./components/sliding-ticker"

export default function MarketOverview() {
    return (
        <div className="relative min-h-screen w-full pb-12 overflow-x-hidden">
            {/* Minimalist Neo-Quant Background */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_40%,transparent_100%)]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col space-y-6 w-full max-w-[1600px] mx-auto pt-2">

                {/* Header */}
                <div className="px-1 sm:px-2">
                    <PageHeader />
                </div>

                {/* Sliding Market Ticker */}
                <div className="relative z-20 w-full">
                    <SlidingMarketTicker />
                </div>

                {/* Data-Dense Quick Stats */}
                <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4 bg-border/40 border border-border/40 rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm">
                    {/* Stat 1 */}
                    <div className="bg-background/80 hover:bg-background/95 transition-colors p-6 flex flex-col justify-between group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Total Assets</span>
                            <Globe className="h-4 w-4 text-blue-500/80 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div>
                            <div className="text-3xl font-mono font-bold tracking-tight text-foreground">1,247</div>
                            <div className="flex items-center mt-2 text-xs font-mono font-medium">
                                <span className="text-emerald-500 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
                                    <TrendingUp className="h-3 w-3 mr-1" /> +12.5%
                                </span>
                                <span className="text-muted-foreground/60 ml-2">from 30d</span>
                            </div>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-background/80 hover:bg-background/95 transition-colors p-6 flex flex-col justify-between group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Active Markets</span>
                            <Activity className="h-4 w-4 text-indigo-500/80 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <div>
                            <div className="text-3xl font-mono font-bold tracking-tight text-foreground">24</div>
                            <div className="flex items-center mt-2 text-xs font-mono font-medium">
                                <span className="text-emerald-500 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
                                    <TrendingUp className="h-3 w-3 mr-1" /> +2
                                </span>
                                <span className="text-muted-foreground/60 ml-2">new this wk</span>
                            </div>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-background/80 hover:bg-background/95 transition-colors p-6 flex flex-col justify-between group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">24h Volume</span>
                            <DollarSign className="h-4 w-4 text-emerald-500/80 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <div>
                            <div className="text-3xl font-mono font-bold tracking-tight text-foreground">$2.4B</div>
                            <div className="flex items-center mt-2 text-xs font-mono font-medium">
                                <span className="text-emerald-500 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
                                    <TrendingUp className="h-3 w-3 mr-1" /> +8.2%
                                </span>
                                <span className="text-muted-foreground/60 ml-2">from 24h</span>
                            </div>
                        </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="bg-background/80 hover:bg-background/95 transition-colors p-6 flex flex-col justify-between group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Market Sentiment</span>
                            <LineChart className="h-4 w-4 text-amber-500/80 group-hover:text-amber-500 transition-colors" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold tracking-tight text-emerald-500 font-mono">BULLISH</div>
                            <div className="flex items-center mt-2 text-xs font-mono font-medium">
                                <span className="text-foreground/80">65%</span>
                                <span className="text-muted-foreground/60 ml-1">positive metrics</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Market Movers */}
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">Volatility Watch</h2>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-md p-4 lg:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                        <AssetTopMovers />
                    </div>
                </div>

                {/* Market Performance */}
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground group">Market Performance Grid</h2>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-md p-1 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                        <SectionCards />
                    </div>
                </div>

                {/* Dashboard Bento Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-12">

                    {/* Left/Main Column */}
                    <div className="xl:col-span-8 flex flex-col space-y-8">

                        {/* Compare Assets */}
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">Asset Cross-Comparison</h2>
                            </div>
                            <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-md p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                                <AssetComparison code="" />
                            </div>
                        </div>

                        {/* Finance News */}
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">Live Intelligence Feed</h2>
                                </div>
                                <button className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                                    View Archive <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                            <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-md p-2 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-l-2 border-l-blue-500/50">
                                <FinanceNews />
                            </div>
                        </div>
                    </div>

                    {/* Right/Sidebar Column */}
                    <div className="xl:col-span-4 flex flex-col space-y-8">

                        {/* Fund Performance */}
                        <div className="flex flex-col space-y-3">
                            <FundTypePerformance />
                        </div>

                        {/* Action Bay (Quick Links) */}
                        <div className="flex flex-col space-y-3 pt-4">
                            <div className="flex items-center gap-2 px-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">Command Center</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                                {[
                                    { href: "fund", icon: TrendingUp, label: "Explore Funds" },
                                    { href: "etf", icon: BarChart3, label: "Explore ETFs" },
                                ].map((item, idx) => (
                                    <Link key={idx} href={item.href} className="group flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-background/50 hover:bg-muted/50 transition-all backdrop-blur-sm cursor-pointer relative overflow-hidden">
                                        <div className="absolute inset-y-0 left-0 w-0.5 bg-primary/0 group-hover:bg-primary transition-colors"></div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-medium tracking-tight">{item.label}</span>
                                        </div>
                                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
                                    </Link>
                                ))}

                                <button className="group w-full flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-background/50 hover:bg-muted/50 transition-all backdrop-blur-sm cursor-pointer relative overflow-hidden text-left">
                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-primary/0 group-hover:bg-primary transition-colors"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                            <Search className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium tracking-tight">Compare Assets</span>
                                    </div>
                                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
                                </button>

                                <button className="group w-full flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-background/50 hover:bg-muted/50 transition-all backdrop-blur-sm cursor-pointer relative overflow-hidden text-left">
                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-primary/0 group-hover:bg-primary transition-colors"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium tracking-tight">Market Calendar</span>
                                    </div>
                                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}