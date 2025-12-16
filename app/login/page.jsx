'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Hardcoded user database simulation
const USER_DATABASE = {
  users: [
    {
      id: 1,
      email: 'resident@demo.com',
      password: '123456',
      name: 'John Resident',
      type: 'resident',
      unitNumber: 'A-101',
      building: 'Tower A',
      phone: '+91 9876543210'
    },
    {
      id: 2,
      email: 'admin@demo.com',
      password: '123456',
      name: 'Admin User',
      type: 'admin',
      role: 'Super Admin',
      accessLevel: 'full',
      phone: '+91 9876543211'
    },
    {
      id: 3,
      email: 'security@demo.com',
      password: '123456',
      name: 'Security Officer',
      type: 'security',
      gateStation: 'Gate 1',
      shift: 'Day Shift',
      badgeNumber: 'SEC-001'
    },
    {
      id: 4,
      email: 'staff@demo.com',
      password: '123456',
      name: 'Staff Member',
      type: 'staff',
      department: 'Maintenance',
      phone: '+91 9876543212'
    }
  ],
  sessions: []
}

// Mock API functions
const mockAPI = {
  // Authenticate user
  async authenticateUser(email, password, userType) {
    await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay
    
    const user = USER_DATABASE.users.find(u => 
      u.email === email && u.password === password && u.type === userType
    )
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    // Create session
    const session = {
      userId: user.id,
      userType: user.type,
      userName: user.name,
      userEmail: user.email,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }
    
    USER_DATABASE.sessions.push(session)
    
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        ...(user.type === 'resident' && { unitNumber: user.unitNumber, building: user.building }),
        ...(user.type === 'admin' && { role: user.role, accessLevel: user.accessLevel }),
        ...(user.type === 'security' && { gateStation: user.gateStation, badgeNumber: user.badgeNumber })
      },
      session: session.sessionId
    }
  },
  
  // Get current session (simulated)
  getCurrentSession() {
    return USER_DATABASE.sessions[USER_DATABASE.sessions.length - 1] || null
  }
}

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

    try {
      const result = await mockAPI.authenticateUser(email, password, userType)
      
      if (result.success) {
        // Store minimal data in sessionStorage for current session only
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('currentUser', JSON.stringify(result.user))
          sessionStorage.setItem('sessionId', result.session)
        }
        
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
          case 'staff':
            router.push('/dashboard/staff')
            break
          default:
            router.push('/dashboard/resident')
        }
      }
    } catch (err) {
      setError('Invalid credentials. Use demo credentials: email@demo.com / 123456')
      setIsLoading(false)
    }
  }

  // Demo credentials for the selected user type
  const getDemoCredentials = () => {
    const user = USER_DATABASE.users.find(u => u.type === userType)
    return {
      email: user?.email || `${userType}@demo.com`,
      password: '123456',
      name: user?.name || `${userType.charAt(0).toUpperCase() + userType.slice(1)} User`
    }
  }

  const demoCredentials = getDemoCredentials()

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
              <div className="grid grid-cols-4 gap-2">
                {['resident', 'admin', 'security', 'staff'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setUserType(type)
                      const creds = USER_DATABASE.users.find(u => u.type === type)
                      setEmail(creds?.email || '')
                    }}
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
                placeholder={demoCredentials.email}
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
                  <div className="text-gray-900">Email: {demoCredentials.email}</div>
                  <div className="text-gray-900">Password: {demoCredentials.password}</div>
                  <div className="text-gray-900 mt-1 text-xs">Name: {demoCredentials.name}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(demoCredentials.email)
                    setPassword('123456')
                  }}
                  className="mt-3 text-sm text-blue-700 hover:text-blue-900 font-medium"
                >
                  Click to auto-fill credentials
                </button>
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
              This is a demo application. All data is stored in-memory and resets on page refresh.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Active users in database: {USER_DATABASE.users.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}