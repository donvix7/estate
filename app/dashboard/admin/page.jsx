'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  Users,
  Bell,
  Shield,
  FileText,
  Settings,
  ShieldAlert,
  MessageSquare,
  UserCheck,
  Calendar,
  Smartphone,
  Activity,
  BarChart3,
  Clock,
  Briefcase
} from 'lucide-react'
import AdminNav from '@/components/AdminNav'
import StatsCard from '@/components/StatsCard'
import DashboardTabs from '@/components/DashboardTabs'
import { api } from '@/services/api' // Unified API Service

// Dynamically import the QR scanner
const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then(mod => mod.Scanner),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center bg-gray-900/50 rounded-2xl border border-gray-700/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading scanner...</p>
        </div>
      </div>
    )
  }
)



export default function AdminDashboard() {
  const router = useRouter()
  
  // State from API
  const [userData, setUserData] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [securityLogs, setSecurityLogs] = useState([])
  const [pendingInvites, setPendingInvites] = useState([])
  const [staffMembers, setStaffMembers] = useState([])
  const [estates, setEstates] = useState([])
  
  // UI State
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [showScanner, setShowScanner] = useState(false)
  const [visitorCode, setVisitorCode] = useState('')

  // Load Initial Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [
          user, 
          anns, 
          logs, 
          invites, 
          staff,
          estatesList
        ] = await Promise.all([
          api.getUserData(),
          api.getAnnouncements(),
          api.getSecurityLogs(),
          api.getPendingInvites(),
          api.getStaffMembers(),
          api.getEstates()
        ]);

        setUserData(user);
        setAnnouncements(anns);
        setSecurityLogs(logs);
        setPendingInvites(invites);
        setStaffMembers(staff);
        setEstates(estatesList);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleVerifyVisitor = async (code, pin) => {
     try {
       const result = await api.verifyVisitorPass(code, pin || '0000'); // weak pin check for admin demo
       if (result.success) {
         alert(`Verified: ${result.visitor.name} (${result.visitor.resident})`);
         // refresh logs
         const logs = await api.getSecurityLogs();
         setSecurityLogs(logs);
       } else {
         alert(`Verification Failed: ${result.message}`);
       }
     } catch (e) {
       alert('Error verifying visitor');
     }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'staff', label: 'Staff', icon: UserCheck },
    { id: 'users', label: 'Residents', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="space-y-4 text-center">
           <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
           <p className="text-gray-400 animate-pulse">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 font-sans">
      <AdminNav />
      
      <main className="container mx-auto px-4 py-8">
        <DashboardTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <div className="animate-fadeIn">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                  title="Total Residents" 
                  value="1,245" 
                  icon={Users} 
                  color="blue" 
                  subtext="+12 this week"
                />
                <StatsCard 
                  title="Active Security" 
                  value={staffMembers.filter(s => s.department === 'Security' || s.role.includes('Security')).length || 5} 
                  icon={ShieldAlert} 
                  color="red" 
                  subtext="on duty now"
                />
                <StatsCard 
                  title="Pending Invites" 
                  value={pendingInvites.length} 
                  icon={Mail} 
                  color="yellow" 
                  subtext="awaiting acceptance"
                />
                 <StatsCard 
                  title="Maintenance Requests" 
                  value="8" 
                  icon={Settings} 
                  color="cyan" 
                  subtext="3 high priority"
                />
              </div>

               {/* Recent Activity */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-gray-900 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <Activity className="w-5 h-5 text-cyan-400" /> Recent Security Logs
                   </h3>
                   <div className="space-y-4">
                     {securityLogs.slice(0, 5).map(log => (
                       <div key={log.id} className="border-b border-gray-700/50 last:border-0 pb-3 last:pb-0">
                         <div className="flex justify-between items-start">
                           <p className="text-gray-200 font-medium">{log.action}</p>
                           <span className="text-xs text-gray-500 bg-gray-900/50 px-2 py-1 rounded">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         </div>
                         <p className="text-sm text-gray-400 mt-1">
                           {log.visitorName || log.visitorCode} - {log.location || 'Main Gate'}
                         </p>
                       </div>
                     ))}
                     {securityLogs.length === 0 && <p className="text-gray-500 italic">No recent logs.</p>}
                   </div>
                 </div>

                 <div className="bg-gray-900 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-400" /> Recent Announcements
                   </h3>
                   <div className="space-y-4">
                      {announcements.slice(0, 4).map(ann => (
                        <div key={ann.id} className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/30">
                          <h4 className="font-semibold text-gray-200">{ann.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{new Date(ann.timestamp).toLocaleDateString()}</p>
                        </div>
                      ))}
                   </div>
                 </div>
               </div>
            </div>
          )}

          {/* STAFF TAB (Simplified for Demo) */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 backdrop-blur">
                 <h2 className="text-xl font-bold text-white">Staff Directory</h2>
                 <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors text-sm font-medium">
                   + Add Staff
                 </button>
               </div>
               
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {staffMembers.map(staff => (
                   <div key={staff.id} className="bg-gray-800/40 border border-gray-700/50 p-6 rounded-xl hover:border-cyan-500/30 transition-all group">
                     <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center">
                         <Briefcase className="w-6 h-6 text-cyan-400" />
                       </div>
                       <div>
                         <h3 className="font-bold text-white">{staff.name}</h3>
                         <p className="text-sm text-cyan-400">{staff.role}</p>
                       </div>
                     </div>
                     <div className="space-y-2 text-sm text-gray-400">
                       <div className="flex justify-between">
                         <span>Department:</span>
                         <span className="text-gray-300">{staff.department}</span>
                       </div>
                       <div className="flex justify-between">
                         <span>Status:</span>
                         <span className={`px-2 py-0.5 rounded text-xs ${staff.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20'}`}>
                           {staff.status}
                         </span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
          
          {/* PLACEHOLDERS FOR OTHER TABS */}
          {(activeTab === 'security' || activeTab === 'users' || activeTab === 'announcements') && (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-800/20 border border-gray-700/50 rounded-2xl border-dashed">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-400">Under Maintenance</h3>
              <p className="text-gray-500 mt-2">This module is currently being optimized.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function Mail({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}