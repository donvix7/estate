'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('resident')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Demo credentials
    const demoCredentials = {
      resident: { email: 'resident@demo.com', password: '123456', name: 'John Resident' },
      admin: { email: 'admin@demo.com', password: '123456', name: 'Admin User' },
      security: { email: 'security@demo.com', password: '123456', name: 'Security Officer' }
    }

    const valid = demoCredentials[userType]
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (email === valid.email && password === valid.password) {
      // Store user data in localStorage for demo
      localStorage.setItem('userType', userType)
      localStorage.setItem('userName', valid.name)
      localStorage.setItem('userEmail', email)
      
      switch(userType) {
        case 'resident':
          router.push('/dashboard/resident')
          break
        case 'admin':
          router.push('/dashboard/admin')
          break
        case 'security':
          router.push('/dashboard/security')
          break
        default:
          router.push('/dashboard/resident')
      }
    } else {
      setError('Invalid credentials. Use demo credentials: email@demo.com / 123456')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">ES</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">EstateSecure</h1>
            <p className="text-gray-700 font-medium">Secure Estate Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-800">Select Your Role</label>
              <div className="grid grid-cols-3 gap-2">
                {['resident', 'admin', 'security'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setUserType(type)}
                    className={`py-3 rounded-lg capitalize font-medium transition-all ${
                      userType === type 
                        ? 'bg-blue-700 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                placeholder={`${userType}@demo.com`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                placeholder="123456"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                `Sign In as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`
              )}
            </button>

            <div className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-800 mb-1">Demo Credentials for {userType}:</p>
                <div className="font-mono text-sm bg-white p-2 rounded border">
                  <div className="text-gray-900">Email: {userType}@demo.com</div>
                  <div className="text-gray-900">Password: 123456</div>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-900">Core Features:</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <span className="text-blue-600 mr-2">🔐</span>
                  <span className="text-sm font-medium text-gray-800">Visitor Pass System</span>
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <div className="flex items-center">
                  <span className="text-red-600 mr-2">🚨</span>
                  <span className="text-sm font-medium text-gray-800">Panic Button</span>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">💰</span>
                  <span className="text-sm font-medium text-gray-800">Digital Payments</span>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <div className="flex items-center">
                  <span className="text-purple-600 mr-2">📊</span>
                  <span className="text-sm font-medium text-gray-800">Admin Dashboard</span>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                <div className="flex items-center">
                  <span className="text-yellow-600 mr-2">👮</span>
                  <span className="text-sm font-medium text-gray-800">Security Interface</span>
                </div>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-100">
                <div className="flex items-center">
                  <span className="text-cyan-600 mr-2">🔔</span>
                  <span className="text-sm font-medium text-gray-800">Real-time Alerts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              This is a demo application. All data is stored locally.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}