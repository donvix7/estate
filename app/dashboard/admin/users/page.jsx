'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Mock data for demonstration
const MOCK_DATA = {
  residents: [
    {
      id: 'RES001',
      name: 'Amit Sharma',
      email: 'amit.sharma@example.com',
      phone: '+91 9876543210',
      unitNumber: 'A-101',
      residentSince: '2022-03-15',
      occupation: 'Software Engineer',
      emergencyContact: '+91 9876543211',
      status: 'active',
      type: 'resident',
      profileImage: '👨‍💼'
    },
    {
      id: 'RES002',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 9876543212',
      unitNumber: 'B-202',
      residentSince: '2021-08-22',
      occupation: 'Doctor',
      emergencyContact: '+91 9876543213',
      status: 'active',
      type: 'resident',
      profileImage: '👩‍⚕️'
    },
    {
      id: 'RES003',
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      phone: '+91 9876543214',
      unitNumber: 'C-303',
      residentSince: '2023-01-10',
      occupation: 'Business Owner',
      emergencyContact: '+91 9876543215',
      status: 'inactive',
      type: 'resident',
      profileImage: '👨‍💼'
    },
    {
      id: 'RES004',
      name: 'Sneha Gupta',
      email: 'sneha.gupta@example.com',
      phone: '+91 9876543216',
      unitNumber: 'D-404',
      residentSince: '2022-11-30',
      occupation: 'Architect',
      emergencyContact: '+91 9876543217',
      status: 'active',
      type: 'resident',
      profileImage: '👩‍🎨'
    },
  ],
  staff: [
    {
      id: 'STF001',
      name: 'Rajesh Kumar',
      email: 'rajesh.staff@estatesecure.com',
      phone: '+91 9876543220',
      role: 'Maintenance Supervisor',
      department: 'Maintenance',
      joinDate: '2021-05-15',
      salary: '₹35,000',
      status: 'active',
      type: 'staff',
      profileImage: '👨‍🔧'
    },
    {
      id: 'STF002',
      name: 'Sunita Rao',
      email: 'sunita.staff@estatesecure.com',
      phone: '+91 9876543221',
      role: 'Housekeeping Head',
      department: 'Housekeeping',
      joinDate: '2020-08-20',
      salary: '₹28,000',
      status: 'active',
      type: 'staff',
      profileImage: '👩‍🔧'
    },
    {
      id: 'STF003',
      name: 'Vikram Singh',
      email: 'vikram.staff@estatesecure.com',
      phone: '+91 9876543222',
      role: 'Electrician',
      department: 'Maintenance',
      joinDate: '2022-02-10',
      salary: '₹25,000',
      status: 'active',
      type: 'staff',
      profileImage: '👨‍🔧'
    },
    {
      id: 'STF004',
      name: 'Meena Desai',
      email: 'meena.staff@estatesecure.com',
      phone: '+91 9876543223',
      role: 'Accountant',
      department: 'Finance',
      joinDate: '2021-11-05',
      salary: '₹40,000',
      status: 'inactive',
      type: 'staff',
      profileImage: '👩‍💼'
    },
  ],
  security: [
    {
      id: 'SEC001',
      name: 'Arjun Mehta',
      email: 'arjun.security@estatesecure.com',
      phone: '+91 9876543230',
      role: 'Senior Security Officer',
      badgeNumber: 'SG-2024-001',
      shift: 'Morning (6 AM - 2 PM)',
      joinDate: '2023-01-15',
      experience: '2 years',
      status: 'active',
      type: 'security',
      profileImage: '👮'
    },
    {
      id: 'SEC002',
      name: 'Kavita Nair',
      email: 'kavita.security@estatesecure.com',
      phone: '+91 9876543231',
      role: 'Security Officer',
      badgeNumber: 'SG-2024-002',
      shift: 'Evening (2 PM - 10 PM)',
      joinDate: '2023-03-20',
      experience: '1 year',
      status: 'active',
      type: 'security',
      profileImage: '👮‍♀️'
    },
    {
      id: 'SEC003',
      name: 'Deepak Roy',
      email: 'deepak.security@estatesecure.com',
      phone: '+91 9876543232',
      role: 'Night Security Incharge',
      badgeNumber: 'SG-2024-003',
      shift: 'Night (10 PM - 6 AM)',
      joinDate: '2022-08-10',
      experience: '3 years',
      status: 'active',
      type: 'security',
      profileImage: '👮'
    },
    {
      id: 'SEC004',
      name: 'Suresh Iyer',
      email: 'suresh.security@estatesecure.com',
      phone: '+91 9876543233',
      role: 'Security Officer',
      badgeNumber: 'SG-2024-004',
      shift: 'Morning (6 AM - 2 PM)',
      joinDate: '2023-06-15',
      experience: '6 months',
      status: 'inactive',
      type: 'security',
      profileImage: '👮'
    },
  ]
}

// Mock API functions
const mockAPI = {
  // Get all profiles
  async getAllProfiles() {
    try {
      const allProfiles = [
        ...MOCK_DATA.residents,
        ...MOCK_DATA.staff,
        ...MOCK_DATA.security
      ];
      return allProfiles;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
  },

  // Get profiles by type
  async getProfilesByType(type) {
    try {
      return MOCK_DATA[type] || [];
    } catch (error) {
      console.error('Error fetching profiles by type:', error);
      return [];
    }
  },

  // Update profile
  async updateProfile(profileId, updates) {
    console.log('Updating profile:', profileId, updates);
    // Find and update in all arrays
    Object.keys(MOCK_DATA).forEach(type => {
      const index = MOCK_DATA[type].findIndex(p => p.id === profileId);
      if (index !== -1) {
        MOCK_DATA[type][index] = { ...MOCK_DATA[type][index], ...updates };
      }
    });
    return { success: true };
  },

  // Delete profile
  async deleteProfile(profileId) {
    console.log('Deleting profile:', profileId);
    // Delete from all arrays
    Object.keys(MOCK_DATA).forEach(type => {
      MOCK_DATA[type] = MOCK_DATA[type].filter(p => p.id !== profileId);
    });
    return { success: true };
  },

  // Add new profile
  async addProfile(profile) {
    console.log('Adding new profile:', profile);
    const newProfile = {
      ...profile,
      id: `${profile.type.toUpperCase()}${Date.now().toString().slice(-3)}`
    };
    
    if (MOCK_DATA[profile.type]) {
      MOCK_DATA[profile.type].push(newProfile);
    }
    return { success: true, profile: newProfile };
  }
};

export default function AdminPeopleManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state for editing/adding
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    unitNumber: '',
    department: '',
    occupation: '',
    emergencyContact: '',
    badgeNumber: '',
    shift: '',
    joinDate: '',
    experience: '',
    salary: '',
    status: 'active',
    type: 'resident'
  });

  // Load profiles on component mount
  useEffect(() => {
    loadProfiles();
  }, []);

  // Filter profiles when search term or status changes
  useEffect(() => {
    filterProfiles();
  }, [profiles, searchTerm, statusFilter, activeTab]);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      let data;
      if (activeTab === 'all') {
        data = await mockAPI.getAllProfiles();
      } else {
        data = await mockAPI.getProfilesByType(activeTab);
      }
      setProfiles(data);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProfiles = () => {
    let filtered = profiles;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(term) ||
        profile.email.toLowerCase().includes(term) ||
        profile.phone.toLowerCase().includes(term) ||
        (profile.unitNumber && profile.unitNumber.toLowerCase().includes(term)) ||
        (profile.role && profile.role.toLowerCase().includes(term))
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(profile => profile.status === statusFilter);
    }
    
    setFilteredProfiles(filtered);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedProfile(null);
    setIsEditing(false);
    loadProfiles();
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    setIsEditing(false);
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      role: profile.role || '',
      unitNumber: profile.unitNumber || '',
      department: profile.department || '',
      occupation: profile.occupation || '',
      emergencyContact: profile.emergencyContact || '',
      badgeNumber: profile.badgeNumber || '',
      shift: profile.shift || '',
      joinDate: profile.joinDate || '',
      experience: profile.experience || '',
      salary: profile.salary || '',
      status: profile.status || 'active',
      type: profile.type || 'resident'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    if (!selectedProfile) return;
    
    try {
      await mockAPI.updateProfile(selectedProfile.id, formData);
      await loadProfiles();
      
      // Update selected profile in state
      const updatedProfile = { ...selectedProfile, ...formData };
      setSelectedProfile(updatedProfile);
      setIsEditing(false);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleDeleteProfile = async () => {
    if (!selectedProfile) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedProfile.name}'s profile? This action cannot be undone.`)) {
      try {
        await mockAPI.deleteProfile(selectedProfile.id);
        await loadProfiles();
        setSelectedProfile(null);
        alert('Profile deleted successfully!');
      } catch (error) {
        console.error('Error deleting profile:', error);
        alert('Error deleting profile. Please try again.');
      }
    }
  };

  const handleAddProfile = async () => {
    try {
      const result = await mockAPI.addProfile(formData);
      if (result.success) {
        await loadProfiles();
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: '',
          unitNumber: '',
          department: '',
          occupation: '',
          emergencyContact: '',
          badgeNumber: '',
          shift: '',
          joinDate: '',
          experience: '',
          salary: '',
          status: 'active',
          type: 'resident'
        });
        alert('Profile added successfully!');
      }
    } catch (error) {
      console.error('Error adding profile:', error);
      alert('Error adding profile. Please try again.');
    }
  };

  const getProfileTypeLabel = (type) => {
    switch(type) {
      case 'resident': return 'Resident';
      case 'staff': return 'Staff';
      case 'security': return 'Security';
      default: return type;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading People Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">👨‍💼</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">People Management</h1>
                <p className="text-blue-200">Admin Dashboard - Manage Residents, Staff & Security</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-200">Estate: Sunrise Towers</p>
                <p className="text-sm text-blue-200">Admin: Estate Administrator</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total People</p>
                <p className="text-3xl font-bold text-blue-700">{profiles.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Residents</p>
                <p className="text-3xl font-bold text-green-600">
                  {profiles.filter(p => p.type === 'resident' && p.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">🏠</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Staff</p>
                <p className="text-3xl font-bold text-purple-600">
                  {profiles.filter(p => p.type === 'staff' && p.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">👨‍🔧</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Security</p>
                <p className="text-3xl font-bold text-orange-600">
                  {profiles.filter(p => p.type === 'security' && p.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">👮</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - List & Filters */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              {/* Header with Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">People Directory</h2>
                  <p className="text-gray-600">Manage all residents, staff, and security personnel</p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center"
                  >
                    <span className="mr-2">+</span> Add New
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Export Data
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b mb-6 overflow-x-auto">
                {[
                  { id: 'all', label: 'All People', icon: '👥' },
                  { id: 'resident', label: 'Residents', icon: '🏠' },
                  { id: 'staff', label: 'Staff', icon: '👨‍🔧' },
                  { id: 'security', label: 'Security', icon: '👮' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center px-6 py-3 whitespace-nowrap font-medium ${
                      activeTab === tab.id 
                        ? 'border-b-2 border-blue-700 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, email, phone, or role..."
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                    />
                    <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                  <span className="text-sm text-gray-600">
                    {filteredProfiles.length} {filteredProfiles.length === 1 ? 'person' : 'people'} found
                  </span>
                </div>
              </div>

              {/* Profiles List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredProfiles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">👥</span>
                    </div>
                    <p className="text-gray-500 text-lg">No people found</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {searchTerm ? 'Try a different search term' : 'Add new people to get started'}
                    </p>
                  </div>
                ) : (
                  filteredProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      onClick={() => handleProfileSelect(profile)}
                      className={`border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all ${
                        selectedProfile?.id === profile.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                            {profile.profileImage}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{profile.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(profile.status)}`}>
                                {profile.status}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                {getProfileTypeLabel(profile.type)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {profile.email} • {profile.phone}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {profile.role || profile.occupation || profile.unitNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {profile.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-1">
            {selectedProfile ? (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-6">
                {/* Profile Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {selectedProfile.profileImage}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedProfile.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedProfile.status)}`}>
                          {selectedProfile.status}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {getProfileTypeLabel(selectedProfile.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500">ID: {selectedProfile.id}</p>
                    <p className="text-xs text-gray-400">Click to copy</p>
                  </div>
                </div>

                {/* Edit Mode Toggle */}
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-gray-900">
                    {isEditing ? 'Edit Profile' : 'Profile Details'}
                  </h4>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      isEditing 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {/* Profile Form/Details */}
                <div className="space-y-4">
                  {isEditing ? (
                    // Edit Form
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        />
                      </div>
                      
                      {selectedProfile.type === 'resident' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-800">Unit Number</label>
                            <input
                              type="text"
                              name="unitNumber"
                              value={formData.unitNumber}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-800">Occupation</label>
                            <input
                              type="text"
                              name="occupation"
                              value={formData.occupation}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                            />
                          </div>
                        </>
                      )}
                      
                      {selectedProfile.type === 'staff' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-800">Role</label>
                            <input
                              type="text"
                              name="role"
                              value={formData.role}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-800">Department</label>
                            <input
                              type="text"
                              name="department"
                              value={formData.department}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                            />
                          </div>
                        </>
                      )}
                      
                      {selectedProfile.type === 'security' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-800">Badge Number</label>
                            <input
                              type="text"
                              name="badgeNumber"
                              value={formData.badgeNumber}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-800">Shift</label>
                            <select
                              name="shift"
                              value={formData.shift}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                            >
                              <option value="">Select Shift</option>
                              <option value="Morning (6 AM - 2 PM)">Morning (6 AM - 2 PM)</option>
                              <option value="Evening (2 PM - 10 PM)">Evening (2 PM - 10 PM)</option>
                              <option value="Night (10 PM - 6 AM)">Night (10 PM - 6 AM)</option>
                            </select>
                          </div>
                        </>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          onClick={handleUpdateProfile}
                          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                        >
                          Save Changes
                        </button>
                      </div>
                    </>
                  ) : (
                    // View Details
                    <>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">{selectedProfile.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium text-gray-900">{selectedProfile.phone}</p>
                        </div>
                        
                        {selectedProfile.type === 'resident' && (
                          <>
                            <div>
                              <p className="text-sm text-gray-600">Unit Number</p>
                              <p className="font-medium text-gray-900">{selectedProfile.unitNumber || 'N/A'}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600">Occupation</p>
                              <p className="font-medium text-gray-900">{selectedProfile.occupation || 'N/A'}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600">Resident Since</p>
                              <p className="font-medium text-gray-900">{formatDate(selectedProfile.residentSince)}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600">Emergency Contact</p>
                              <p className="font-medium text-gray-900">{selectedProfile.emergencyContact || 'N/A'}</p>
                            </div>
                          </>
                        )}
                        
                        {selectedProfile.type === 'staff' && (
                          <>
                            <div>
                              <p className="text-sm text-gray-600">Role</p>
                              <p className="font-medium text-gray-900">{selectedProfile.role}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600">Department</p>
                              <p className="font-medium text-gray-900">{selectedProfile.department}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600">Join Date</p>
                              <p className="font-medium text-gray-900">{formatDate(selectedProfile.joinDate)}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600">Salary</p>
                              <p className="font-medium text-gray-900">{selectedProfile.salary || 'N/A'}</p>
                            </div>
                          </>
                        )}
                        
                        {selectedProfile.type === 'security' && (
                          <>
                            <div>
                              <p className="text-sm text-gray-600">Badge Number</p>
                              <p className="font-medium text-gray-900">{selectedProfile.badgeNumber}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600">Shift</p>
                              <p className="font-medium text-gray-900">{selectedProfile.shift}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600">Join Date</p>
                              <p className="font-medium text-gray-900">{formatDate(selectedProfile.joinDate)}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600">Experience</p>
                              <p className="font-medium text-gray-900">{selectedProfile.experience}</p>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="pt-6 border-t border-gray-200 space-y-3">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                          Edit Profile
                        </button>
                        
                        <button
                          onClick={handleDeleteProfile}
                          className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                        >
                          Delete Profile
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              // Empty State
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Profile Selected</h3>
                <p className="text-gray-600 mb-4">Select a person from the list to view and manage their profile</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add New Person
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Person</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {/* Add Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Person Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                  >
                    <option value="resident">Resident</option>
                    <option value="staff">Staff</option>
                    <option value="security">Security</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                    required
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                    required
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                    required
                    placeholder="Enter phone number"
                  />
                </div>
                
                {formData.type === 'resident' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800">Unit Number</label>
                      <input
                        type="text"
                        name="unitNumber"
                        value={formData.unitNumber}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        placeholder="e.g., A-101"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800">Occupation</label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                  </>
                )}
                
                {formData.type === 'staff' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800">Role</label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        placeholder="e.g., Maintenance Supervisor"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        placeholder="e.g., Maintenance"
                      />
                    </div>
                  </>
                )}
                
                {formData.type === 'security' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800">Badge Number</label>
                      <input
                        type="text"
                        name="badgeNumber"
                        value={formData.badgeNumber}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                        placeholder="e.g., SG-2024-001"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800">Shift</label>
                      <select
                        name="shift"
                        value={formData.shift}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                      >
                        <option value="">Select Shift</option>
                        <option value="Morning (6 AM - 2 PM)">Morning (6 AM - 2 PM)</option>
                        <option value="Evening (2 PM - 10 PM)">Evening (2 PM - 10 PM)</option>
                        <option value="Night (10 PM - 6 AM)">Night (10 PM - 6 AM)</option>
                      </select>
                    </div>
                  </>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Initial Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={handleAddProfile}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Add Person
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="p-4 bg-gray-900 text-white rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-300">Admin Controls:</p>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Edit Permissions: Enabled</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Data Export: Enabled</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Profile Management: Active</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Last Update: {new Date().toLocaleTimeString()}</p>
              <p className="text-sm text-gray-300">All administrative functions operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}