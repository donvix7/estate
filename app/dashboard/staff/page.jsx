'use client';

import React, { useState, useEffect } from 'react';
import StaffNav from '@/components/StaffNav';
import StatsCard from '@/components/StatsCard';
import DashboardTabs from '@/components/DashboardTabs';
import { api } from '@/services/api';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  MessageSquare, 
  User, 
  Package, 
  ClipboardList, 
  Calendar,
  Filter,
  Plus,
  ChevronRight,
  TrendingUp,
  MapPin,
  Award,
  Shield,
  Briefcase,
  Phone,
  Mail
} from 'lucide-react';

const PRIORITY_COLORS = {
  high: 'text-red-400 bg-red-400/10 border-red-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  low: 'text-green-400 bg-green-400/10 border-green-400/20'
};

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  'in-progress': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  completed: 'text-green-400 bg-green-400/10 border-green-400/20'
};

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [staffData, setStaffData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  // Form States
  const [newLog, setNewLog] = useState({
    taskTitle: '',
    hours: '',
    notes: ''
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [staffMembers, tasksData, logs, inv, anns] = await Promise.all([
          api.getStaffMembers(),
          api.getStaffTasks(),
          api.getWorkLogs(),
          api.getInventory(),
          api.getAnnouncements()
        ]);
        
        // Use the first staff member as the logged-in user for demo
        setStaffData(staffMembers[0]);
        setTasks(tasksData);
        setWorkLogs(logs);
        setInventory(inv);
        setAnnouncements(anns);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    await api.updateTaskStatus(taskId, newStatus);
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    const result = await api.submitWorkLog(newLog);
    if (result.success) {
      setWorkLogs([result.data, ...workLogs]);
      setNewLog({ taskTitle: '', hours: '', notes: '' });
      alert('Work log submitted successfully!');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'tasks', label: 'My Tasks', icon: ClipboardList },
    { id: 'logs', label: 'Work Log', icon: FileText },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 animate-pulse">Loading Staff Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-cyan-500/30">
      <StaffNav />
      {/* Passing empty title to handle default or specific title logic if needed in StaffNav */}
      
      <main className="container mx-auto px-4 py-8">
        <DashboardTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Content Area */}
        <div className="space-y-6 animate-fadeIn">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                  title="Pending Tasks" 
                  value={tasks.filter(t => t.status === 'pending').length} 
                  icon={AlertTriangle} 
                  color="yellow" 
                />
                <StatsCard 
                  title="In Progress" 
                  value={tasks.filter(t => t.status === 'in-progress').length} 
                  icon={Clock} 
                  color="blue" 
                />
                <StatsCard 
                  title="Completed Tasks" 
                  value={tasks.filter(t => t.status === 'completed').length} 
                  icon={CheckCircle} 
                  color="green" 
                />
                <StatsCard 
                  title="Work Hours" 
                  value={workLogs.reduce((acc, log) => acc + (parseFloat(log.hours) || 0), 0)} 
                  icon={Calendar} 
                  color="purple" 
                  subtext="total logged"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Priorities */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <ClipboardList className="w-6 h-6 text-cyan-400" />
                      Priority Tasks
                    </h2>
                    <button 
                      onClick={() => setActiveTab('tasks')}
                      className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {tasks.slice(0, 3).map(task => (
                      <div key={task.id} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:border-gray-600 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${PRIORITY_COLORS[task.priority]}`}>
                              {task.priority || 'medium'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${STATUS_COLORS[task.status]}`}>
                              {task.status}
                            </span>
                          </div>
                          <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {task.dueDate}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors mb-2">{task.title}</h3>
                        <p className="text-gray-400 text-sm mb-4">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {task.location}</span>
                          <span className="flex items-center gap-1"><User className="w-4 h-4" /> {task.assignedBy}</span>
                        </div>
                      </div>
                    ))}
                    {tasks.length === 0 && <p className="text-gray-500 italic">No tasks assigned.</p>}
                  </div>
                </div>

                {/* Quick Actions / Recent Logs */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setActiveTab('logs')}
                        className="w-full py-3 px-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
                      >
                        <Plus className="w-5 h-5" /> Log Work Hour
                      </button>
                      <button 
                        onClick={() => setActiveTab('inventory')}
                        className="w-full py-3 px-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
                      >
                        <Package className="w-5 h-5" /> Check Inventory
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
             <div className="space-y-6">
               <div className="flex justify-between items-center bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 backdrop-blur">
                 <h2 className="text-xl font-bold text-white">All Tasks</h2>
                 <div className="flex gap-2">
                   <button className="p-2 text-gray-400 hover:text-white bg-gray-800/50 rounded-lg hover:bg-gray-700"><Filter className="w-5 h-5" /></button>
                 </div>
               </div>

               <div className="grid gap-4">
                 {tasks.map(task => (
                   <div key={task.id} className="bg-gray-800/30 backdrop-blur border border-gray-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/5 transition-all">
                     <div className="flex flex-col md:flex-row justify-between gap-4">
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                           <h3 className="text-lg font-bold text-white">{task.title}</h3>
                           <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                         </div>
                         <p className="text-gray-400 mb-4">{task.description}</p>
                         <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                           <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {task.location}</span>
                           <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-400" /> Due: {task.dueDate}</span>
                           <span className="flex items-center gap-1"><User className="w-4 h-4 text-gray-400" /> By: {task.assignedBy}</span>
                         </div>
                       </div>
                       
                       <div className="flex flex-col gap-3 min-w-[200px]">
                         <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                            <span className="text-sm text-gray-400">Status</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLORS[task.status]}`}>{task.status}</span>
                         </div>
                         
                         {task.status !== 'completed' && (
                           <div className="flex gap-2">
                             {task.status === 'pending' && (
                               <button 
                                 onClick={() => handleTaskStatusUpdate(task.id, 'in-progress')}
                                 className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-medium transition-colors"
                               >
                                 Start Task
                               </button>
                             )}
                             {task.status === 'in-progress' && (
                               <button 
                                 onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                                 className="flex-1 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg text-sm font-medium transition-colors"
                               >
                                 Mark Complete
                               </button>
                             )}
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {/* WORK LOGS TAB */}
          {activeTab === 'logs' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Log Form */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl p-6 sticky top-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-cyan-400" /> New Log
                  </h3>
                  <form onSubmit={handleSubmitLog} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Task Title</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        placeholder="e.g. Garden Maintenance"
                        value={newLog.taskTitle}
                        onChange={(e) => setNewLog({...newLog, taskTitle: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Hours Spent</label>
                      <input 
                        type="number" 
                        required
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        placeholder="0.0"
                        value={newLog.hours}
                        onChange={(e) => setNewLog({...newLog, hours: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                      <textarea 
                        rows="3"
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        placeholder="Brief description of work done..."
                        value={newLog.notes}
                        onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
                    >
                      Submit Work Log
                    </button>
                  </form>
                </div>
              </div>

              {/* Log History */}
              <div className="lg:col-span-2 space-y-6">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                   <Clock className="w-5 h-5 text-gray-400" /> Recent History
                 </h3>
                 <div className="space-y-4">
                   {workLogs.map(log => (
                     <div key={log.id} className="bg-gray-800/30 backdrop-blur border border-gray-700/50 rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4">
                       <div>
                         <div className="flex items-center gap-3 mb-1">
                           <h4 className="font-semibold text-gray-200">{log.taskTitle}</h4>
                           <span className={`text-xs px-2 py-0.5 rounded-full border ${log.status === 'approved' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'}`}>
                             {log.status}
                           </span>
                         </div>
                         <p className="text-gray-400 text-sm mb-2">{log.notes}</p>
                         <span className="text-xs text-gray-500">{log.date}</span>
                       </div>
                       <div className="flex items-center gap-2 text-gray-300 md:self-center bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700/50">
                         <Clock className="w-4 h-4 text-cyan-400" />
                         <span className="font-mono font-bold">{log.hours}h</span>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
             <div className="space-y-6">
                <div className="bg-gray-800/30 -mx-4 md:mx-0 md:rounded-2xl border border-gray-700/50 overflow-hidden backdrop-blur">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider border-b border-gray-700">
                          <th className="p-4 font-semibold">Item Name</th>
                          <th className="p-4 font-semibold">Category</th>
                          <th className="p-4 font-semibold">Quantity</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {inventory.map(item => (
                          <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                            <td className="p-4">
                              <span className="font-medium text-gray-200">{item.name}</span>
                            </td>
                            <td className="p-4 text-gray-400">{item.category}</td>
                            <td className="p-4">
                              <span className="font-mono text-gray-300">{item.quantity} {item.unit}</span>
                            </td>
                            <td className="p-4">
                              {item.quantity <= item.minLevel ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                  <AlertTriangle className="w-3 h-3" /> Low Stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                  <CheckCircle className="w-3 h-3" /> In Stock
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium px-3 py-1 hover:bg-cyan-500/10 rounded-lg transition-colors">
                                Request Restock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
             </div>
          )}

          {/* ANNOUNCEMENTS TAB */}
          {activeTab === 'announcements' && (
             <div className="space-y-6 max-w-4xl mx-auto">
               <h2 className="text-2xl font-bold text-white mb-6">Staff Bulletin</h2>
               <div className="grid gap-6">
                  {announcements.map(ann => (
                    <div key={ann.id} className="group bg-gray-800/30 hover:bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-2xl p-6 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3 items-center">
                          <span className={`h-10 w-10 rounded-full flex items-center justify-center ${
                             ann.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                             ann.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                             'bg-blue-500/20 text-blue-400'
                          }`}>
                             <MessageSquare className="w-5 h-5" />
                          </span>
                          <div>
                            <h3 className="text-lg font-bold text-gray-100">{ann.title}</h3>
                            <span className="text-xs text-gray-500 uppercase tracking-widest">{ann.type}</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700/50">
                          {new Date(ann.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed pl-[52px]">{ann.message || ann.content}</p>
                    </div>
                  ))}
               </div>
             </div>
          )}

          {/* PROFILE TAB (Simplified) */}
          {activeTab === 'profile' && staffData && (
             <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl p-8">
                   <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                         <User className="w-10 h-10 text-cyan-400" />
                      </div>
                      <div>
                         <h2 className="text-2xl font-bold text-white">{staffData.name}</h2>
                         <p className="text-gray-400">{staffData.role} • {staffData.department}</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3 text-gray-300">
                            <Shield className="w-5 h-5 text-gray-500" />
                            <span>ID: {staffData.employeeId}</span>
                         </div>
                         <div className="flex items-center gap-3 text-gray-300">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <span>{staffData.shift}</span>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-3 text-gray-300">
                            <Briefcase className="w-5 h-5 text-gray-500" />
                            <span>{staffData.skills?.join(', ')}</span>
                         </div>
                         <div className="flex items-center gap-3 text-gray-300">
                            <Award className="w-5 h-5 text-yellow-500" />
                            <span>Rating: {staffData.rating}/5.0</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-900/50 flex items-center justify-center text-gray-400">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-gray-200">{value}</p>
      </div>
    </div>
  );
}