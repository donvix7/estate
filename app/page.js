'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const router = useRouter()

  const features = [
    {
      title: 'Access Control',
      items: ['Visitor QR Codes', 'Security Verification', 'Entry/Exit Logs', 'Blacklist System']
    },
    {
      title: 'Panic & Emergency',
      items: ['One-tap Panic Button', 'Instant Security Alerts', 'Admin Notifications', 'Activity Logging']
    },
    {
      title: 'Digital Payments',
      items: ['Monthly Dues Payment', 'Transaction History', 'Digital Receipts', 'Arrears Alerts']
    },
    {
      title: 'Admin Dashboard',
      items: ['Resident Management', 'Visitor Approvals', 'Panic Monitoring', 'Payment Overview']
    },
    {
      title: 'Communication',
      items: ['Announcements', 'Emergency Broadcasts', 'Real-time Notifications', 'Admin Messages']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ES</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">EstateSecure</h1>
            </div>
            <button
              onClick={() => router.push('/register')}
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Secure Your Community,
            <span className="block text-blue-700">Simplify Management</span>
          </h1>
          
          <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-8 leading-relaxed">
            All-in-one Progressive Web App for modern residential estates. 
            Visitor management, emergency response, payments, and communication in one platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 text-lg font-medium shadow-lg transition-all"
            >
              Try Demo
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 border-2 border-blue-700 text-blue-700 rounded-lg hover:bg-blue-50 text-lg font-medium transition-all"
            >
              View Features
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Core Features</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feature Navigation */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full p-6 text-left rounded-xl transition-all duration-300 ${
                    activeFeature === index 
                      ? 'bg-blue-700 text-white shadow-lg transform -translate-y-1' 
                      : 'bg-gray-50 hover:bg-gray-100 hover:shadow-md border border-gray-200'
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {feature.items.map((item, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          activeFeature === index
                            ? 'bg-white/30 text-white'
                            : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Feature Demo */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">{features[activeFeature].title}</h3>
              
              {activeFeature === 0 && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h4 className="font-semibold mb-3 text-gray-900">Visitor Pass Demo</h4>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-40 h-40 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">QR CODE</span>
                      </div>
                      <div className="text-center md:text-left">
                        <p className="font-mono text-xl font-bold text-gray-900">ABC123</p>
                        <p className="text-gray-700 mt-2">Pass Code</p>
                        <p className="font-mono text-lg font-bold text-gray-900 mt-1">4567</p>
                        <p className="text-gray-700">Entry PIN</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeFeature === 1 && (
                <div className="text-center">
                  <button className="w-48 h-48 bg-gradient-to-r from-red-600 to-red-700 rounded-full text-white text-2xl font-bold hover:from-red-700 hover:to-red-800 animate-pulse shadow-2xl transition-all">
                    PANIC
                  </button>
                  <p className="mt-6 text-gray-800 font-medium">Instant alert to security & admin</p>
                </div>
              )}
              
              {activeFeature === 2 && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h4 className="font-semibold mb-4 text-gray-900">Payment Due: ₹5,000</h4>
                    <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md">
                      Pay Now
                    </button>
                  </div>
                </div>
              )}
              
              {activeFeature === 3 && (
                <div className="bg-white p-6 rounded-xl shadow-md border">
                  <h4 className="font-semibold mb-4 text-gray-900">Admin Controls</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                      <span className="text-gray-800">Pending Visitors</span>
                      <span className="font-bold text-lg text-blue-700">3</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                      <span className="text-gray-800">Active Residents</span>
                      <span className="font-bold text-lg text-green-600">156</span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeFeature === 4 && (
                <div className="bg-white p-6 rounded-xl shadow-md border">
                  <h4 className="font-semibold mb-4 text-gray-900">Send Announcement</h4>
                  <textarea 
                    className="w-full p-4 border rounded-lg mb-4 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3" 
                    placeholder="Type your announcement here..."
                  />
                  <button className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md">
                    Broadcast to All Residents
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Secure Your Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join modern estates using EstateSecure for safer, smarter living.
          </p>
          <button
            onClick={() => router.push('/register')}
            className="px-10 py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 text-lg font-semibold shadow-xl transition-all transform hover:scale-105"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">ES</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">EstateSecure</h3>
            <p className="text-gray-300 mb-6">Secure Estate Management PWA</p>
            <div className="mt-8 text-sm">
              <p className="text-gray-400 mb-2">© 2024 EstateSecure. All core features included.</p>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Access Control</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Panic System</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Digital Payments</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Admin Dashboard</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Communication</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}