'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/Footer'
import { AlertCircle, ChevronDown, CreditCard, LayoutDashboard, Lock, MessageCircle, User } from 'lucide-react'

export default function EstateRegistrationPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    estateName: '',
    estateType: 'apartment',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Step 2: Management Details
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    managementType: 'owner',
    
    // Step 3: Estate Configuration
    totalUnits: '',
    securityContacts: '',
    amenities: [],
    
    // Step 4: Account Setup
    username: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const features = [
    { title: 'Visitor Management', desc: 'QR codes, logs, approvals', icon:<User />  },
    { title: 'Panic System', desc: 'Emergency alerts & monitoring', icon: <AlertCircle /> },
    { title: 'Digital Payments', desc: 'Dues collection & tracking', icon: <CreditCard /> },
    { title: 'Admin Dashboard', desc: 'Full control & analytics', icon: <LayoutDashboard /> },
    { title: 'Communication', desc: 'Announcements & notifications', icon: <MessageCircle /> },
    { title: 'Security Features', desc: 'Access control & logs', icon: <Lock /> }
  ]
  
  const estateTypes = [
    { value: 'apartment', label: 'Apartment Complex' },
    { value: 'gated', label: 'Gated Community' },
    { value: 'townhouse', label: 'Townhouse Society' },
    { value: 'villa', label: 'Villa Complex' },
    { value: 'cooperative', label: 'Cooperative Housing' }
  ]

  const managementTypes = [
    { value: 'owner', label: 'Self-Managed by Owner' },
    { value: 'association', label: 'Residents Association' },
    { value: 'professional', label: 'Professional Management' }
  ]

  const amenitiesList = [
    'Swimming Pool',
    'Gymnasium',
    'Club House',
    'Children Play Area',
    'Security 24/7',
    'Power Backup',
    'Garden/Park',
    'Sports Complex',
    'Visitor Parking'
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const validateStep = () => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.estateName.trim()) newErrors.estateName = 'Estate name is required'
      if (!formData.address.trim()) newErrors.address = 'Address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
    }

    if (step === 2) {
      if (!formData.adminName.trim()) newErrors.adminName = 'Admin name is required'
      if (!formData.adminEmail.trim()) newErrors.adminEmail = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) newErrors.adminEmail = 'Invalid email format'
      if (!formData.adminPhone.trim()) newErrors.adminPhone = 'Phone number is required'
      else if (!/^\d{10}$/.test(formData.adminPhone)) newErrors.adminPhone = 'Invalid phone number'
    }

    if (step === 3) {
      if (!formData.totalUnits || formData.totalUnits < 1) newErrors.totalUnits = 'Number of units is required'
      if (!formData.securityContacts.trim()) newErrors.securityContacts = 'Security contact is required'
    }

    if (step === 4) {
      if (!formData.username.trim()) newErrors.username = 'Username is required'
      if (!formData.password) newErrors.password = 'Password is required'
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateStep()) {
      setIsSubmitting(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Redirect to success page or dashboard
        router.push('/login')
      } catch (error) {
        console.error('Registration failed:', error)
        setErrors({ submit: 'Registration failed. Please try again.' })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const progressSteps = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Management' },
    { number: 3, label: 'Configuration' },
    { number: 4, label: 'Account' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />

      {/* Main Content */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              Register Your Estate
            </h1>
            <p className="text-xl text-gray-300">
              Join thousands of secure communities using EstateSecure
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {progressSteps.map((item, index) => (
                <div key={item.number} className="flex items-center gap-3">
                  <div
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-500 transform hover:scale-110 ${
                      step >= item.number
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-blue-400 shadow-lg shadow-blue-500/30'
                        : 'bg-gray-800 text-gray-400 border-gray-700'
                    }`}
                  >
                    {item.number}
                    {step === item.number && (
                      <div className="absolute -inset-1 rounded-full border-2 border-blue-400 animate-ping opacity-50"></div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${step >= item.number ? 'text-cyan-300' : 'text-gray-500'}`}>
                      Step {item.number}
                    </span>
                    <span className={`font-semibold ${step >= item.number ? 'text-white' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div className="hidden md:block ml-4 w-24 h-0.5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 md:p-10 transition-all duration-500 hover:border-gray-600/50">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-8 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">1</span>
                    Basic Estate Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">
                        Estate Name *
                      </label>
                      <input
                        type="text"
                        name="estateName"
                        value={formData.estateName}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-lg bg-gray-900/50 border focus:outline-none transition-all ${
                          errors.estateName
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                            : 'border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30'
                        } text-white placeholder-gray-500`}
                        placeholder="e.g., Sunshine Residency"
                      />
                      {errors.estateName && (
                        <p className="text-red-400 text-sm mt-1">{errors.estateName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">
                        Estate Type *
                      </label>
                      <div className="relative">
                        <select
                          name="estateType"
                          value={formData.estateType}
                          onChange={handleChange}
                          className="w-full p-4 rounded-lg bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white appearance-none"
                        >
                          {estateTypes.map(type => (
                            <option key={type.value} value={type.value} className="bg-gray-800">
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-gray-300 font-medium">
                        Complete Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full p-4 rounded-lg bg-gray-900/50 border focus:outline-none transition-all ${
                          errors.address
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                            : 'border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30'
                        } text-white placeholder-gray-500 resize-none`}
                        placeholder="Full address including landmark"
                      />
                      {errors.address && (
                        <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-lg bg-gray-900/50 border focus:outline-none transition-all ${
                          errors.city
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                            : 'border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30'
                        } text-white placeholder-gray-500`}
                        placeholder="Enter city"
                      />
                      {errors.city && (
                        <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full p-4 rounded-lg bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white placeholder-gray-500"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Management Details */}
              {step === 2 && (
                <div className="space-y-8 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full border border-cyan-500 text-cyan-500 flex items-center justify-center">2</span>
                    Management Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">
                        Primary Admin Name *
                      </label>
                      <input
                        type="text"
                        name="adminName"
                        value={formData.adminName}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-lg bg-gray-900/50 border focus:outline-none transition-all ${
                          errors.adminName
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                            : 'border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30'
                        } text-white placeholder-gray-500`}
                        placeholder="Full name"
                      />
                      {errors.adminName && (
                        <p className="text-red-400 text-sm mt-1">{errors.adminName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">
                        Management Type *
                      </label>
                      <div className="relative">
                        <select
                          name="managementType"
                          value={formData.managementType}
                          onChange={handleChange}
                          className="w-full p-4 rounded-lg bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white appearance-none"
                        >
                          {managementTypes.map(type => (
                            <option key={type.value} value={type.value} className="bg-gray-800">
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">
                        Admin Email *
                      </label>
                      <input
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-lg bg-gray-900/50 border focus:outline-none transition-all ${
                          errors.adminEmail
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                            : 'border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30'
                        } text-white placeholder-gray-500`}
                        placeholder="admin@estate.com"
                      />
                      {errors.adminEmail && (
                        <p className="text-red-400 text-sm mt-1">{errors.adminEmail}</p>
                      )}
                    </div>

<div className="flex">
  <div className="relative">
    <select
      name="countryCode"
      value={formData.countryCode}
      onChange={handleChange}
      className="h-full px-4 rounded-l-lg bg-gray-900/50 border border-gray-700 border-r-0 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-white appearance-none"
    >
      <option value="+234">+234</option>
      <option value="+91">+91</option>
      <option value="+1">+1</option>
    </select>
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </div>
  </div>
  <input
    type="tel"
    name="adminPhone"
    value={formData.adminPhone}
    onChange={handleChange}
    className={`flex-1 p-4 rounded-r-lg bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all ${
      errors.adminPhone ? 'border-red-500 focus:ring-red-500/30' : ''
    } text-white placeholder-gray-500`}
    placeholder="10-digit mobile number"
    maxLength="10"
  />
</div>
                  </div>
                </div>
              )}

              {/* Step 3: Estate Configuration */}
              {step === 3 && (
                <div className="space-y-8 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">3</span>
                    Estate Configuration
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">
                        Total Residential Units *
                      </label>
                      <input
                        type="number"
                        name="totalUnits"
                        value={formData.totalUnits}
                        onChange={handleChange}
                        min="1"
                        className={`w-full p-4 rounded-lg bg-gray-900/50 border focus:outline-none transition-all ${
                          errors.totalUnits
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                            : 'border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30'
                        } text-white placeholder-gray-500`}
                        placeholder="e.g., 100"
                      />
                      {errors.totalUnits && (
                        <p className="text-red-400 text-sm mt-1">{errors.totalUnits}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">
                        Security Contact Number *
                      </label>
                      <input
                        type="tel"
                        name="securityContacts"
                        value={formData.securityContacts}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-lg bg-gray-900/50 border focus:outline-none transition-all ${
                          errors.securityContacts
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                            : 'border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30'
                        } text-white placeholder-gray-500`}
                        placeholder="Security desk contact"
                      />
                      {errors.securityContacts && (
                        <p className="text-red-400 text-sm mt-1">{errors.securityContacts}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-gray-300 font-medium">
                      Select Available Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {amenitiesList.map(amenity => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => handleAmenityChange(amenity)}
                          className={`p-3 rounded-lg border transition-all duration-300 transform hover:scale-105 ${
                            formData.amenities.includes(amenity)
                              ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/20'
                              : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Account Setup */}
              {step === 4 && (
                <div className="space-y-8 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">4</span>
                    Account Setup
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">
                        Choose Username *
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-lg bg-gray-900/50 border focus:outline-none transition-all ${
                          errors.username
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                            : 'border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30'
                        } text-white placeholder-gray-500`}
                        placeholder="Choose unique username"
                      />
                      {errors.username && (
                        <p className="text-red-400 text-sm mt-1">{errors.username}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-lg bg-gray-900/50 border focus:outline-none transition-all ${
                          errors.password
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                            : 'border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30'
                        } text-white placeholder-gray-500`}
                        placeholder="At least 8 characters"
                      />
                      {errors.password && (
                        <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-lg bg-gray-900/50 border focus:outline-none transition-all ${
                          errors.confirmPassword
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                            : 'border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30'
                        } text-white placeholder-gray-500`}
                        placeholder="Re-enter password"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-900/30 border border-gray-700">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyan-500 focus:ring-cyan-500/30"
                      />
                      <label htmlFor="termsAccepted" className="text-gray-300 flex-1">
                        I agree to the{' '}
                        <a href="/terms" className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline">
                          Terms of Service
                        </a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline">
                          Privacy Policy
                        </a>
                        . I confirm that I am an authorized representative of this estate.
                      </label>
                    </div>
                    {errors.termsAccepted && (
                      <p className="mt-2 text-red-400 text-sm">{errors.termsAccepted}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 pt-8 border-t border-gray-700/50">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800/50 font-medium transition-all duration-300 hover:border-gray-500"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </span>
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 font-medium shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      Continue
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-10 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:from-emerald-700 hover:to-teal-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Complete Registration
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Features Preview */}
          <div className="mt-12 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
            <h3 className="text-2xl font-bold mb-8 text-white text-center">
              What You'll Get Access To
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex flex-col justify-center bg-gray-800/30 p-5 rounded-xl border border-gray-700/50 transition-all duration-300 hover:border-cyan-500/30 hover:bg-gray-800/50 hover:transform hover:-translate-y-1 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl group-hover:scale-110 text-gray-300 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-gray-400 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}