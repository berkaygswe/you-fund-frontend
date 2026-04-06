'use client';

import React from 'react';
import { Target, CheckCircle, ChevronRight, TrendingUp } from 'lucide-react';
import FloatingCard from './FloatingCard';

export function PortfolioSimulation() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 lg:p-12 border border-white/10 backdrop-blur-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center space-x-2 bg-orange-500/20 rounded-full px-4 py-2 mb-6 border border-orange-500/30">
                                <Target className="w-4 h-4 text-orange-400" />
                                <span className="text-sm text-orange-200">Coming Soon</span>
                            </div>

                            <h2 className="text-4xl font-bold mb-6">
                                Portfolio Simulation
                                <br />
                                <span className="text-blue-400">& Backtesting</span>
                            </h2>

                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                Test your investment strategies with our advanced portfolio simulator.
                                Analyze performance, risk metrics, and optimize your allocations before
                                committing real capital.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Historical backtesting with 20+ years of data</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Advanced risk analysis & metrics</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Real-time performance tracking</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>AI-powered asset allocation optimization</span>
                                </div>
                            </div>

                            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                                <span>Join Waitlist</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <FloatingCard>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-semibold">Simulated Portfolio</span>
                                    <span className="text-green-400 flex items-center">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        +12.4%
                                    </span>
                                </div>
                                <div className="text-3xl font-bold mb-4">$124,567</div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Stocks (60%)</span>
                                        <span>$74,740</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>ETFs (25%)</span>
                                        <span>$31,142</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Crypto (15%)</span>
                                        <span>$18,685</span>
                                    </div>
                                </div>
                            </FloatingCard>

                            <FloatingCard>
                                <div className="text-center">
                                    <div className="text-lg font-semibold mb-2">Risk Score</div>
                                    <div className="text-3xl font-bold text-yellow-400">7.2/10</div>
                                    <div className="text-sm text-gray-400 mt-2">Moderate Risk</div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '72%' }}></div>
                                    </div>
                                </div>
                            </FloatingCard>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
