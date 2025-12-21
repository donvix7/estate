'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Hardcoded database simulation for staff
const STAFF_DATA = {
  announcements: [
    {
      id: 1,
      title: 'Cleaning Schedule Update',
      message: 'Block A cleaning shifted to 2 PM today',
      type: 'maintenance',
      priority: 'normal',
      author: 'Maintenance Manager',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false
    },
    {
      id: 2,
      title: 'Garden Maintenance',
      message: 'Lawn mowing scheduled for tomorrow 9 AM',
      type: 'maintenance',
      priority: 'high',
      author: 'Admin',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true
    },
    {
      id: 3,
      title: 'Plumbing Work',
      message: 'Water supply interruption in Tower B from 10 AM - 12 PM',
      type: 'maintenance',
      priority: 'normal',
      author: 'Maintenance',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true
    }
  ],
  tasks: [
    {
      id: 1,
      title: 'Clean Common Areas - Block A',
      description: 'Clean corridors, lobby, and common areas of Block A',
      assignedTo: 'John Cleaner',
      priority: 'high',
      status: 'in_progress',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      estate: 'Sunrise Towers',
      location: 'Block A, Ground Floor',
      progress: 60
    },
    {
      id: 2,
      title: 'Garden Maintenance',
      description: 'Trim hedges and water plants in central garden',
      assignedTo: 'Mike Gardener',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date(Date.now() + 172800000).toISOString(),
      estate: 'Sunrise Towers',
      location: 'Central Garden',
      progress: 0
    },
    {
      id: 3,
      title: 'Light Bulb Replacement',
      description: 'Replace faulty bulbs in Parking Area 2',
      assignedTo: 'Electrician Team',
      priority: 'high',
      status: 'completed',
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      estate: 'Sunrise Towers',
      location: 'Parking Area 2',
      progress: 100
    },
    {
      id: 4,
      title: 'Lift Maintenance',
      description: 'Monthly maintenance check for Lifts 1-4',
      assignedTo: 'Maintenance Team',
      priority: 'medium',
      status: 'in_progress',
      dueDate: new Date(Date.now() + 259200000).toISOString(),
      estate: 'Sunrise Towers',
      location: 'All Towers',
      progress: 30
    }
  ],
  workLogs: [
    {
      id: 1,
      task: 'Cleaning - Lobby Area',
      staff: 'John Cleaner',
      hours: 3,
      date: '2024-01-18',
      status: 'approved',
      notes: 'Completed all areas'
    },
    {
      id: 2,
      task: 'Garden Watering',
      staff: 'Mike Gardener',
      hours: 2,
      date: '2024-01-18',
      status: 'pending',
      notes: 'All plants watered'
    },
    {
      id: 3,
      task: 'Electrical Repair',
      staff: 'Electrician Team',
      hours: 5,
      date: '2024-01-17',
      status: 'approved',
      notes: 'Fixed wiring in Block B'
    }
  ],
  inventory: [
    {
      id: 1,
      item: 'Cleaning Supplies',
      category: 'consumables',
      quantity: 45,
      unit: 'units',
      threshold: 20,
      location: 'Storage Room 1'
    },
    {
      id: 2,
      item: 'Light Bulbs',
      category: 'electrical',
      quantity: 120,
      unit: 'pieces',
      threshold: 50,
      location: 'Electrical Room'
    },
    {
      id: 3,
      item: 'Gardening Tools',
      category: 'tools',
      quantity: 15,
      unit: 'sets',
      threshold: 5,
      location: 'Garden Shed'
    },
    {
      id: 4,
      item: 'Plumbing Pipes',
      category: 'plumbing',
      quantity: 25,
      unit: 'meters',
      threshold: 10,
      location: 'Maintenance Store'
    }
  ],
  staffData: {
    name: 'John Cleaner',
    role: 'cleaning_staff',
    estate: 'Sunrise Towers',
    department: 'Housekeeping',
    employeeId: 'STF-00123',
    joinDate: '2023-03-15',
    contact: '+91 9876543210',
    email: 'john.cleaner@sunrisetowers.com',
    address: 'Staff Quarters, Block C, Sunrise Towers',
    emergencyContact: '+91 9876543211',
    bloodGroup: 'O+',
    skills: ['Cleaning', 'Sanitization', 'Equipment Handling'],
    certifications: ['Basic Housekeeping', 'Safety Training'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    performance: {
      rating: 4.5,
      completedTasks: 156,
      attendance: 98.5,
      lastReview: '2024-01-10'
    }
  }
}

// Simulated API calls for staff
const mockAPI = {
  // Get announcements
  async getAnnouncements() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
      const data = await response.json();
      
      return data.map((post, index) => ({
        id: post.id,
        title: `Staff Update: ${post.title.split(' ').slice(0, 3).join(' ')}`,
        message: post.body,
        type: ['maintenance', 'security', 'general'][index % 3],
        priority: ['normal', 'high', 'normal'][index % 3],
        author: `Manager ${post.userId}`,
        timestamp: new Date(Date.now() - (index * 3600000)).toISOString(),
        read: index > 0
      }));
    } catch (error) {
      console.log('Using staff announcements data');
      return STAFF_DATA.announcements;
    }
  },

  // Get tasks
  async getTasks() {
    return STAFF_DATA.tasks;
  },

  // Get work logs
  async getWorkLogs() {
    return STAFF_DATA.workLogs;
  },

  // Get inventory
  async getInventory() {
    return STAFF_DATA.inventory;
  },

  // Get staff data
  async getStaffData() {
    return STAFF_DATA.staffData;
  },

  // Update task status
  async updateTaskStatus(taskId, status) {
    const taskIndex = STAFF_DATA.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      STAFF_DATA.tasks[taskIndex].status = status;
      if (status === 'completed') {
        STAFF_DATA.tasks[taskIndex].progress = 100;
      } else if (status === 'in_progress') {
        STAFF_DATA.tasks[taskIndex].progress = 50;
      }
    }
    return { success: true };
  },

  // Submit work log
  async submitWorkLog(workLog) {
    const newWorkLog = {
      id: Date.now(),
      ...workLog,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    STAFF_DATA.workLogs.unshift(newWorkLog);
    return { success: true, data: newWorkLog };
  },

  // Update inventory
  async updateInventory(itemId, quantity) {
    const itemIndex = STAFF_DATA.inventory.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
      STAFF_DATA.inventory[itemIndex].quantity = quantity;
    }
    return { success: true };
  },

  // Update profile
  async updateProfile(profileData) {
    STAFF_DATA.staffData = { ...STAFF_DATA.staffData, ...profileData };
    return { success: true, data: STAFF_DATA.staffData };
  }
};

export default function StaffDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [announcements, setAnnouncements] = useState([])
  const [tasks, setTasks] = useState([])
  const [workLogs, setWorkLogs] = useState([])
  const [inventory, setInventory] = useState([])
  const [staffData, setStaffData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Task Management State
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    location: '',
    dueDate: ''
  })
  
  // Work Log State
  const [newWorkLog, setNewWorkLog] = useState({
    task: '',
    hours: 0,
    notes: ''
  })
  
  // Inventory State
  const [inventoryUpdate, setInventoryUpdate] = useState({
    itemId: '',
    quantity: 0,
    action: 'use' // 'use' or 'add'
  })

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false)
  const [originalProfileData, setOriginalProfileData] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  // Profile State
  const [profileData, setProfileData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    skills: '',
    certifications: ''
  })

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setProfileData(originalProfileData)
    } else {
      // Start editing - save current data as original
      setOriginalProfileData(profileData)
    }
    setIsEditing(!isEditing)
  }

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [announcementsData, tasksData, workLogsData, inventoryData, staffData] = await Promise.all([
          mockAPI.getAnnouncements(),
          mockAPI.getTasks(),
          mockAPI.getWorkLogs(),
          mockAPI.getInventory(),
          mockAPI.getStaffData()
        ])
        setAnnouncements(announcementsData)
        setTasks(tasksData)
        setWorkLogs(workLogsData)
        setInventory(inventoryData)
        setStaffData(staffData)
        setProfileData({
          name: staffData.name,
          contact: staffData.contact,
          email: staffData.email,
          address: staffData.address,
          emergencyContact: staffData.emergencyContact,
          bloodGroup: staffData.bloodGroup,
          skills: staffData.skills.join(', '),
          certifications: staffData.certifications.join(', ')
        })
      } catch (error) {
        console.error('Error loading staff data:', error)
        // Fallback to hardcoded data
        setAnnouncements(STAFF_DATA.announcements)
        setTasks(STAFF_DATA.tasks)
        setWorkLogs(STAFF_DATA.workLogs)
        setInventory(STAFF_DATA.inventory)
        setStaffData(STAFF_DATA.staffData)
        setProfileData({
          name: STAFF_DATA.staffData.name,
          contact: STAFF_DATA.staffData.contact,
          email: STAFF_DATA.staffData.email,
          address: STAFF_DATA.staffData.address,
          emergencyContact: STAFF_DATA.staffData.emergencyContact,
          bloodGroup: STAFF_DATA.staffData.bloodGroup,
          skills: STAFF_DATA.staffData.skills.join(', '),
          certifications: STAFF_DATA.staffData.certifications.join(', ')
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Task Management Functions
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await mockAPI.updateTaskStatus(taskId, newStatus)
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus, progress: newStatus === 'completed' ? 100 : task.progress } : task
      ))
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      alert('Please enter task title')
      return
    }

    const task = {
      id: Date.now(),
      ...newTask,
      assignedTo: staffData?.name || 'Self',
      status: 'pending',
      progress: 0,
      estate: staffData?.estate || 'Sunrise Towers',
      dueDate: newTask.dueDate || new Date(Date.now() + 86400000).toISOString()
    }

    setTasks([task, ...tasks])
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      location: '',
      dueDate: ''
    })
    
    alert('Task added successfully!')
  }

  // Work Log Functions
  const handleSubmitWorkLog = async () => {
    if (!newWorkLog.task.trim() || newWorkLog.hours <= 0) {
      alert('Please enter task description and valid hours')
      return
    }

    try {
      const result = await mockAPI.submitWorkLog({
        ...newWorkLog,
        staff: staffData?.name || 'Unknown Staff'
      })
      
      if (result.success) {
        setWorkLogs([result.data, ...workLogs])
        setNewWorkLog({
          task: '',
          hours: 0,
          notes: ''
        })
        alert('Work log submitted for approval!')
      }
    } catch (error) {
      console.error('Error submitting work log:', error)
      alert('Error submitting work log')
    }
  }

  // Inventory Functions
  const handleUpdateInventory = async (itemId, action) => {
    const item = inventory.find(i => i.id === itemId)
    if (!item) return

    let newQuantity = item.quantity
    if (action === 'use') {
      newQuantity = Math.max(0, item.quantity - 1)
    } else if (action === 'add') {
      newQuantity = item.quantity + 1
    }

    try {
      await mockAPI.updateInventory(itemId, newQuantity)
      setInventory(inventory.map(i => 
        i.id === itemId ? { ...i, quantity: newQuantity } : i
      ))
    } catch (error) {
      console.error('Error updating inventory:', error)
    }
  }

  // Profile Functions
  const handleProfileUpdate = async () => {
    try {
      const result = await mockAPI.updateProfile({
        ...profileData,
        skills: profileData.skills.split(',').map(skill => skill.trim()),
        certifications: profileData.certifications.split(',').map(cert => cert.trim())
      })
      
      if (result.success) {
        setStaffData(result.data)
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    }
  }

  const handleProfileFieldChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      approved: 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      approved: 'Approved'
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

  const getPriorityIcon = (priority) => {
    const icons = {
      high: '🔴',
      medium: '🟡',
      low: '🔵',
      normal: '⚪'
    }
    return icons[priority] || '⚪'
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

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      router.push('/login')
    }
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const pending = tasks.filter(t => t.status === 'pending').length
    
    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  const getTodayHours = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayLogs = workLogs.filter(log => log.date === today && log.status === 'approved')
    return todayLogs.reduce((total, log) => total + log.hours, 0)
  }

  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.threshold)
  }

  const calculateExperience = () => {
    if (!staffData?.joinDate) return '0 years'
    const joinDate = new Date(staffData.joinDate)
    const today = new Date()
    const years = today.getFullYear() - joinDate.getFullYear()
    const months = today.getMonth() - joinDate.getMonth()
    return months < 0 ? `${years-1} years ${12+months} months` : `${years} years ${months} months`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading Staff Dashboard...</p>
        </div>
      </div>
    )
  }

  const taskStats = getTaskStats()
  const todayHours = getTodayHours()
  const lowStockItems = getLowStockItems()
  const experience = calculateExperience()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Staff Dashboard</h1>
              <p className="text-blue-200">
                {staffData?.estate} | Welcome, {staffData?.name}
              </p>
              <p className="text-blue-300 text-sm mt-1">
                {staffData?.department} • ID: {staffData?.employeeId}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('profile')}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 font-medium"
              >
                <span>👤</span>
                <span>Profile</span>
              </button>
              <div className="relative">
                <button 
                  onClick={() => setActiveTab('announcements')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 font-medium"
                >
                  <span>📢</span>
                  <span>Updates</span>
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
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium ${activeTab === 'overview' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('worklog')}
            className={`px-6 py-3 font-medium ${activeTab === 'worklog' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Work Log
          </button>
          
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-6 py-3 font-medium ${activeTab === 'announcements' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Announcements
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Profile
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Recent Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent Tasks</h3>
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                  >
                    View All Tasks
                  </button>
                </div>
                <div className="space-y-4">
                  {tasks.slice(0, 3).map(task => (
                    <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-700 mt-1">{task.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)} {task.priority}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusText(task.status)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{task.progress}% complete</p>
                        </div>
                        <button
                          onClick={() => handleUpdateTaskStatus(task.id, task.status === 'completed' ? 'in_progress' : 'completed')}
                          className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          {task.status === 'completed' ? 'Reopen' : 'Complete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Announcements */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent Announcements</h3>
                  <button 
                    onClick={() => setActiveTab('announcements')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {announcements.slice(0, 3).map(announcement => (
                    <div key={announcement.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{announcement.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityColor(announcement.priority)}`}>
                              {announcement.priority}
                            </span>
                            <span className="text-xs text-gray-700">
                              {formatTimeAgo(announcement.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{announcement.message}</p>
                      <p className="text-xs text-gray-500 mt-2">By: {announcement.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Work Log Tab */}
        {activeTab === 'worklog' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submit Work Log */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Submit Work Log</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Task Description *</label>
                  <input
                    type="text"
                    value={newWorkLog.task}
                    onChange={(e) => setNewWorkLog({...newWorkLog, task: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-gray-50"
                    placeholder="Describe the work done"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Hours Worked *</label>
                  <input
                    type="number"
                    value={newWorkLog.hours}
                    onChange={(e) => setNewWorkLog({...newWorkLog, hours: parseInt(e.target.value) || 0})}
                    min="0"
                    max="24"
                    step="0.5"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-gray-50"
                    placeholder="Enter hours worked"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Notes (Optional)</label>
                  <textarea
                    value={newWorkLog.notes}
                    onChange={(e) => setNewWorkLog({...newWorkLog, notes: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-gray-50"
                    rows="3"
                    placeholder="Any additional notes or details..."
                  />
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-blue-600 mr-2">ℹ️</span>
                    <p className="text-sm text-blue-800">
                      Your work log will be submitted for manager approval. Please ensure accuracy.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleSubmitWorkLog}
                  disabled={!newWorkLog.task.trim() || newWorkLog.hours <= 0}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Submit Work Log
                </button>
              </div>
            </div>

            {/* Work Log History */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Work Log History</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Total Hours: {workLogs.reduce((total, log) => total + log.hours, 0)}
                </span>
              </div>
              
              {workLogs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <p className="text-gray-700 text-lg">No work logs yet</p>
                  <p className="text-gray-600 text-sm mt-2">Submit your first work log</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workLogs.map(log => (
                    <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{log.task}</h4>
                          <p className="text-sm text-gray-700 mt-1">Staff: {log.staff}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-700">{log.hours} hours</div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                            {getStatusText(log.status)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.notes}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Date: {log.date}</span>
                        {log.status === 'pending' && (
                          <span className="text-xs text-yellow-600">⏳ Pending approval</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Today's Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-800">Hours Today</p>
                    <p className="text-lg font-bold text-green-700">{todayHours}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-800">Logs Today</p>
                    <p className="text-lg font-bold text-green-700">
                      {workLogs.filter(log => log.date === new Date().toISOString().split('T')[0]).length}
                    </p>
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
                <h3 className="text-xl font-bold text-gray-900">Staff Announcements</h3>
                <p className="text-gray-700 mt-1">
                  {getUnreadCount()} unread • {announcements.length} total
                </p>
              </div>
              <button
                onClick={() => {
                  setAnnouncements(announcements.map(ann => ({ ...ann, read: true })))
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
              >
                Mark All Read
              </button>
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
                    className={`border rounded-lg p-4 ${!announcement.read ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'}`}
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
                           announcement.type === 'security' ? '🛡️' : '📢'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{announcement.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityColor(announcement.priority)}`}>
                              {announcement.priority}
                            </span>
                            <span className="text-xs text-gray-700">
                              {formatTimeAgo(announcement.timestamp)} • {announcement.author}
                            </span>
                            {!announcement.read && (
                              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                                NEW
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-800 mt-3">{announcement.message}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xl">ℹ️</span>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Important Information</h4>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Report any maintenance issues immediately to supervisor</li>
                    <li>• Always wear safety equipment when required</li>
                    <li>• Submit work logs daily before end of shift</li>
                    <li>• Check inventory levels before starting tasks</li>
                    <li>• Contact emergency number (911) for urgent situations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && staffData && (
          <div className="space-y-6">
            {/* Profile Header with Edit Button */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white">
                    {staffData.avatar ? (
                      <img 
                        src={staffData.avatar} 
                        alt={staffData.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl text-blue-600">👤</span>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-3xl font-bold">{staffData.name}</h2>
                      <p className="text-blue-200 mt-2">{staffData.department}</p>
                    </div>
                    <button
                      onClick={handleEditToggle}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
                        isEditing 
                          ? 'bg-yellow-500 hover:bg-yellow-600' 
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <span className="mr-2">✕</span>
                          Cancel
                        </>
                      ) : (
                        <>
                          <span className="mr-2">✏️</span>
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      Employee ID: {staffData.employeeId}
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      Experience: {experience}
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      Joined: {new Date(staffData.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Editable Profile Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <span className="mr-2">📝</span> Personal Information
                    </h3>
                    {!isEditing && (
                      <span className="text-sm text-gray-500">Click "Edit Profile" to make changes</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white' 
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Contact Number *</label>
                      <input
                        type="tel"
                        value={profileData.contact}
                        onChange={(e) => handleProfileFieldChange('contact', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white' 
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Email Address *</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white' 
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Emergency Contact</label>
                      <input
                        type="tel"
                        value={profileData.emergencyContact}
                        onChange={(e) => handleProfileFieldChange('emergencyContact', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white' 
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Blood Group</label>
                      <input
                        type="text"
                        value={profileData.bloodGroup}
                        onChange={(e) => handleProfileFieldChange('bloodGroup', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white' 
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                        disabled={!isEditing}
                        placeholder="e.g., O+, A-, B+"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-gray-700">Address</label>
                      <textarea
                        value={profileData.address}
                        onChange={(e) => handleProfileFieldChange('address', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white' 
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        }`}
                        rows="3"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Skills & Certifications */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-2">🎯</span> Professional Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Skills (comma separated)</label>
                      <textarea
                        value={profileData.skills}
                        onChange={(e) => handleProfileFieldChange('skills', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        rows="2"
                        placeholder="e.g., Cleaning, Sanitization, Equipment Handling"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Certifications (comma separated)</label>
                      <textarea
                        value={profileData.certifications}
                        onChange={(e) => handleProfileFieldChange('certifications', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        rows="2"
                        placeholder="e.g., Basic Housekeeping, Safety Training"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}