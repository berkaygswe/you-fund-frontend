import React from 'react';
import { LandingNav } from './LandingNav';
import { LandingHero } from './LandingHero';
import { LandingFeatures } from './LandingFeatures';
import { PortfolioSimulation } from './PortfolioSimulation';
import { LandingFooter } from './LandingFooter';
import { QuantBackground } from '@/components/ui/quant-background';

export default function LandingEnhanced() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-300">
            <QuantBackground />
            
            <div className="relative z-10">
                <LandingNav />

                <main>
                    <LandingHero />
                    <LandingFeatures />
                    <PortfolioSimulation />
                </main>

                <LandingFooter />
            </div>
        </div>
    );
}

