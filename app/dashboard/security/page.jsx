'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import AdminNav from '@/components/AdminNav'
import StatsCard from '@/components/StatsCard'
import DashboardTabs from '@/components/DashboardTabs'
import { api } from '@/services/api'
import {
  Users,
  FileText,
  Bell,
  MessageSquare,
  User,
  Shield,
  LogOut,
  QrCode,
  Activity,
  AlertTriangle,
  RotateCcw
} from 'lucide-react'

// Dynamically import Scanner
const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then(mod => mod.Scanner),
  { 
    ssr: false,
    loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Loading Scanner...</div>
  }
)

export default function SecurityDashboard() {
  const router = useRouter()
  
  // Data State
  const [currentVisitors, setCurrentVisitors] = useState([])
  const [todayLogs, setTodayLogs] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [securityProfile, setSecurityProfile] = useState(null)
  
  // UI State
  const [activeTab, setActiveTab] = useState('visitors')
  const [isLoading, setIsLoading] = useState(true)
  const [visitorCode, setVisitorCode] = useState('')
  const [visitorPin, setVisitorPin] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [visitors, logs, anns] = await Promise.all([
           api.getVisitors(),
           api.getSecurityLogs(),
           api.getAnnouncements()
        ])
        
        setCurrentVisitors(visitors)
        setTodayLogs(logs)
        setAnnouncements(anns)
        
        // Mock profile for now
        setSecurityProfile({
          name: 'Officer Michael',
          badgeNumber: 'SG-2024-01',
          role: 'Head of Security'
        })
      } catch (error) {
        console.error('Error loading security data', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleVerify = async () => {
     if (!visitorCode) return alert('Enter a code');
     setIsLoading(true);
     try {
       const result = await api.verifyVisitorPass(visitorCode, visitorPin || '0000');
       if (result.success) {
         alert(`ACCESS GRANTED: ${result.visitor.name}`);
         // Refresh data
         const [newVisitors, newLogs] = await Promise.all([
           api.getVisitors(),
           api.getSecurityLogs()
         ]);
         setCurrentVisitors(newVisitors);
         setTodayLogs(newLogs);
         setVisitorCode('');
         setVisitorPin('');
       } else {
         alert(`ACCESS DENIED: ${result.message}`);
       }
     } catch (e) {
       alert('Verification Error');
     } finally {
       setIsLoading(false);
     }
  }

  const handleScan = (result) => {
      if (result) {
          const raw = result[0]?.rawValue;
          if (raw) {
              setVisitorCode(raw);
              setIsScanning(false);
              alert(`Scanned: ${raw}`);
          }
      }
  }

  const tabs = [
    { id: 'visitors', label: 'Visitor Management', icon: Users },
    { id: 'logs', label: 'Entry/Exit Logs', icon: FileText },
    { id: 'alerts', label: 'Security Alerts', icon: Bell },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
    { id: 'profile', label: 'My Profile', icon: User }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading Security Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 font-sans">
      <AdminNav title="Security Dashboard" />

      <main className="container mx-auto px-4 py-8">
        <DashboardTabs 
           tabs={tabs} 
           activeTab={activeTab} 
           onTabChange={setActiveTab} 
        />

        {/* VISITORS TAB */}
        {activeTab === 'visitors' && (
           <div className="grid md:grid-cols-2 gap-8">
              {/* Stats */}
              <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                 <StatsCard title="On Premises" value={currentVisitors.length} icon={Users} color="blue" />
                 <StatsCard title="Today's Entries" value={todayLogs.filter(l => l.type === 'entry').length} icon={LogOut} color="green" />
                 <StatsCard title="Today's Exits" value={todayLogs.filter(l => l.type === 'exit').length} icon={RotateCcw} color="yellow" />
                 <StatsCard title="Alerts" value="0" icon={AlertTriangle} color="red" />
              </div>

              {/* Verification Panel */}
              <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
                 <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                   <QrCode className="w-6 h-6 text-cyan-400" /> Verify Visitor
                 </h3>
                 
                 <div className="space-y-4">
                    {isScanning ? (
                      <div className="h-64 bg-black rounded-xl overflow-hidden relative">
                         <Scanner onScan={handleScan} />
                         <button 
                           onClick={() => setIsScanning(false)}
                           className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                         >
                           Stop
                         </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsScanning(true)}
                        className="w-full py-4 bg-gray-700/50 hover:bg-gray-700 text-cyan-400 rounded-xl border border-dashed border-gray-600 flex flex-col items-center justify-center gap-2 transition-all"
                      >
                        <QrCode className="w-8 h-8" />
                        <span>Launch Scanner</span>
                      </button>
                    )}

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-800 text-gray-500">Or enter manually</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <input 
                         type="text" 
                         placeholder="Visitor Code" 
                         className="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                         value={visitorCode}
                         onChange={(e) => setVisitorCode(e.target.value)}
                       />
                       <input 
                         type="password" 
                         placeholder="PIN" 
                         className="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                         value={visitorPin}
                         onChange={(e) => setVisitorPin(e.target.value)}
                       />
                    </div>
                    
                    <button 
                      onClick={handleVerify}
                      className="w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
                    >
                      Verify Access
                    </button>
                 </div>
              </div>

              {/* Current Visitors List */}
              <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
                 <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                   <Users className="w-6 h-6 text-blue-400" /> Current Visitors
                 </h3>
                 <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {currentVisitors.length === 0 ? (
                       <p className="text-gray-500 text-center py-8">No active visitors on premises.</p>
                    ) : (
                       currentVisitors.map(visitor => (
                         <div key={visitor.id} className="p-4 bg-gray-900/50 border border-gray-700/50 rounded-xl flex justify-between items-center group hover:border-cyan-500/30 transition-all">
                            <div>
                               <p className="font-bold text-gray-200">{visitor.name}</p>
                               <p className="text-sm text-gray-500">To: {visitor.resident}</p>
                            </div>
                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">
                               {visitor.status}
                            </span>
                         </div>
                       ))
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
           <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-gray-900/50 text-gray-400 text-sm uppercase">
                    <tr>
                       <th className="p-4">Time</th>
                       <th className="p-4">Event</th>
                       <th className="p-4">Details</th>
                       <th className="p-4">Location</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-700/50 text-gray-300">
                    {todayLogs.map(log => (
                       <tr key={log.id} className="hover:bg-gray-800/50">
                          <td className="p-4 whitespace-nowrap text-sm text-gray-400">
                             {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="p-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                log.type === 'entry' ? 'bg-green-500/10 text-green-400' : 
                                log.type === 'exit' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                             }`}>
                                {log.type}
                             </span>
                          </td>
                          <td className="p-4">
                             {log.visitorName || log.visitorCode}
                          </td>
                          <td className="p-4 text-gray-400 text-sm">{log.location || 'Main Gate'}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}

        {/* Other Tabs Placeholder */}
        {(activeTab === 'alerts' || activeTab === 'announcements' || activeTab === 'profile') && (
           <div className="flex flex-col items-center justify-center py-20 bg-gray-800/20 border border-gray-700/50 rounded-2xl border-dashed">
              <Activity className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-gray-500">Module under optimization.</p>
           </div>
        )}

      </main>
    </div>
  )
}