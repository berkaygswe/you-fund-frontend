'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, BarChart3, Bitcoin, Briefcase, ShieldCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center gap-20 px-4 py-12 md:py-24">
      {/* Hero */}
      <section className="text-center space-y-6 max-w-3xl">
        <Badge variant="secondary" className="text-sm font-medium">
          🚀 Now supporting 10,000+ assets
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Compare <span className="text-primary">Stocks, ETFs & Crypto</span> in One Place
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Real-time data, side-by-side analysis, and zero clutter. Make smarter
          investment decisions faster.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/market-overview">
              Start Comparing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full max-w-6xl grid gap-8 md:grid-cols-3">
        {[
          {
            icon: <BarChart3 className="h-8 w-8 text-primary" />,
            title: 'Side-by-Side Charts',
            desc: 'Overlay price, volume, and key ratios for any combination of assets.',
          },
          {
            icon: <Briefcase className="h-8 w-8 text-primary" />,
            title: 'ETF Deep Dive',
            desc: 'Break down holdings, expense ratios, and sector weights instantly.',
          },
          {
            icon: <Bitcoin className="h-8 w-8 text-primary" />,
            title: 'Crypto Metrics',
            desc: 'Market cap, on-chain data, and staking yields for 2,000+ tokens.',
          },
        ].map((f) => (
          <Card key={f.title} className="border-0 shadow-none">
            <CardHeader>
              <div className="mb-2">{f.icon}</div>
              <CardTitle className="text-lg">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{f.desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Tabs Demo */}
      <section className="w-full max-w-4xl">
        <Tabs defaultValue="stocks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-sm mx-auto">
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="etfs">ETFs</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>
          <TabsContent value="stocks">
            <PreviewCard
              title="AAPL vs MSFT"
              description="Compare P/E, revenue growth, margins and more."
              badge="Real-time"
            />
          </TabsContent>
          <TabsContent value="etfs">
            <PreviewCard
              title="VTI vs SPY"
              description="Expense ratio, tracking error, top holdings and overlap."
              badge="Updated daily"
            />
          </TabsContent>
          <TabsContent value="crypto">
            <PreviewCard
              title="BTC vs ETH"
              description="On-chain metrics, staking yields, correlation and volatility."
              badge="Live"
            />
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4 max-w-xl">
        <h2 className="text-3xl font-bold">Ready to level-up your research?</h2>
        <p className="text-muted-foreground">
          Join 50,000+ investors who use our tools every day.
        </p>
        <Button size="lg" className="w-full sm:w-auto" asChild>
          <Link href="/signup">
            Get Started for Free <ShieldCheck className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </footer>
    </main>
  );
}

function PreviewCard({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge>{badge}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-40 w-full rounded-md bg-muted flex items-center justify-center">
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Chart preview</span>
        </div>
      </CardContent>
    </Card>
  );
}