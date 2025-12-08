'use client'

import { useState, useEffect, useRef } from 'react'

export function AdminCommunicationSystem() {
  // Announcements state
  const [announcements, setAnnouncements] = useState([])
  const [broadcasts, setBroadcasts] = useState([])
  
  // New announcement/broadcast form
  const [newMessage, setNewMessage] = useState({
    title: '',
    content: '',
    type: 'announcement', // announcement, emergency, maintenance, event
    audience: 'all', // all, residents, security, specific_blocks
    priority: 'normal', // low, normal, high, critical
    scheduleFor: '', // For scheduled broadcasts
    specificBlocks: [],
    sendSMS: false,
    sendPush: true,
    sendEmail: false
  })

  // UI state
  const [activeTab, setActiveTab] = useState('create') // create, announcements, broadcasts, scheduled, analytics
  const [editingId, setEditingId] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [selectedBlocks, setSelectedBlocks] = useState([])
  const [recipientStats, setRecipientStats] = useState({
    totalResidents: 156,
    activeResidents: 142,
    securityStaff: 12,
    adminStaff: 5
  })

  // Sample data for blocks
  const estateBlocks = [
    { id: 'A', name: 'Block A', residents: 45 },
    { id: 'B', name: 'Block B', residents: 38 },
    { id: 'C', name: 'Block C', residents: 42 },
    { id: 'D', name: 'Block D', residents: 31 },
  ]

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAnnouncements = localStorage.getItem('adminAnnouncements')
    const savedBroadcasts = localStorage.getItem('adminBroadcasts')
    
    if (savedAnnouncements) {
      setAnnouncements(JSON.parse(savedAnnouncements))
    }
    
    if (savedBroadcasts) {
      setBroadcasts(JSON.parse(savedBroadcasts))
    }
    
    // Set default scheduled time (next hour)
    const nextHour = new Date()
    nextHour.setHours(nextHour.getHours() + 1)
    nextHour.setMinutes(0)
    setNewMessage(prev => ({
      ...prev,
      scheduleFor: nextHour.toISOString().slice(0, 16)
    }))
  }, [])

  // Save data to localStorage
  useEffect(() => {
    if (announcements.length > 0) {
      localStorage.setItem('adminAnnouncements', JSON.stringify(announcements))
    }
  }, [announcements])

  useEffect(() => {
    if (broadcasts.length > 0) {
      localStorage.setItem('adminBroadcasts', JSON.stringify(broadcasts))
    }
  }, [broadcasts])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewMessage(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Toggle block selection
  const toggleBlockSelection = (blockId) => {
    setSelectedBlocks(prev => 
      prev.includes(blockId)
        ? prev.filter(id => id !== blockId)
        : [...prev, blockId]
    )
  }

  // Create new announcement/broadcast
  const createMessage = () => {
    if (!newMessage.title.trim() || !newMessage.content.trim()) {
      alert('Please enter title and content')
      return
    }

    const messageData = {
      id: Date.now(),
      ...newMessage,
      specificBlocks: newMessage.audience === 'specific_blocks' ? selectedBlocks : [],
      created: new Date().toISOString(),
      status: newMessage.scheduleFor && new Date(newMessage.scheduleFor) > new Date() ? 'scheduled' : 'sent',
      sentAt: newMessage.scheduleFor && new Date(newMessage.scheduleFor) > new Date() ? null : new Date().toISOString(),
      readBy: 0,
      totalRecipients: calculateRecipients(),
      author: 'Admin'
    }

    // Add to appropriate list
    if (newMessage.type === 'announcement') {
      setAnnouncements(prev => [messageData, ...prev])
    } else {
      setBroadcasts(prev => [messageData, ...prev])
    }

    // Show success message
    const action = messageData.status === 'scheduled' ? 'scheduled' : 'sent'
    alert(`✅ ${newMessage.type === 'announcement' ? 'Announcement' : 'Broadcast'} ${action} successfully!\n\nRecipients: ${messageData.totalRecipients}`)

    // Reset form
    resetForm()
  }

  // Calculate total recipients
  const calculateRecipients = () => {
    let count = 0
    
    switch(newMessage.audience) {
      case 'all':
        count = recipientStats.totalResidents + recipientStats.securityStaff + recipientStats.adminStaff
        break
      case 'residents':
        count = recipientStats.totalResidents
        break
      case 'security':
        count = recipientStats.securityStaff
        break
      case 'specific_blocks':
        count = selectedBlocks.reduce((sum, blockId) => {
          const block = estateBlocks.find(b => b.id === blockId)
          return sum + (block ? block.residents : 0)
        }, 0)
        break
    }
    
    return count
  }

  // Reset form
  const resetForm = () => {
    setNewMessage({
      title: '',
      content: '',
      type: 'announcement',
      audience: 'all',
      priority: 'normal',
      scheduleFor: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      specificBlocks: [],
      sendSMS: false,
      sendPush: true,
      sendEmail: false
    })
    setSelectedBlocks([])
    setEditingId(null)
  }

  // Edit existing message
  const editMessage = (message) => {
    setNewMessage({
      title: message.title,
      content: message.content,
      type: message.type,
      audience: message.audience,
      priority: message.priority,
      scheduleFor: message.scheduleFor || '',
      specificBlocks: message.specificBlocks || [],
      sendSMS: message.sendSMS || false,
      sendPush: message.sendPush || true,
      sendEmail: message.sendEmail || false
    })
    setSelectedBlocks(message.specificBlocks || [])
    setEditingId(message.id)
    setActiveTab('create')
  }

  // Delete message
  const deleteMessage = (id, type) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      if (type === 'announcement') {
        setAnnouncements(prev => prev.filter(msg => msg.id !== id))
      } else {
        setBroadcasts(prev => prev.filter(msg => msg.id !== id))
      }
      alert('Message deleted successfully')
    }
  }

  // Send scheduled message now
  const sendNow = (message) => {
    const updatedMessage = {
      ...message,
      status: 'sent',
      sentAt: new Date().toISOString()
    }

    if (message.type === 'announcement') {
      setAnnouncements(prev => prev.map(msg => msg.id === message.id ? updatedMessage : msg))
    } else {
      setBroadcasts(prev => prev.map(msg => msg.id === message.id ? updatedMessage : msg))
    }

    alert(`Message sent now to ${message.totalRecipients} recipients`)
  }

  // Mark as important
  const toggleImportant = (id, type) => {
    if (type === 'announcement') {
      setAnnouncements(prev => prev.map(msg => 
        msg.id === id ? { ...msg, priority: msg.priority === 'critical' ? 'normal' : 'critical' } : msg
      ))
    } else {
      setBroadcasts(prev => prev.map(msg => 
        msg.id === id ? { ...msg, priority: msg.priority === 'critical' ? 'normal' : 'critical' } : msg
      ))
    }
  }

  // Get message stats
  const getMessageStats = () => {
    const allMessages = [...announcements, ...broadcasts]
    
    return {
      total: allMessages.length,
      sent: allMessages.filter(m => m.status === 'sent').length,
      scheduled: allMessages.filter(m => m.status === 'scheduled').length,
      critical: allMessages.filter(m => m.priority === 'critical').length,
      totalRecipients: allMessages.reduce((sum, msg) => sum + (msg.totalRecipients || 0), 0)
    }
  }

  // Format date/time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not sent yet'
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Get audience label
  const getAudienceLabel = (audience, specificBlocks) => {
    const labels = {
      all: 'All Residents & Staff',
      residents: 'All Residents',
      security: 'Security Staff',
      specific_blocks: `Specific Blocks (${specificBlocks.length} blocks)`
    }
    return labels[audience] || audience
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return colors[priority] || colors.normal
  }

  // Get type icon
  const getTypeIcon = (type) => {
    const icons = {
      announcement: '📢',
      emergency: '🚨',
      maintenance: '🔧',
      event: '🎉'
    }
    return icons[type] || '📢'
  }

  const stats = getMessageStats()

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Admin Communication System</h2>
              <p className="text-purple-100">Manage announcements, broadcasts, and communications</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Total Communications: {stats.total}</p>
              <p className="text-sm">Total Recipients: {stats.totalRecipients.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.scheduled}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Recipients</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalRecipients.toLocaleString()}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 whitespace-nowrap ${activeTab === 'create' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
            >
              Create Message
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-6 py-3 whitespace-nowrap ${activeTab === 'announcements' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
            >
              Announcements ({announcements.length})
            </button>
            <button
              onClick={() => setActiveTab('broadcasts')}
              className={`px-6 py-3 whitespace-nowrap ${activeTab === 'broadcasts' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
            >
              Broadcasts ({broadcasts.length})
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`px-6 py-3 whitespace-nowrap ${activeTab === 'scheduled' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
            >
              Scheduled ({stats.scheduled})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 whitespace-nowrap ${activeTab === 'analytics' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600'}`}
            >
              Analytics
            </button>
          </div>

          {/* Create Message Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4">
                      {editingId ? 'Edit Message' : 'Create New Message'}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Message Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={newMessage.title}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg"
                          placeholder="Enter message title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Content *</label>
                        <textarea
                          name="content"
                          value={newMessage.content}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg"
                          rows="6"
                          placeholder="Type your message here..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Message Type</label>
                          <select
                            name="type"
                            value={newMessage.type}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-lg"
                          >
                            <option value="announcement">📢 Announcement</option>
                            <option value="emergency">🚨 Emergency Alert</option>
                            <option value="maintenance">🔧 Maintenance Notice</option>
                            <option value="event">🎉 Event Notification</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Priority</label>
                          <select
                            name="priority"
                            value={newMessage.priority}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-lg"
                          >
                            <option value="low">Low Priority</option>
                            <option value="normal">Normal Priority</option>
                            <option value="high">High Priority</option>
                            <option value="critical">Critical Priority</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Audience</label>
                        <select
                          name="audience"
                          value={newMessage.audience}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg"
                        >
                          <option value="all">All Residents & Staff</option>
                          <option value="residents">Residents Only</option>
                          <option value="security">Security Staff Only</option>
                          <option value="specific_blocks">Specific Blocks</option>
                        </select>
                      </div>

                      {/* Block Selection (if specific blocks chosen) */}
                      {newMessage.audience === 'specific_blocks' && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <label className="block text-sm font-medium mb-2">Select Blocks</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {estateBlocks.map(block => (
                              <button
                                key={block.id}
                                type="button"
                                onClick={() => toggleBlockSelection(block.id)}
                                className={`p-3 rounded-lg text-center ${selectedBlocks.includes(block.id) ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                              >
                                <div className="font-semibold">{block.name}</div>
                                <div className="text-sm">{block.residents} residents</div>
                              </button>
                            ))}
                          </div>
                          {selectedBlocks.length > 0 && (
                            <p className="text-sm text-blue-600 mt-2">
                              Selected: {selectedBlocks.map(id => estateBlocks.find(b => b.id === id)?.name).join(', ')}
                            </p>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Schedule For (Leave empty for immediate)
                        </label>
                        <input
                          type="datetime-local"
                          name="scheduleFor"
                          value={newMessage.scheduleFor}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Preview & Delivery Options */}
                <div className="space-y-6">
                  {/* Delivery Options */}
                  <div className="bg-white border rounded-xl p-6">
                    <h4 className="font-semibold mb-4">Delivery Options</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="sendPush"
                          checked={newMessage.sendPush}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span>Push Notification</span>
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Recommended</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="sendSMS"
                          checked={newMessage.sendSMS}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span>SMS Message</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="sendEmail"
                          checked={newMessage.sendEmail}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span>Email</span>
                      </label>
                    </div>
                  </div>

                  {/* Recipient Stats */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-semibold mb-4">Recipient Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Recipients:</span>
                        <span className="font-bold">{calculateRecipients().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Residents:</span>
                        <span className="font-bold">{recipientStats.activeResidents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Staff:</span>
                        <span className="font-bold">{recipientStats.securityStaff}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Admin Staff:</span>
                        <span className="font-bold">{recipientStats.adminStaff}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white border rounded-xl p-6">
                    <h4 className="font-semibold mb-4">Quick Templates</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setNewMessage({
                            ...newMessage,
                            title: 'Water Supply Maintenance',
                            content: 'Water supply will be interrupted tomorrow from 10 AM to 4 PM for maintenance work. Please store water accordingly.',
                            type: 'maintenance',
                            priority: 'high'
                          })
                        }}
                        className="w-full text-left p-3 bg-blue-50 rounded hover:bg-blue-100"
                      >
                        🔧 Maintenance Notice
                      </button>
                      <button
                        onClick={() => {
                          setNewMessage({
                            ...newMessage,
                            title: 'Emergency Alert - Power Outage',
                            content: 'Emergency power outage in Block A. Maintenance team is on site. Expected restoration in 2 hours.',
                            type: 'emergency',
                            priority: 'critical'
                          })
                        }}
                        className="w-full text-left p-3 bg-red-50 rounded hover:bg-red-100"
                      >
                        🚨 Emergency Alert
                      </button>
                      <button
                        onClick={() => {
                          setNewMessage({
                            ...newMessage,
                            title: 'Community Event - Annual Dinner',
                            content: 'Join us for the annual community dinner this Saturday at 7 PM in the clubhouse. All residents are welcome!',
                            type: 'event',
                            priority: 'normal'
                          })
                        }}
                        className="w-full text-left p-3 bg-green-50 rounded hover:bg-green-100"
                      >
                        🎉 Event Announcement
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={createMessage}
                  disabled={!newMessage.title.trim() || !newMessage.content.trim()}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
                >
                  {newMessage.scheduleFor && new Date(newMessage.scheduleFor) > new Date() 
                    ? 'Schedule Message' 
                    : 'Send Message Now'}
                </button>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {previewMode ? 'Hide Preview' : 'Show Preview'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Reset Form
                </button>
              </div>

              {/* Preview */}
              {previewMode && (
                <div className="bg-gray-50 border rounded-xl p-6">
                  <h4 className="font-semibold mb-4">Message Preview</h4>
                  <div className={`p-6 rounded-lg ${
                    newMessage.priority === 'critical' ? 'bg-red-50 border-red-200' :
                    newMessage.priority === 'high' ? 'bg-orange-50 border-orange-200' :
                    'bg-white border'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(newMessage.type)}</span>
                        <div>
                          <h5 className="text-xl font-bold">{newMessage.title || '(No Title)'}</h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-sm px-2 py-1 rounded-full ${getPriorityColor(newMessage.priority)}`}>
                              {newMessage.priority}
                            </span>
                            <span className="text-sm text-gray-600">
                              To: {getAudienceLabel(newMessage.audience, selectedBlocks)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">From: Admin</p>
                        {newMessage.scheduleFor && (
                          <p className="text-sm text-gray-600">
                            Scheduled: {formatDateTime(newMessage.scheduleFor)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{newMessage.content || '(No Content)'}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        This message will be delivered to {calculateRecipients().toLocaleString()} recipients via:
                        {newMessage.sendPush && ' Push Notification'}
                        {newMessage.sendSMS && ', SMS'}
                        {newMessage.sendEmail && ', Email'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Announcements ({announcements.length})</h3>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  + New Announcement
                </button>
              </div>

              {announcements.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No announcements yet</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Create First Announcement
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map(announcement => (
                    <div key={announcement.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl mt-1">{getTypeIcon(announcement.type)}</span>
                          <div>
                            <h4 className="font-semibold">{announcement.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(announcement.priority)}`}>
                                {announcement.priority}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDateTime(announcement.sentAt || announcement.created)}
                              </span>
                              <span className="text-xs text-gray-500">
                                To: {getAudienceLabel(announcement.audience, announcement.specificBlocks)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {announcement.status === 'scheduled' && (
                            <button
                              onClick={() => sendNow(announcement)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Send Now
                            </button>
                          )}
                          <button
                            onClick={() => editMessage(announcement)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleImportant(announcement.id, 'announcement')}
                            className={`px-3 py-1 text-sm rounded ${
                              announcement.priority === 'critical'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {announcement.priority === 'critical' ? '★ Important' : 'Mark Important'}
                          </button>
                          <button
                            onClick={() => deleteMessage(announcement.id, 'announcement')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{announcement.content}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div>
                          <span>Recipients: {announcement.totalRecipients?.toLocaleString() || 'N/A'}</span>
                          <span className="mx-2">•</span>
                          <span>Status: {announcement.status}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span>Read by: {announcement.readBy || 0}</span>
                          {announcement.sendPush && <span>📱</span>}
                          {announcement.sendSMS && <span>💬</span>}
                          {announcement.sendEmail && <span>📧</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Broadcasts Tab - Similar structure to announcements */}
          {activeTab === 'broadcasts' && (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Broadcasts ({broadcasts.length})</h3>
                <button
                  onClick={() => {
                    setNewMessage(prev => ({ ...prev, type: 'emergency' }))
                    setActiveTab('create')
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  + Emergency Broadcast
                </button>
              </div>

              {broadcasts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No broadcasts yet</p>
                  <button
                    onClick={() => {
                      setNewMessage(prev => ({ ...prev, type: 'emergency' }))
                      setActiveTab('create')
                    }}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Create Emergency Broadcast
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {broadcasts.map(broadcast => (
                    <div key={broadcast.id} className={`border rounded-lg p-4 ${
                      broadcast.priority === 'critical' ? 'bg-red-50 border-red-200' : 'hover:bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl mt-1">{getTypeIcon(broadcast.type)}</span>
                          <div>
                            <h4 className="font-semibold">{broadcast.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(broadcast.priority)}`}>
                                {broadcast.priority}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDateTime(broadcast.sentAt || broadcast.created)}
                              </span>
                              <span className="text-xs text-gray-500">
                                To: {getAudienceLabel(broadcast.audience, broadcast.specificBlocks)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {broadcast.status === 'scheduled' && (
                            <button
                              onClick={() => sendNow(broadcast)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Send Now
                            </button>
                          )}
                          <button
                            onClick={() => editMessage(broadcast)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMessage(broadcast.id, 'broadcast')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{broadcast.content}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div>
                          <span>Recipients: {broadcast.totalRecipients?.toLocaleString() || 'N/A'}</span>
                          <span className="mx-2">•</span>
                          <span>Status: {broadcast.status}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span>Read by: {broadcast.readBy || 0}</span>
                          {broadcast.sendPush && <span>📱</span>}
                          {broadcast.sendSMS && <span>💬</span>}
                          {broadcast.sendEmail && <span>📧</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-xl font-semibold mb-6">Communication Analytics</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Message Types Breakdown */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Message Types Distribution</h4>
                  <div className="space-y-3">
                    {['announcement', 'emergency', 'maintenance', 'event'].map(type => {
                      const count = [...announcements, ...broadcasts].filter(m => m.type === type).length
                      const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                      return (
                        <div key={type} className="flex items-center">
                          <div className="w-24">{getTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}</div>
                          <div className="flex-1 ml-4">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{count} messages</span>
                              <span className="text-sm">{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Audience Reach */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Audience Reach</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Total Residents', value: recipientStats.totalResidents, color: 'bg-blue-500' },
                      { label: 'Active Residents', value: recipientStats.activeResidents, color: 'bg-green-500' },
                      { label: 'Security Staff', value: recipientStats.securityStaff, color: 'bg-orange-500' },
                      { label: 'Admin Staff', value: recipientStats.adminStaff, color: 'bg-purple-500' }
                    ].map(item => (
                      <div key={item.label} className="flex items-center">
                        <div className="w-32">{item.label}</div>
                        <div className="flex-1 ml-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">{item.value.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${item.color} h-2 rounded-full`}
                              style={{ width: `${(item.value / recipientStats.totalResidents) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Methods */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Delivery Methods Usage</h4>
                  <div className="space-y-3">
                    {[
                      { method: 'Push Notifications', count: [...announcements, ...broadcasts].filter(m => m.sendPush).length },
                      { method: 'SMS Messages', count: [...announcements, ...broadcasts].filter(m => m.sendSMS).length },
                      { method: 'Email', count: [...announcements, ...broadcasts].filter(m => m.sendEmail).length }
                    ].map(item => (
                      <div key={item.method} className="flex justify-between items-center p-3 bg-white rounded">
                        <span>{item.method}</span>
                        <span className="font-bold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {[...announcements, ...broadcasts]
                      .sort((a, b) => new Date(b.created) - new Date(a.created))
                      .slice(0, 5)
                      .map(msg => (
                        <div key={msg.id} className="flex items-center justify-between p-2 bg-white rounded">
                          <div>
                            <p className="font-medium text-sm">{msg.title}</p>
                            <p className="text-xs text-gray-500">{formatDateTime(msg.created)}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(msg.priority)}`}>
                            {msg.priority}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}