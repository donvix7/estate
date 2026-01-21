import { Building, LogOut, Briefcase, User, IDCard } from 'lucide-react'
import React from 'react'

const StaffNav = ({ staffData, onLogout }) => {
  // Default values to prevent crashes if data hasn't loaded yet
  const safeStaffData = staffData || {
    name: 'Staff Member',
    estate: 'Loading...',
    department: 'Department', 
    employeeId: 'STF-XXXX'
  }

  return (
    <div>
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 via-gray-800/95 to-gray-800 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Staff Dashboard</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-gray-400 text-sm">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    {safeStaffData.estate}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>Welcome, {safeStaffData.name}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span className="text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                    {safeStaffData.department}
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    ID: {safeStaffData.employeeId}
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}

export default StaffNav
