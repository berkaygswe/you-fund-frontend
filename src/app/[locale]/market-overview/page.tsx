import { Link } from "@/i18n/routing"
import AssetComparison from "@/components/asset-detail/AssetComparison"
import AssetTopMovers from "@/components/homepage/AssetTopMovers"
import FinanceNews from "@/components/homepage/FinanceNews"
import FundTypePerformance from "@/components/homepage/FundTypePerformance"
import { SectionCards } from "@/components/homepage/SectionCards"
import { Search, Calendar, TrendingUp, BarChart3, ArrowUpRight } from "lucide-react"
import PageHeader from "@/components/homepage/PageHeader"
import { SlidingMarketTicker } from "./components/sliding-ticker"
import { QuickStats } from "./components/quick-stats"
import { Card, CardContent } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.MarketOverview" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function MarketOverview({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations('Dashboard.MarketOverview');
    const tMeta = await getTranslations({ locale, namespace: "Metadata.MarketOverview" });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": tMeta("title"),
        "description": tMeta("description"),
    };

    const quickLinks = [
        { href: "/fund", icon: TrendingUp, labelKey: "exploreFunds" },
        { href: "/etf", icon: BarChart3, labelKey: "exploreEtfs" },
        { href: "/compare", icon: Search, labelKey: "compareAssets" },
        { href: "/calendar", icon: Calendar, labelKey: "marketCalendar" }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen w-full pb-12">
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
                <QuickStats />

                {/* Market Movers */}
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">{t('volatilityWatch')}</h2>
                        </div>
                    </div>
                    <Card className="p-0">
                        <CardContent className="p-4 lg:p-6">
                            <AssetTopMovers />
                        </CardContent>
                    </Card>
                </div>

                {/* Market Performance */}
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground group">{t('marketPerformanceGrid')}</h2>
                    </div>
                    <Card className="p-0">
                        <CardContent className="p-1 sm:p-4">
                            <SectionCards />
                        </CardContent>
                    </Card>
                </div>

                {/* Dashboard Bento Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-12">
                    {/* Left/Main Column */}
                    <div className="xl:col-span-8 flex flex-col space-y-8">
                        {/* Compare Assets */}
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">{t('assetCrossComparison')}</h2>
                            </div>
                            <Card className="p-0 overflow-hidden">
                                <CardContent className="p-4 sm:p-6">
                                    <AssetComparison code="" standalone={false} />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Finance News */}
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">{t('liveIntelligenceFeed')}</h2>
                                </div>
                                <button className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                                    {t('viewArchive')} <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                            <Card className="p-0 border-l-2 border-l-blue-500/50">
                                <CardContent className="p-2 sm:p-4">
                                    <FinanceNews />
                                </CardContent>
                            </Card>
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
                                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">{t('commandCenter')}</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                                {quickLinks.map((item, idx) => {
                                    const Content = (
                                        <>
                                            <div className="absolute inset-y-0 left-0 w-0.5 bg-primary/0 group-hover:bg-primary transition-colors"></div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                                    <item.icon className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-medium tracking-tight">{t(item.labelKey)}</span>
                                            </div>
                                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
                                        </>
                                    );

                                    const className = "group flex items-center justify-between p-3.5 rounded-xl border border-border/20 bg-card/50 hover:bg-card/80 transition-all backdrop-blur-sm cursor-pointer relative overflow-hidden text-left";

                                    return (
                                        <Link key={idx} href={item.href} className={className}>
                                            {Content}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}
