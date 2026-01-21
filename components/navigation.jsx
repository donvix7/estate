"use client"

import { useRouter } from 'next/navigation'
import React from 'react'

const Navigation = () => {
    const router = useRouter()
  return (
    <div>
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
            <a href="/documentation" className="text-gray-700 hover:text-blue-700 font-medium">
              documentation
            </a>
            <button
              onClick={() => router.push('/register')}
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navigation