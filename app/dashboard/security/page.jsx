'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Scanner } from '@yudiel/react-qr-scanner'

// Hardcoded database simulation
const HARDCODED_DATA = {
  visitors: [
    /*{ id: 1, name: 'John Delivery', code: 'ABC123', pin: '4567', resident: 'A-101', purpose: 'Delivery', entryTime: '10:30 AM', status: 'active' },
   
    */ ],
  logs: [
   /* { id: 1, visitor: 'John Delivery', code: 'ABC123', type: 'entry', time: '10:30 AM', verified: true },
   */],
  alerts: [
   /* { id: 1, type: 'panic', unit: 'C-303', time: '9:15 AM', status: 'responded', priority: 'high' },
     */ ],
  announcements: [
   /* { id: 1, title: 'Security Patrol Update', message: 'Night patrol timings changed to 10 PM - 6 AM', type: 'security', time: '2 hours ago' },
    */ ]
}

// Blacklisted codes
const BLACKLISTED_CODES = ['BLOCK123', 'BLOCK456', 'DENY789']

// Security personnel mock data
const SECURITY_PERSONNEL = {
  /*id: 'SEC001',
  name: 'Rajesh Kumar',
  badgeNumber: 'SG-2024-001',
  role: 'Senior Security Officer',
  email: 'rajesh.security@estatesecure.com',
  phone: '+91 9876543210',
  shift: 'Morning (6 AM - 2 PM)',
  joinDate: '2023-01-15',
  experience: '2 years',
  training: ['Basic Security', 'First Aid', 'CCTV Operation', 'Visitor Management'],
  performance: {
    totalShifts: 245,
    punctuality: 98.5,
    incidentsResolved: 42,
    visitorVerified: 1245
  },
  emergencyContact: {
    name: 'Priya Kumar',
    relationship: 'Spouse',
    phone: '+91 9876543211'
  },
  status: 'active'*/
}

// Mock API functions
const mockAPI = {
  // Get visitors
  async getVisitors() {
    try {
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

  // Get security profile
  async getSecurityProfile() {
    return SECURITY_PERSONNEL;
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
  const [securityProfile, setSecurityProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isScanning, setIsScanning] = useState(false)
  const [scannerResult, setScannerResult] = useState('')
  const [cameraError, setCameraError] = useState('')
  const [showProfileModal, setShowProfileModal] = useState(false)
  
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
        const [visitorsData, logsData, alertsData, announcementsData, profileData] = await Promise.all([
          mockAPI.getVisitors(),
          mockAPI.getLogs(),
          mockAPI.getAlerts(),
          mockAPI.getAnnouncements(),
          mockAPI.getSecurityProfile()
        ]);
        
        setCurrentVisitors(visitorsData);
        setTodayLogs(logsData);
        setSecurityAlerts(alertsData);
        setAnnouncements(announcementsData);
        setSecurityProfile(profileData);

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
        setCurrentVisitors(HARDCODED_DATA.visitors);
        setTodayLogs(HARDCODED_DATA.logs);
        setSecurityAlerts(HARDCODED_DATA.alerts);
        setAnnouncements(HARDCODED_DATA.announcements);
        setSecurityProfile(SECURITY_PERSONNEL);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [])

  // Start QR Scanning
  const startScanner = () => {
    setIsScanning(true);
    setScannerResult('');
    setCameraError('');
  }

  // Stop QR Scanning
  const stopScanner = () => {
    setIsScanning(false);
  }

  // Handle QR scan success
  const handleQRScanSuccess = (result) => {
    if (result) {
      try {
        const parsedData = JSON.parse(result);
        if (parsedData.code && parsedData.pin) {
          setVisitorCode(parsedData.code);
          setVisitorPin(parsedData.pin);
          setScannerResult(`✅ Scanned: ${parsedData.code} - ${parsedData.name || 'Visitor'}`);
        } else {
          setVisitorCode(result);
          setScannerResult(`✅ Scanned: ${result}`);
        }
      } catch {
        setVisitorCode(result);
        setScannerResult(`✅ Scanned: ${result}`);
      }
      
      setTimeout(() => {
        stopScanner();
      }, 1000);
    }
  }

  // Handle QR scan error
  const handleQRScanError = (error) => {
    console.error('QR Scanner error:', error);
    if (error.name === 'NotAllowedError') {
      setCameraError('Camera access denied. Please allow camera permissions.');
    } else if (error.name === 'NotFoundError') {
      setCameraError('No camera found on this device.');
    } else {
      setCameraError('Camera error: ' + error.message);
    }
  }

  // Handle QR scan manually (for demo)
  const handleManualQRInput = (data) => {
    const sampleQRData = {
      code: 'QRCODE123',
      pin: '7890',
      name: 'QR Visitor',
      resident: 'D-404',
      purpose: 'Meeting'
    };
    
    if (data === 'sample1') {
      const qrString = JSON.stringify(sampleQRData);
      handleQRScanSuccess(qrString);
    } else if (data === 'blacklisted') {
      const blacklistedData = {
        code: 'BLOCK123',
        pin: '0000',
        name: 'Blacklisted Person',
        resident: 'N/A',
        purpose: 'Suspicious'
      };
      const qrString = JSON.stringify(blacklistedData);
      handleQRScanSuccess(qrString);
    }
  }

  const handleVerifyVisitor = async () => {
    if (!visitorCode || !visitorPin) {
      alert('Please enter both Pass Code and PIN')
      return
    }

    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const visitor = currentVisitors.find(v => v.code === visitorCode && v.pin === visitorPin)
      
      if (visitor) {
        await mockAPI.updateVisitorStatus(visitor.id, {
          status: 'active',
          entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        const updatedVisitors = currentVisitors.map(v => 
          v.code === visitorCode ? { 
            ...v, 
            status: 'active', 
            entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          } : v
        );
        setCurrentVisitors(updatedVisitors);

        const newLog = {
          id: Date.now(),
          visitor: visitor.name,
          code: visitorCode,
          type: 'entry',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          verified: true,
          method: visitorCode.includes('QR') ? 'QR Scan' : 'Manual',
          verifiedBy: securityProfile?.name || 'Security Officer'
        };

        await mockAPI.addLogEntry(newLog);

        const updatedLogs = [newLog, ...todayLogs];
        setTodayLogs(updatedLogs);

        setSecurityStats(prev => ({
          ...prev,
          entriesToday: prev.entriesToday + 1,
          activeVisitors: prev.activeVisitors + 1,
          pendingVerifications: prev.pendingVerifications > 0 ? prev.pendingVerifications - 1 : 0
        }));

        alert(`✅ Visitor ${visitor.name} verified successfully!\nAccess granted.`);
      } else {
        const isBlacklisted = BLACKLISTED_CODES.includes(visitorCode);
        
        if (isBlacklisted) {
          alert(` BLACKLISTED VISITOR DETECTED!\nPass Code: ${visitorCode}\nSecurity notified. Access denied.`);
          
          const incident = {
            id: Date.now(),
            type: 'blacklist_attempt',
            visitorCode,
            time: new Date().toLocaleTimeString(),
            action: 'Denied entry',
            priority: 'high',
            reportedBy: securityProfile?.name || 'Security Officer'
          };
          
          await mockAPI.addSecurityAlert(incident);
          
          setSecurityAlerts(prev => [incident, ...prev]);
        } else {
          alert('❌ Invalid Pass Code or PIN. Please check and try again.');
        }
      }

      setVisitorCode('');
      setVisitorPin('');
      setScannerResult('');
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
      await mockAPI.updateVisitorStatus(visitorId, { status: 'checked-out' });

      const updatedVisitors = currentVisitors.filter(v => v.id !== visitorId);
      setCurrentVisitors(updatedVisitors);

      const newLog = {
        id: Date.now(),
        visitor: visitor.name,
        code: visitor.code,
        type: 'exit',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verified: true,
        method: visitor.code.includes('QR') ? 'QR Scan' : 'Manual',
        processedBy: securityProfile?.name || 'Security Officer'
      };

      await mockAPI.addLogEntry(newLog);

      const updatedLogs = [newLog, ...todayLogs];
      setTodayLogs(updatedLogs);

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
    setScannerResult('Test blacklisted visitor loaded')
    alert('Test blacklisted visitor loaded. Try verifying to see the alert.')
  }

  const handleMarkAlertResolved = async (alertId) => {
    try {
      await mockAPI.updateAlertStatus(alertId, 'resolved');
      
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
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('sessionId');
      router.push('/login');
    }
  }

  const getShiftInfo = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 14) return 'Morning Shift (6 AM - 2 PM)'
    if (hour >= 14 && hour < 22) return 'Evening Shift (2 PM - 10 PM)'
    return 'Night Shift (10 PM - 6 AM)'
  }

  const handleEditProfile = () => {
    alert('Profile editing feature will be available soon!');
  }

  const handleGenerateReport = () => {
    alert('Daily report generated! Report has been saved to your records.');
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
                    {securityProfile?.name || 'Security Officer'} • {getShiftInfo()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-200">Badge: {securityProfile?.badgeNumber || 'SG-XXXX-XXX'}</p>
                <p className="text-sm text-blue-200">Logged in: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              
              {/* Profile Button */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white">👤</span>
                </div>
                <span>Profile</span>
              </button>
              
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

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Security Personnel Profile</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Personal Info */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-xl p-6 text-white text-center">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">👮</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{securityProfile?.name}</h3>
                    <p className="text-blue-200 mb-4">{securityProfile?.role}</p>
                    
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-blue-200">Badge No.</p>
                          <p className="font-bold text-lg">{securityProfile?.badgeNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-200">Status</p>
                          <span className="px-2 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-left">
                      <div className="flex items-center">
                        <span className="mr-2">📧</span>
                        <span className="text-sm">{securityProfile?.email}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📱</span>
                        <span className="text-sm">{securityProfile?.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">⏰</span>
                        <span className="text-sm">{securityProfile?.shift}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Emergency Contact */}
                  <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="font-bold text-red-900 mb-3">🆘 Emergency Contact</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Name:</span> {securityProfile?.emergencyContact?.name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Relationship:</span> {securityProfile?.emergencyContact?.relationship}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Phone:</span> {securityProfile?.emergencyContact?.phone}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Details */}
                <div className="lg:col-span-2">
                  {/* Performance Stats */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Performance Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Shifts</p>
                        <p className="text-2xl font-bold text-blue-700">{securityProfile?.performance?.totalShifts}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Punctuality</p>
                        <p className="text-2xl font-bold text-green-700">{securityProfile?.performance?.punctuality}%</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Incidents Resolved</p>
                        <p className="text-2xl font-bold text-purple-700">{securityProfile?.performance?.incidentsResolved}</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Visitors Verified</p>
                        <p className="text-2xl font-bold text-orange-700">{securityProfile?.performance?.visitorVerified}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Training & Skills */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Training & Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {securityProfile?.training?.map((training, index) => (
                        <span key={index} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                          🎓 {training}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Service Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Join Date</p>
                        <p className="font-bold text-gray-900">{formatDate(securityProfile?.joinDate)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-bold text-gray-900">{securityProfile?.experience}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Security ID</p>
                      <p className="font-mono text-gray-900">{securityProfile?.id}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-8 flex space-x-4">
                    <button
                      onClick={handleEditProfile}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex-1"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleGenerateReport}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex-1"
                    >
                      Generate Daily Report
                    </button>
                    <button
                      onClick={() => setShowProfileModal(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
       

        {/* Tab Navigation */}
        <div className="flex border-b mb-6 overflow-x-auto">
          {[
            { id: 'visitors', label: 'Visitor Management', icon: '👥' },
            { id: 'logs', label: 'Entry/Exit Logs', icon: '📊' },
            { id: 'alerts', label: 'Security Alerts', icon: '🚨' },
            { id: 'announcements', label: 'Announcements', icon: '📢' },
            { id: 'quick', label: 'Quick Actions', icon: '⚡' },
            { id: 'profile', label: 'My Profile', icon: '👤' }
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
            {/* Visitor Verification Form with QR Scanner */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Visitor Verification</h3>
              
              <div className="space-y-6">
                {/* QR Scanner Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">QR Code Scanner</h4>
                    <div className="flex space-x-2">
                      {!isScanning ? (
                        <button
                          onClick={startScanner}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
                        >
                          <span className="mr-2">📷</span> Scan QR Code
                        </button>
                      ) : (
                        <button
                          onClick={stopScanner}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                        >
                          Stop Scanner
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {isScanning && (
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-blue-300 rounded-lg overflow-hidden">
                        <Scanner
                          onDecode={handleQRScanSuccess}
                          onError={handleQRScanError}
                          scanDelay={500}
                          constraints={{
                            facingMode: 'environment'
                          }}
                          containerStyle={{
                            width: '100%',
                            height: '300px'
                          }}
                          videoStyle={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      
                      {cameraError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-700 font-medium">{cameraError}</p>
                          <p className="text-sm text-red-600 mt-1">
                            Try using demo buttons below or enter manually
                          </p>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <p className="text-sm text-blue-600">📱 Point camera at visitor's QR code</p>
                        <p className="text-xs text-gray-500">Scanner will auto-fill the form below</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Demo QR Buttons */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Demo QR Codes:</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleManualQRInput('sample1')}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium flex items-center"
                      >
                        <span className="mr-1"></span> Valid Visitor
                      </button>
                      <button
                        onClick={() => handleManualQRInput('blacklisted')}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium flex items-center"
                      >
                        <span className="mr-1">🚫</span> Blacklisted
                      </button>
                      <button
                        onClick={() => handleQRScanSuccess('QRVISITOR123')}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium flex items-center"
                      >
                        <span className="mr-1">📱</span> Simple Code
                      </button>
                    </div>
                  </div>
                  
                  {scannerResult && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <p className="text-green-700 font-medium">{scannerResult}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Manual Entry Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Manual Entry</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800">Visitor Pass Code</label>
                      <input
                        type="text"
                        value={visitorCode}
                        onChange={(e) => setVisitorCode(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        placeholder="Enter pass code or scan QR"
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
                    
                    <div className="space-y-3 pt-2">
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
                      
                      
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3 text-gray-900">Today's Summary</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">QR Scans Today</p>
                    <p className="text-lg font-bold text-blue-700">12</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Manual Entries</p>
                    <p className="text-lg font-bold text-green-700">8</p>
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
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => {
                            const qrData = JSON.stringify({
                              code: visitor.code,
                              pin: visitor.pin,
                              name: visitor.name,
                              resident: visitor.resident,
                              purpose: visitor.purpose
                            });
                            navigator.clipboard.writeText(qrData);
                            alert('QR data copied to clipboard! Use demo QR button to test scanning.');
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                          <span className="mr-1">📋</span> Copy QR Data for Testing
                        </button>
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
                    <th className="text-left py-3 text-gray-800 font-medium">Verified By</th>
                    <th className="text-left py-3 text-gray-800 font-medium">Status</th>
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
                      <td className="py-3 text-gray-700 text-sm">
                        {log.verifiedBy || log.processedBy || 'System'}
                      </td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          log.verified 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {log.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                            {alert.reportedBy && (
                              <p className="text-xs text-gray-500 mt-1">
                                Reported by: {alert.reportedBy}
                              </p>
                            )}
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
              <h4 className="text-xl font-bold mb-4"> Emergency Contacts</h4>
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


        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👮</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{securityProfile?.name}</h2>
                    <p className="text-blue-200">{securityProfile?.role}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        Badge: {securityProfile?.badgeNumber}
                      </span>
                      <span className="px-3 py-1 bg-green-500 rounded-full text-sm">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-medium"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleGenerateReport}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
            
            {/* Profile Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Personal Info */}
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Contact Information</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-medium text-gray-900">{securityProfile?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium text-gray-900">{securityProfile?.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Current Shift</p>
                        <p className="font-medium text-gray-900">{securityProfile?.shift}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Emergency Contact */}
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h4 className="font-bold text-red-900 mb-4 text-lg">🆘 Emergency Contact</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-700">Name</p>
                        <p className="font-medium text-gray-900">{securityProfile?.emergencyContact?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">Relationship</p>
                        <p className="font-medium text-gray-900">{securityProfile?.emergencyContact?.relationship}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">Phone</p>
                        <p className="font-medium text-gray-900">{securityProfile?.emergencyContact?.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                
                
                {/* Right Column - Training */}
                <div className="space-y-6">
                 
                  
                  
                </div>
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
                  <span className="text-sm">QR Scanner: Ready</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Logged in as: {securityProfile?.name}</span>
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