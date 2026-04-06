'use client';

import React from 'react';
import {
    TrendingUp,
    BarChart3,
    PieChart,
    Wallet,
    Zap,
    Briefcase,
    Sparkles
} from 'lucide-react';
import FloatingCard from './FloatingCard';

const features = [
    {
        icon: <TrendingUp className="w-8 h-8" />,
        title: 'Diversified Market Data',
        description: 'Access prices and market movements across stocks, ETFs, cryptocurrencies, and funds.',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: <BarChart3 className="w-8 h-8" />,
        title: 'Advanced Analytics',
        description: 'Fundamental analysis, comparing different asset classes to make informed investment decisions.',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: <PieChart className="w-8 h-8" />,
        title: 'Portfolio Backtesting',
        description: 'Test investment strategies with historical data. Analyze performance, risk metrics, and optimize allocations.',
        color: 'from-green-500 to-emerald-500',
        soon: true
    },
    {
        icon: <Wallet className="w-8 h-8" />,
        title: 'TEFAS Fund Tracking',
        description: 'Comprehensive coverage of Turkish equity funds with detailed holdings and performance analysis.',
        color: 'from-orange-500 to-red-500'
    },
    {
        icon: <Briefcase className="w-8 h-8" />,
        title: 'ETF Deep Analysis',
        description: 'Break down holdings, expense ratios, sector weights, and tracking error for global ETFs.',
        color: 'from-indigo-500 to-purple-500'
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: 'Lightning Fast Platform',
        description: 'Optimized performance ensures you never miss market opportunities with our ultra-fast infrastructure.',
        color: 'from-yellow-500 to-orange-500'
    }
];

export function LandingFeatures() {
    return (
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-blue-500/20 rounded-full px-4 py-2 mb-6 border border-blue-500/30">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-200">Powerful Features</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Everything You Need
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Professional-grade tools designed for modern investors, traders, and financial analysts
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <FloatingCard key={feature.title} className="group hover:scale-105 transition-all duration-300">
                            <div className='mb- flex justify-between'>
                                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                                    {feature.icon}
                                </div>
                                {feature.soon && (
                                    <div className="inline-flex items-center space-x-2 bg-orange-500/20 rounded-full px-4 py-2 mb-6 border border-orange-500/30">
                                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-orange-200">Soon</span>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                        </FloatingCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
