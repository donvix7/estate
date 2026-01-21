'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/Footer'
import { 
  Shield, 
  QrCode, 
  Bell, 
  CreditCard, 
  Users, 
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Lock,
  AlertTriangle,
  Smartphone,
  Zap,
  BarChart3,
  Globe,
  Building,
  Home,
  Clock,
  Eye,
  Fingerprint,
  Camera,
  MapPin,
  Database,
  Cloud
} from 'lucide-react'

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [stats, setStats] = useState({
    communities: 0,
    residents: 0,
    transactions: 0,
    alerts: 0
  })
  const router = useRouter()
  const featuresRef = useRef(null)
  const heroRef = useRef(null)

  const features = [
    {
      title: 'Intelligent Access Control',
      icon: <Lock className="w-8 h-8" />,
      description: 'Advanced visitor management with biometric verification and smart entry systems',
      items: ['Dynamic QR Code Passes', 'Facial Recognition', 'Automated Entry/Exit Logs', 'Real-time Blacklist Alerts', 'Biometric Verification'],
      color: 'from-blue-600 to-cyan-500',
      demo: 'access'
    },
    {
      title: 'Emergency Response System',
      icon: <AlertTriangle className="w-8 h-8" />,
      description: 'Instant panic response with multi-channel emergency notification',
      items: ['One-tap SOS Button', 'GPS Location Sharing', 'Multi-admin Alert System', 'Emergency Broadcast', 'Incident Documentation'],
      color: 'from-red-600 to-orange-500',
      demo: 'emergency'
    },
    {
      title: 'Secure Digital Payments',
      icon: <CreditCard className="w-8 h-8" />,
      description: 'Seamless financial transactions with automated compliance tracking',
      items: ['Automated Dues Collection', 'Encrypted Transactions', 'Digital Receipts', 'Arrears Management', 'Expense Analytics'],
      color: 'from-emerald-600 to-green-500',
      demo: 'payments'
    },
    {
      title: 'Centralized Admin Dashboard',
      icon: <BarChart3 className="w-8 h-8" />,
      description: 'Comprehensive management platform with real-time monitoring',
      items: ['Resident Analytics', 'Visitor Approvals', 'Emergency Monitoring', 'Financial Overview', 'Compliance Reports'],
      color: 'from-purple-600 to-violet-500',
      demo: 'admin'
    },
    {
      title: 'Smart Communication Hub',
      icon: <MessageSquare className="w-8 h-8" />,
      description: 'Integrated messaging system for announcements and alerts',
      items: ['Targeted Announcements', 'Emergency Broadcasts', 'Real-time Notifications', 'Group Messaging', 'Chat History'],
      color: 'from-amber-600 to-yellow-500',
      demo: 'communication'
    },
    {
      title: 'Advanced Surveillance',
      icon: <Camera className="w-8 h-8" />,
      description: 'Integrated security monitoring with AI-powered threat detection',
      items: ['CCTV Integration', 'Motion Detection', 'License Plate Recognition', 'Suspicious Activity Alerts', 'Cloud Storage'],
      color: 'from-indigo-600 to-blue-500',
      demo: 'surveillance'
    }
  ]

  // Scroll animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      if (window.scrollY > 100) {
        setIsVisible(true)
      }
    }

    // Animate stats counter
    const targetStats = {
      communities: 250,
      residents: 50000,
      transactions: 1000000,
      alerts: 12000
    }

    let animationFrame
    const animateStats = () => {
      setStats(prev => ({
        communities: Math.min(prev.communities + 5, targetStats.communities),
        residents: Math.min(prev.residents + 1000, targetStats.residents),
        transactions: Math.min(prev.transactions + 20000, targetStats.transactions),
        alerts: Math.min(prev.alerts + 240, targetStats.alerts)
      }))
      
      if (stats.communities < targetStats.communities) {
        animationFrame = requestAnimationFrame(animateStats)
      }
    }

    window.addEventListener('scroll', handleScroll)
    setTimeout(() => animateStats(), 1000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrame)
    }
  }, [stats])

  // Feature carousel auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true)
        setActiveFeature(prev => (prev + 1) % features.length)
        setTimeout(() => setIsAnimating(false), 500)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isAnimating, features.length])

  const renderDemo = (demoType) => {
    switch(demoType) {
      case 'access':
        return (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 backdrop-blur-xl">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center animate-pulse-slow shadow-2xl">
                    <QrCode className="w-32 h-32 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-cyan-400" />
                      <span className="text-cyan-300 font-semibold">ACTIVE PASS</span>
                    </div>
                    <p className="text-4xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      ES-2024-8932
                    </p>
                    <p className="text-gray-400">Valid until: Today 11:59 PM</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
                      <p className="text-sm text-gray-400">Entry Code</p>
                      <p className="text-xl font-mono font-bold text-white">7845</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
                      <p className="text-sm text-gray-400">Visitor Name</p>
                      <p className="text-lg font-semibold text-white">John Carter</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'emergency':
        return (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 backdrop-blur-xl border border-gray-800">
              <div className="text-center space-y-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-red-600 rounded-full blur-xl animate-ping"></div>
                  <button className="relative w-64 h-64 bg-gradient-to-br from-red-600 to-orange-600 rounded-full text-white text-3xl font-bold hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex flex-col items-center justify-center group">
                    <AlertTriangle className="w-20 h-20 mb-4" />
                    EMERGENCY SOS
                    <div className="text-sm font-normal mt-2 opacity-80">Press & Hold 3 Seconds</div>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="w-5 h-5 text-red-400" />
                      <span className="text-red-300 font-semibold">Alerts Sent</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Security</span>
                        <span className="text-green-400 font-semibold">✓ Connected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Admin</span>
                        <span className="text-green-400 font-semibold">✓ Connected</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-300 font-semibold">Location</span>
                    </div>
                    <p className="text-sm text-gray-300">GPS coordinates shared</p>
                    <p className="text-xs text-gray-400 mt-1">Accuracy: 3 meters</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'payments':
        return (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 backdrop-blur-xl border border-gray-800">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-xl p-6 border border-emerald-800/30">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-gray-400">Monthly Dues</p>
                      <p className="text-3xl font-bold text-white">₹8,500</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">Due Date</p>
                      <p className="text-lg font-semibold text-emerald-300">15th June</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-sm text-gray-400">Payment Progress: 85% collected</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-4 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    Pay Now Securely
                  </button>
                  <button className="bg-gray-900 border border-gray-800 text-gray-300 font-semibold py-4 rounded-xl hover:bg-gray-800 transition-all">
                    View History
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                      <span className="text-gray-300">Last Payment</span>
                    </div>
                    <span className="font-semibold text-white">₹8,500</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-400" />
                      <span className="text-gray-300">Next Payment</span>
                    </div>
                    <span className="font-semibold text-white">July 15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <Navigation/>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-32 pb-20 px-4 min-h-screen flex flex-col justify-center z-10"
      >
        <div className="container mx-auto text-center">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              TRUSTED BY 250+ COMMUNITIES
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            <span className="block text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text animate-gradient">
              EstateSecure
            </span>
            <span className="block mt-4 text-4xl md:text-6xl text-white">
              Next-Gen Community
              <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text">
                Security Platform
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Transform your residential community with our all-in-one security management platform. 
            <span className="block mt-2 text-lg text-gray-400">
              AI-powered surveillance, smart access control, and real-time emergency response in one integrated solution.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => router.push('/register')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 text-lg font-semibold shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-cyan-500/30 text-cyan-300 rounded-xl hover:bg-cyan-500/10 text-lg font-medium transition-all duration-300 group"
            >
              <span className="flex items-center gap-2">
                Explore Features
                <ArrowRight className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </span>
            </button>
          </div>

         
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-cyan-500/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        id="features" 
        className="py-32 relative z-10 min-h-screen"
      >
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full mb-6 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-cyan-300">POWERFUL FEATURES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Complete Security</span>
              <span className="block text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                Management Suite
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to secure and manage modern residential communities. 
              From access control to emergency response, all in one unified platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Feature Navigation */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAnimating(true)
                    setActiveFeature(index)
                    setTimeout(() => setIsAnimating(false), 300)
                  }}
                  className={`w-full p-6 text-left rounded-2xl transition-all duration-500 transform ${
                    activeFeature === index 
                      ? `bg-gradient-to-br ${feature.color} text-white shadow-2xl -translate-y-2 border-transparent` 
                      : 'bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-gray-700 hover:shadow-lg'
                  } ${isAnimating ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${activeFeature === index ? 'bg-white/20' : 'bg-gray-800'}`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm mb-3 opacity-90">{feature.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {feature.items.map((item, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              activeFeature === index
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-800 text-gray-300'
                            }`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Feature Demo */}
            <div className="sticky top-24">
              <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {renderDemo(features[activeFeature].demo)}
              </div>
              
              {/* Feature highlights */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: <Cloud className="w-5 h-5" />, text: 'Cloud Powered' },
                  { icon: <Fingerprint className="w-5 h-5" />, text: 'Biometric Ready' },
                  { icon: <Eye className="w-5 h-5" />, text: '24/7 Monitoring' },
                  { icon: <Database className="w-5 h-5" />, text: 'Data Encrypted' }
                ].map((highlight, index) => (
                  <div 
                    key={index}
                    className="bg-gray-900/30 border border-gray-800 rounded-xl p-4 flex items-center gap-3 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="p-2 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg">
                      {highlight.icon}
                    </div>
                    <span className="text-sm text-gray-300">{highlight.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Simple Integration,</span>
              <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text">
                Powerful Results
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                title: 'Setup & Integration',
                description: 'Quick installation with existing security infrastructure',
                color: 'from-blue-600 to-cyan-500'
              },
              {
                step: '02',
                title: 'Onboard Community',
                description: 'Easy resident registration and system training',
                color: 'from-purple-600 to-violet-500'
              },
              {
                step: '03',
                title: 'Go Live & Monitor',
                description: '24/7 monitoring dashboard and support',
                color: 'from-emerald-600 to-green-500'
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${step.color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500`}></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} mb-6`}>
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                  <div className="mt-8 pt-6 border-t border-gray-800">
                    <ul className="space-y-3">
                      {['24-hour Setup', 'No Downtime', 'Expert Support'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-purple-900/20"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-cyan-500/30 rounded-full mb-8 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="text-lg font-medium text-cyan-300">ENTERPRISE-GRADE SECURITY</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="text-white">Ready to Transform</span>
              <span className="block text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text animate-gradient">
                Community Security?
              </span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of modern communities using EstateSecure for unparalleled safety and seamless management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => router.push('/register')}
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 text-xl font-semibold shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="flex items-center gap-3">
                  Start 30-Day Free Trial
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
              
              <button
                onClick={() => router.push('/#')}
                className="px-10 py-5 border-2 border-cyan-500 text-cyan-300 rounded-xl hover:bg-cyan-500/10 text-xl font-medium transition-all duration-300 group"
              >
                <span className="flex items-center gap-3">
                  Schedule Live Demo
                  <ArrowRight className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </span>
              </button>
            </div>
            
            <p className="text-gray-500 text-sm mt-8">
              No credit card required • 24/7 Support • GDPR Compliant
            </p>
          </div>
        </div>
      </section>

      <Footer/>
      
      {/* Global animation styles */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0f172a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #0ea5e9, #06b6d4);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0284c7, #0891b2);
        }
        
        /* Selection */
        ::selection {
          background: rgba(6, 182, 212, 0.3);
          color: #ffffff;
        }
      `}</style>
    </div>
  )
}