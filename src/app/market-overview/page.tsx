import Link from "next/link"
import AssetComparison from "../components/fund-detail/AssetComparsion"
import AssetTopMovers from "../components/homepage/asset-top-movers"
import FinanceNews from "../components/homepage/finance-news"
import FundTypePerformance from "../components/homepage/fund-type-performance"
import { SectionCards } from "../components/homepage/section-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart3, Globe, Clock, Activity, DollarSign, ArrowUpRight } from "lucide-react"
import PageHeader from "../components/homepage/page-header"

export default function MarketOverview() {
  return (
    <div className="space-y-6">
      {/* Market Overview Header */}
      <PageHeader />

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Markets</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4B</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bullish</div>
            <p className="text-xs text-muted-foreground">
              65% positive indicators
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Cards Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Market Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SectionCards />
            </CardContent>
          </Card>

          {/* Asset Comparison Section */}
          <AssetComparison code="" />

          {/* Finance News Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Latest Financial News
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FinanceNews />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Market Movers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5" />
                Market Movers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AssetTopMovers />
            </CardContent>
          </Card>

          {/* Fund Performance */}
          <FundTypePerformance />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>    
                <Link href="fund">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <span className="text-sm font-medium">View All Funds</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
              <div>    
                <Link href="etf">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <span className="text-sm font-medium">View All ETFs</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <span className="text-sm font-medium">Compare Assets</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <span className="text-sm font-medium">Market Calendar</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}