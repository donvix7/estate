'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PanicButton } from '@/components/panic-button'
import { VisitorPassGenerator } from '@/components/visitor-pass-generator'
import { PaymentSystem } from '@/components/payment-system'

// Hardcoded database simulation
const HARDCODED_DATA = {
  announcements: [
    { id: 1, title: 'Water Supply Maintenance', content: 'Water supply will be interrupted on Jan 20, 10 AM - 4 PM', date: '2024-01-18', type: 'maintenance', read: false },
    { id: 2, title: 'Security Update', content: 'New security protocols effective from Feb 1', date: '2024-01-17', type: 'security', read: true },
    { id: 3, title: 'Community Event', content: 'Annual community dinner on Jan 25 at Club House', date: '2024-01-16', type: 'event', read: true }
  ],
  visitors: [
    { id: 1, name: 'John Delivery', purpose: 'Delivery', time: 'Today, 10:30 AM', status: 'Active' },
    { id: 2, name: 'Electrician', purpose: 'Service', time: 'Today, 2:00 PM', status: 'Pending' },
    { id: 3, name: 'Sarah Guest', purpose: 'Personal', time: 'Yesterday, 7:00 PM', status: 'Completed' },
    { id: 4, name: 'Amazon Delivery', purpose: 'Delivery', time: 'Jan 15, 11:30 AM', status: 'Completed' }
  ],
  residents: [
    {
      id: 1,
      name: 'John Resident',
      email: 'resident@demo.com',
      unitNumber: 'A-101',
      building: 'Tower A',
      phone: '+91 9876543210',
      joinDate: '2023-01-15'
    }
  ]
}

// Mock API functions
const mockAPI = {
  // Get announcements
  async getAnnouncements() {
    try {
      // Try to fetch from placeholder API
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
      const data = await response.json();
      
      return data.map((post, index) => ({
        id: post.id,
        title: post.title.substring(0, 30) + '...',
        content: post.body.substring(0, 100) + '...',
        date: `2024-01-${18 - index}`,
        type: ['maintenance', 'security', 'event'][index],
        read: index > 0
      }));
    } catch (error) {
      console.log('Using hardcoded announcements data');
      return HARDCODED_DATA.announcements;
    }
  },

  // Get resident data
  async getResidentData(userId = 1) {
    const resident = HARDCODED_DATA.residents.find(r => r.id === userId);
    if (!resident) {
      return HARDCODED_DATA.residents[0];
    }
    return resident;
  },

  // Get visitors
  async getVisitors() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=4');
      const data = await response.json();
      
      return data.map((user, index) => ({
        id: user.id,
        name: user.name,
        purpose: ['Delivery', 'Service', 'Personal', 'Delivery'][index],
        time: ['Today, 10:30 AM', 'Today, 2:00 PM', 'Yesterday, 7:00 PM', 'Jan 15, 11:30 AM'][index],
        status: ['Active', 'Pending', 'Completed', 'Completed'][index]
      }));
    } catch (error) {
      console.log('Using hardcoded visitors data');
      return HARDCODED_DATA.visitors;
    }
  },

  // Mark announcement as read
  async markAnnouncementAsRead(announcementId) {
    const announcementIndex = HARDCODED_DATA.announcements.findIndex(a => a.id === announcementId);
    if (announcementIndex !== -1) {
      HARDCODED_DATA.announcements[announcementIndex].read = true;
    }
    return { success: true };
  },

  // Mark all announcements as read
  async markAllAnnouncementsAsRead() {
    HARDCODED_DATA.announcements.forEach(ann => ann.read = true);
    return { success: true };
  }
};

export default function ResidentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [announcements, setAnnouncements] = useState([])
  const [visitors, setVisitors] = useState([])
  const [residentData, setResidentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [announcementsData, visitorsData, residentData] = await Promise.all([
          mockAPI.getAnnouncements(),
          mockAPI.getVisitors(),
          mockAPI.getResidentData()
        ]);
        
        setAnnouncements(announcementsData);
        setVisitors(visitorsData);
        setResidentData(residentData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to hardcoded data
        setAnnouncements(HARDCODED_DATA.announcements);
        setVisitors(HARDCODED_DATA.visitors);
        setResidentData(HARDCODED_DATA.residents[0]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [])

  const getUserName = () => {
    if (residentData) {
      return residentData.name;
    }
    
    // Fallback to session storage
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        return user.name || 'Resident';
      }
    }
    return 'Resident';
  }

  const getUnitNumber = () => {
    if (residentData) {
      return residentData.unitNumber;
    }
    
    // Fallback to session storage
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        return user.unitNumber || 'A-101';
      }
    }
    return 'A-101';
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear session storage
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('sessionId');
      router.push('/login');
    }
  }

  const markAsRead = async (id) => {
    try {
      await mockAPI.markAnnouncementAsRead(id);
      
      // Update local state
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === id ? { ...ann, read: true } : ann
        )
      );
    } catch (error) {
      console.error('Error marking announcement as read:', error);
      // Still update local state for better UX
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === id ? { ...ann, read: true } : ann
        )
      );
    }
  }

  const markAllAsRead = async () => {
    try {
      await mockAPI.markAllAnnouncementsAsRead();
      
      // Update local state
      setAnnouncements(prev => 
        prev.map(ann => ({ ...ann, read: true }))
      );
    } catch (error) {
      console.error('Error marking all announcements as read:', error);
      // Still update local state for better UX
      setAnnouncements(prev => 
        prev.map(ann => ({ ...ann, read: true }))
      );
    }
  }

  const getUnreadCount = () => {
    return announcements.filter(ann => !ann.read).length;
  }

  const getActiveVisitors = () => {
    return visitors.filter(v => v.status === 'Active').length;
  }

  const getVisitorStatistics = () => {
    const activeVisitors = visitors.filter(v => v.status === 'Active').length;
    const pendingVisitors = visitors.filter(v => v.status === 'Pending').length;
    
    return {
      thisMonth: visitors.length,
      active: activeVisitors,
      pending: pendingVisitors
    };
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading Resident Dashboard...</p>
        </div>
      </div>
    );
  }

  const visitorStats = getVisitorStatistics();

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
                    <p className="text-3xl font-bold text-blue-700">{getActiveVisitors()}</p>
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
                {visitors.slice(0, 2).map(visitor => (
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
                  {visitors.length} Total
                </span>
              </div>
              <div className="space-y-4">
                {visitors.map(visitor => (
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
                    <p className="text-lg font-bold text-blue-700">{visitorStats.thisMonth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Active</p>
                    <p className="text-lg font-bold text-green-700">{visitorStats.active}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Pending</p>
                    <p className="text-lg font-bold text-yellow-700">{visitorStats.pending}</p>
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
                onClick={markAllAsRead}
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