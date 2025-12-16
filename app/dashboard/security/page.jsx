'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Hardcoded database simulation
const HARDCODED_DATA = {
  visitors: [
    { id: 1, name: 'John Delivery', code: 'ABC123', pin: '4567', resident: 'A-101', purpose: 'Delivery', entryTime: '10:30 AM', status: 'active' },
    { id: 2, name: 'Electrician', code: 'XYZ789', pin: '8910', resident: 'B-202', purpose: 'Service', entryTime: '2:00 PM', status: 'active' },
    { id: 3, name: 'Amazon Delivery', code: 'DEL456', pin: '1234', resident: 'C-303', purpose: 'Delivery', entryTime: '4:15 PM', status: 'pending' }
  ],
  logs: [
    { id: 1, visitor: 'John Delivery', code: 'ABC123', type: 'entry', time: '10:30 AM', verified: true },
    { id: 2, visitor: 'Electrician', code: 'XYZ789', type: 'entry', time: '2:00 PM', verified: true },
    { id: 3, visitor: 'Sarah Guest', code: 'GUEST01', type: 'exit', time: '1:45 PM', verified: true },
    { id: 4, visitor: 'Amazon Delivery', code: 'DEL456', type: 'entry', time: '4:15 PM', verified: false }
  ],
  alerts: [
    { id: 1, type: 'panic', unit: 'C-303', time: '9:15 AM', status: 'responded', priority: 'high' },
    { id: 2, type: 'unauthorized', location: 'Gate 2', time: '11:30 AM', status: 'investigating', priority: 'medium' },
    { id: 3, type: 'suspicious', location: 'Parking Area', time: '3:45 PM', status: 'pending', priority: 'low' }
  ],
  announcements: [
    { id: 1, title: 'Security Patrol Update', message: 'Night patrol timings changed to 10 PM - 6 AM', type: 'security', time: '2 hours ago' },
    { id: 2, title: 'CCTV Maintenance', message: 'Camera maintenance in Parking Area from 2-4 PM', type: 'maintenance', time: '1 day ago' },
    { id: 3, title: 'Visitor Policy Update', message: 'New visitor verification process effective tomorrow', type: 'policy', time: '2 days ago' }
  ]
}

// Blacklisted codes
const BLACKLISTED_CODES = ['BLOCK123', 'BLOCK456', 'DENY789']

// Mock API functions
const mockAPI = {
  // Get visitors
  async getVisitors() {
    try {
      // Try to fetch from placeholder API
      const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=3');
      const data = await response.json();
      
      return data.map((user, index) => ({
        id: user.id,
        name: user.name,
        code: `CODE${user.id}`,
        pin: Math.floor(1000 + Math.random() * 9000).toString(),
        resident: ['A-101', 'B-202', 'C-303'][index],
        purpose: ['Delivery', 'Service', 'Guest'][index],
        entryTime: ['10:30 AM', '2:00 PM', '4:15 PM'][index],
        status: ['active', 'active', 'pending'][index]
      }));
    } catch (error) {
      console.log('Using hardcoded visitors data');
      return HARDCODED_DATA.visitors;
    }
  },

  // Get logs
  async getLogs() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=4');
      const data = await response.json();
      
      return data.map((post, index) => ({
        id: post.id,
        visitor: `Visitor ${post.id}`,
        code: `CODE${post.id}`,
        type: index % 2 === 0 ? 'entry' : 'exit',
        time: ['10:30 AM', '2:00 PM', '1:45 PM', '4:15 PM'][index],
        verified: index !== 3
      }));
    } catch (error) {
      console.log('Using hardcoded logs data');
      return HARDCODED_DATA.logs;
    }
  },

  // Get alerts
  async getAlerts() {
    return HARDCODED_DATA.alerts;
  },

  // Get announcements
  async getAnnouncements() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=3');
      const data = await response.json();
      
      return data.map((comment, index) => ({
        id: comment.id,
        title: comment.name.substring(0, 30) + '...',
        message: comment.body.substring(0, 100) + '...',
        type: ['security', 'maintenance', 'policy'][index],
        time: ['2 hours ago', '1 day ago', '2 days ago'][index]
      }));
    } catch (error) {
      console.log('Using hardcoded announcements data');
      return HARDCODED_DATA.announcements;
    }
  },

  // Update visitor status
  async updateVisitorStatus(visitorId, updates) {
    const visitorIndex = HARDCODED_DATA.visitors.findIndex(v => v.id === visitorId);
    if (visitorIndex !== -1) {
      HARDCODED_DATA.visitors[visitorIndex] = {
        ...HARDCODED_DATA.visitors[visitorIndex],
        ...updates
      };
    }
    return { success: true };
  },

  // Add log entry
  async addLogEntry(log) {
    HARDCODED_DATA.logs.unshift(log);
    return { success: true, id: log.id };
  },

  // Add security alert
  async addSecurityAlert(alert) {
    HARDCODED_DATA.alerts.unshift(alert);
    return { success: true, id: alert.id };
  },

  // Update alert status
  async updateAlertStatus(alertId, status) {
    const alertIndex = HARDCODED_DATA.alerts.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      HARDCODED_DATA.alerts[alertIndex].status = status;
    }
    return { success: true };
  }
};

export default function SecurityDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('visitors')
  const [visitorCode, setVisitorCode] = useState('')
  const [visitorPin, setVisitorPin] = useState('')
  const [currentVisitors, setCurrentVisitors] = useState([])
  const [todayLogs, setTodayLogs] = useState([])
  const [securityAlerts, setSecurityAlerts] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [securityStats, setSecurityStats] = useState({
    entriesToday: 0,
    exitsToday: 0,
    activeVisitors: 0,
    pendingVerifications: 0
  })

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const [visitorsData, logsData, alertsData, announcementsData] = await Promise.all([
          mockAPI.getVisitors(),
          mockAPI.getLogs(),
          mockAPI.getAlerts(),
          mockAPI.getAnnouncements()
        ]);
        
        setCurrentVisitors(visitorsData);
        setTodayLogs(logsData);
        setSecurityAlerts(alertsData);
        setAnnouncements(announcementsData);

        // Calculate stats
        const entries = logsData.filter(log => log.type === 'entry').length;
        const exits = logsData.filter(log => log.type === 'exit').length;
        const active = visitorsData.filter(v => v.status === 'active').length;
        const pending = visitorsData.filter(v => v.status === 'pending').length;

        setSecurityStats({
          entriesToday: entries,
          exitsToday: exits,
          activeVisitors: active,
          pendingVerifications: pending
        });
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to hardcoded data
        setCurrentVisitors(HARDCODED_DATA.visitors);
        setTodayLogs(HARDCODED_DATA.logs);
        setSecurityAlerts(HARDCODED_DATA.alerts);
        setAnnouncements(HARDCODED_DATA.announcements);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [])

  const handleVerifyVisitor = async () => {
    if (!visitorCode || !visitorPin) {
      alert('Please enter both Pass Code and PIN')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const visitor = currentVisitors.find(v => v.code === visitorCode && v.pin === visitorPin)
      
      if (visitor) {
        // Update visitor status via API
        await mockAPI.updateVisitorStatus(visitor.id, {
          status: 'active',
          entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        // Update local state
        const updatedVisitors = currentVisitors.map(v => 
          v.code === visitorCode ? { 
            ...v, 
            status: 'active', 
            entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          } : v
        );
        setCurrentVisitors(updatedVisitors);

        // Add to logs via API
        const newLog = {
          id: Date.now(),
          visitor: visitor.name,
          code: visitorCode,
          type: 'entry',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          verified: true
        };

        await mockAPI.addLogEntry(newLog);

        // Update local logs state
        const updatedLogs = [newLog, ...todayLogs];
        setTodayLogs(updatedLogs);

        // Update stats
        setSecurityStats(prev => ({
          ...prev,
          entriesToday: prev.entriesToday + 1,
          activeVisitors: prev.activeVisitors + 1,
          pendingVerifications: prev.pendingVerifications > 0 ? prev.pendingVerifications - 1 : 0
        }));

        alert(`✅ Visitor ${visitor.name} verified successfully!\nAccess granted.`);
      } else {
        // Check if blacklisted
        const isBlacklisted = BLACKLISTED_CODES.includes(visitorCode);
        
        if (isBlacklisted) {
          alert(`🚨 BLACKLISTED VISITOR DETECTED!\nPass Code: ${visitorCode}\nSecurity notified. Access denied.`);
          
          // Log security incident via API
          const incident = {
            id: Date.now(),
            type: 'blacklist_attempt',
            visitorCode,
            time: new Date().toLocaleTimeString(),
            action: 'Denied entry',
            priority: 'high'
          };
          
          await mockAPI.addSecurityAlert(incident);
          
          // Update local alerts state
          setSecurityAlerts(prev => [incident, ...prev]);
        } else {
          alert('❌ Invalid Pass Code or PIN. Please check and try again.');
        }
      }

      setVisitorCode('');
      setVisitorPin('');
    } catch (error) {
      console.error('Error verifying visitor:', error);
      alert('Error verifying visitor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleCheckout = async (visitorId) => {
    const visitor = currentVisitors.find(v => v.id === visitorId)
    if (!visitor) return

    try {
      // Remove from current visitors in API
      await mockAPI.updateVisitorStatus(visitorId, { status: 'checked-out' });

      // Update local state
      const updatedVisitors = currentVisitors.filter(v => v.id !== visitorId);
      setCurrentVisitors(updatedVisitors);

      // Add exit log via API
      const newLog = {
        id: Date.now(),
        visitor: visitor.name,
        code: visitor.code,
        type: 'exit',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verified: true
      };

      await mockAPI.addLogEntry(newLog);

      // Update local logs state
      const updatedLogs = [newLog, ...todayLogs];
      setTodayLogs(updatedLogs);

      // Update stats
      setSecurityStats(prev => ({
        ...prev,
        exitsToday: prev.exitsToday + 1,
        activeVisitors: prev.activeVisitors > 0 ? prev.activeVisitors - 1 : 0
      }));

      alert(`Visitor ${visitor.name} checked out at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error('Error checking out visitor:', error);
      alert('Error checking out visitor. Please try again.');
    }
  }

  const handleTestBlacklist = () => {
    setVisitorCode('BLOCK123')
    setVisitorPin('0000')
    alert('Test blacklisted visitor loaded. Try verifying to see the alert.')
  }

  const handleMarkAlertResolved = async (alertId) => {
    try {
      await mockAPI.updateAlertStatus(alertId, 'resolved');
      
      // Update local state
      setSecurityAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, status: 'resolved' } : alert
        )
      );
      
      alert('Alert marked as resolved');
    } catch (error) {
      console.error('Error updating alert:', error);
      alert('Error updating alert. Please try again.');
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear session storage
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('sessionId');
      router.push('/register');
    }
  }

  const getUserName = () => {
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        return user.name || 'Security Officer';
      }
    }
    return 'Security Officer';
  }

  const getShiftInfo = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 14) return 'Morning Shift (6 AM - 2 PM)'
    if (hour >= 14 && hour < 22) return 'Evening Shift (2 PM - 10 PM)'
    return 'Night Shift (10 PM - 6 AM)'
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading Security Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">👮</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Security Dashboard</h1>
                  <p className="text-blue-200">
                    {getUserName()} • {getShiftInfo()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-200">Gate Station: Gate 1</p>
                <p className="text-sm text-blue-200">Logged in: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Entries Today</p>
                <p className="text-3xl font-bold text-blue-700">{securityStats.entriesToday}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">↘️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Exits Today</p>
                <p className="text-3xl font-bold text-green-600">{securityStats.exitsToday}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">↗️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Visitors</p>
                <p className="text-3xl font-bold text-purple-600">{securityStats.activeVisitors}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Verifications</p>
                <p className="text-3xl font-bold text-yellow-600">{securityStats.pendingVerifications}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6 overflow-x-auto">
          {[
            { id: 'visitors', label: 'Visitor Management', icon: '👥' },
            { id: 'logs', label: 'Entry/Exit Logs', icon: '📊' },
            { id: 'alerts', label: 'Security Alerts', icon: '🚨' },
            { id: 'announcements', label: 'Announcements', icon: '📢' },
            { id: 'quick', label: 'Quick Actions', icon: '⚡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 whitespace-nowrap font-medium ${
                activeTab === tab.id 
                  ? 'border-b-2 border-blue-700 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Visitor Management Tab */}
        {activeTab === 'visitors' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visitor Verification Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Visitor Verification</h3>
              
              <div className="space-y-6">
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
                
                <div className="space-y-3">
                  <button
                    onClick={handleVerifyVisitor}
                    disabled={isLoading || !visitorCode || !visitorPin}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Verifying...
                      </div>
                    ) : 'Verify & Allow Entry'}
                  </button>
                  
                  <button
                    onClick={handleTestBlacklist}
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-md transition-all"
                  >
                    Test Blacklisted Visitor
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3 text-gray-900">Today's Summary</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Successful Verifications</p>
                    <p className="text-lg font-bold text-blue-700">{securityStats.entriesToday}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Failed Attempts</p>
                    <p className="text-lg font-bold text-red-700">2</p>
                  </div>
                </div>
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
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">👥</span>
                  </div>
                  <p className="text-gray-500 text-lg">No active visitors</p>
                  <p className="text-gray-400 text-sm mt-2">All visitors have checked out</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentVisitors.map(visitor => (
                    <div key={visitor.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
                              <span className="font-medium">Entry:</span> {visitor.entryTime}
                            </p>
                            <div className="mt-2">
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                Code: {visitor.code}
                              </span>
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded ml-2">
                                PIN: {visitor.pin}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            visitor.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {visitor.status === 'active' ? 'Active' : 'Pending'}
                          </span>
                          <button
                            onClick={() => handleCheckout(visitor.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                          >
                            Check Out
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Entry/Exit Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Today's Entry/Exit Logs</h3>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
                  Export Logs
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium">
                  View Full History
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-gray-800 font-medium">Visitor</th>
                    <th className="text-left py-3 text-gray-800 font-medium">Pass Code</th>
                    <th className="text-left py-3 text-gray-800 font-medium">Type</th>
                    <th className="text-left py-3 text-gray-800 font-medium">Time</th>
                    <th className="text-left py-3 text-gray-800 font-medium">Status</th>
                    <th className="text-left py-3 text-gray-800 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todayLogs.map(log => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div className="font-medium text-gray-900">{log.visitor}</div>
                      </td>
                      <td className="py-3">
                        <span className="font-mono text-gray-800">{log.code}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          log.type === 'entry' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {log.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-gray-700">{log.time}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          log.verified 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {log.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3">
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Log Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-700">Total Logs Today</p>
                  <p className="text-2xl font-bold text-blue-700">{todayLogs.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Entry Logs</p>
                  <p className="text-2xl font-bold text-green-700">
                    {todayLogs.filter(log => log.type === 'entry').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">Exit Logs</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {todayLogs.filter(log => log.type === 'exit').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Security Alerts</h3>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium">
                  Send Emergency Alert
                </button>
              </div>
              
              <div className="space-y-4">
                {securityAlerts.map(alert => (
                  <div key={alert.id} className={`border rounded-lg p-4 ${
                    alert.priority === 'high' 
                      ? 'bg-red-50 border-red-200' 
                      : alert.priority === 'medium'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          alert.priority === 'high' 
                            ? 'bg-red-100 text-red-600' 
                            : alert.priority === 'medium'
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {alert.type === 'panic' ? '🚨' : '⚠️'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {alert.type === 'panic' ? 'Panic Alert' : 
                             alert.type === 'unauthorized' ? 'Unauthorized Access' : 
                             'Suspicious Activity'}
                          </h4>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-700">
                              {alert.unit && `Unit: ${alert.unit} • `}
                              {alert.location && `Location: ${alert.location} • `}
                              Time: {alert.time}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                alert.status === 'responded' 
                                  ? 'bg-green-100 text-green-700' 
                                  : alert.status === 'investigating'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {alert.status}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                alert.priority === 'high' 
                                  ? 'bg-red-100 text-red-700' 
                                  : alert.priority === 'medium'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {alert.priority} priority
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {alert.status !== 'resolved' && (
                          <button
                            onClick={() => handleMarkAlertResolved(alert.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            Mark Resolved
                          </button>
                        )}
                        <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
              <h4 className="text-xl font-bold mb-4">🚨 Emergency Contacts</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 p-4 rounded-lg">
                  <p className="font-medium">Police Control Room</p>
                  <p className="text-2xl font-bold mt-2">100</p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <p className="font-medium">Estate Manager</p>
                  <p className="text-2xl font-bold mt-2">12345</p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <p className="font-medium">Medical Emergency</p>
                  <p className="text-2xl font-bold mt-2">108</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Announcements & Updates</h3>
            
            <div className="space-y-4">
              {announcements.map(announcement => (
                <div key={announcement.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        announcement.type === 'security' 
                          ? 'bg-blue-100 text-blue-600' 
                          : announcement.type === 'maintenance'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {announcement.type === 'security' ? '🛡️' : 
                         announcement.type === 'maintenance' ? '🔧' : '📋'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{announcement.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            announcement.type === 'security' 
                              ? 'bg-blue-100 text-blue-700' 
                              : announcement.type === 'maintenance'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {announcement.type}
                          </span>
                          <span className="text-xs text-gray-500">{announcement.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{announcement.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions Tab */}
        {activeTab === 'quick' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Report */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4">Quick Incident Report</h4>
              <div className="space-y-3">
                <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-900">
                  <option>Select Incident Type</option>
                  <option>Unauthorized Entry</option>
                  <option>Suspicious Activity</option>
                  <option>Property Damage</option>
                  <option>Noise Complaint</option>
                </select>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  rows="3"
                  placeholder="Brief description..."
                />
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  Submit Report
                </button>
              </div>
            </div>

            {/* Patrol Check-in */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4">Patrol Check-in</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200">
                    <div className="text-center">
                      <div className="text-2xl">📍</div>
                      <div className="text-sm font-medium mt-2">Gate 1</div>
                    </div>
                  </button>
                  <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200">
                    <div className="text-center">
                      <div className="text-2xl">📍</div>
                      <div className="text-sm font-medium mt-2">Parking</div>
                    </div>
                  </button>
                  <button className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 border border-purple-200">
                    <div className="text-center">
                      <div className="text-2xl">📍</div>
                      <div className="text-sm font-medium mt-2">Club House</div>
                    </div>
                  </button>
                  <button className="p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 border border-orange-200">
                    <div className="text-center">
                      <div className="text-2xl">📍</div>
                      <div className="text-sm font-medium mt-2">Pool Area</div>
                    </div>
                  </button>
                </div>
                <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                  Check-in at Current Location
                </button>
              </div>
            </div>

            {/* Emergency Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4">Emergency Actions</h4>
              <div className="space-y-3">
                <button className="w-full p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border border-red-200 flex items-center justify-between">
                  <span className="font-medium">Lock All Gates</span>
                  <span>🔒</span>
                </button>
                <button className="w-full p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border border-red-200 flex items-center justify-between">
                  <span className="font-medium">Activate Sirens</span>
                  <span>🚨</span>
                </button>
                <button className="w-full p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border border-red-200 flex items-center justify-between">
                  <span className="font-medium">Notify All Security</span>
                  <span>📢</span>
                </button>
                <button className="w-full p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border border-red-200 flex items-center justify-between">
                  <span className="font-medium">Emergency Evacuation</span>
                  <span>🚪</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Status Bar */}
        <div className="mt-8 p-4 bg-gray-900 text-white rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-300">Security System Status:</p>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">CCTV: Online</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Access Gates: Online</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Communication: Online</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Last System Check: {new Date().toLocaleTimeString()}</p>
              <p className="text-sm text-gray-300">All systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}