'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import the QR scanner to avoid SSR issues
const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then(mod => mod.Scanner),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading scanner...</p>
      </div>
    </div>
  }
)

// Hardcoded database simulation
const HARDCODED_DATA = {
  announcements: [],
  broadcasts: [],
  securityIncidents: [],
  emergencyAlerts: [],
  currentVisitors: [],
  securityLogs: [],
  userData: {
    /*id: 'admin_001',
    name: 'John Admin',
    gateStation: 'Main Office',
    type: 'admin',
    estateId: 'estate_001'*/
  },
  estates: [],
  pendingInvites: [],
  staffMembers: [],
  staffAttendance: [],
  staffTasks: []
}

// Mock API implementation (unchanged)
const mockAPI = {
  async getAnnouncements() {
    try {
      const response = await fetch('https://');
      const data = await response.json();
      
      return data.map((post, index) => ({
        id: post.id,
        title: `Announcement: ${post.title.split(' ').slice(0, 3).join(' ')}`,
        message: post.body,
        type: ['general', 'security', 'maintenance'][index % 3],
        priority: ['normal', 'high', 'normal'][index % 3],
        author: `User ${post.userId}`,
        timestamp: new Date(Date.now() - (index * 3600000)).toISOString(),
        read: index > 0
      }));
    } catch (error) {
      console.log('Using hardcoded announcements data');
      return HARDCODED_DATA.announcements;
    }
  },

  async saveAnnouncement(announcement) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(announcement),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      await response.json();
      return { success: true, id: Date.now() };
    } catch (error) {
      console.log('Simulating save to in-memory database');
      return { success: true, id: Date.now() };
    }
  },

  async verifyVisitorPass(code, pin) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const blacklistedCodes = ['BLOCK123', 'BLOCK456', 'DENY789'];
    const isBlacklisted = blacklistedCodes.includes(code);
    
    if (isBlacklisted) {
      return {
        success: false,
        message: 'Visitor is blacklisted',
        blacklisted: true,
        visitor: null
      };
    }
    
    const getRandomResident = () => {
      const residents = ['A-101', 'A-102', 'B-201', 'B-202', 'C-301', 'C-302'];
      return residents[Math.floor(Math.random() * residents.length)];
    };
    
    const visitorData = {
      id: `visitor_${Date.now()}`,
      code: code,
      pin: pin,
      name: `Visitor ${code}`,
      resident: getRandomResident(),
      purpose: 'Verified Entry',
      entryTime: new Date().toISOString(),
      status: 'active',
      verifiedBy: 'QR Scan'
    };
    
    HARDCODED_DATA.currentVisitors.unshift(visitorData);
    
    const logEntry = {
      id: Date.now(),
      type: 'visitor_verified',
      visitorCode: code,
      timestamp: new Date().toISOString(),
      action: 'Entry granted via QR scan',
      securityPersonnel: 'Security Dashboard',
      location: 'Main Gate',
      notes: `QR Code scanned and verified with PIN: ${pin}`
    };
    
    HARDCODED_DATA.securityLogs.unshift(logEntry);
    
    return {
      success: true,
      message: 'Visitor verified successfully',
      visitor: visitorData,
      log: logEntry
    };
  },

  async getSecurityLogs() {
    return HARDCODED_DATA.securityLogs || [];
  },

  async getUserData() {
    return HARDCODED_DATA.userData;
  },

  async getEstates() {
    return HARDCODED_DATA.estates;
  },

  async getStaffMembers() {
    return HARDCODED_DATA.staffMembers;
  },

  async getStaffAttendance() {
    return HARDCODED_DATA.staffAttendance;
  },

  async getStaffTasks() {
    return HARDCODED_DATA.staffTasks;
  },

  async getPendingInvites() {
    return HARDCODED_DATA.pendingInvites;
  },

  async getAdminEstate(adminId) {
    const estate = HARDCODED_DATA.estates.find(e => e.adminId === adminId);
    if (!estate) {
      return HARDCODED_DATA.estates[0];
    }
    return estate;
  },

  async saveSecurityIncident(incident) {
    HARDCODED_DATA.securityIncidents.unshift(incident);
    return { success: true };
  },

  async saveBroadcast(broadcast) {
    HARDCODED_DATA.broadcasts.unshift(broadcast);
    return { success: true };
  },

  async saveEmergencyAlert(alert) {
    HARDCODED_DATA.emergencyAlerts.unshift(alert);
    return { success: true };
  },

  async sendUserInvitation(invitation) {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const token = `invite_${timestamp}_${randomSuffix}_${invitation.estateId}`;
    
    const invitationData = {
      ...invitation,
      id: token,
      token: token,
      sentAt: new Date().toISOString(),
      status: 'sent',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    HARDCODED_DATA.pendingInvites = HARDCODED_DATA.pendingInvites.filter(
      invite => !(invite.email === invitation.email && invite.estateId === invitation.estateId)
    );
    
    HARDCODED_DATA.pendingInvites.unshift(invitationData);
    
    // Log to console (in real app, this would send email)
    console.log('📧 Email sent to:', invitation.email);
    console.log('Invitation Link:', `${typeof window !== 'undefined' ? window.location.origin : ''}/signup/${token}`);
    console.log('Estate-specific identifier:', invitation.estateId);
    
    return { 
      success: true, 
      invitation: invitationData,
      message: `Invitation sent to ${invitation.email}` 
    };
  },

  async addStaffMember(staffData) {
    const staffId = `staff_${Date.now()}`;
    const employeeId = `STF-${String(Date.now()).slice(-5)}`;
    
    const newStaff = {
      ...staffData,
      id: staffId,
      employeeId: employeeId,
      estateId: 'estate_001',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    
    HARDCODED_DATA.staffMembers.push(newStaff);
    return { success: true, staff: newStaff };
  },

  async updateStaffMember(staffId, updates) {
    const index = HARDCODED_DATA.staffMembers.findIndex(s => s.id === staffId);
    if (index !== -1) {
      HARDCODED_DATA.staffMembers[index] = {
        ...HARDCODED_DATA.staffMembers[index],
        ...updates
      };
      return { success: true, staff: HARDCODED_DATA.staffMembers[index] };
    }
    return { success: false };
  },

  async deleteStaffMember(staffId) {
    HARDCODED_DATA.staffMembers = HARDCODED_DATA.staffMembers.filter(s => s.id !== staffId);
    return { success: true };
  },

  async markAttendance(attendanceData) {
    const newAttendance = {
      id: Date.now(),
      ...attendanceData,
      date: new Date().toISOString().split('T')[0]
    };
    
    HARDCODED_DATA.staffAttendance.unshift(newAttendance);
    return { success: true, attendance: newAttendance };
  },

  async assignStaffTask(taskData) {
    const newTask = {
      id: Date.now(),
      ...taskData,
      status: 'pending',
      progress: 0
    };
    
    HARDCODED_DATA.staffTasks.unshift(newTask);
    return { success: true, task: newTask };
  },

  async updateTaskStatus(taskId, status) {
    const index = HARDCODED_DATA.staffTasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      HARDCODED_DATA.staffTasks[index].status = status;
      HARDCODED_DATA.staffTasks[index].progress = status === 'completed' ? 100 : 
                                                 status === 'in_progress' ? 50 : 0;
      return { success: true };
    }
    return { success: false };
  }
};

export default function SecurityDashboard() {
  const router = useRouter()
  const [visitorCode, setVisitorCode] = useState('')
  const [visitorPin, setVisitorPin] = useState('')
  const [currentVisitors, setCurrentVisitors] = useState(HARDCODED_DATA.currentVisitors)
  
  // QR Scanner State
  const [showScanner, setShowScanner] = useState(false)
  const [scanning, setScanning] = useState(true)
  const [cameraDevices, setCameraDevices] = useState([])
  const [selectedCamera, setSelectedCamera] = useState(null)
  
  // Announcements & Broadcast State
  const [announcements, setAnnouncements] = useState([])
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    type: 'general',
    priority: 'normal'
  })
  const [activeTab, setActiveTab] = useState('visitors')
  const [userData, setUserData] = useState(HARDCODED_DATA.userData)
  const [isLoading, setIsLoading] = useState(true)
  
  // User Creation State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    unitNumber: '',
    phone: '',
    role: 'resident'
  })
  const [estates, setEstates] = useState([])
  const [adminEstate, setAdminEstate] = useState(null)
  const [pendingInvites, setPendingInvites] = useState([])
  const [sendingInvite, setSendingInvite] = useState(false)
  const [inviteStatus, setInviteStatus] = useState('')
  
  // Staff Management State
  const [staffMembers, setStaffMembers] = useState([])
  const [staffAttendance, setStaffAttendance] = useState([])
  const [staffTasks, setStaffTasks] = useState([])
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'cleaning_staff',
    department: 'Housekeeping',
    salary: '',
    workSchedule: 'Mon-Fri, 9AM-6PM',
    emergencyContact: '',
    address: '',
    skills: '',
    notes: ''
  })
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
    location: ''
  })
  const [attendanceData, setAttendanceData] = useState({
    staffId: '',
    checkIn: '',
    checkOut: '',
    notes: ''
  })
  const [editingStaff, setEditingStaff] = useState(null)
  const [showStaffForm, setShowStaffForm] = useState(false)

  // Security Logs State
  const [securityLogs, setSecurityLogs] = useState([])

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [
          announcementsData, 
          userData, 
          estatesData, 
          invitesData, 
          adminEstateData,
          staffData,
          attendanceData,
          tasksData,
          logsData
        ] = await Promise.all([
          mockAPI.getAnnouncements(),
          mockAPI.getUserData(),
          mockAPI.getEstates(),
          mockAPI.getPendingInvites(),
          mockAPI.getAdminEstate('admin_001'),
          mockAPI.getStaffMembers(),
          mockAPI.getStaffAttendance(),
          mockAPI.getStaffTasks(),
          mockAPI.getSecurityLogs()
        ])
        setAnnouncements(announcementsData)
        setUserData(userData)
        setEstates(estatesData)
        setPendingInvites(invitesData)
        setAdminEstate(adminEstateData)
        setStaffMembers(staffData)
        setStaffAttendance(attendanceData)
        setStaffTasks(tasksData)
        setSecurityLogs(logsData)
      } catch (error) {
        console.error('Error loading data:', error)
        // Fallback to hardcoded data
        setAnnouncements(HARDCODED_DATA.announcements)
        setUserData(HARDCODED_DATA.userData)
        setEstates(HARDCODED_DATA.estates)
        setPendingInvites(HARDCODED_DATA.pendingInvites)
        setStaffMembers(HARDCODED_DATA.staffMembers)
        setStaffAttendance(HARDCODED_DATA.staffAttendance)
        setStaffTasks(HARDCODED_DATA.staffTasks)
        setSecurityLogs(HARDCODED_DATA.securityLogs)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Get available camera devices
  const getCameraDevices = async () => {
    try {
      // Check if we're in browser environment
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setCameraDevices(videoDevices)
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId)
        }
      }
    } catch (error) {
      console.error('Error getting camera devices:', error)
    }
  }

  // Load camera devices when scanner is shown
  useEffect(() => {
    if (showScanner) {
      getCameraDevices()
    }
  }, [showScanner])

  // Handle QR Code Scan
  const handleScan = async (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0 && scanning) {
      const scannedData = detectedCodes[0].rawValue
      setScanning(false) // Pause scanning
      
      try {
        // Parse QR code data
        let code = ''
        let pin = ''
        
        if (scannedData.includes(',')) {
          // Parse structured data
          const parts = scannedData.split(',')
          parts.forEach(part => {
            if (part.includes('code:')) {
              code = part.split(':')[1]
            } else if (part.includes('pin:')) {
              pin = part.split(':')[1]
            }
          })
        } else {
          // Simple code format
          code = scannedData
        }
        
        if (code) {
          setVisitorCode(code)
          
          // If PIN is included in QR, auto-verify
          if (pin) {
            setVisitorPin(pin)
            
            // Auto-verify after setting PIN
            setTimeout(async () => {
              await handleVerifyVisitorWithAPI(code, pin)
            }, 500)
          } else {
            // Only code scanned, ask for PIN
            alert(`QR Code scanned!\nVisitor Code: ${code}\n\nPlease enter PIN for verification.`)
            setShowScanner(false)
            // Focus on PIN input field
            const pinInput = document.getElementById('pinInput')
            if (pinInput) pinInput.focus()
          }
        }
        
        setShowScanner(false)
        setScanning(true)
        
      } catch (error) {
        console.error('Error processing QR code:', error)
        alert('Error scanning QR code. Please try again.')
        setShowScanner(false)
        setScanning(true)
      }
    }
  }

  // Handle Scanner Error
  const handleScannerError = (error) => {
    console.error('Scanner error:', error)
    alert(`Camera error: ${error?.message || 'Unable to access camera'}`)
  }

  // Enhanced verification function using API
  const handleVerifyVisitorWithAPI = async (code, pin) => {
    if (!code || !pin) {
      alert('Both code and PIN are required for verification')
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await mockAPI.verifyVisitorPass(code, pin)
      
      if (result.success) {
        // Add to current visitors list
        const newVisitor = {
          id: Date.now(),
          name: result.visitor.name,
          code: code,
          resident: result.visitor.resident,
          purpose: result.visitor.purpose,
          entry: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          verifiedBy: 'QR Scan',
          scanTime: new Date().toISOString()
        }
        
        setCurrentVisitors([newVisitor, ...currentVisitors])
        
        // Update security logs
        setSecurityLogs([result.log, ...securityLogs])
        
        // Show success message
        alert(`ACCESS GRANTED!\n\nVisitor: ${code}\nResident: ${result.visitor.resident}\nTime: ${new Date().toLocaleTimeString()}\n\nEntry logged successfully.`)
        
        // Add to activity log
        const newAnnouncement = {
          id: Date.now(),
          title: 'Visitor Entry - QR Scan',
          message: `Visitor ${code} granted entry for resident ${result.visitor.resident}`,
          type: 'security',
          priority: 'normal',
          author: 'Security System',
          timestamp: new Date().toISOString(),
          read: false
        }
        
        setAnnouncements([newAnnouncement, ...announcements])
        
        // Reset fields
        setVisitorCode('')
        setVisitorPin('')
        
      } else {
        if (result.blacklisted) {
          alert(`🚨 BLACKLISTED VISITOR!\n\nCode: ${code}\nSecurity has been notified.\n\nAutomatic incident report generated.`)
          
          // Log security incident
          const incident = {
            id: Date.now(),
            title: 'Blacklisted Visitor Attempt',
            message: `Visitor ${code} attempted entry via QR scan`,
            type: 'security',
            priority: 'high',
            author: 'Security System',
            timestamp: new Date().toISOString(),
            read: false
          }
          
          setAnnouncements([incident, ...announcements])
          
          // Save security incident
          await mockAPI.saveSecurityIncident({
            type: 'blacklist_attempt_qr',
            visitorCode: code,
            timestamp: new Date().toISOString(),
            action: 'Automatically blocked',
            method: 'QR Scan'
          })
        } else {
          alert(`Verification Failed\n\n${result.message}`)
        }
      }
    } catch (error) {
      console.error('Verification error:', error)
      alert('Error verifying visitor. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Original verification function (now using API)
  const handleVerifyVisitor = async () => {
    // Use visitorCode and visitorPin from state
    const codeToVerify = visitorCode
    const pinToVerify = visitorPin
    
    if (codeToVerify && pinToVerify) {
      await handleVerifyVisitorWithAPI(codeToVerify, pinToVerify)
    } else if (codeToVerify && !pinToVerify) {
      // Only code scanned, ask for PIN
      const pin = prompt(`Enter PIN for visitor code: ${codeToVerify}`)
      if (pin) {
        setVisitorPin(pin)
        // Auto-verify after setting PIN
        setTimeout(() => handleVerifyVisitor(), 100)
      }
    } else {
      alert('Please enter both code and PIN for verification')
    }
  }

  const handleCheckout = (id) => {
    const visitor = currentVisitors.find(v => v.id === id)
    if (visitor) {
      setCurrentVisitors(currentVisitors.filter(v => v.id !== id))
      alert(`Visitor ${visitor.name} (${visitor.code}) checked out at ${new Date().toLocaleTimeString()}`)
      
      // Add checkout log
      const checkoutLog = {
        id: Date.now(),
        type: 'visitor_checked_out',
        visitorCode: visitor.code,
        timestamp: new Date().toISOString(),
        action: 'Checked out manually',
        securityPersonnel: userData.name,
        location: 'Main Gate',
        notes: `Visitor ${visitor.name} checked out`
      }
      
      setSecurityLogs([checkoutLog, ...securityLogs])
    }
  }

  // Announcements & Broadcast Functions
  const handleSendBroadcast = async () => {
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

    // Save broadcast via API
    await mockAPI.saveBroadcast(broadcast)

    // Also save as announcement via API
    await mockAPI.saveAnnouncement(broadcast)

    // Show confirmation
    alert(`Broadcast sent!\nType: ${newAnnouncement.type}\nPriority: ${newAnnouncement.priority}\n\nMessage: ${newAnnouncement.message}`)

    // Reset form
    setNewAnnouncement({
      title: '',
      message: '',
      type: 'general',
      priority: 'normal'
    })
  }

  const handleSendEmergencyAlert = async () => {
    const emergencyMessage = prompt('Enter emergency alert message:')
    if (emergencyMessage) {
      const emergencyAlert = {
        id: Date.now(),
        title: 'EMERGENCY ALERT',
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

      // Save emergency alert via API
      await mockAPI.saveEmergencyAlert(emergencyAlert)

      alert('EMERGENCY ALERT SENT TO ALL RESIDENTS AND ADMIN!')
    }
  }

  // User Creation Functions
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !adminEstate) {
      setInviteStatus({ type: 'error', message: 'Name and email are required' })
      return
    }

    setSendingInvite(true)
    setInviteStatus({ type: 'info', message: 'Sending invitation...' })

    try {
      const invitationData = {
        ...newUser,
        estateId: adminEstate.id || 'estate_001'
      }
      
      const result = await mockAPI.sendUserInvitation(invitationData)
      
      if (result.success) {
        setInviteStatus({ 
          type: 'success', 
          message: result.message 
        })
        
        setPendingInvites([result.invitation, ...pendingInvites.filter(inv => inv.id !== result.invitation.id)])
        
        setNewUser({
          name: '',
          email: '',
          unitNumber: '',
          phone: '',
          role: 'resident'
        })
        
        setTimeout(() => {
          setInviteStatus('')
        }, 5000)
      } else {
        setInviteStatus({ 
          type: 'error', 
          message: 'Failed to send invitation. Please try again.' 
        })
      }
    } catch (error) {
      console.error('Error sending invitation:', error)
      setInviteStatus({ 
        type: 'error', 
        message: 'An error occurred. Please try again.' 
      })
    } finally {
      setSendingInvite(false)
    }
  }

  // Staff Management Functions
  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.phone) {
      alert('Name and phone are required')
      return
    }

    try {
      const result = await mockAPI.addStaffMember(newStaff)
      if (result.success) {
        setStaffMembers([...staffMembers, result.staff])
        setNewStaff({
          name: '',
          email: '',
          phone: '',
          role: 'cleaning_staff',
          department: 'Housekeeping',
          salary: '',
          workSchedule: 'Mon-Fri, 9AM-6PM',
          emergencyContact: '',
          address: '',
          skills: '',
          notes: ''
        })
        setShowStaffForm(false)
        alert('Staff member added successfully!')
      }
    } catch (error) {
      console.error('Error adding staff:', error)
      alert('Error adding staff member')
    }
  }

  const handleUpdateStaff = async () => {
    if (!editingStaff) return

    try {
      const result = await mockAPI.updateStaffMember(editingStaff.id, editingStaff)
      if (result.success) {
        setStaffMembers(staffMembers.map(s => 
          s.id === editingStaff.id ? result.staff : s
        ))
        setEditingStaff(null)
        alert('Staff member updated successfully!')
      }
    } catch (error) {
      console.error('Error updating staff:', error)
      alert('Error updating staff member')
    }
  }

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const result = await mockAPI.deleteStaffMember(staffId)
        if (result.success) {
          setStaffMembers(staffMembers.filter(s => s.id !== staffId))
          alert('Staff member deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting staff:', error)
        alert('Error deleting staff member')
      }
    }
  }

  const handleMarkAttendance = async () => {
    if (!attendanceData.staffId || !attendanceData.checkIn) {
      alert('Staff and check-in time are required')
      return
    }

    try {
      const result = await mockAPI.markAttendance(attendanceData)
      if (result.success) {
        setStaffAttendance([result.attendance, ...staffAttendance])
        setAttendanceData({
          staffId: '',
          checkIn: '',
          checkOut: '',
          notes: ''
        })
        alert('Attendance marked successfully!')
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
      alert('Error marking attendance')
    }
  }

  const handleAssignTask = async () => {
    if (!newTask.title || !newTask.assignedTo) {
      alert('Task title and assigned staff are required')
      return
    }

    try {
      const staff = staffMembers.find(s => s.id === newTask.assignedTo)
      const taskData = {
        ...newTask,
        assignedName: staff?.name || 'Unknown'
      }
      
      const result = await mockAPI.assignStaffTask(taskData)
      if (result.success) {
        setStaffTasks([result.task, ...staffTasks])
        setNewTask({
          title: '',
          description: '',
          assignedTo: '',
          priority: 'medium',
          dueDate: '',
          location: ''
        })
        alert('Task assigned successfully!')
      }
    } catch (error) {
      console.error('Error assigning task:', error)
      alert('Error assigning task')
    }
  }

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      const result = await mockAPI.updateTaskStatus(taskId, status)
      if (result.success) {
        setStaffTasks(staffTasks.map(task => 
          task.id === taskId ? { ...task, status, progress: status === 'completed' ? 100 : task.progress } : task
        ))
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStaffInputChange = (e) => {
    const { name, value } = e.target
    if (editingStaff) {
      setEditingStaff(prev => ({
        ...prev,
        [name]: value
      }))
    } else {
      setNewStaff(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAttendanceInputChange = (e) => {
    const { name, value } = e.target
    setAttendanceData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getEstateName = (estateId) => {
    const estate = estates.find(e => e.id === estateId)
    return estate ? estate.name : 'Unknown Estate'
  }

  const getStaffName = (staffId) => {
    const staff = staffMembers.find(s => s.id === staffId)
    return staff ? staff.name : 'Unknown Staff'
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      on_leave: 'bg-yellow-100 text-yellow-800',
      terminated: 'bg-red-100 text-red-800',
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const texts = {
      active: 'Active',
      inactive: 'Inactive',
      on_leave: 'On Leave',
      terminated: 'Terminated',
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed'
    }
    return texts[status] || status
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-orange-100 text-orange-800',
      low: 'bg-blue-100 text-blue-800',
      normal: 'bg-blue-100 text-blue-800'
    }
    return colors[priority] || colors.normal
  }

  const getRoleColor = (role) => {
    const colors = {
      cleaning_staff: 'bg-blue-100 text-blue-800',
      gardener: 'bg-green-100 text-green-800',
      electrician: 'bg-yellow-100 text-yellow-800',
      plumber: 'bg-purple-100 text-purple-800',
      security: 'bg-red-100 text-red-800',
      supervisor: 'bg-indigo-100 text-indigo-800'
    }
    return colors[role] || colors.cleaning_staff
  }

  const getRoleText = (role) => {
    const texts = {
      cleaning_staff: 'Cleaning Staff',
      gardener: 'Gardener',
      electrician: 'Electrician',
      plumber: 'Plumber',
      security: 'Security',
      supervisor: 'Supervisor'
    }
    return texts[role] || role
  }

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0]
    return staffAttendance.filter(a => a.date === today)
  }

  const getActiveStaffCount = () => {
    return staffMembers.filter(s => s.status === 'active').length
  }

  const getTodayPresentCount = () => {
    const todayAttendance = getTodayAttendance()
    return todayAttendance.filter(a => a.status === 'present').length
  }

  const getTaskStats = () => {
    const total = staffTasks.length
    const completed = staffTasks.filter(t => t.status === 'completed').length
    const inProgress = staffTasks.filter(t => t.status === 'in_progress').length
    
    return {
      total,
      completed,
      inProgress,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
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

  const getPriorityIcon = (priority) => {
    const icons = {
      high: '🔴',
      medium: '🟡',
      low: '🔵',
      normal: '⚪'
    }
    return icons[priority] || '⚪'
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

  const getStatusBadge = (status) => {
    const badges = {
      sent: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      expired: 'bg-gray-100 text-gray-800'
    }
    return badges[status] || badges.sent
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      router.push('/register')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading Security Dashboard...</p>
        </div>
      </div>
    )
  }

  const todayAttendance = getTodayAttendance()
  const activeStaffCount = getActiveStaffCount()
  const todayPresentCount = getTodayPresentCount()
  const taskStats = getTaskStats()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-200">{userData.gateStation} | Welcome, {userData.name}</p>
              <p className="text-blue-300 text-sm mt-1">
                Estate: {adminEstate?.name || 'Loading...'}
              </p>
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
        <div className="flex border-b mb-6 overflow-x-auto">
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
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Create Users
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-6 py-3 font-medium relative ${activeTab === 'staff' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Staff Management
            {staffTasks.filter(t => t.status === 'pending').length > 0 && (
              <span className="absolute -top-1 right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {staffTasks.filter(t => t.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 font-medium ${activeTab === 'logs' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Security Logs
          </button>
        </div>

        {/* Visitor Management Tab */}
        {activeTab === 'visitors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visitor Verification */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Visitor Verification</h3>
                
                {/* QR Scanner Button */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowScanner(true)}
                    className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md flex items-center justify-center space-x-3"
                  >
                    <span className="text-2xl">📷</span>
                    <span className="text-lg">Scan QR Code</span>
                  </button>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Use camera to scan visitor QR codes
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Visitor Pass Code</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={visitorCode}
                        onChange={(e) => setVisitorCode(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        placeholder="Enter pass code or scan QR"
                      />
                      <button
                        onClick={() => setShowScanner(true)}
                        className="px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 border border-blue-300"
                      >
                        Scan
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">PIN Number</label>
                    <input
                      type="password"
                      id="pinInput"
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
                                {visitor.verifiedBy && (
                                  <span className={`ml-2 text-xs px-2 py-1 rounded ${visitor.verifiedBy === 'QR Scan' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {visitor.verifiedBy}
                                  </span>
                                )}
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
                    Total entries today: {currentVisitors.length}
                    <br />
                    QR Scans: {currentVisitors.filter(v => v.verifiedBy === 'QR Scan').length}
                  </p>
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
                    <option value="general">General Announcement</option>
                    <option value="security">Security Update</option>
                    <option value="maintenance">Maintenance Notice</option>
                    <option value="emergency">Emergency Alert</option>
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
            </div>
          </div>
        )}

        {/* Create Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create User Form */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Invite New User</h3>
                    <p className="text-gray-700 mt-1">
                      Estate: <span className="font-semibold text-blue-700">{adminEstate?.name || 'N/A'}</span>
                    </p>
                  </div>
                  
                  <button
                      onClick={() => router.push('/dashboard/admin/users')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                    >
                      View Users
                    </button>
                </div>
                
                {/* Status Message */}
                {inviteStatus && (
                  <div className={`mb-6 p-4 rounded-lg border ${
                    inviteStatus.type === 'success' 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : inviteStatus.type === 'error'
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}>
                    <div className="flex items-center">
                      <span className="mr-2">
                        {inviteStatus.type === 'success' ? '✅' : 
                         inviteStatus.type === 'error' ? '❌' : '⏳'}
                      </span>
                      <span>{inviteStatus.message}</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={newUser.name}
                      onChange={handleNewUserInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleNewUserInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                      placeholder="user@example.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={newUser.phone}
                        onChange={handleNewUserInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800">Unit Number</label>
                      <input
                        type="text"
                        name="unitNumber"
                        value={newUser.unitNumber}
                        onChange={handleNewUserInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        placeholder="A-101"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Role</label>
                    <select
                      name="role"
                      value={newUser.role}
                      onChange={handleNewUserInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                    >
                      <option value="resident">Resident</option>
                      <option value="security">Security Personnel</option>
                      <option value="staff">Staff Member</option>
                      <option value="admin">Admin (Limited)</option>
                    </select>
                  </div>
                  
                  {/* Estate Information - Read Only */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Estate Information</p>
                        <p className="text-blue-800">{adminEstate?.name || 'No estate assigned'}</p>
                        <p className="text-sm text-blue-700">{adminEstate?.address || ''}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          Auto-assigned
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      User will automatically be authorized for this estate only
                    </p>
                  </div>
                  
                  <button
                    onClick={handleCreateUser}
                    disabled={sendingInvite || !newUser.name || !newUser.email || !adminEstate}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {sendingInvite ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Invitation...
                      </>
                    ) : (
                      'Send Invitation Email'
                    )}
                  </button>
                </div>
              </div>

              {/* Pending Invitations */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Pending Invitations</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {pendingInvites.length} Sent
                  </span>
                </div>
                
                {pendingInvites.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📨</span>
                    </div>
                    <p className="text-gray-700 text-lg">No pending invitations</p>
                    <p className="text-gray-600 text-sm mt-2">Send your first invitation using the form</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingInvites.map(invite => (
                      <div key={invite.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900">{invite.name}</h4>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Email:</span> {invite.email}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Estate:</span> {getEstateName(invite.estateId)}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Role:</span> {invite.role}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Sent:</span> {formatTimeAgo(invite.sentAt)}
                              </p>
                            </div>
                            <div className="mt-3">
                              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(invite.status)}`}>
                                {invite.status}
                              </span>
                              {invite.unitNumber && (
                                <span className="ml-2 text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                  Unit: {invite.unitNumber}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">
                              Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                            </div>
                            <div className="mt-2">
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/signup?token=${invite.token}`);
                                  alert('Invitation link copied to clipboard!');
                                }}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium"
                              >
                                Copy Link
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 font-mono break-all">
                            Token: {invite.token}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Contains estate identifier: {invite.estateId}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Staff Management Tab */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Staff List */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Staff Members</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowStaffForm(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                    >
                      + Add Staff
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {staffMembers.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👨‍🔧</span>
                      </div>
                      <p className="text-gray-700 text-lg">No staff members</p>
                      <button
                        onClick={() => setShowStaffForm(true)}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Add First Staff Member
                      </button>
                    </div>
                  ) : (
                    staffMembers.map(staff => (
                      <div key={staff.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-bold">
                                  {staff.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{staff.name}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getRoleColor(staff.role)}`}>
                                    {getRoleText(staff.role)}
                                  </span>
                                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(staff.status)}`}>
                                    {getStatusText(staff.status)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 space-y-1">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Employee ID:</span> {staff.employeeId}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Department:</span> {staff.department}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Phone:</span> {staff.phone}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Schedule:</span> {staff.workSchedule}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingStaff(staff)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staff.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        {staff.notes && (
                          <p className="text-sm text-gray-600 mt-2 border-t pt-2">
                            <span className="font-medium">Notes:</span> {staff.notes}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            {/* Staff Form Modal */}
            {(showStaffForm || editingStaff) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowStaffForm(false)
                          setEditingStaff(null)
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">Full Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={editingStaff ? editingStaff.name : newStaff.name}
                            onChange={handleStaffInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                            placeholder="Enter full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">Phone Number *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={editingStaff ? editingStaff.phone : newStaff.phone}
                            onChange={handleStaffInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                            placeholder="+91 9876543210"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={editingStaff ? editingStaff.email : newStaff.email}
                            onChange={handleStaffInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                            placeholder="staff@estate.com"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">Role</label>
                          <select
                            name="role"
                            value={editingStaff ? editingStaff.role : newStaff.role}
                            onChange={handleStaffInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                          >
                            <option value="cleaning_staff">Cleaning Staff</option>
                            <option value="gardener">Gardener</option>
                            <option value="electrician">Electrician</option>
                            <option value="plumber">Plumber</option>
                            <option value="security">Security</option>
                            <option value="supervisor">Supervisor</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">Department</label>
                          <select
                            name="department"
                            value={editingStaff ? editingStaff.department : newStaff.department}
                            onChange={handleStaffInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                          >
                            <option value="Housekeeping">Housekeeping</option>
                            <option value="Gardening">Gardening</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Security">Security</option>
                            <option value="Administration">Administration</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">Salary (₹)</label>
                          <input
                            type="number"
                            name="salary"
                            value={editingStaff ? editingStaff.salary : newStaff.salary}
                            onChange={handleStaffInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                            placeholder="Monthly salary"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Work Schedule</label>
                        <input
                          type="text"
                          name="workSchedule"
                          value={editingStaff ? editingStaff.workSchedule : newStaff.workSchedule}
                          onChange={handleStaffInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                          placeholder="e.g., Mon-Fri, 9AM-6PM"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">Emergency Contact</label>
                          <input
                            type="tel"
                            name="emergencyContact"
                            value={editingStaff ? editingStaff.emergencyContact : newStaff.emergencyContact}
                            onChange={handleStaffInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                            placeholder="Emergency phone number"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-800">Address</label>
                          <input
                            type="text"
                            name="address"
                            value={editingStaff ? editingStaff.address : newStaff.address}
                            onChange={handleStaffInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                            placeholder="Staff accommodation address"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Skills (comma separated)</label>
                        <input
                          type="text"
                          name="skills"
                          value={editingStaff ? editingStaff.skills : newStaff.skills}
                          onChange={handleStaffInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                          placeholder="e.g., Cleaning, Maintenance, Electrical"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Notes</label>
                        <textarea
                          name="notes"
                          value={editingStaff ? editingStaff.notes : newStaff.notes}
                          onChange={handleStaffInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                          rows="3"
                          placeholder="Additional notes about the staff member"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          onClick={() => {
                            setShowStaffForm(false)
                            setEditingStaff(null)
                          }}
                          className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={editingStaff ? handleUpdateStaff : handleAddStaff}
                          disabled={!(editingStaff ? editingStaff.name : newStaff.name) || !(editingStaff ? editingStaff.phone : newStaff.phone)}
                          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {editingStaff ? 'Update Staff' : 'Add Staff'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Security Logs</h3>
                <p className="text-gray-700 mt-1">
                  All visitor entries, exits, and security incidents
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                  Export Logs
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium">
                  Filter Logs
                </button>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 mb-1">Total Entries Today</p>
                <p className="text-2xl font-bold text-green-800">
                  {currentVisitors.length }
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 mb-1">QR Scans</p>
                <p className="text-2xl font-bold text-blue-800">
                  {currentVisitors.filter(v => v.verifiedBy === 'QR Scan').length}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700 mb-1">Manual Entries</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {currentVisitors.filter(v => v.verifiedBy !== 'QR Scan').length}
                </p>
              </div>
            </div>
            
            {/* Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">Time</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">Visitor Code</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">Resident</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">Method</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentVisitors.map(visitor => (
                    <tr key={visitor.id} className="hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-900">
                        {new Date(visitor.scanTime || new Date()).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-gray-900">{visitor.code}</div>
                        <div className="text-xs text-gray-500">{visitor.name}</div>
                      </td>
                      <td className="p-3 text-sm text-gray-700">{visitor.resident}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          visitor.verifiedBy === 'QR Scan' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {visitor.verifiedBy || 'Manual Entry'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleCheckout(visitor.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Check Out
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Scan QR Code</h3>
                <button
                  onClick={() => {
                    setShowScanner(false)
                    setScanning(true)
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              {/* Camera Device Selection */}
              {cameraDevices.length > 1 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-800">Select Camera</label>
                  <select
                    value={selectedCamera || ''}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                  >
                    {cameraDevices.map(device => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${device.deviceId}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* QR Scanner Component */}
              <div className="relative rounded-lg overflow-hidden border-2 border-blue-500">
                <Scanner
                  onScan={handleScan}
                  onError={handleScannerError}
                  constraints={{
                    deviceId: selectedCamera,
                    facingMode: 'environment'
                  }}
                  paused={!scanning}
                  components={{
                    audio: true,
                    finder: true,
                    torch: true,
                  }}
                  styles={{
                    container: { height: '400px' }
                  }}
                />
                <div className="absolute inset-0 pointer-events-none border-4 border-transparent">
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <p className="text-gray-700 mb-2">
                     Position QR code within the frame
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Ready to scan</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Camera active</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setScanning(!scanning)}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {scanning ? 'Pause' : 'Resume'} Scanning
                  </button>
                  <button
                    onClick={() => {
                      setShowScanner(false)
                      setScanning(true)
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Close Scanner
                  </button>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">QR Code Format</h4>
                <p className="text-sm text-blue-800">
                  Supported formats: <code className="bg-blue-100 px-2 py-1 rounded">code:ABC123,pin:4567</code> or just the pass code
                </p>
                <p className="text-sm text-blue-800 mt-2">
                  The scanner will automatically extract visitor code and PIN if present
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}