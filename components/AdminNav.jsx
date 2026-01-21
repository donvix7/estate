import { Building, LogOut, Shield } from 'lucide-react'
import React from 'react'

const AdminNav = () => {
     const userData = {
    /*id: 'admin_001',
    name: 'John Admin',
    gateStation: 'Main Office',
    type: 'admin',
    estateId: 'estate_001'*/
  }

  const adminEstate = {
    /*id: 'estate_001',
    name: 'Estate A',
    address: '123 Main St, City',
    phone: '+1234567890',
    email: 'estate@example.com'*/
  }

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked');
  }
  
  return (
    <div>
         {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 via-gray-800/95 to-gray-800 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400">
                  <Building className="w-4 h-4 inline mr-2" />
                  {userData.gateStation || 'Main Office'} | Welcome, {userData.name || 'Admin'}
                </p>
                <p className="text-cyan-400 text-sm mt-1">
                  Estate: {adminEstate?.name || 'Loading...'}
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
    </div>
  )
}

export default AdminNav