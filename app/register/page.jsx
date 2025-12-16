'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    'Parking Facility',
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
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'
      else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode format'
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ES</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">EstateSecure</h1>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 border-2 border-blue-700 text-blue-700 rounded-lg hover:bg-blue-50 font-medium transition-all"
            >
              Already Registered?
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Register Your Estate
            </h1>
            <p className="text-xl text-gray-700">
              Join thousands of secure communities using EstateSecure
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center space-x-8">
              {progressSteps.map((item) => (
                <div key={item.number} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${
                      step >= item.number
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-gray-400 border-gray-300'
                    }`}
                  >
                    {item.number}
                  </div>
                  <span className={`ml-3 font-medium ${step >= item.number ? 'text-blue-700' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                  {item.number < 4 && (
                    <div className={`ml-8 w-16 h-0.5 ${step > item.number ? 'bg-blue-700' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Estate Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Estate Name *
                      </label>
                      <input
                        type="text"
                        name="estateName"
                        value={formData.estateName}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.estateName
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="e.g., Sunshine Residency"
                      />
                      {errors.estateName && (
                        <p className="mt-2 text-red-600 text-sm">{errors.estateName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Estate Type *
                      </label>
                      <select
                        name="estateType"
                        value={formData.estateType}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white"
                      >
                        {estateTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-800 font-medium mb-2">
                        Complete Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.address
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="Full address including landmark"
                      />
                      {errors.address && (
                        <p className="mt-2 text-red-600 text-sm">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.city
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="Enter city"
                      />
                      {errors.city && (
                        <p className="mt-2 text-red-600 text-sm">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        placeholder="Enter state"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.pincode
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="6-digit pincode"
                        maxLength="6"
                      />
                      {errors.pincode && (
                        <p className="mt-2 text-red-600 text-sm">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Management Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Management Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Primary Admin Name *
                      </label>
                      <input
                        type="text"
                        name="adminName"
                        value={formData.adminName}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.adminName
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="Full name"
                      />
                      {errors.adminName && (
                        <p className="mt-2 text-red-600 text-sm">{errors.adminName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Management Type *
                      </label>
                      <select
                        name="managementType"
                        value={formData.managementType}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white"
                      >
                        {managementTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Admin Email *
                      </label>
                      <input
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.adminEmail
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="admin@estate.com"
                      />
                      {errors.adminEmail && (
                        <p className="mt-2 text-red-600 text-sm">{errors.adminEmail}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Admin Phone *
                      </label>
                      <input
                        type="tel"
                        name="adminPhone"
                        value={formData.adminPhone}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.adminPhone
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="10-digit mobile number"
                        maxLength="10"
                      />
                      {errors.adminPhone && (
                        <p className="mt-2 text-red-600 text-sm">{errors.adminPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Estate Configuration */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Estate Configuration</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Total Residential Units *
                      </label>
                      <input
                        type="number"
                        name="totalUnits"
                        value={formData.totalUnits}
                        onChange={handleChange}
                        min="1"
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.totalUnits
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="e.g., 100"
                      />
                      {errors.totalUnits && (
                        <p className="mt-2 text-red-600 text-sm">{errors.totalUnits}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Security Contact Number *
                      </label>
                      <input
                        type="tel"
                        name="securityContacts"
                        value={formData.securityContacts}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.securityContacts
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="Security desk contact"
                      />
                      {errors.securityContacts && (
                        <p className="mt-2 text-red-600 text-sm">{errors.securityContacts}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-800 font-medium mb-4">
                      Select Available Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {amenitiesList.map(amenity => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => handleAmenityChange(amenity)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            formData.amenities.includes(amenity)
                              ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
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
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Setup</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Choose Username *
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.username
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="Choose unique username"
                      />
                      {errors.username && (
                        <p className="mt-2 text-red-600 text-sm">{errors.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.password
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="At least 8 characters"
                      />
                      {errors.password && (
                        <p className="mt-2 text-red-600 text-sm">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-800 font-medium mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.confirmPassword
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="Re-enter password"
                      />
                      {errors.confirmPassword && (
                        <p className="mt-2 text-red-600 text-sm">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="mt-1 mr-3"
                      />
                      <label htmlFor="termsAccepted" className="text-gray-700">
                        I agree to the{' '}
                        <a href="/terms" className="text-blue-700 hover:text-blue-800 font-medium">
                          Terms of Service
                        </a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-blue-700 hover:text-blue-800 font-medium">
                          Privacy Policy
                        </a>
                        . I confirm that I am an authorized representative of this estate.
                      </label>
                    </div>
                    {errors.termsAccepted && (
                      <p className="mt-2 text-red-600 text-sm">{errors.termsAccepted}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 pt-8 border-t border-gray-200">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium shadow-md transition-all"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-10 py-3 bg-green-600 text-white rounded-lg font-medium shadow-md transition-all ${
                      isSubmitting
                        ? 'opacity-75 cursor-not-allowed'
                        : 'hover:bg-green-700'
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
                      'Complete Registration'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Features Preview */}
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 text-center">
              What You'll Get Access To
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Visitor Management', desc: 'QR codes, logs, approvals' },
                { title: 'Panic System', desc: 'Emergency alerts & monitoring' },
                { title: 'Digital Payments', desc: 'Dues collection & tracking' },
                { title: 'Admin Dashboard', desc: 'Full control & analytics' },
                { title: 'Communication', desc: 'Announcements & notifications' },
                { title: 'Security Features', desc: 'Access control & logs' }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                  <h4 className="font-semibold text-blue-700 mb-2">{feature.title}</h4>
                  <p className="text-gray-700 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Assistance?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Our team is ready to help you set up your estate. Contact us for personalized onboarding support.
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-all"
          >
            Contact Support
          </button>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400">© 2024 EstateSecure. Secure Estate Management Platform</p>
          </div>
        </div>
      </footer>
    </div>
  )
}