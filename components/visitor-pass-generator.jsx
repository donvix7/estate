'use client'

import { useState, useEffect, useRef } from 'react'

export function VisitorPassGenerator() {
  // Form state
  const [formData, setFormData] = useState({
    visitorName: '',
    phone: '',
    purpose: 'Personal',
    vehicleNumber: '',
    expectedArrival: '',
    expectedDeparture: '',
    residentName: 'John Doe',
    unitNumber: 'A-101'
  })

  // Generated pass state
  const [generatedPass, setGeneratedPass] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrCodeData, setQrCodeData] = useState('')
  const [passHistory, setPassHistory] = useState([])
  const [blacklistedVisitors, setBlacklistedVisitors] = useState([
    { name: 'Robert Suspicious', phone: '9870012345', reason: 'Security Violation' },
    { name: 'Jane Unauthorized', phone: '9870012346', reason: 'Previous Misconduct' }
  ])

  // Timer state for pass expiry
  const [timeLeft, setTimeLeft] = useState(null)
  const timerRef = useRef(null)

  // Initialize default times
  useEffect(() => {
    const now = new Date()
    const arrival = new Date(now.getTime() + 30 * 60000) // 30 minutes from now
    const departure = new Date(arrival.getTime() + 2 * 60 * 60000) // 2 hours later

    setFormData(prev => ({
      ...prev,
      expectedArrival: arrival.toISOString().slice(0, 16),
      expectedDeparture: departure.toISOString().slice(0, 16)
    }))

    // Load history from localStorage
    const savedHistory = localStorage.getItem('visitorPassHistory')
    if (savedHistory) {
      setPassHistory(JSON.parse(savedHistory))
    }

    // Load blacklist from localStorage
    const savedBlacklist = localStorage.getItem('visitorBlacklist')
    if (savedBlacklist) {
      setBlacklistedVisitors(JSON.parse(savedBlacklist))
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Check if visitor is blacklisted on name/phone change
    if ((name === 'visitorName' || name === 'phone') && value) {
      checkBlacklist(value, name === 'visitorName' ? 'name' : 'phone')
    }
  }

  // Check if visitor is blacklisted
  const checkBlacklist = (value, field) => {
    const isBlacklisted = blacklistedVisitors.some(visitor => 
      field === 'name' 
        ? visitor.name.toLowerCase().includes(value.toLowerCase())
        : visitor.phone.includes(value)
    )
    
    if (isBlacklisted) {
      alert('⚠️ WARNING: This visitor is on the blacklist!')
    }
  }

  // Generate QR code data URL
  const generateQRCode = (passData) => {
    const qrData = JSON.stringify({
      passId: passData.id,
      visitor: passData.visitorName,
      resident: passData.residentName,
      unit: passData.unitNumber,
      purpose: passData.purpose,
      passCode: passData.passCode,
      generated: passData.timestamp
    })

    // Using a simple QR code generation API (free tier)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`
  }

  // Generate visitor pass
  const generatePass = () => {
    if (!formData.visitorName || !formData.phone) {
      alert('Please fill in visitor name and phone number')
      return
    }

    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      const passCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      const pin = Math.floor(1000 + Math.random() * 9000).toString()
      const timestamp = new Date().toISOString()
      const id = Date.now().toString()

      const passData = {
        id,
        ...formData,
        passCode,
        pin,
        timestamp,
        status: 'pending',
        securityVerified: false
      }

      const qrCodeUrl = generateQRCode(passData)
      
      setGeneratedPass(passData)
      setQrCodeData(qrCodeUrl)
      setIsGenerating(false)

      // Add to history
      const newHistory = [passData, ...passHistory.slice(0, 9)] // Keep last 10
      setPassHistory(newHistory)
      localStorage.setItem('visitorPassHistory', JSON.stringify(newHistory))

      // Log entry
      logEntryExit('entry', passData)

      // Start expiry timer (2 hours default)
      const expiryTime = new Date(formData.expectedDeparture).getTime() - Date.now()
      if (expiryTime > 0) {
        setTimeLeft(Math.floor(expiryTime / 1000))
        
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current)
              alert(`Pass for ${formData.visitorName} has expired!`)
              return null
            }
            return prev - 1
          })
        }, 1000)
      }

      alert(`✅ Visitor pass generated!\nPass Code: ${passCode}\nPIN: ${pin}`)
    }, 1500)
  }

  // Log entry/exit
  const logEntryExit = (type, passData) => {
    const log = {
      id: Date.now(),
      type,
      visitor: passData.visitorName,
      passCode: passData.passCode,
      timestamp: new Date().toISOString(),
      verifiedBy: type === 'entry' ? 'System' : 'Security'
    }

    const logs = JSON.parse(localStorage.getItem('entryExitLogs') || '[]')
    logs.unshift(log)
    localStorage.setItem('entryExitLogs', JSON.stringify(logs))
  }

  // Verify visitor entry
  const verifyEntry = () => {
    if (!generatedPass) return

    const enteredPin = prompt('Security: Enter visitor PIN for verification:')
    if (enteredPin === generatedPass.pin) {
      setGeneratedPass(prev => ({ ...prev, securityVerified: true, status: 'active' }))
      alert('✅ Visitor verified and allowed entry!')
      logEntryExit('entry', generatedPass)
    } else {
      alert('❌ Invalid PIN. Access denied.')
    }
  }

  // Mark visitor exit
  const markExit = () => {
    if (!generatedPass) return
    
    setGeneratedPass(prev => ({ ...prev, status: 'completed' }))
    alert(`Visitor ${generatedPass.visitorName} has checked out.`)
    logEntryExit('exit', generatedPass)
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
      setTimeLeft(null)
    }
  }

  // Add to blacklist
  const addToBlacklist = () => {
    if (!formData.visitorName) {
      alert('Please enter visitor name first')
      return
    }

    const reason = prompt('Enter reason for blacklisting:')
    if (reason) {
      const newBlacklist = [
        ...blacklistedVisitors,
        {
          name: formData.visitorName,
          phone: formData.phone,
          reason,
          added: new Date().toISOString()
        }
      ]
      
      setBlacklistedVisitors(newBlacklist)
      localStorage.setItem('visitorBlacklist', JSON.stringify(newBlacklist))
      alert('✅ Visitor added to blacklist')
    }
  }

  // Remove from blacklist
  const removeFromBlacklist = (index) => {
    const newBlacklist = [...blacklistedVisitors]
    newBlacklist.splice(index, 1)
    setBlacklistedVisitors(newBlacklist)
    localStorage.setItem('visitorBlacklist', JSON.stringify(newBlacklist))
  }

  // Share pass
  const sharePass = () => {
    if (!generatedPass) return

    const message = `Visitor Pass for ${generatedPass.visitorName}:
Pass Code: ${generatedPass.passCode}
PIN: ${generatedPass.pin}
Resident: ${generatedPass.residentName} (${generatedPass.unitNumber})
Purpose: ${generatedPass.purpose}
Valid until: ${new Date(generatedPass.expectedDeparture).toLocaleString()}`

    if (navigator.share) {
      navigator.share({
        title: 'Visitor Pass',
        text: message,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(message)
      alert('Pass details copied to clipboard!')
    }
  }

  // Format time
  const formatTime = (seconds) => {
    if (!seconds) return null
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Load from history
  const loadFromHistory = (pass) => {
    setFormData({
      visitorName: pass.visitorName,
      phone: pass.phone,
      purpose: pass.purpose,
      vehicleNumber: pass.vehicleNumber || '',
      expectedArrival: pass.expectedArrival || '',
      expectedDeparture: pass.expectedDeparture || '',
      residentName: pass.residentName,
      unitNumber: pass.unitNumber
    })
    alert(`Loaded ${pass.visitorName}'s details from history`)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔐</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Visitor Pass Generator</h2>
              <p className="text-blue-200 font-medium">Generate QR codes and PINs for estate visitors</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Form */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3">Resident Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Resident Name</label>
                    <input
                      type="text"
                      name="residentName"
                      value={formData.residentName}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Unit Number</label>
                    <input
                      type="text"
                      name="unitNumber"
                      value={formData.unitNumber}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Visitor Details</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Visitor Name *</label>
                  <input
                    type="text"
                    name="visitorName"
                    value={formData.visitorName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Purpose of Visit</label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Service">Service/Maintenance</option>
                    <option value="Guest">Guest</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Vehicle Number (Optional)</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    placeholder="Vehicle registration number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Expected Arrival</label>
                    <input
                      type="datetime-local"
                      name="expectedArrival"
                      value={formData.expectedArrival}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Expected Departure</label>
                    <input
                      type="datetime-local"
                      name="expectedDeparture"
                      value={formData.expectedDeparture}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={generatePass}
                  disabled={isGenerating || !formData.visitorName || !formData.phone}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                      Generating Pass...
                    </span>
                  ) : 'Generate Visitor Pass'}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={addToBlacklist}
                    className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                  >
                    Add to Blacklist
                  </button>
                  <button
                    onClick={() => {
                      setFormData({
                        visitorName: '',
                        phone: '',
                        purpose: 'Personal',
                        vehicleNumber: '',
                        expectedArrival: formData.expectedArrival,
                        expectedDeparture: formData.expectedDeparture,
                        residentName: formData.residentName,
                        unitNumber: formData.unitNumber
                      })
                    }}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Clear Form
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Generated Pass & Features */}
            <div className="space-y-6">
              {/* Generated Pass Display */}
              {generatedPass && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">Visitor Pass</h3>
                      <p className="text-blue-800 font-medium">#{generatedPass.passCode}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      generatedPass.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      generatedPass.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {generatedPass.status.toUpperCase()}
                    </span>
                  </div>

                  {/* QR Code Display */}
                  <div className="flex flex-col items-center mb-4">
                    {qrCodeData && (
                      <div className="relative">
                        <img 
                          src={qrCodeData} 
                          alt="QR Code" 
                          className="w-48 h-48 border-4 border-white shadow-lg rounded-lg"
                        />
                        {timeLeft && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                            Expires in: {formatTime(timeLeft)}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Pass Code</p>
                        <p className="text-2xl font-bold font-mono text-gray-900">{generatedPass.passCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Entry PIN</p>
                        <p className="text-2xl font-bold font-mono text-gray-900">{generatedPass.pin}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pass Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-800">Visitor:</span>
                      <span className="font-bold text-gray-900">{generatedPass.visitorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Phone:</span>
                      <span className="font-bold text-gray-900">{generatedPass.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Purpose:</span>
                      <span className="font-bold text-gray-900">{generatedPass.purpose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Resident:</span>
                      <span className="font-bold text-gray-900">{generatedPass.residentName} ({generatedPass.unitNumber})</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={verifyEntry}
                      disabled={generatedPass.securityVerified}
                      className={`py-2.5 rounded-lg font-medium ${
                        generatedPass.securityVerified
                          ? 'bg-green-100 text-green-800 cursor-default border border-green-200'
                          : 'bg-blue-700 text-white hover:bg-blue-800 shadow-md'
                      }`}
                    >
                      {generatedPass.securityVerified ? '✓ Verified' : 'Verify Entry'}
                    </button>
                    <button
                      onClick={markExit}
                      className="py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-md"
                    >
                      Mark Exit
                    </button>
                    <button
                      onClick={sharePass}
                      className="py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-md col-span-2"
                    >
                      Share Pass
                    </button>
                  </div>
                </div>
              )}

              {/* Blacklist Section */}
              <div className="bg-red-50 border border-red-300 rounded-xl p-4">
                <h4 className="font-bold text-red-900 mb-3">Blacklisted Visitors</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {blacklistedVisitors.length === 0 ? (
                    <p className="text-gray-700 text-sm">No blacklisted visitors</p>
                  ) : (
                    blacklistedVisitors.map((visitor, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{visitor.name}</p>
                          <p className="text-xs text-gray-700 mt-1">{visitor.reason}</p>
                        </div>
                        <button
                          onClick={() => removeFromBlacklist(index)}
                          className="text-xs bg-red-100 text-red-800 px-3 py-1.5 rounded hover:bg-red-200 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent History */}
              {passHistory.length > 0 && (
                <div className="bg-gray-50 border border-gray-300 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-3">Recent Passes</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {passHistory.slice(0, 5).map((pass, index) => (
                      <div 
                        key={index}
                        onClick={() => loadFromHistory(pass)}
                        className="p-3 bg-white rounded-lg border cursor-pointer hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-gray-900">{pass.visitorName}</span>
                          <span className="text-xs font-mono bg-gray-100 text-gray-900 px-2 py-1 rounded border">
                            {pass.passCode}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 mt-1">
                          {new Date(pass.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Entry/Exit Logs Preview */}
          <div className="mt-8 bg-white border border-gray-300 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Recent Entry/Exit Logs</h4>
            <div className="space-y-3">
              {(() => {
                const logs = JSON.parse(localStorage.getItem('entryExitLogs') || '[]')
                return logs.slice(0, 3).map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border-b border-gray-200">
                    <div>
                      <span className="font-medium text-gray-900">{log.visitor}</span>
                      <span className={`ml-2 text-xs px-3 py-1.5 rounded-full font-medium ${
                        log.type === 'entry' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 font-medium">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              })()}
            </div>
            <button
              onClick={() => {
                const logs = JSON.parse(localStorage.getItem('entryExitLogs') || '[]')
                if (logs.length > 0) {
                  alert(`Total logs: ${logs.length}\nLast entry: ${logs[0]?.visitor} at ${new Date(logs[0]?.timestamp).toLocaleString()}`)
                } else {
                  alert('No logs available')
                }
              }}
              className="w-full mt-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium"
            >
              View All Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}