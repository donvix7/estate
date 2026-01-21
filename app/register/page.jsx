'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/Footer'
import { 
  Building, 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Lock, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react'

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
    countryCode: '+234', // Default
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
  const [submitError, setSubmitError] = useState('')
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
    'Swimming Pool', 'Gymnasium', 'Club House', 'Children Play Area',
    'Security 24/7', 'Power Backup', 'Garden/Park', 'Sports Complex', 'Visitor Parking'
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
    setSubmitError('')
    
    if (validateStep()) {
      setIsSubmitting(true)
      try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed')
        }
        
        // Redirect to success page or login
        router.push('/login?registered=true')
      } catch (error) {
        console.error('Registration failed:', error)
        setSubmitError(error.message || 'Registration failed. Please try again.')
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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-100 overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

      <Navigation />

      <main className="relative z-10 pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Register Your </span>
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                Estate
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Join thousands of secure communities today.</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center relative">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-800 rounded-full -z-10"></div>
                
                {/* Active Line Progress - dynamic width based on step */}
                <div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full -z-10 transition-all duration-500"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                ></div>

              {progressSteps.map((item) => (
                <div key={item.number} className="flex flex-col items-center gap-2">
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 border-2 ${
                        step >= item.number
                        ? 'bg-gray-900 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                        : 'bg-gray-900 border-gray-700 text-gray-500'
                    } ${step === item.number ? 'scale-110' : ''}`}
                  >
                    {step > item.number ? <CheckCircle className="w-6 h-6" /> : item.number}
                  </div>
                  <span className={`text-sm font-medium ${step >= item.number ? 'text-cyan-300' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: BASIC INFO */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Building className="text-cyan-400" /> Estate Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Estate Name</label>
                      <input
                        type="text"
                        name="estateName"
                        value={formData.estateName}
                        onChange={handleChange}
                        className={`w-full p-4 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.estateName ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                        }`}
                        placeholder="e.g. Royal Gardens"
                      />
                      {errors.estateName && <p className="text-red-400 text-xs mt-1">{errors.estateName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Estate Type</label>
                      <div className="relative">
                        <select
                            name="estateType"
                            value={formData.estateType}
                            onChange={handleChange}
                            className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 appearance-none text-gray-300"
                        >
                            {estateTypes.map(type => (
                            <option key={type.value} value={type.value} className="bg-gray-900">{type.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ArrowRight className="w-4 h-4 text-gray-500 rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-300">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full p-4 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                            errors.address ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                        }`}
                        placeholder="Full street address"
                      />
                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full p-4 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.city ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                        }`}
                        placeholder="City"
                      />
                      {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        placeholder="State"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: MANAGEMENT */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="text-cyan-400" /> Management Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Admin Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            name="adminName"
                            value={formData.adminName}
                            onChange={handleChange}
                            className={`w-full pl-12 p-4 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                errors.adminName ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                            }`}
                            placeholder="Full Name"
                        />
                      </div>
                      {errors.adminName && <p className="text-red-400 text-xs mt-1">{errors.adminName}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Management Type</label>
                        <div className="relative">
                            <select
                                name="managementType"
                                value={formData.managementType}
                                onChange={handleChange}
                                className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 appearance-none text-gray-300"
                            >
                                {managementTypes.map(type => (
                                <option key={type.value} value={type.value} className="bg-gray-900">{type.label}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ArrowRight className="w-4 h-4 text-gray-500 rotate-90" />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-300">Admin Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="email"
                            name="adminEmail"
                            value={formData.adminEmail}
                            onChange={handleChange}
                            className={`w-full pl-12 p-4 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                errors.adminEmail ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                            }`}
                            placeholder="admin@estate.com"
                        />
                      </div>
                      {errors.adminEmail && <p className="text-red-400 text-xs mt-1">{errors.adminEmail}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-300">Admin Phone</label>
                      <div className="flex">
                        <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className="bg-gray-800 border border-gray-700 border-r-0 rounded-l-xl px-3 focus:outline-none text-gray-300"
                        >
                            <option value="+234">+234</option>
                            <option value="+1">+1</option>
                            <option value="+91">+91</option>
                        </select>
                        <div className="relative flex-1">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="tel"
                                name="adminPhone"
                                value={formData.adminPhone}
                                onChange={handleChange}
                                className={`w-full pl-12 p-4 bg-gray-900/50 border rounded-r-xl focus:outline-none focus:ring-2 transition-all ${
                                    errors.adminPhone ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                                }`}
                                placeholder="PhoneNumber"
                            />
                        </div>
                      </div>
                      {errors.adminPhone && <p className="text-red-400 text-xs mt-1">{errors.adminPhone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CONFIGURATION */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="text-cyan-400" /> Configuration
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Total Units</label>
                        <input
                            type="number"
                            name="totalUnits"
                            value={formData.totalUnits}
                            onChange={handleChange}
                            min="1"
                            className={`w-full p-4 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                errors.totalUnits ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                            }`}
                            placeholder="Number of houses/flats"
                        />
                        {errors.totalUnits && <p className="text-red-400 text-xs mt-1">{errors.totalUnits}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Security Desk Phone</label>
                        <input
                            type="tel"
                            name="securityContacts"
                            value={formData.securityContacts}
                            onChange={handleChange}
                            className={`w-full p-4 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                errors.securityContacts ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                            }`}
                            placeholder="Emergency contact"
                        />
                        {errors.securityContacts && <p className="text-red-400 text-xs mt-1">{errors.securityContacts}</p>}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <label className="text-sm font-medium text-gray-300">Amenities & Facilities</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {amenitiesList.map(amenity => (
                            <button
                                key={amenity}
                                type="button"
                                onClick={() => handleAmenityChange(amenity)}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                                    formData.amenities.includes(amenity)
                                    ? 'bg-cyan-900/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                                    : 'bg-gray-800/30 border-gray-700 text-gray-400 hover:border-gray-600'
                                }`}
                            >
                                {amenity}
                            </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: ACCOUNT */}
              {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Lock className="text-cyan-400" /> Account Setup
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full p-4 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                errors.username ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                            }`}
                            placeholder="Choose a unique username"
                        />
                        {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full p-4 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                    errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                                }`}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full p-4 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                                }`}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div className="pt-4">
                        <label className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/30 border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors">
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                checked={formData.termsAccepted}
                                onChange={handleChange}
                                className="mt-1 w-5 h-5 rounded bg-gray-800 border-gray-600 text-cyan-500 focus:ring-cyan-500/40"
                            />
                            <span className="text-sm text-gray-400">
                                I agree to the <span className="text-cyan-400 hover:underline">Terms of Service</span> and <span className="text-cyan-400 hover:underline">Privacy Policy</span>. I confirm I am an authorized representative of this estate.
                            </span>
                        </label>
                        {errors.termsAccepted && <p className="text-red-400 text-xs mt-2 ml-1">{errors.termsAccepted}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 pt-6 border-t border-gray-800">
                <button
                    type="button"
                    onClick={prevStep}
                    disabled={step === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                        step === 1 
                        ? 'opacity-0 cursor-default' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {step < 4 ? (
                    <button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1"
                    >
                        Continue <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl font-semibold shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        {isSubmitting ? 'Registering...' : 'Complete Registration'}
                    </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}