'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Wallet, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Menu, 
  X, 
  Briefcase,
  Shield,
  Globe,
  Users,
  ChevronRight,
  Target,
  Activity,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import AssetType from './landing-page/AssetType';
import FloatingCard from './landing-page/FloatingCard';

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

/*const testimonials = [
  {
    name: "Ahmet Yılmaz",
    role: "Portfolio Manager",
    company: "ABC Investment",
    content: "YouFund has transformed how we analyze Turkish markets. The real-time data and portfolio simulation tools are game-changers.",
    rating: 5,
    avatar: "AY"
  },
  {
    name: "Sarah Johnson",
    role: "Retail Investor",
    company: "Independent",
    content: "Finally, a platform that combines stocks, ETFs, and crypto in one place. The backtesting feature helped me optimize my strategy.",
    rating: 5,
    avatar: "SJ"
  },
  {
    name: "Mehmet Kaya",
    role: "Financial Analyst",
    company: "XYZ Securities",
    content: "The TEFAS fund analysis is incredibly detailed. We use it daily for client portfolio recommendations.",
    rating: 5,
    avatar: "MK"
  }
];*/

/*const stats = [
  { value: "10,000+", label: "Assets Tracked", icon: <Globe className="w-5 h-5" /> },
  { value: "50ms", label: "Data Latency", icon: <Zap className="w-5 h-5" /> },
  { value: "15,000+", label: "Active Users", icon: <Users className="w-5 h-5" /> },
  { value: "99.9%", label: "Uptime", icon: <Shield className="w-5 h-5" /> }
];*/

/*const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Real-time market data",
      "Basic portfolio tracking",
      "5 asset comparisons",
      "Community support"
    ],
    cta: "Get Started Free",
    popular: false
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For serious investors",
    features: [
      "Everything in Free",
      "Advanced analytics",
      "Portfolio backtesting",
      "Unlimited comparisons",
      "Priority support",
      "API access"
    ],
    cta: "Start Pro Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per month",
    description: "For teams and institutions",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom integrations",
      "Dedicated support",
      "White-label options",
      "Advanced reporting"
    ],
    cta: "Contact Sales",
    popular: false
  }
];*/

export default function LandingEnhanced() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //const [currentStat, setCurrentStat] = useState(0);

  // Animate stats
  /*useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);*/

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
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
              {/*<a href="#pricing" className="hover:text-blue-300 transition-colors duration-200">Pricing</a>*/}
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
              {/*<a href="#pricing" className="block hover:text-blue-300 transition-colors">Pricing</a>*/}
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20 shadow-lg">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">🚀 Now supporting 1,000+ assets across global markets</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Your Complete
              <br />
              <span className="text-white">Financial Universe</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Compare stocks, ETFs, cryptocurrencies, and funds in real-time. 
              <br />
              Simulate portfolios, backtest strategies, and make smarter investment decisions with advanced analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/market-overview">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-3 shadow-xl cursor-pointer">
                  <span>Start Exploring Markets</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              {/* <button className="border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:bg-white/10 flex items-center space-x-3">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
              */}
            </div>

            {/* Stats 
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <FloatingCard key={index} className={`text-center transform transition-all duration-500 ${currentStat === index ? 'scale-110 bg-white/20 shadow-xl' : ''}`}>
                  <div className="text-blue-400 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-blue-300 mb-1">{stat.value}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </FloatingCard>
              ))}
            </div>
            */}
          </div>

          {/* Asset Type Showcase */}
          <AssetType />
        </div>
      </section>

      {/* Features Section */}
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
            {features.map((feature, index) => (
              <FloatingCard key={index} className="group hover:scale-105 transition-all duration-300">
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

      {/* Portfolio Simulation Section */}
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
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '72%'}}></div>
                    </div>
                  </div>
                </FloatingCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section 
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Trusted by Investors
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what our users say about YouFund
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FloatingCard key={index} className="group hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-semibold text-white mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-xs text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>
      */}
      {/* Pricing Section 
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your investment needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <FloatingCard key={index} className={`relative ${plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-gray-400">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className={`w-full py-3 rounded-full font-medium transition-all duration-200 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105' 
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}>
                  {plan.cta}
                </button>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>
      */}
      {/* CTA Section 
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-12 border border-white/10">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your
              <br />
              <span className="text-blue-400">Investment Strategy?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of investors who trust YouFund for their financial analysis and portfolio management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-3 shadow-xl">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button className="border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:bg-white/10">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
      */}
      {/* Footer */}
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
            {/* 
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">Features</a>
                <a href="#" className="block hover:text-white transition-colors">Pricing</a>
                <a href="#" className="block hover:text-white transition-colors">API</a>
                <a href="#" className="block hover:text-white transition-colors">Documentation</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">About</a>
                <a href="#" className="block hover:text-white transition-colors">Blog</a>
                <a href="#" className="block hover:text-white transition-colors">Careers</a>
                <a href="#" className="block hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block hover:text-white transition-colors">Community</a>
                <a href="#" className="block hover:text-white transition-colors">Status</a>
                <a href="#" className="block hover:text-white transition-colors">Security</a>
              </div>
            </div>
            */}
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2025 YouFund. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
