// Centralized Mock Data Store
// This ensures all dashboards share the same initial data state

export const INITIAL_DATA = {
  // Visitor Management
  visitors: [],
  currentVisitors: [],
  logs: [], // Security logs
  securityLogs: [], // detailed logs

  // Communications
  announcements: [
    {
      id: 1,
      title: 'Maintainence Notice: Main Gate',
      message: 'The main gate will be undergoing maintenance on Saturday from 2 PM to 4 PM. Please use the side entrance.',
      type: 'maintenance',
      priority: 'normal',
      author: 'Admin',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false
    },
    {
      id: 2,
      title: 'Security Alert: Suspicious Activity',
      message: 'Report of suspicious individual near Block C. Security has been dispatched.',
      type: 'security',
      priority: 'high',
      author: 'System',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true
    }
  ],
  broadcasts: [],
  emergencyAlerts: [],
  securityIncidents: [], 
  alerts: [], // specific security alerts

  // User Management
  userData: {
    id: 'admin_001',
    name: 'John Admin',
    gateStation: 'Main Office',
    type: 'admin',
    estateId: 'estate_001'
  },
  estates: [
    { id: 'estate_001', name: 'Sunrise Estate', adminId: 'admin_001' }
  ],
  pendingInvites: [],
  
  // Staff Management
  staffMembers: [
    {
      id: 'staff_001',
      name: 'Samuel Okeke',
      role: 'Senior Technician',
      employeeId: 'STF-2024-042',
      department: 'Maintenance',
      shift: 'Morning (8:00 AM - 4:00 PM)',
      phone: '+234 801 234 5678',
      email: 'samuel.okeke@estate.com',
      joinDate: '2022-03-15',
      rating: 4.8,
      status: 'active',
      skills: ['Electrical Repair', 'Plumbing']
    }
  ],
  staffAttendance: [],
  staffTasks: [
    {
      id: 1,
      title: 'Inspect Water Pump B',
      location: 'Block C Utility Room',
      priority: 'high',
      status: 'pending',
      assignedBy: 'Facility Manager',
      dueDate: '2024-10-25',
      description: 'Reported unusual noise. Check pressure levels and vibration.'
    }
  ],
  inventory: [
    { id: 1, name: 'LED Bulbs (15W)', quantity: 45, unit: 'pcs', minLevel: 20, category: 'Electrical' },
    { id: 2, name: 'PVC Pipe (2 inch)', quantity: 8, unit: 'lengths', minLevel: 10, category: 'Plumbing' }
  ],
  workLogs: []
};

// Blacklisted codes for security checks
export const BLACKLISTED_CODES = ['BLOCK123', 'BLOCK456', 'DENY789'];
