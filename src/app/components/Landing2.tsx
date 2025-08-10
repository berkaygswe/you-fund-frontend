import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart, Wallet, Shield, Zap, ArrowRight, Star, Users, Globe, CheckCircle, Menu, X } from 'lucide-react';

const FinancialLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stocks');
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { value: '10M+', label: 'Assets Tracked' },
    { value: '500K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ];

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Real-Time Market Data',
      description: 'Access live prices and market movements across stocks, ETFs, cryptocurrencies, and funds with millisecond precision.'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Comprehensive charting tools, technical indicators, and performance metrics to make informed investment decisions.'
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: 'Portfolio Simulation',
      description: 'Test investment strategies with our advanced portfolio simulator before committing real capital.'
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Portfolio Management',
      description: 'Track, analyze, and optimize your investments across multiple asset classes in one unified dashboard.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Bank-Level Security',
      description: 'Your data is protected with enterprise-grade encryption and multi-factor authentication.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Optimized performance ensures you never miss a market opportunity with our ultra-fast platform.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Portfolio Manager',
      content: 'The comparison tools and real-time data have transformed how I manage client portfolios. Absolutely essential.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Day Trader',
      content: 'Finally, a platform that combines everything I need. The speed and accuracy are unmatched.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      role: 'Investment Advisor',
      content: 'The portfolio simulation feature has helped me test strategies before recommending them to clients.',
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const FloatingCard = ({ children, className = '' }: {children: React.ReactNode; className?: string;}) => (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FinanceHub
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-blue-300 transition-colors">Features</a>
              <a href="#about" className="hover:text-blue-300 transition-colors">About</a>
              <a href="#contact" className="hover:text-blue-300 transition-colors">Contact</a>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105">
                Get Started
              </button>
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
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block hover:text-blue-300 transition-colors">Features</a>
              <a href="#about" className="block hover:text-blue-300 transition-colors">About</a>
              <a href="#contact" className="block hover:text-blue-300 transition-colors">Contact</a>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-full font-medium transition-all duration-200">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-200">Platform launching soon</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Your Complete
              <br />
              Financial Universe
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Compare stocks, ETFs, cryptocurrencies, and funds. Simulate portfolios. 
              Make smarter investment decisions with real-time data and advanced analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                <span>Start Exploring</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:bg-white/10">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <FloatingCard key={index} className={`text-center transform transition-all duration-500 ${currentStat === index ? 'scale-110 bg-white/20' : ''}`}>
                <div className="text-3xl font-bold text-blue-300 mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </FloatingCard>
            ))}
          </div>

          {/* Asset Type Showcase */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Compare Everything</h2>
              <p className="text-gray-300">All major asset classes in one powerful platform</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['stocks', 'etfs', 'crypto', 'funds'].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    activeTab === type 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FloatingCard>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">AAPL</span>
                  <span className="text-green-400">+2.4%</span>
                </div>
                <div className="text-2xl font-bold mb-2">$175.43</div>
                <div className="text-gray-400 text-sm">Apple Inc.</div>
              </FloatingCard>
              
              <FloatingCard>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">SPY</span>
                  <span className="text-green-400">+1.2%</span>
                </div>
                <div className="text-2xl font-bold mb-2">$445.67</div>
                <div className="text-gray-400 text-sm">SPDR S&P 500 ETF</div>
              </FloatingCard>
              
              <FloatingCard>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">BTC</span>
                  <span className="text-red-400">-0.8%</span>
                </div>
                <div className="text-2xl font-bold mb-2">$43,250</div>
                <div className="text-gray-400 text-sm">Bitcoin</div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful tools designed for modern investors and traders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FloatingCard key={index} className="group hover:scale-105 transition-all duration-300">
                <div className="text-blue-400 mb-4 group-hover:text-purple-400 transition-colors">
                  {feature.icon}
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
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 lg:p-12 border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-orange-500/20 rounded-full px-4 py-2 mb-6 border border-orange-500/30">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-orange-200">Coming Soon</span>
                </div>
                
                <h2 className="text-4xl font-bold mb-6">
                  Portfolio Simulation
                  <br />
                  <span className="text-blue-400">& Management</span>
                </h2>
                
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Test your investment strategies with our advanced portfolio simulator. 
                  Analyze performance, risk metrics, and optimize your allocations before 
                  committing real capital.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Historical backtesting</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Risk analysis & metrics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Performance tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Asset allocation optimization</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <FloatingCard>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Simulated Portfolio</span>
                    <span className="text-green-400">+12.4%</span>
                  </div>
                  <div className="text-2xl font-bold mb-4">$124,567</div>
                  <div className="space-y-2">
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
                  </div>
                </FloatingCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Trusted by Professionals</h2>
            <p className="text-xl text-gray-300">See what our users are saying</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FloatingCard key={index} className="hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <FloatingCard className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Investing?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of investors who are already using our platform to make smarter financial decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105">
                Get Early Access
              </button>
              <button className="border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:bg-white/10">
                Learn More
              </button>
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  FinanceHub
                </span>
              </div>
              <p className="text-gray-400">
                Your complete financial universe in one platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-gray-400">
                <div>Features</div>
                <div>Pricing</div>
                <div>API</div>
                <div>Security</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Documentation</div>
                <div>Community</div>
                <div>Status</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FinanceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FinancialLandingPage;