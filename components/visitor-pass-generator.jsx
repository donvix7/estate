'use client'

import { useState, useEffect, useRef } from 'react'

// Hardcoded database simulation
const HARDCODED_DATA = {
  passHistory: [],
  entryExitLogs: [],
  blacklist: []
}

// Mock API functions
const mockAPI = {
  // Get pass history
  async getPassHistory() {
    try {
      // Try to fetch from placeholder API
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      const data = await response.json();
      
      // Transform to our format
      return data.map((post, index) => ({
        id: post.id,
        visitorName: `Visitor ${post.id}`,
        phone: `98765${post.id.toString().padStart(5, '0')}`,
        purpose: ['Personal', 'Delivery', 'Service'][index % 3],
        residentName: 'John Doe',
        unitNumber: `A-${101 + index}`,
        passCode: `PASS${post.id.toString().padStart(3, '0')}`,
        pin: Math.floor(1000 + Math.random() * 9000).toString(),
        timestamp: new Date(Date.now() - (index * 86400000)).toISOString(),
        status: ['pending', 'active', 'completed'][index % 3]
      }));
    } catch (error) {
      console.log('Using hardcoded pass history');
      return HARDCODED_DATA.passHistory;
    }
  },

  // Get entry/exit logs
  async getEntryExitLogs() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=3');
      const data = await response.json();
      
      return data.map((comment, index) => ({
        id: comment.id,
        visitor: `Visitor ${comment.id}`,
        type: index % 2 === 0 ? 'entry' : 'exit',
        passCode: `PASS${comment.id.toString().padStart(3, '0')}`,
        timestamp: new Date(Date.now() - (index * 3600000)).toISOString(),
        verifiedBy: index % 2 === 0 ? 'System' : 'Security'
      }));
    } catch (error) {
      console.log('Using hardcoded entry/exit logs');
      return HARDCODED_DATA.entryExitLogs;
    }
  },

  // Save pass to history
  async savePassToHistory(passData) {
    HARDCODED_DATA.passHistory.unshift(passData);
    return { success: true, id: passData.id };
  },

  // Add to blacklist
  async addToBlacklist(visitor) {
    HARDCODED_DATA.blacklist.push(visitor);
    return { success: true };
  },

  // Remove from blacklist
  async removeFromBlacklist(index) {
    HARDCODED_DATA.blacklist.splice(index, 1);
    return { success: true };
  },

  // Log entry/exit
  async logEntryExit(log) {
    HARDCODED_DATA.entryExitLogs.unshift(log);
    return { success: true, id: log.id };
  },

  async getBlacklist() {
    HARDCODED_DATA.blacklist;
    return { success: true };
  },
};

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
  const [blacklistedVisitors, setBlacklistedVisitors] = useState([])
  const [entryExitLogs, setEntryExitLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Timer state for pass expiry
  const [timeLeft, setTimeLeft] = useState(null)
  const timerRef = useRef(null)

  // Initialize component
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [history, blacklist, logs] = await Promise.all([
          mockAPI.getPassHistory(),
          mockAPI.getBlacklist(),
          mockAPI.getEntryExitLogs()
        ])
        
        setPassHistory(history)
        setBlacklistedVisitors(blacklist)
        setEntryExitLogs(logs)
      } catch (error) {
        console.error('Error loading data:', error)
        setBlacklistedVisitors(HARDCODED_DATA.blacklist)
      } finally {
        setIsLoading(false)
      }
    }

    // Set default times
    const now = new Date()
    const arrival = new Date(now.getTime() + 30 * 60000)
    const departure = new Date(arrival.getTime() + 2 * 60 * 60000)

    setFormData(prev => ({
      ...prev,
      expectedArrival: arrival.toISOString().slice(0, 16),
      expectedDeparture: departure.toISOString().slice(0, 16)
    }))

    loadData()

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

    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`
  }

  // Generate visitor pass
  const generatePass = async () => {
    if (!formData.visitorName || !formData.phone) {
      alert('Please fill in visitor name and phone number')
      return
    }

    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(async () => {
      try {
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

        // Save to history via API
        await mockAPI.savePassToHistory(passData)

        // Update local state
        const newHistory = [passData, ...passHistory.slice(0, 9)]
        setPassHistory(newHistory)

        // Log entry
        const logEntry = {
          id: Date.now(),
          type: 'entry',
          visitor: passData.visitorName,
          passCode: passData.passCode,
          timestamp: new Date().toISOString(),
          verifiedBy: 'System'
        }
        await mockAPI.logEntryExit(logEntry)

        // Update logs state
        setEntryExitLogs(prev => [logEntry, ...prev.slice(0, 9)])

        // Start expiry timer
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
      } catch (error) {
        console.error('Error generating pass:', error)
        alert('Failed to generate pass. Please try again.')
      } finally {
        setIsGenerating(false)
      }
    }, 1500)
  }

  // Verify visitor entry
  const verifyEntry = async () => {
    if (!generatedPass) return

    const enteredPin = prompt('Security: Enter visitor PIN for verification:')
    if (enteredPin === generatedPass.pin) {
      setGeneratedPass(prev => ({ ...prev, securityVerified: true, status: 'active' }))
      alert('✅ Visitor verified and allowed entry!')
      
      // Log entry
      const logEntry = {
        id: Date.now(),
        type: 'entry',
        visitor: generatedPass.visitorName,
        passCode: generatedPass.passCode,
        timestamp: new Date().toISOString(),
        verifiedBy: 'Security'
      }
      await mockAPI.logEntryExit(logEntry)
      setEntryExitLogs(prev => [logEntry, ...prev.slice(0, 9)])
    } else {
      alert('❌ Invalid PIN. Access denied.')
    }
  }

  // Mark visitor exit
  const markExit = async () => {
    if (!generatedPass) return
    
    setGeneratedPass(prev => ({ ...prev, status: 'completed' }))
    alert(`Visitor ${generatedPass.visitorName} has checked out.`)
    
    // Log exit
    const logExit = {
      id: Date.now(),
      type: 'exit',
      visitor: generatedPass.visitorName,
      passCode: generatedPass.passCode,
      timestamp: new Date().toISOString(),
      verifiedBy: 'Security'
    }
    await mockAPI.logEntryExit(logExit)
    setEntryExitLogs(prev => [logExit, ...prev.slice(0, 9)])
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
      setTimeLeft(null)
    }
  }

  // Add to blacklist
  const addToBlacklist = async () => {
    if (!formData.visitorName) {
      alert('Please enter visitor name first')
      return
    }

    const reason = prompt('Enter reason for blacklisting:')
    if (reason) {
      const visitor = {
        name: formData.visitorName,
        phone: formData.phone,
        reason,
        added: new Date().toISOString()
      }
      
      await mockAPI.addToBlacklist(visitor)
      setBlacklistedVisitors(prev => [...prev, visitor])
      alert('✅ Visitor added to blacklist')
    }
  }

  // Remove from blacklist
  const removeFromBlacklist = async (index) => {
    await mockAPI.removeFromBlacklist(index)
    setBlacklistedVisitors(prev => prev.filter((_, i) => i !== index))
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                <p className="mt-4 text-gray-700">Loading Visitor Pass Generator...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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

              

              
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}