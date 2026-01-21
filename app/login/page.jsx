'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Shield, User, Users, KeyRound, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react'

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

  const userTypeConfig = {
    resident: { icon: <Building2 className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    admin: { icon: <Shield className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
    security: { icon: <Users className="w-5 h-5" />, color: 'from-amber-500 to-orange-500' },
    staff: { icon: <User className="w-5 h-5" />, color: 'from-emerald-500 to-teal-500' }
  }

  const userTypeLabels = {
    resident: 'Resident',
    admin: 'Admin',
    security: 'Security',
    staff: 'Staff'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 md:p-10 transition-all duration-500 hover:border-gray-600/50">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-2xl">ES</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-3">
              EstateSecure
            </h1>
            <p className="text-gray-300 font-medium">Secure Estate Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* User Type Selection */}
            <div>
              <label className="block text-gray-300 font-medium mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Select Your Role
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {['resident', 'admin', 'security', 'staff'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setUserType(type)
                      const creds = USER_DATABASE.users.find(u => u.type === type)
                      setEmail(creds?.email || '')
                    }}
                    className={`py-4 rounded-xl capitalize font-medium transition-all duration-300 transform hover:scale-105 ${
                      userType === type 
                        ? `border border-cyan-500 text-cyan-500 shadow-lg` 
                        : 'bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`${userType === type ? 'text-cyan-500' : 'text-gray-500'}`}>
                        {userTypeConfig[type].icon}
                      </div >
                      <span>{userTypeLabels[type]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 text-red-300 flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-gray-300 font-medium flex items-center gap-2">
                <User className="w-5 h-5" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-lg bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white placeholder-gray-500 transition-all"
                placeholder={demoCredentials.email}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 font-medium flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-lg bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white placeholder-gray-500 transition-all"
                placeholder="123456"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-medium shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <LogIn className="w-5 h-5" />
                  Sign In as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </div>
              )}
            </button>

            {/* Demo Credentials Section */}
            <div className="mt-8">
              <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <p className="text-gray-300 font-medium">
                    Demo Credentials for <span className="text-cyan-300">{userTypeLabels[userType]}</span>
                  </p>
                </div>
                <div className="space-y-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-white font-mono text-sm">{demoCredentials.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                      <KeyRound className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Password</div>
                      <div className="text-white font-mono text-sm">{demoCredentials.password}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="text-white font-mono text-sm">{demoCredentials.name}</div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(demoCredentials.email)
                    setPassword('123456')
                  }}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 rounded-lg hover:text-white hover:from-gray-700 hover:to-gray-800 font-medium border border-gray-700 transition-all duration-300"
                >
                  Auto-fill Demo Credentials
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-700/50 text-center">
              <p className="text-gray-500 text-sm">
                Need help? Contact support at{' '}
                <a href="mailto:support@estatesecure.com" className="text-cyan-400 hover:text-cyan-300 hover:underline">
                  support@estatesecure.com
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}