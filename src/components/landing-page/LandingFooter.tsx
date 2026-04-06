'use client';

import React from 'react';
import { TrendingUp, Globe, Activity, Users } from 'lucide-react';

export function LandingFooter() {
    return (
        <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <div>
                        <div className="flex justify-center items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                YouFund
                            </span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Your complete financial universe in one powerful platform.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                <Globe className="w-4 h-4" />
                            </div>
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                <Activity className="w-4 h-4" />
                            </div>
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 YouFund. All rights reserved. | Privacy Policy | Terms of Service</p>
                </div>
            </div>
        </footer>
    );
}
