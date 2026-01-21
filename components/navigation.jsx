"use client"

import { useRouter, usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  Home, 
  FileText, 
  Menu, 
  X, 
  ChevronDown,
  Users,
  Building,
  Smartphone,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  ShieldCheck,
  Bell
} from 'lucide-react'

const Navigation = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDocsOpen, setIsDocsOpen] = useState(false)
    const [activeLink, setActiveLink] = useState('')

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setActiveLink(pathname)
    }, [pathname])

    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Features', path: '/#features', icon: <Zap size={18} /> },
    ]

    const docItems = [
        { name: 'API Documentation', path: '/docs/api' },
        { name: 'Setup Guide', path: '/docs/setup' },
        { name: 'Security Features', path: '/docs/security' },
        { name: 'Integration Guide', path: '/docs/integration' },
        { name: 'FAQ', path: '/docs/faq' },
    ]

    return (
        <>
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-500 ${
                isScrolled 
                    ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10 py-3 border-b border-gray-800/50' 
                    : 'bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-transparent py-5'
            }`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div 
                            onClick={() => router.push('/')}
                            className="flex items-center space-x-3 cursor-pointer group min-w-0"
                        >
                            <div className="relative shrink-0">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 text-white font-bold flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-105 ${
                                    isScrolled ? 'shadow-blue-500/30' : 'shadow-blue-500/40'
                                }`}>
                                  ES
                                </div>
                                
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tight truncate">
                                    EstateSecure
                                </h1>
                                <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">
                                    Community Security Platform
                                </p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        if (item.path.startsWith('/#')) {
                                            const element = document.querySelector(item.path.substring(1))
                                            element?.scrollIntoView({ behavior: 'smooth' })
                                        } else {
                                            router.push(item.path)
                                        }
                                    }}
                                    className={`relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 group min-w-[90px] ${
                                        activeLink === item.path 
                                            ? 'text-blue-300 bg-gray-800/50 border border-gray-700' 
                                            : 'text-gray-300 hover:text-blue-300 hover:bg-gray-800/30'
                                    }`}
                                >
                                    <span className="flex items-center gap-2 justify-center">
                                        <span className="hidden xl:inline">{item.icon}</span>
                                        <span className="text-sm">{item.name}</span>
                                    </span>
                                    {activeLink === item.path && (
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                                    )}
                                </button>
                            ))}

                            {/* Documentation Dropdown */}
                            <div className="relative">
                                <button
                                    onMouseEnter={() => setIsDocsOpen(true)}
                                    onMouseLeave={() => setIsDocsOpen(false)}
                                    className={`relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 group min-w-[160px] ${
                                        activeLink.includes('/docs') 
                                            ? 'text-blue-300 bg-gray-800/50 border border-gray-700' 
                                            : 'text-gray-300 hover:text-blue-300 hover:bg-gray-800/30'
                                    }`}
                                >
                                    <FileText size={18} className="shrink-0" />
                                    <span className="text-sm">Documentation</span>
                                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                                        isDocsOpen ? 'rotate-180' : ''
                                    }`} />
                                    {activeLink.includes('/docs') && (
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                {isDocsOpen && (
                                    <div 
                                        onMouseEnter={() => setIsDocsOpen(true)}
                                        onMouseLeave={() => setIsDocsOpen(false)}
                                        className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 border border-gray-800 overflow-hidden z-50"
                                    >
                                        <div className="p-3 space-y-1">
                                            {docItems.map((doc) => (
                                                <button
                                                    key={doc.name}
                                                    onClick={() => {
                                                        router.push(doc.path)
                                                        setIsDocsOpen(false)
                                                    }}
                                                    className="w-full px-4 py-3 rounded-xl text-left text-gray-300 hover:text-blue-300 hover:bg-gray-800/50 transition-all duration-300 flex items-center gap-3 group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                                                        <FileText size={16} className="text-blue-400" />
                                                    </div>
                                                    <span className="font-medium text-sm">{doc.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="px-4 py-3 bg-gradient-to-r from-gray-800/50 to-blue-900/20 border-t border-gray-800">
                                            <button
                                                onClick={() => {
                                                    router.push('/contact')
                                                    setIsDocsOpen(false)
                                                }}
                                                className="w-full text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors flex items-center justify-between"
                                            >
                                                <span>Need Help?</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => router.push('/login')}
                                className="px-4 py-2.5 text-gray-400 hover:text-blue-300 font-medium transition-colors text-sm"
                            >
                                Sign In
                            </button>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                                <button
                                    onClick={() => router.push('/register')}
                                    className="relative px-5 py-2.5 bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 overflow-hidden text-sm"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    <span className="flex items-center gap-2">
                                        Get Started
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 rounded-xl bg-gray-800 text-gray-300 hover:text-blue-300 hover:bg-gray-700 transition-colors"
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden pt-16">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    {/* Menu Panel */}
                    <div className="relative bg-gray-900/95 backdrop-blur-xl shadow-2xl border-t border-gray-800 mx-4 overflow-hidden animate-slide-up max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <div className="p-4 space-y-2">
                       

                            {/* Mobile Nav Items */}
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        if (item.path.startsWith('/#')) {
                                            const element = document.querySelector(item.path.substring(1))
                                            element?.scrollIntoView({ behavior: 'smooth' })
                                            setIsMenuOpen(false)
                                        } else {
                                            router.push(item.path)
                                            setIsMenuOpen(false)
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 ${
                                        activeLink === item.path 
                                            ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/20 text-blue-300 border border-blue-800/50' 
                                            : 'text-gray-300 hover:text-blue-300 hover:bg-gray-800/50'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg ${
                                        activeLink === item.path 
                                            ? 'bg-gradient-to-r from-blue-900/50 to-cyan-900/30 text-blue-400' 
                                            : 'bg-gray-800 text-gray-400'
                                    }`}>
                                        {item.icon}
                                    </div>
                                    <span className="font-medium text-sm">{item.name}</span>
                                </button>
                            ))}

                            {/* Documentation Section */}
                            <div className="pt-4 border-t border-gray-800/50">
                                <h3 className="px-4 text-sm font-semibold text-gray-500 mb-3">Documentation</h3>
                                <div className="space-y-1">
                                    {docItems.slice(0, 3).map((doc) => (
                                        <button
                                            key={doc.name}
                                            onClick={() => {
                                                router.push(doc.path)
                                                setIsMenuOpen(false)
                                            }}
                                            className="w-full px-4 py-2.5 rounded-lg text-gray-400 hover:text-blue-300 hover:bg-gray-800/50 text-left transition-colors text-sm"
                                        >
                                            {doc.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                           
                            {/* CTA Buttons */}
                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={() => {
                                        router.push('/login')
                                        setIsMenuOpen(false)
                                    }}
                                    className="w-full px-6 py-3.5 border-2 border-gray-700 text-gray-300 font-semibold rounded-xl hover:border-gray-600 hover:bg-gray-800/50 transition-all text-sm"
                                >
                                    Sign In to Dashboard
                                </button>
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                                    <button
                                        onClick={() => {
                                            router.push('/register')
                                            setIsMenuOpen(false)
                                        }}
                                        className="relative w-full px-6 py-3.5 bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg hover:shadow-xl text-sm"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            Start Free Trial
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Security Badges */}
                            <div className="pt-4 border-t border-gray-800/50">
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <span className="px-3 py-1.5 bg-gray-800/50 text-gray-300 rounded-full text-xs flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                        GDPR Compliant
                                    </span>
                                    <span className="px-3 py-1.5 bg-gray-800/50 text-gray-300 rounded-full text-xs flex items-center gap-1">
                                        <Lock className="w-3 h-3 text-blue-400" />
                                        SOC 2 Certified
                                    </span>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="pt-4 text-center">
                                <p className="text-xs text-gray-500">
                                    Need help?{' '}
                                    <a href="mailto:support@estatesecure.com" className="text-blue-400 hover:text-blue-300 font-medium">
                                        Contact Support
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Styles for Animation */}
            <style jsx global>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }

                /* Custom scrollbar for mobile menu */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1f2937;
                    border-radius: 3px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #3b82f6, #06b6d4);
                    border-radius: 3px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #2563eb, #0891b2);
                }

                /* Smooth transitions */
                * {
                    transition: background-color 0.2s ease, border-color 0.2s ease;
                }

                /* Responsive typography */
                @media (max-width: 640px) {
                    .text-responsive {
                        font-size: clamp(0.875rem, 3vw, 1rem);
                    }
                }

                /* Prevent horizontal scroll on mobile */
                body {
                    overflow-x: hidden;
                }
            `}</style>
        </>
    )
}

export default Navigation