"'use client';

import React from 'react';
import { LandingNav } from './landing-page/LandingNav';
import { LandingHero } from './landing-page/LandingHero';
import { LandingFeatures } from './landing-page/LandingFeatures';
import { PortfolioSimulation } from './landing-page/PortfolioSimulation';
import { LandingFooter } from './landing-page/LandingFooter';

export default function LandingEnhanced() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
            <LandingNav />

            <main>
                <LandingHero />
                <LandingFeatures />
                <PortfolioSimulation />
            </main>

            <LandingFooter />
        </div>
    );
}
