'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SecurityDashboard() {
  const router = useRouter()
  const [visitorCode, setVisitorCode] = useState('')
  const [visitorPin, setVisitorPin] = useState('')
  const [currentVisitors, setCurrentVisitors] = useState([
    { id: 1, name: 'John Delivery', code: 'ABC123', resident: 'A-101', purpose: 'Delivery', entry: '10:30 AM' },
    { id: 2, name: 'Electrician', code: 'XYZ789', resident: 'B-202', purpose: 'Service', entry: '2:00 PM' }
  ])
  
  // Announcements & Broadcast State
  const [announcements, setAnnouncements] = useState([])
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    type: 'general', // general, emergency, maintenance, security
    priority: 'normal' // normal, high, urgent
  })
  const [activeTab, setActiveTab] = useState('visitors') // visitors, announcements, broadcast

  // Load announcements from localStorage on component mount
  useEffect(() => {
    const savedAnnouncements = localStorage.getItem('securityAnnouncements')
    if (savedAnnouncements) {
      setAnnouncements(JSON.parse(savedAnnouncements))
    } else {
      // Default announcements
      const defaultAnnouncements = [
        {
          id: 1,
          title: 'Security Patrol Update',
          message: 'Night patrol timings changed to 10 PM - 6 AM',
          type: 'security',
          priority: 'normal',
          author: 'Security Chief',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          read: false
        },
        {
          id: 2,
          title: 'Emergency Drill Today',
          message: 'Fire safety drill at 4 PM in Block B',
          type: 'emergency',
          priority: 'high',
          author: 'Admin',
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          read: true
        },
        {
          id: 3,
          title: 'CCTV Maintenance',
          message: 'Camera maintenance in Parking Area from 2-4 PM',
          type: 'maintenance',
          priority: 'normal',
          author: 'Security',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          read: true
        }
      ]
      setAnnouncements(defaultAnnouncements)
      localStorage.setItem('securityAnnouncements', JSON.stringify(defaultAnnouncements))
    }
  }, [])

  // Save announcements to localStorage whenever they change
  useEffect(() => {
    if (announcements.length > 0) {
      localStorage.setItem('securityAnnouncements', JSON.stringify(announcements))
    }
  }, [announcements])

  const handleVerifyVisitor = () => {
    if (visitorCode && visitorPin) {
      // Check if visitor is on blacklist
      const isBlacklisted = checkBlacklist(visitorCode)
      
      if (isBlacklisted) {
        alert(`🚨 BLACKLISTED VISITOR!\nCode: ${visitorCode}\nSecurity notified automatically.`)
        // Log this incident
        logSecurityIncident({
          type: 'blacklist_attempt',
          visitorCode,
          timestamp: new Date().toISOString(),
          action: 'Denied entry'
        })
      } else {
        alert(`✅ Visitor ${visitorCode} verified with PIN ${visitorPin}\nAccess granted!`)
        // Add to current visitors
        const newVisitor = {
          id: Date.now(),
          name: `Visitor ${visitorCode}`,
          code: visitorCode,
          resident: 'Unknown',
          purpose: 'Verified Entry',
          entry: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setCurrentVisitors([...currentVisitors, newVisitor])
      }
      
      setVisitorCode('')
      setVisitorPin('')
    }
  }

  const checkBlacklist = (code) => {
    // Simulated blacklist check
    const blacklistedCodes = ['BLOCK123', 'BLOCK456', 'DENY789']
    return blacklistedCodes.includes(code)
  }

  const logSecurityIncident = (incident) => {
    const incidents = JSON.parse(localStorage.getItem('securityIncidents') || '[]')
    incidents.unshift(incident)
    localStorage.setItem('securityIncidents', JSON.stringify(incidents))
  }

  const handleCheckout = (id) => {
    const visitor = currentVisitors.find(v => v.id === id)
    if (visitor) {
      setCurrentVisitors(currentVisitors.filter(v => v.id !== id))
      alert(`Visitor ${visitor.name} (${visitor.code}) checked out at ${new Date().toLocaleTimeString()}`)
    }
  }

  // Announcements & Broadcast Functions
  const handleSendBroadcast = () => {
    if (!newAnnouncement.message.trim()) {
      alert('Please enter a message')
      return
    }

    const broadcast = {
      id: Date.now(),
      ...newAnnouncement,
      author: 'Security',
      timestamp: new Date().toISOString(),
      read: false,
      sent: true
    }

    // Add to announcements
    const updatedAnnouncements = [broadcast, ...announcements]
    setAnnouncements(updatedAnnouncements)

    // Save to broadcast history
    const broadcasts = JSON.parse(localStorage.getItem('securityBroadcasts') || '[]')
    broadcasts.unshift(broadcast)
    localStorage.setItem('securityBroadcasts', JSON.stringify(broadcasts))

    // Show confirmation
    alert(`📢 Broadcast sent!\nType: ${newAnnouncement.type}\nPriority: ${newAnnouncement.priority}\n\nMessage: ${newAnnouncement.message}`)

    // Reset form
    setNewAnnouncement({
      title: '',
      message: '',
      type: 'general',
      priority: 'normal'
    })
  }

  const handleSendEmergencyAlert = () => {
    const emergencyMessage = prompt('Enter emergency alert message:')
    if (emergencyMessage) {
      const emergencyAlert = {
        id: Date.now(),
        title: '🚨 EMERGENCY ALERT',
        message: emergencyMessage,
        type: 'emergency',
        priority: 'urgent',
        author: 'Security',
        timestamp: new Date().toISOString(),
        read: false,
        sent: true
      }

      const updatedAnnouncements = [emergencyAlert, ...announcements]
      setAnnouncements(updatedAnnouncements)

      // Save emergency alert
      const emergencies = JSON.parse(localStorage.getItem('emergencyAlerts') || '[]')
      emergencies.unshift(emergencyAlert)
      localStorage.setItem('emergencyAlerts', JSON.stringify(emergencies))

      alert('🚨 EMERGENCY ALERT SENT TO ALL RESIDENTS AND ADMIN!')
    }
  }

  const markAsRead = (id) => {
    setAnnouncements(announcements.map(ann => 
      ann.id === id ? { ...ann, read: true } : ann
    ))
  }

  const deleteAnnouncement = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(ann => ann.id !== id))
    }
  }

  const getUnreadCount = () => {
    return announcements.filter(ann => !ann.read).length
  }

  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getPriorityColor = (priority) => {
    const colors = {
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    }
    return colors[priority] || colors.normal
  }

  const getTypeIcon = (type) => {
    const icons = {
      emergency: '🚨',
      security: '🛡️',
      maintenance: '🔧',
      general: '📢'
    }
    return icons[type] || '📢'
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userType')
      localStorage.removeItem('userName')
      localStorage.removeItem('userEmail')
      router.push('/login')
    }
  }

  const getUserName = () => {
    return localStorage.getItem('userName') || 'Security Officer'
  }

  const getGateStation = () => {
    return localStorage.getItem('gateStation') || 'Gate 1'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Security Dashboard</h1>
              <p className="text-blue-200">{getGateStation()} | Welcome, {getUserName()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setActiveTab('announcements')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 font-medium"
                >
                  <span>📢</span>
                  <span>Announcements</span>
                  {getUnreadCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getUnreadCount()}
                    </span>
                  )}
                </button>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('visitors')}
            className={`px-6 py-3 font-medium ${activeTab === 'visitors' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Visitor Management
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-6 py-3 font-medium relative ${activeTab === 'announcements' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Announcements
            {getUnreadCount() > 0 && (
              <span className="absolute -top-1 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getUnreadCount()}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-6 py-3 font-medium ${activeTab === 'broadcast' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Broadcast
          </button>
        </div>

        {/* Visitor Management Tab */}
        {activeTab === 'visitors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visitor Verification */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Visitor Verification</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Visitor Pass Code</label>
                    <input
                      type="text"
                      value={visitorCode}
                      onChange={(e) => setVisitorCode(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                      placeholder="Enter pass code"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">PIN Number</label>
                    <input
                      type="password"
                      value={visitorPin}
                      onChange={(e) => setVisitorPin(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                      placeholder="Enter 4-digit PIN"
                      maxLength="4"
                    />
                  </div>
                  
                  <button
                    onClick={handleVerifyVisitor}
                    disabled={!visitorCode || !visitorPin}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Verify & Allow Entry
                  </button>
                  
                  <button
                    onClick={() => {
                      setVisitorCode('BLOCK123')
                      setVisitorPin('0000')
                    }}
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-md"
                  >
                    Test Blacklisted Visitor
                  </button>
                </div>
              </div>

              {/* Current Visitors */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Current Visitors</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {currentVisitors.length} Active
                  </span>
                </div>
                
                {currentVisitors.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👥</span>
                    </div>
                    <p className="text-gray-700 text-lg">No active visitors</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentVisitors.map(visitor => (
                      <div key={visitor.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900">{visitor.name}</h4>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Resident:</span> {visitor.resident}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Purpose:</span> {visitor.purpose}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Entry:</span> {visitor.entry}
                              </p>
                              <div className="mt-2">
                                <span className="font-mono text-sm bg-gray-100 text-gray-900 px-2 py-1 rounded border">
                                  Code: {visitor.code}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={() => handleCheckout(visitor.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                            >
                              Check Out
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Entry/Exit Logs</h4>
                  <p className="text-blue-800 text-sm">
                    Total entries today: {currentVisitors.length + 5}
                    <br />
                    Last entry: 30 minutes ago
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Alerts Section */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-red-900">Emergency Alerts</h3>
                <button 
                  onClick={() => setActiveTab('broadcast')}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                >
                  Send Emergency Broadcast
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-white border border-red-300 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-red-800">🚨 Panic Alert Received</h4>
                      <p className="text-red-700 mt-1">Unit C-303 • 9:15 AM • Responding...</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setAnnouncements(announcements.map(ann => ({ ...ann, read: true })))
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  Mark All Read
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📢</span>
                  </div>
                  <p className="text-gray-700 text-lg">No announcements yet</p>
                </div>
              ) : (
                announcements.map(announcement => (
                  <div 
                    key={announcement.id} 
                    className={`border rounded-lg p-4 ${!announcement.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl mt-1">{getTypeIcon(announcement.type)}</span>
                        <div>
                          <h4 className="font-bold text-gray-900">{announcement.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getPriorityColor(announcement.priority)}`}>
                              {announcement.priority}
                            </span>
                            <span className="text-xs text-gray-700">
                              {formatTimeAgo(announcement.timestamp)} • {announcement.author}
                            </span>
                            {!announcement.read && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                NEW
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!announcement.read && (
                          <button
                            onClick={() => markAsRead(announcement.id)}
                            className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="text-sm text-red-700 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-800 mt-3">{announcement.message}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Quick Actions</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setNewAnnouncement({
                      title: 'Security Patrol Update',
                      message: 'Increased patrol frequency in Block A',
                      type: 'security',
                      priority: 'normal'
                    })
                    setActiveTab('broadcast')
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 font-medium"
                >
                  Send Security Update
                </button>
                <button
                  onClick={() => {
                    setNewAnnouncement({
                      title: 'Maintenance Notice',
                      message: 'Gate maintenance scheduled for tomorrow',
                      type: 'maintenance',
                      priority: 'high'
                    })
                    setActiveTab('broadcast')
                  }}
                  className="px-4 py-2 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 font-medium"
                >
                  Send Maintenance Alert
                </button>
                <button
                  onClick={handleSendEmergencyAlert}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 font-medium"
                >
                  Send Emergency Alert
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Broadcast Tab */}
        {activeTab === 'broadcast' && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Send Broadcast Message</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Title (Optional)</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                  placeholder="Enter broadcast title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Message *</label>
                <textarea
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                  rows="4"
                  placeholder="Type your broadcast message here..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Message Type</label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                  >
                    <option value="general">📢 General Announcement</option>
                    <option value="security">🛡️ Security Update</option>
                    <option value="maintenance">🔧 Maintenance Notice</option>
                    <option value="emergency">🚨 Emergency Alert</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Priority Level</label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Priority</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Preview</h4>
                <div className={`p-4 rounded border ${
                  newAnnouncement.priority === 'urgent' ? 'bg-red-50 border-red-200' :
                  newAnnouncement.priority === 'high' ? 'bg-orange-50 border-orange-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">{getTypeIcon(newAnnouncement.type)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(newAnnouncement.priority)}`}>
                      {newAnnouncement.priority}
                    </span>
                  </div>
                  {newAnnouncement.title && (
                    <h5 className="font-semibold text-gray-900 mb-2">{newAnnouncement.title}</h5>
                  )}
                  <p className="text-gray-800">{newAnnouncement.message || 'Your message will appear here...'}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSendBroadcast}
                  disabled={!newAnnouncement.message.trim()}
                  className="flex-1 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Send Broadcast
                </button>
                
                <button
                  onClick={handleSendEmergencyAlert}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-md"
                >
                  Send Emergency Alert
                </button>
              </div>
              
              <div className="text-sm text-gray-800">
                <p className="font-medium mb-2">📝 Broadcasts will be sent to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>All residents via notifications</li>
                  <li>Admin dashboard</li>
                  <li>Other security personnel</li>
                  <li>Announcements log (stored for 30 days)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}