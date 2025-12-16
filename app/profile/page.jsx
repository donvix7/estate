'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Mock user data for demonstration
const MOCK_USER_DATA = {
  resident: {
    id: 'resident_001',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+91 9876543210',
    unitNumber: 'A-101',
    estateId: 'estate_001',
    estateName: 'Sunrise Towers',
    profileImage: null,
    emergencyContact: '+91 9876543211',
    emergencyContactName: 'Sarah Johnson',
    occupation: 'Software Engineer',
    familyMembers: [
      { name: 'Sarah Johnson', relation: 'Spouse', age: 32 },
      { name: 'Emma Johnson', relation: 'Daughter', age: 7 }
    ],
    vehicleDetails: [
      { type: 'Car', number: 'MH-12-AB-1234', color: 'White', model: 'Hyundai Creta' }
    ],
    pets: [
      { type: 'Dog', name: 'Max', breed: 'Golden Retriever', notes: 'Friendly, vaccinated' }
    ],
    moveInDate: '2022-03-15',
    subscriptionType: 'premium',
    notificationPreferences: {
      email: true,
      sms: true,
      push: true,
      emergencyAlerts: true,
      securityUpdates: true,
      maintenanceAlerts: true,
      paymentReminders: true,
      visitorNotifications: true
    },
    twoFactorEnabled: false,
    lastLogin: '2024-01-18T14:30:00Z'
  },
  activityLogs: [
    { id: 1, action: 'Visitor Entry Approved', timestamp: '2024-01-18 10:30 AM', details: 'Delivery person - ABC123' },
    { id: 2, action: 'Monthly Dues Paid', timestamp: '2024-01-15 02:15 PM', details: '₹5,000 via UPI' },
    { id: 3, action: 'Emergency Alert Received', timestamp: '2024-01-12 04:45 PM', details: 'Fire drill in Block B' },
    { id: 4, action: 'Visitor Pass Generated', timestamp: '2024-01-10 11:20 AM', details: 'For electrician service' },
    { id: 5, action: 'Complaint Submitted', timestamp: '2024-01-08 09:15 AM', details: 'Water leakage in common area' }
  ],
  currentVisitors: [
    { id: 1, name: 'Amazon Delivery', code: 'DEL123', entryTime: '2:30 PM', expectedExit: '3:00 PM' },
    { id: 2, name: 'John - AC Repair', code: 'AC456', entryTime: '10:00 AM', expectedExit: '12:00 PM' }
  ],
  upcomingPayments: [
    { id: 1, type: 'Monthly Maintenance', amount: '₹5,000', dueDate: '2024-01-25', status: 'pending' },
    { id: 2, type: 'Water Bill', amount: '₹850', dueDate: '2024-01-28', status: 'pending' }
  ],
  recentPayments: [
    { id: 1, type: 'Monthly Maintenance', amount: '₹5,000', date: '2023-12-20', method: 'UPI' },
    { id: 2, type: 'Electricity Bill', amount: '₹2,100', date: '2023-12-15', method: 'Net Banking' }
  ],
  documents: [
    { id: 1, name: 'Resident Agreement', type: 'PDF', uploaded: '2022-03-15' },
    { id: 2, name: 'ID Proof', type: 'Image', uploaded: '2022-03-16' },
    { id: 3, name: 'NOC Letter', type: 'PDF', uploaded: '2022-03-20' }
  ]
}

export default function ResidentProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [userData, setUserData] = useState(MOCK_USER_DATA.resident)
  const [activityLogs, setActivityLogs] = useState(MOCK_USER_DATA.activityLogs)
  const [currentVisitors, setCurrentVisitors] = useState(MOCK_USER_DATA.currentVisitors)
  const [upcomingPayments, setUpcomingPayments] = useState(MOCK_USER_DATA.upcomingPayments)
  const [recentPayments, setRecentPayments] = useState(MOCK_USER_DATA.recentPayments)
  const [documents, setDocuments] = useState(MOCK_USER_DATA.documents)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ ...MOCK_USER_DATA.resident })
  const [isUploading, setIsUploading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [notifications, setNotifications] = useState(MOCK_USER_DATA.resident.notificationPreferences)
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileImage(reader.result)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle notification preferences change
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  // Save profile changes
  const handleSaveProfile = () => {
    setUserData(editForm)
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  // Generate new visitor pass
  const handleGenerateVisitorPass = () => {
    const code = `VIS${Math.floor(100 + Math.random() * 900)}`
    const pin = Math.floor(1000 + Math.random() * 9000)
    
    alert(`New Visitor Pass Generated!\n\nCode: ${code}\nPIN: ${pin}\n\nShare this with your visitor.`)
    
    // Add to activity log
    const newLog = {
      id: activityLogs.length + 1,
      action: 'Visitor Pass Generated',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().getHours() >= 12 ? 'PM' : 'AM',
      details: `Code: ${code}, PIN: ${pin}`
    }
    setActivityLogs([newLog, ...activityLogs])
  }

  // Handle payment
  const handlePayment = (paymentId) => {
    const payment = upcomingPayments.find(p => p.id === paymentId)
    if (payment) {
      alert(`Processing payment of ${payment.amount} for ${payment.type}...`)
      
      // Move to recent payments
      const newRecentPayment = {
        ...payment,
        status: 'paid',
        date: new Date().toISOString().split('T')[0],
        method: 'UPI'
      }
      
      setRecentPayments([newRecentPayment, ...recentPayments])
      setUpcomingPayments(upcomingPayments.filter(p => p.id !== paymentId))
      
      // Add to activity log
      const newLog = {
        id: activityLogs.length + 1,
        action: 'Payment Made',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + (new Date().getHours() >= 12 ? 'PM' : 'AM'),
        details: `${payment.type} - ${payment.amount}`
      }
      setActivityLogs([newLog, ...activityLogs])
    }
  }

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      router.push('/login')
    }
  }

  // Handle notification settings save
  const saveNotificationSettings = () => {
    setUserData(prev => ({
      ...prev,
      notificationPreferences: notifications
    }))
    setShowNotificationSettings(false)
    alert('Notification preferences saved!')
  }

  // Get subscription color
  const getSubscriptionColor = (type) => {
    const colors = {
      premium: 'bg-purple-100 text-purple-800',
      standard: 'bg-blue-100 text-blue-800',
      basic: 'bg-gray-100 text-gray-800'
    }
    return colors[type] || colors.basic
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard/resident')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-blue-200">Manage your account and preferences</p>
              </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-2">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      userData.name.charAt(0)
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                      ) : (
                        <span className="text-white">📷</span>
                      )}
                    </div>
                  </label>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
                <p className="text-gray-600">{userData.occupation}</p>
                <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${getSubscriptionColor(userData.subscriptionType)}`}>
                  {userData.subscriptionType.charAt(0).toUpperCase() + userData.subscriptionType.slice(1)} Member
                </span>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Unit</span>
                  <span className="font-bold text-blue-700">{userData.unitNumber}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Active Visitors</span>
                  <span className="font-bold text-green-700">{currentVisitors.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-gray-700">Pending Payments</span>
                  <span className="font-bold text-yellow-700">{upcomingPayments.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Move-in Date</span>
                  <span className="font-bold text-purple-700">{formatDate(userData.moveInDate)}</span>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="mt-6 space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  📊 Overview
                </button>
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'personal' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  👤 Personal Info
                </button>
                <button
                  onClick={() => setActiveTab('family')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'family' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  👨‍👩‍👧‍👦 Family & Pets
                </button>
                <button
                  onClick={() => setActiveTab('visitors')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'visitors' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  👥 Visitor Management
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'payments' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  💰 Payments
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'activity' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  📝 Activity Log
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'documents' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  📄 Documents
                </button>
                <button
                  onClick={() => setShowNotificationSettings(true)}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  🔔 Notification Settings
                </button>
              </div>

              {/* Security Status */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Security Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-700">Account Active</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${userData.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={`text-sm ${userData.twoFactorEnabled ? 'text-green-700' : 'text-gray-600'}`}>
                      2FA {userData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-700">Last login: Today</span>
                  </div>
                </div>
                <button className="mt-3 w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                  View Security Report
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Estate Info Banner */}
            <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{userData.estateName}</h2>
                  <p className="text-blue-100">Welcome to your secure community</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-200">Resident ID</p>
                  <p className="font-mono font-bold">{userData.id}</p>
                </div>
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleGenerateVisitorPass}
                    className="p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow text-center"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-blue-600">👥</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Generate Visitor Pass</h3>
                    <p className="text-sm text-gray-600">Create QR code for visitors</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow text-center"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-green-600">💰</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Make Payment</h3>
                    <p className="text-sm text-gray-600">{upcomingPayments.length} payments due</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('personal')}
                    className="p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow text-center"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-purple-600">⚙️</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Update Profile</h3>
                    <p className="text-sm text-gray-600">Edit personal information</p>
                  </button>
                </div>

                {/* Current Visitors */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Current Visitors</h3>
                    <button
                      onClick={handleGenerateVisitorPass}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                    >
                      + New Pass
                    </button>
                  </div>
                  
                  {currentVisitors.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👥</span>
                      </div>
                      <p className="text-gray-700 text-lg">No active visitors</p>
                      <p className="text-gray-600 text-sm mt-2">Generate a pass for your visitors</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentVisitors.map(visitor => (
                        <div key={visitor.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h4 className="font-bold text-gray-900">{visitor.name}</h4>
                            <p className="text-sm text-gray-700">Code: {visitor.code}</p>
                            <p className="text-sm text-gray-600">Entered: {visitor.entryTime}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-700">Exit by: {visitor.expectedExit}</p>
                            <button className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                              Revoke Access
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Payments */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Payments</h3>
                  
                  {upcomingPayments.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">✅</span>
                      </div>
                      <p className="text-gray-700 text-lg">All payments cleared</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingPayments.map(payment => (
                        <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h4 className="font-bold text-gray-900">{payment.type}</h4>
                            <p className="text-sm text-gray-700">Due: {formatDate(payment.dueDate)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-red-600">{payment.amount}</p>
                            <button
                              onClick={() => handlePayment(payment.id)}
                              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Pay Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {activityLogs.slice(0, 3).map(log => (
                      <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600">📝</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{log.action}</h4>
                          <p className="text-sm text-gray-700">{log.details}</p>
                          <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                  <button
                    onClick={() => {
                      if (isEditing) {
                        handleSaveProfile()
                      } else {
                        setEditForm(userData)
                        setIsEditing(true)
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>
                
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Occupation</label>
                        <input
                          type="text"
                          name="occupation"
                          value={editForm.occupation}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Emergency Contact Name</label>
                        <input
                          type="text"
                          name="emergencyContactName"
                          value={editForm.emergencyContactName}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Emergency Contact Number</label>
                        <input
                          type="tel"
                          name="emergencyContact"
                          value={editForm.emergencyContact}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Security Settings</h4>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Two-Factor Authentication</h5>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="twoFactorEnabled"
                            checked={editForm.twoFactorEnabled}
                            onChange={(e) => setEditForm(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Full Name</p>
                        <p className="font-semibold text-gray-900">{userData.name}</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Email Address</p>
                        <p className="font-semibold text-gray-900">{userData.email}</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                        <p className="font-semibold text-gray-900">{userData.phone}</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Occupation</p>
                        <p className="font-semibold text-gray-900">{userData.occupation}</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Emergency Contact</p>
                        <p className="font-semibold text-gray-900">{userData.emergencyContactName}</p>
                        <p className="text-gray-700">{userData.emergencyContact}</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Move-in Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(userData.moveInDate)}</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Security Status</h4>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Two-Factor Authentication</h5>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${userData.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {userData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Family & Pets Tab */}
            {activeTab === 'family' && (
              <div className="space-y-6">
                {/* Family Members */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Family Members</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                      + Add Member
                    </button>
                  </div>
                  
                  {userData.familyMembers.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👨‍👩‍👧‍👦</span>
                      </div>
                      <p className="text-gray-700 text-lg">No family members added</p>
                      <p className="text-gray-600 text-sm mt-2">Add your family members for better management</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userData.familyMembers.map((member, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 text-xl">👤</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{member.name}</h4>
                              <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                {member.relation}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Age: {member.age} years</p>
                            <p className="mt-1">Status: Registered Resident</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pets */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Pets</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                      + Add Pet
                    </button>
                  </div>
                  
                  {userData.pets.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🐾</span>
                      </div>
                      <p className="text-gray-700 text-lg">No pets registered</p>
                      <p className="text-gray-600 text-sm mt-2">Register your pets for community compliance</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userData.pets.map((pet, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-green-600 text-xl">🐕</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{pet.name}</h4>
                              <span className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded">
                                {pet.type}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Breed: {pet.breed}</p>
                            <p className="mt-1">Notes: {pet.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vehicle Details */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Vehicle Details</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                      + Add Vehicle
                    </button>
                  </div>
                  
                  {userData.vehicleDetails.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🚗</span>
                      </div>
                      <p className="text-gray-700 text-lg">No vehicles registered</p>
                      <p className="text-gray-600 text-sm mt-2">Register your vehicles for parking access</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userData.vehicleDetails.map((vehicle, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <span className="text-yellow-600 text-xl">🚗</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{vehicle.model}</h4>
                              <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                                {vehicle.number}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Color: {vehicle.color}</p>
                            <p className="mt-1">Type: {vehicle.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Visitor Management Tab */}
            {activeTab === 'visitors' && (
              <div className="space-y-6">
                {/* Current Visitors */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Current Visitors</h3>
                    <button
                      onClick={handleGenerateVisitorPass}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                    >
                      + Generate New Pass
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {currentVisitors.map(visitor => (
                      <div key={visitor.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900">{visitor.name}</h4>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Pass Code:</span> {visitor.code}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Entry Time:</span> {visitor.entryTime}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Expected Exit:</span> {visitor.expectedExit}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <button className="block w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium">
                              Revoke Access
                            </button>
                            <button className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                              Extend Time
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visitor History */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Visitor History</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Visitor Name</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Date</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Purpose</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="p-3 text-sm text-gray-900">Amazon Delivery</td>
                          <td className="p-3 text-sm text-gray-700">Jan 17, 2024</td>
                          <td className="p-3 text-sm text-gray-700">Package Delivery</td>
                          <td className="p-3">
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Completed
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="p-3 text-sm text-gray-900">Electrician</td>
                          <td className="p-3 text-sm text-gray-700">Jan 15, 2024</td>
                          <td className="p-3 text-sm text-gray-700">Repair Work</td>
                          <td className="p-3">
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Completed
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                    <h4 className="font-semibold text-blue-900 mb-3">Generate Visitor Pass</h4>
                    <p className="text-blue-800 text-sm mb-4">Create a QR code pass for your visitors</p>
                    <button
                      onClick={handleGenerateVisitorPass}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                    >
                      Generate QR Pass
                    </button>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                    <h4 className="font-semibold text-green-900 mb-3">Visitor Rules</h4>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• All visitors must carry ID proof</li>
                      <li>• Maximum 3 visitors at a time</li>
                      <li>• Night entry after 10 PM requires special permission</li>
                      <li>• Parking available in designated areas only</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                {/* Upcoming Payments */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Payments</h3>
                  
                  <div className="space-y-4">
                    {upcomingPayments.map(payment => (
                      <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h4 className="font-bold text-gray-900">{payment.type}</h4>
                          <p className="text-sm text-gray-700">Due: {formatDate(payment.dueDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-red-600">{payment.amount}</p>
                          <button
                            onClick={() => handlePayment(payment.id)}
                            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Payments</h3>
                  
                  <div className="space-y-4">
                    {recentPayments.map(payment => (
                      <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h4 className="font-bold text-gray-900">{payment.type}</h4>
                          <p className="text-sm text-gray-700">Paid: {formatDate(payment.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">{payment.amount}</p>
                          <p className="text-sm text-gray-600">via {payment.method}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Payment Methods</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                      + Add Method
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600">💳</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">UPI</h4>
                            <p className="text-sm text-gray-600">alex.johnson@upi</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Primary
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-600">🏦</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Net Banking</h4>
                            <p className="text-sm text-gray-600">HDFC Bank ****1234</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Log Tab */}
            {activeTab === 'activity' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Activity Log</h3>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium">
                    Export Logs
                  </button>
                </div>
                
                <div className="space-y-4">
                  {activityLogs.map(log => (
                    <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{log.action}</h4>
                          <p className="text-gray-700 mt-1">{log.details}</p>
                          <p className="text-sm text-gray-500 mt-2">{log.timestamp}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {log.timestamp.includes('Today') ? 'Today' : 'Recent'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                    Load More Activities
                  </button>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">My Documents</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                      + Upload Document
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map(doc => (
                      <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600">📄</span>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {doc.type}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{doc.name}</h4>
                        <p className="text-sm text-gray-600">Uploaded: {formatDate(doc.uploaded)}</p>
                        <div className="mt-4 flex space-x-2">
                          <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                            View
                          </button>
                          <button className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Document Guidelines */}
                <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                  <h4 className="font-semibold text-amber-900 mb-3">Document Guidelines</h4>
                  <ul className="text-amber-800 text-sm space-y-2">
                    <li>• Keep all documents updated for security compliance</li>
                    <li>• ID proof must be valid for at least 6 months</li>
                    <li>• Vehicle documents should include insurance and RC</li>
                    <li>• Pet registration requires vaccination certificate</li>
                    <li>• Maximum file size: 10MB per document</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Settings Modal */}
      {showNotificationSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Notification Preferences</h3>
                <button
                  onClick={() => setShowNotificationSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="email"
                        checked={notifications.email}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="sms"
                        checked={notifications.sms}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Receive app push notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="push"
                        checked={notifications.push}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Emergency Alerts</h4>
                      <p className="text-sm text-gray-600">Critical emergency notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emergencyAlerts"
                        checked={notifications.emergencyAlerts}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Security Updates</h4>
                      <p className="text-sm text-gray-600">Security patrols and updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="securityUpdates"
                        checked={notifications.securityUpdates}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Visitor Notifications</h4>
                      <p className="text-sm text-gray-600">Visitor entry/exit alerts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="visitorNotifications"
                        checked={notifications.visitorNotifications}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowNotificationSettings(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNotificationSettings}
                  className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}