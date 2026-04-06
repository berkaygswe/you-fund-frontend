'use client';

import React, { useState } from 'react';
import { TrendingUp, Menu, X } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function LandingNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 border-b backdrop-blur-sm border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            YouFund
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="hover:text-blue-300 transition-colors duration-200">Features</a>
                        <Link href="/login" className="hover:text-blue-300 transition-colors duration-200">
                            Login
                        </Link>
                        <Link href="/signup">
                            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                                Sign Up Free
                            </button>
                        </Link>
                    </div>

                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
                    <div className="px-4 py-4 space-y-4">
                        <a href="#features" className="block hover:text-blue-300 transition-colors">Features</a>
                        <Link href="/login" className="block hover:text-blue-300 transition-colors">Login</Link>
                        <Link href="/signup">
                            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-full font-medium transition-all duration-200">
                                Sign Up Free
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
