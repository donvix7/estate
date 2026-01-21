'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PanicButton } from '@/components/panic-button'
import { VisitorPassGenerator } from '@/components/visitor-pass-generator'
import { PaymentSystem } from '@/components/payment-system'
import {
  Home,
  Users,
  CreditCard,
  Bell,
  User,
  LogOut,
  Settings,
  Phone,
  Mail,
  Shield,
  AlertCircle,
  CheckCircle,
  Calendar,
  Car,
  Users as UsersIcon,
  Building,
  Edit,
  Save,
  X,
  ChevronRight,
  Download,
  Eye,
  Clock,
  Package,
  MessageSquare,
  Activity,
  BarChart3,
  FileText,
  HelpCircle,
  ShieldAlert,
  ShieldClose,
  Settings2
} from 'lucide-react'

// Hardcoded database simulation
const HARDCODED_DATA = {
  announcements: [
    /*{ id: 1, title: 'Water Supply Maintenance', content: 'Water supply will be interrupted on Jan 20, 10 AM - 4 PM', date: '2024-01-18', type: 'maintenance', read: false },
   */],
  visitors: [
    /*{ id: 1, name: 'John Delivery', purpose: 'Delivery', time: 'Today, 10:30 AM', status: 'Active' },
    */],
  residents: [
   /* {
      id: 1,
      name: 'John Resident',
      email: 'resident@demo.com',
      unitNumber: 'A-101',
      building: 'Tower A',
      phone: '+91 9876543210',
      joinDate: '2023-01-15',
      emergencyContact: '+91 9876543211',
      familyMembers: 3,
      vehicleNumber: 'MH01AB1234'
    }*/
  ]
}

// Mock API functions
const mockAPI = {
  // Get announcements
  async getAnnouncements() {
    try {
      // Try to fetch from placeholder API
      const response = await fetch('https://');
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
  },

  // Update resident profile
  async updateResidentProfile(userId, updatedData) {
    const residentIndex = HARDCODED_DATA.residents.findIndex(r => r.id === userId);
    if (residentIndex !== -1) {
      HARDCODED_DATA.residents[residentIndex] = {
        ...HARDCODED_DATA.residents[residentIndex],
        ...updatedData
      };
      return { success: true, data: HARDCODED_DATA.residents[residentIndex] };
    }
    return { success: false };
  }
};

export default function ResidentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [announcements, setAnnouncements] = useState([])
  const [visitors, setVisitors] = useState([])
  const [residentData, setResidentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saveStatus, setSaveStatus] = useState('')

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
        setEditForm(residentData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to hardcoded data
        setAnnouncements(HARDCODED_DATA.announcements);
        setVisitors(HARDCODED_DATA.visitors);
        setResidentData(HARDCODED_DATA.residents[0]);
        setEditForm(HARDCODED_DATA.residents[0]);
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

  const handleEditProfile = () => {
    setIsEditing(true);
    setSaveStatus('');
  }

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(residentData);
    setSaveStatus('');
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSaveProfile = async () => {
    try {
      setSaveStatus('saving');
      const result = await mockAPI.updateResidentProfile(residentData.id, editForm);
      
      if (result.success) {
        setResidentData(result.data);
        setIsEditing(false);
        setSaveStatus('success');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveStatus('');
        }, 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus('error');
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading Resident Dashboard...</p>
        </div>
      </div>
    );
  }

  const visitorStats = getVisitorStatistics();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
    { id: 'visitors', label: 'Visitors', icon: <Users className="w-5 h-5" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'announcements', label: 'Announcements', icon: <Bell className="w-5 h-5" />, badge: getUnreadCount() },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 via-gray-800/95 to-gray-800 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-lg">ES</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Resident Dashboard</h1>
                <p className="text-gray-400">
                  <Building className="w-4 h-4 inline mr-2" />
                  Unit {getUnitNumber()} | Welcome, {getUserName()}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-700/50 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 relative font-medium flex-shrink-0 transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'text-cyan-300 border-b-2 border-cyan-500 bg-gradient-to-t from-cyan-500/5 to-transparent' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Emergency Section */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 flex items-center justify-center ">
                    <ShieldAlert className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Emergency Panic System</h2>
                    <p className="text-gray-400">24/7 Active Monitoring</p>
                  </div>
                </div>
                
              </div>
              <PanicButton />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12  rounded-xl flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 " />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{visitorStats.thisMonth}</div>
                    <div className="text-sm text-gray-400">This Month</div>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-300 mb-2">Total Visitors</h4>
                <div className="flex items-center gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-400">Active</div>
                    <div className="text-xl font-bold ">{visitorStats.active}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Pending</div>
                    <div className="text-xl font-bold ">{visitorStats.pending}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12  rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 " />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{announcements.length}</div>
                    <div className="text-sm text-gray-400">Announcements</div>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-300 mb-2">Notifications</h4>
                <div className="flex items-center gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-400">Unread</div>
                    <div className="text-xl font-bold ">{getUnreadCount()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Total</div>
                    <div className="text-xl font-bold ">{announcements.length}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12  rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 " />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold ">3</div>
                    <div className="text-sm text-gray-400">Years</div>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-300 mb-2">Community Tenure</h4>
                <p className="text-gray-400 text-sm">
                  Resident since {residentData?.joinDate || '2023-01-15'}
                </p>
              </div>
            </div>

            {/* Recent Visitors */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-8">
              <div className="flex justify-between items-center mb-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14  rounded-xl flex items-center justify-center">
                    <Users className="w-7 h-7 " />
                  </div>
                  <div>
                    <h3 className=" font-bold ">Recent Visitor Passes</h3>
                    <p className="text-gray-400">{visitorStats.active} active visitors</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('visitors')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-medium shadow-lg shadow-blue-500/25 transition-all duration-300 flex items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Manage Visitors
                </button>
              </div>
              <div className="space-y-4">
                {visitors.slice(0, 2).map(visitor => (
                  <div key={visitor.id} className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white text-lg">{visitor.name}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-gray-400 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            {visitor.purpose}
                          </span>
                          <span className="text-gray-400 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {visitor.time}
                          </span>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        visitor.status === 'Active' 
                          ? 'text-green-300 ' 
                          : 'text-amber-300'
                      }`}>
                        {visitor.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Visitors Tab */}
        {activeTab === 'visitors' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <VisitorPassGenerator />
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6 md:p-8">
  <div className="flex justify-between items-center mb-6 md:mb-8 text-white">
    <div className="flex items-center gap-3 md:gap-4">
      <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center">
        <Users className="w-5 h-5 md:w-7 md:h-7 " />
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-white">Visitor History</h3>
        <p className="text-gray-400 text-sm md:text-base">{visitors.length} total visitors</p>
      </div>
    </div>
   
  </div>

  {/* Table Container */}
  <div className="overflow-x-auto rounded-xl border border-gray-700/50">
    <table className="min-w-full divide-y divide-gray-700/50">
      <thead>
        <tr className="bg-gray-900/50">
          <th scope="col" className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Visitor
          </th>
          <th scope="col" className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300 uppercase tracking-wider hidden sm:table-cell">
            Purpose
          </th>
          <th scope="col" className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300 uppercase tracking-wider hidden md:table-cell">
            Time
          </th>
          <th scope="col" className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700/50">
        {visitors.map((visitor) => (
          <tr 
            key={visitor.id} 
            className="bg-gray-900/30 hover:bg-gray-900/50 transition-colors duration-200"
          >
            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mr-3 md:mr-4">
                  <span className="text-cyan-400 text-sm">{visitor.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-sm md:text-base font-medium text-white">{visitor.name}</div>
                  <div className="text-xs text-gray-400 sm:hidden">
                    {visitor.purpose} • <Clock className="w-3 h-3 inline mr-1" /> {visitor.time}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">
              {visitor.purpose}
            </td>
            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                {visitor.time}
              </div>
            </td>
            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${
                visitor.status === 'Active' 
                  ? 'text-green-300' 
                  : visitor.status === 'Pending'
                  ? 'text-amber-300' 
                  : 'text-gray-300'
              }`}>
                {visitor.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-8">
            <div className="flex justify-between items-center mb-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                  <Bell className="w-7 h-7 " />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Announcements & Notifications</h3>
                  <p className="text-gray-400">
                    {getUnreadCount()} unread • {announcements.length} total
                  </p>
                </div>
              </div>
              <button
                onClick={markAllAsRead}
                className="px-6 py-3 b text-cyan-400 rounded-xl hover:text-cyan-500 font-medium s transition-all duration-300"
              >
                Mark All Read
              </button>
            </div>
            
            <div className="space-y-6">
              {announcements.map(announcement => (
                <div 
                  key={announcement.id} 
                  className={`border rounded-xl p-6 transition-all duration-300 ${
                    !announcement.read 
                      ? 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50' 
                      : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        announcement.type === 'maintenance' 
                          ? 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50' 
                          : announcement.type === 'security'
                          ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
                          : 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
                      }`}>
                        <span className={`
                          ${announcement.type === 'maintenance' ? 'text-blue-400' : 
                            announcement.type === 'security' ? 'text-red-400' : 'text-green-400'}
                        `}>
                          {announcement.type === 'maintenance' ?<Settings2/> : 
                           announcement.type === 'security' ? <ShieldAlert/> : <FileText/>}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{announcement.title}</h4>
                        <div className="flex items-center gap-3 mt-3">
                          <span className={`text-sm px-4 py-1.5 rounded-full font-medium ${
                            announcement.type === 'maintenance' 
                              ? 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50' 
                              : announcement.type === 'security'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}>
                            {announcement.type}
                          </span>
                          <span className="text-sm text-gray-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {announcement.date}
                          </span>
                          {!announcement.read && (
                            <span className="text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 rounded-full">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!announcement.read && (
                      <button
                        onClick={() => markAsRead(announcement.id)}
                        className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark read
                      </button>
                    )}
                  </div>
                  <p className="text-gray-300 mb-3">{announcement.content}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-8  rounded-2xl">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xl mb-3">Emergency Notifications</h4>
                  <p className="text-gray-300 mb-6">
                    In case of emergency, use the Panic Button on the Overview tab. 
                    Security and admin will be notified immediately.
                  </p>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-6 py-3 border border-red-500/50 text-red-500 rounded-xl font-medium transition-all duration-300 flex items-center gap-3"
                  >
                    <ShieldAlert className="w-5 h-5" />
                    Go to Panic Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-8 text-white">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14  rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7 " />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Profile Information</h3>
                  <p className="text-gray-400">Manage your personal details</p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={handleEditProfile}
                  className="px-6 py-3 border border-cyan-500/50 text-cyan-500 rounded-xl font-medium transition-all duration-300 flex items-center gap-3"
                >
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-3 bg-gray-700/50 text-gray-300 hover:text-white rounded-xl hover:bg-gray-700 font-medium border border-gray-600 transition-all duration-300 flex items-center gap-3"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-3 border border-cyan-500/50 text-cyan-500 rounded-xl font-medium transition-all duration-300 flex items-center gap-3"
                  >
                    <Save className="w-5 h-5" />
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {saveStatus === 'success' && (
              <div className="mb-8 p-6 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <p className="text-emerald-300 font-medium">Profile updated successfully!</p>
                </div>
              </div>
            )}

            {saveStatus === 'error' && (
              <div className="mb-8 p-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <p className="text-red-300 font-medium">Error updating profile. Please try again.</p>
                </div>
              </div>
            )}

            {isEditing ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name || ''}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email || ''}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone || ''}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={editForm.emergencyContact || ''}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">
                      Unit Number
                    </label>
                    <input
                      type="text"
                      name="unitNumber"
                      value={editForm.unitNumber || ''}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">
                      Building
                    </label>
                    <input
                      type="text"
                      name="building"
                      value={editForm.building || ''}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">
                      Family Members
                    </label>
                    <input
                      type="number"
                      name="familyMembers"
                      value={editForm.familyMembers || ''}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={editForm.vehicleNumber || ''}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white transition-all"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center gap-8 p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/50">
                  <div className="w-24 h-24  rounded-2xl flex items-center justify-center shadow-lg ">
                    <span className="text-white text-3xl font-bold">
                      {residentData?.name?.charAt(0) || 'R'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-white">{residentData?.name || 'Resident'}</h4>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-gray-400 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {residentData?.email || 'resident@demo.com'}
                      </span>
                      <span className="text-gray-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Resident since {residentData?.joinDate || '2023-01-15'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-gray-900/50 border border-gray-700/50 rounded-2xl">
                    <h4 className="font-semibold text-white text-xl mb-6 flex items-center gap-3">
                      <Phone className="w-5 h-5 text-cyan-400" />
                      Contact Information
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-gray-400">Phone Number</p>
                        <p className="font-medium text-white text-lg mt-2">{residentData?.phone || '+91 9876543210'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Emergency Contact</p>
                        <p className="font-medium text-white text-lg mt-2">{residentData?.emergencyContact || '+91 9876543211'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Email Address</p>
                        <p className="font-medium text-white text-lg mt-2">{residentData?.email || 'resident@demo.com'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-gray-900/50 border border-gray-700/50 rounded-2xl">
                    <h4 className="font-semibold text-white text-xl mb-6 flex items-center gap-3">
                      <Building className="w-5 h-5 text-cyan-400" />
                      Residence Details
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-gray-400">Unit Number</p>
                        <p className="font-medium text-white text-lg mt-2">{residentData?.unitNumber || 'A-101'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Building</p>
                        <p className="font-medium text-white text-lg mt-2">{residentData?.building || 'Tower A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Family Members</p>
                        <p className="font-medium text-white text-lg mt-2">{residentData?.familyMembers || '3'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Vehicle Number</p>
                        <p className="font-medium text-white text-lg mt-2">{residentData?.vehicleNumber || 'MH01AB1234'}</p>
                      </div>
                    </div>
                  </div>
                </div>

               
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}