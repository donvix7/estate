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
    contact: '+91 9876543210'
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
  }
};

export default function StaffDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('tasks')
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
      } catch (error) {
        console.error('Error loading staff data:', error)
        // Fallback to hardcoded data
        setAnnouncements(STAFF_DATA.announcements)
        setTasks(STAFF_DATA.tasks)
        setWorkLogs(STAFF_DATA.workLogs)
        setInventory(STAFF_DATA.inventory)
        setStaffData(STAFF_DATA.staffData)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-green-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Staff Dashboard</h1>
              <p className="text-green-200">
                {staffData?.estate} | Welcome, {staffData?.name}
              </p>
              <p className="text-green-300 text-sm mt-1">
                {staffData?.department} • ID: {staffData?.employeeId}
              </p>
            </div>
            <div className="flex items-center space-x-4">
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
            className={`px-6 py-3 font-medium ${activeTab === 'overview' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-3 font-medium relative ${activeTab === 'tasks' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Tasks
            {taskStats.pending > 0 && (
              <span className="absolute -top-1 right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {taskStats.pending}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('worklog')}
            className={`px-6 py-3 font-medium ${activeTab === 'worklog' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Work Log
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-3 font-medium relative ${activeTab === 'inventory' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Inventory
            {lowStockItems.length > 0 && (
              <span className="absolute -top-1 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {lowStockItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-6 py-3 font-medium ${activeTab === 'announcements' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Announcements
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Today's Tasks</h3>
                    <p className="text-3xl font-bold text-green-700">{taskStats.total}</p>
                    <p className="text-sm text-gray-600 mt-1">{taskStats.completed} completed</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">📋</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Today's Hours</h3>
                    <p className="text-3xl font-bold text-blue-700">{todayHours}h</p>
                    <p className="text-sm text-gray-600 mt-1">Work logged today</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">⏱️</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Completion Rate</h3>
                    <p className="text-3xl font-bold text-amber-600">{taskStats.completionRate}%</p>
                    <p className="text-sm text-gray-600 mt-1">Tasks completed</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 text-xl">📈</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Low Stock Items</h3>
                    <p className="text-3xl font-bold text-red-600">{lowStockItems.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Needs restocking</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-xl">⚠️</span>
                  </div>
                </div>
              </div>
            </div>

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

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('worklog')}
                  className="p-4 bg-white border border-green-100 rounded-lg hover:bg-green-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-green-600">📝</span>
                  </div>
                  <h5 className="font-medium text-gray-900">Log Work Hours</h5>
                  <p className="text-sm text-gray-600 mt-1">Submit daily work log</p>
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="p-4 bg-white border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-blue-600">➕</span>
                  </div>
                  <h5 className="font-medium text-gray-900">Add New Task</h5>
                  <p className="text-sm text-gray-600 mt-1">Create personal task</p>
                </button>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="p-4 bg-white border border-amber-100 rounded-lg hover:bg-amber-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-amber-600">📦</span>
                  </div>
                  <h5 className="font-medium text-gray-900">Check Inventory</h5>
                  <p className="text-sm text-gray-600 mt-1">View stock levels</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task List */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">My Tasks</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {taskStats.completed} Completed
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      {taskStats.pending} Pending
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📋</span>
                      </div>
                      <p className="text-gray-700 text-lg">No tasks assigned</p>
                    </div>
                  ) : (
                    tasks.map(task => (
                      <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">{task.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-700">
                                Location: {task.location}
                              </span>
                              <span className="text-xs text-gray-700">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
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
                                className={`h-2 rounded-full ${
                                  task.status === 'completed' ? 'bg-green-600' :
                                  task.status === 'in_progress' ? 'bg-blue-600' : 'bg-yellow-600'
                                }`}
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {task.progress}% complete • Assigned to: {task.assignedTo}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                              disabled={task.status === 'in_progress'}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                            >
                              Start
                            </button>
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                              disabled={task.status === 'completed'}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50"
                            >
                              Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Task & Stats */}
              <div className="space-y-6">
                {/* Add Task Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Task</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800">Task Title *</label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-gray-50"
                        placeholder="Enter task title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800">Description</label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-gray-50"
                        rows="3"
                        placeholder="Enter task description"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Priority</label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-gray-50"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Due Date</label>
                        <input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800">Location</label>
                      <input
                        type="text"
                        value={newTask.location}
                        onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-gray-50"
                        placeholder="e.g., Block A, Ground Floor"
                      />
                    </div>
                    
                    <button
                      onClick={handleAddTask}
                      disabled={!newTask.title.trim()}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      Add Task
                    </button>
                  </div>
                </div>

                {/* Task Statistics */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Task Statistics</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                        <span className="text-sm font-bold text-green-700">{taskStats.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-600 h-3 rounded-full" 
                          style={{ width: `${taskStats.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-700">Completed</span>
                        </div>
                        <span className="font-bold text-green-700">{taskStats.completed}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-700">In Progress</span>
                        </div>
                        <span className="font-bold text-blue-700">{taskStats.inProgress}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-700">Pending</span>
                        </div>
                        <span className="font-bold text-yellow-700">{taskStats.pending}</span>
                      </div>
                    </div>
                  </div>
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

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inventory List */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Inventory Items</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {inventory.length} Items
                  </span>
                </div>
                
                {inventory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📦</span>
                    </div>
                    <p className="text-gray-700 text-lg">No inventory items</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inventory.map(item => (
                      <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">{item.item}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {item.category}
                              </span>
                              <span className="text-xs text-gray-700">
                                Location: {item.location}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              item.quantity <= item.threshold ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {item.quantity} {item.unit}
                            </div>
                            <span className="text-xs text-gray-500">
                              Threshold: {item.threshold}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  item.quantity <= item.threshold ? 'bg-red-600' :
                                  item.quantity <= item.threshold * 2 ? 'bg-yellow-600' : 'bg-green-600'
                                }`}
                                style={{ width: `${Math.min(100, (item.quantity / (item.threshold * 3)) * 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {item.quantity <= item.threshold ? '⚠️ Low Stock' : '✓ In Stock'}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleUpdateInventory(item.id, 'use')}
                              disabled={item.quantity <= 0}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                            >
                              Use
                            </button>
                            <button
                              onClick={() => handleUpdateInventory(item.id, 'add')}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Inventory Stats & Low Stock */}
              <div className="space-y-6">
                {/* Low Stock Alert */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-red-900">Low Stock Alert</h3>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      {lowStockItems.length} Items
                    </span>
                  </div>
                  
                  {lowStockItems.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-600 text-xl">✓</span>
                      </div>
                      <p className="text-green-700 font-medium">All items are sufficiently stocked</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {lowStockItems.map(item => (
                        <div key={item.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-red-900">{item.item}</h4>
                              <p className="text-sm text-red-700 mt-1">
                                Current: {item.quantity} {item.unit} | Threshold: {item.threshold}
                              </p>
                            </div>
                            <span className="text-lg font-bold text-red-600">
                              ⚠️
                            </span>
                          </div>
                          <p className="text-xs text-red-600 mt-2">Location: {item.location}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inventory Statistics */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Inventory Statistics</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Stock Health</span>
                        <span className={`text-sm font-bold ${
                          lowStockItems.length > 0 ? 'text-red-700' : 'text-green-700'
                        }`}>
                          {lowStockItems.length > 0 ? 'Needs Attention' : 'Healthy'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            lowStockItems.length > 0 ? 'bg-red-600' : 'bg-green-600'
                          }`}
                          style={{ width: `${100 - (lowStockItems.length / inventory.length * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">Total Items</p>
                        <p className="text-2xl font-bold text-blue-700">{inventory.length}</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">In Stock</p>
                        <p className="text-2xl font-bold text-green-700">
                          {inventory.filter(i => i.quantity > i.threshold).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                  <h4 className="font-semibold text-green-900 mb-4">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        // Report low stock to manager
                        alert('Low stock report sent to manager!');
                      }}
                      className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 font-medium"
                    >
                      Report Low Stock
                    </button>
                    <button
                      onClick={() => {
                        // Request new items
                        prompt('Enter items to request:');
                      }}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 font-medium"
                    >
                      Request Items
                    </button>
                    <button
                      onClick={() => {
                        // Print inventory report
                        alert('Inventory report generated!');
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 font-medium"
                    >
                      Print Report
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
      </div>
    </div>
  )
}