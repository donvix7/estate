import { INITIAL_DATA, BLACKLISTED_CODES } from './mockData';

// Singleton state simulation (in-memory persistence during session)
let STATE = { ...INITIAL_DATA };

// Helper to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- GENERAL ---
  resetData: () => {
    STATE = { ...INITIAL_DATA };
  },

  getState: () => STATE,

  // --- ANNOUNCEMENTS & ALERTS ---
  async getAnnouncements() {
    await delay(300);
    // Return a combined list of announcements and broadcasts for display
    return [...STATE.announcements].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async saveAnnouncement(announcement) {
    await delay();
    const newAnnouncement = { 
      id: Date.now(), 
      timestamp: new Date().toISOString(),
      read: false,
      ...announcement 
    };
    STATE.announcements.unshift(newAnnouncement);
    return { success: true, data: newAnnouncement };
  },

  async getAlerts() {
    await delay();
    return STATE.alerts;
  },

  async saveEmergencyAlert(alert) {
    await delay();
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...alert
    };
    STATE.emergencyAlerts.unshift(newAlert);
    STATE.alerts.unshift(newAlert);
    // Also add to announcements for visibility
    STATE.announcements.unshift({
      ...newAlert,
      priority: 'urgent',
      type: 'emergency' 
    });
    return { success: true };
  },

  // --- VISITOR MANAGEMENT ---
  async getVisitors() {
    await delay();
    return STATE.currentVisitors;
  },

  async getSecurityLogs() {
    await delay();
    // Combine logs and securityLogs into one stream if needed, mostly returning securityLogs
    return STATE.securityLogs || [];
  },

  async verifyVisitorPass(code, pin) {
    await delay(600);
    
    const isBlacklisted = BLACKLISTED_CODES.includes(code);
    
    if (isBlacklisted) {
      // Auto-log incident
      const incident = {
        id: Date.now(),
        type: 'blacklist_attempt',
        visitorCode: code,
        time: new Date().toISOString(),
        action: 'Denied entry',
        priority: 'high',
        message: `Blacklisted code ${code} attempted entry`
      };
      STATE.alerts.unshift(incident);
      STATE.securityLogs.unshift(incident);

      return {
        success: false,
        message: 'Visitor is blacklisted',
        blacklisted: true,
        visitor: null
      };
    }
    
    // Simulate finding a visitor
    const residents = ['A-101', 'A-102', 'B-201', 'C-302'];
    const randomResident = residents[Math.floor(Math.random() * residents.length)];
    
    const visitorData = {
      id: `visitor_${Date.now()}`,
      code: code,
      pin: pin,
      name: `Visitor ${code.substring(0,6)}`,
      resident: randomResident,
      purpose: 'Verified Entry',
      entryTime: new Date().toISOString(),
      status: 'active',
      verifiedBy: 'QR Scan'
    };
    
    STATE.currentVisitors.unshift(visitorData);
    
    const logEntry = {
      id: Date.now(),
      type: 'entry',
      visitorCode: code,
      visitorName: visitorData.name,
      timestamp: new Date().toISOString(),
      action: 'Entry granted',
      method: 'QR Scan',
      location: 'Main Gate'
    };
    
    STATE.securityLogs.unshift(logEntry);
    STATE.logs.unshift(logEntry); // Legacy support
    
    return {
      success: true,
      message: 'Visitor verified successfully',
      visitor: visitorData,
      log: logEntry
    };
  },

  async updateVisitorStatus(visitorId, updates) {
    await delay();
    const index = STATE.currentVisitors.findIndex(v => v.id === visitorId);
    if (index !== -1) {
      STATE.currentVisitors[index] = { ...STATE.currentVisitors[index], ...updates };
      
      if (updates.status === 'checked-out') {
        const v = STATE.currentVisitors[index];
        const logEntry = {
          id: Date.now(),
          type: 'exit',
          visitorCode: v.code,
          visitorName: v.name,
          timestamp: new Date().toISOString(),
          action: 'Checked out',
        };
        STATE.securityLogs.unshift(logEntry);
      }
      return { success: true };
    }
    return { success: false };
  },

  // --- STAFF & USER MANAGEMENT ---
  async getUserData() {
    await delay(300);
    return STATE.userData;
  },

  async getStaffMembers() {
    await delay();
    return STATE.staffMembers;
  },

  async addStaffMember(staff) {
    await delay();
    const newStaff = {
      id: `staff_${Date.now()}`,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      ...staff
    };
    STATE.staffMembers.push(newStaff);
    return { success: true, staff: newStaff };
  },

  async getStaffTasks() {
    await delay();
    return STATE.staffTasks;
  },

  async updateTaskStatus(taskId, status) {
    await delay();
    const index = STATE.staffTasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      STATE.staffTasks[index] = { ...STATE.staffTasks[index], status };
      return { success: true };
    }
    return { success: false };
  },

  async getInventory() {
    await delay();
    return STATE.inventory;
  },
  
  async getWorkLogs() {
    await delay();
    return STATE.workLogs;
  },

  async submitWorkLog(log) {
    await delay();
     const newWorkLog = {
      id: Date.now(),
      ...log,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    STATE.workLogs.unshift(newWorkLog);
    return { success: true, data: newWorkLog };
  },

  async getEstates() {
    await delay();
    return STATE.estates;
  },

  async sendUserInvitation(invitation) {
    await delay();
    const token = `invite_${Date.now()}`;
    const newInvite = {
      ...invitation,
      id: token,
      token,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };
    STATE.pendingInvites.unshift(newInvite);
    return { success: true, invitation: newInvite, message: `Invitation sent to ${invitation.email}` };
  },
  
  async getPendingInvites() {
    await delay();
    return STATE.pendingInvites;
  },
  
  async getAdminEstate(adminId) {
    await delay();
    return STATE.estates.find(e => e.adminId === adminId) || STATE.estates[0];
  }
};
