'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PanicButton } from '@/components/panic-button'
import { VisitorPassGenerator } from '@/components/visitor-pass-generator'
import { PaymentSystem } from '@/components/payment-system'

export default function ResidentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Water Supply Maintenance', content: 'Water supply will be interrupted on Jan 20, 10 AM - 4 PM', date: '2024-01-18', type: 'maintenance', read: false },
    { id: 2, title: 'Security Update', content: 'New security protocols effective from Feb 1', date: '2024-01-17', type: 'security', read: true },
    { id: 3, title: 'Community Event', content: 'Annual community dinner on Jan 25 at Club House', date: '2024-01-16', type: 'event', read: true }
  ])

  const visitors = [
    { id: 1, name: 'John Delivery', purpose: 'Delivery', time: 'Today, 10:30 AM', status: 'Active' },
    { id: 2, name: 'Electrician', purpose: 'Service', time: 'Today, 2:00 PM', status: 'Pending' }
  ]

  const getUserName = () => {
    return localStorage.getItem('userName') || 'John'
  }

  const getUnitNumber = () => {
    return localStorage.getItem('userUnit') || 'A-101'
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userType')
      localStorage.removeItem('userName')
      localStorage.removeItem('userEmail')
      router.push('/login')
    }
  }

  const markAsRead = (id) => {
    setAnnouncements(announcements.map(ann => 
      ann.id === id ? { ...ann, read: true } : ann
    ))
  }

  const getUnreadCount = () => {
    return announcements.filter(ann => !ann.read).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Resident Dashboard</h1>
              <p className="text-blue-200">Unit {getUnitNumber()} | Welcome, {getUserName()}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'visitors', label: 'Visitors', icon: '👥' },
            { id: 'payments', label: 'Payments', icon: '💰' },
            { id: 'announcements', label: 'Announcements', icon: '📢', badge: getUnreadCount() }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 relative font-medium ${
                activeTab === tab.id 
                  ? 'border-b-2 border-blue-700 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Emergency Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Emergency Panic System</h2>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  🚨 24/7 Active
                </span>
              </div>
              <PanicButton />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Active Visitors</h3>
                    <p className="text-3xl font-bold text-blue-700">{visitors.filter(v => v.status === 'Active').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">👥</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Current Due</h3>
                    <p className="text-3xl font-bold text-amber-600">₹5,000</p>
                    <p className="text-sm text-gray-600 mt-1">Due: 15th Jan</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 text-xl">💰</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Announcements</h3>
                    <p className="text-3xl font-bold text-green-600">{announcements.length}</p>
                    <p className="text-sm text-gray-600 mt-1">{getUnreadCount()} unread</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">📢</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Visitors */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Visitor Passes</h3>
                <button 
                  onClick={() => setActiveTab('visitors')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                >
                  Manage Visitors
                </button>
              </div>
              <div className="space-y-4">
                {visitors.map(visitor => (
                  <div key={visitor.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-bold text-gray-900">{visitor.name}</p>
                      <p className="text-sm text-gray-700 mt-1">{visitor.purpose} • {visitor.time}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      visitor.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {visitor.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Visitors Tab */}
        {activeTab === 'visitors' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VisitorPassGenerator />
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Visitor History</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {[...visitors, 
                    { id: 3, name: 'Sarah Guest', purpose: 'Personal', time: 'Yesterday, 7:00 PM', status: 'Completed' },
                    { id: 4, name: 'Amazon Delivery', purpose: 'Delivery', time: 'Jan 15, 11:30 AM', status: 'Completed' }
                  ].length} Total
                </span>
              </div>
              <div className="space-y-4">
                {[...visitors, 
                  { id: 3, name: 'Sarah Guest', purpose: 'Personal', time: 'Yesterday, 7:00 PM', status: 'Completed' },
                  { id: 4, name: 'Amazon Delivery', purpose: 'Delivery', time: 'Jan 15, 11:30 AM', status: 'Completed' }
                ].map(visitor => (
                  <div key={visitor.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">{visitor.name}</p>
                        <p className="text-sm text-gray-700 mt-1">{visitor.purpose}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-700">{visitor.time}</p>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium mt-2 ${
                          visitor.status === 'Active' 
                            ? 'bg-green-100 text-green-700' 
                            : visitor.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {visitor.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Visitor Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-700">This Month</p>
                    <p className="text-lg font-bold text-blue-700">8</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Active</p>
                    <p className="text-lg font-bold text-green-700">2</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Pending</p>
                    <p className="text-lg font-bold text-yellow-700">1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <PaymentSystem />
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Announcements & Notifications</h3>
                <p className="text-gray-700 mt-1">
                  {getUnreadCount()} unread • {announcements.length} total
                </p>
              </div>
              <button
                onClick={() => {
                  setAnnouncements(announcements.map(ann => ({ ...ann, read: true })))
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
              >
                Mark All Read
              </button>
            </div>
            
            <div className="space-y-4">
              {announcements.map(announcement => (
                <div 
                  key={announcement.id} 
                  className={`border rounded-lg p-4 ${!announcement.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        announcement.type === 'maintenance' 
                          ? 'bg-blue-100 text-blue-600' 
                          : announcement.type === 'security'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {announcement.type === 'maintenance' ? '🔧' : 
                         announcement.type === 'security' ? '🛡️' : '🎉'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{announcement.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            announcement.type === 'maintenance' 
                              ? 'bg-blue-100 text-blue-700' 
                              : announcement.type === 'security'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {announcement.type}
                          </span>
                          <span className="text-xs text-gray-700">{announcement.date}</span>
                          {!announcement.read && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!announcement.read && (
                      <button
                        onClick={() => markAsRead(announcement.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <p className="text-gray-800 mb-3">{announcement.content}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-xl">🚨</span>
                </div>
                <div>
                  <h4 className="font-bold text-red-900 mb-2">Emergency Notifications</h4>
                  <p className="text-red-800">
                    In case of emergency, use the Panic Button on the Overview tab. 
                    Security and admin will be notified immediately.
                  </p>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                  >
                    Go to Panic Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}