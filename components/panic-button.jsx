'use client'

import { useState, useEffect } from 'react'

export function PanicButton() {
  const [isPanicking, setIsPanicking] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [showPin, setShowPin] = useState(false)
  const [pin, setPin] = useState('')

  const handlePanic = () => {
    if (!isPanicking) {
      setIsPanicking(true)
      setShowPin(true)
    }
  }

  const handleCancel = () => {
    setIsPanicking(false)
    setShowPin(false)
    setCountdown(5)
    setPin('')
  }

  const handlePinSubmit = () => {
    if (pin === '0000') { // Default emergency PIN
      // Send panic alert
      alert('🚨 PANIC ALERT SENT! Security and Admin notified!')
      setIsPanicking(false)
      setShowPin(false)
      setPin('')
      // Here you would make API call
    } else {
      alert('Incorrect PIN')
    }
  }

  useEffect(() => {
    let timer
    if (isPanicking && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0 && isPanicking) {
      // Auto-trigger without PIN after countdown
      alert(' PANIC ALERT SENT! Security and Admin notified!')
      setIsPanicking(false)
      setCountdown(5)
    }
    return () => clearTimeout(timer)
  }, [isPanicking, countdown])

  return (
    <div className="flex flex-col items-center">
      {showPin ? (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <h3 className="text-red-700 font-semibold mb-4">Emergency Panic System</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Enter Panic PIN (or wait {countdown}s)</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-2 border border-red-300 rounded"
              placeholder="Enter 0000 for demo"
              maxLength="4"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePinSubmit}
              className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Confirm Emergency
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handlePanic}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all ${
            isPanicking 
              ? 'bg-red-700 animate-pulse shadow-lg' 
              : 'bg-red-600 hover:bg-red-700 hover:scale-105'
          }`}
        >
          {isPanicking ? countdown : 'PANIC'}
        </button>
      )}
      <p className="mt-4 text-sm text-gray-600 text-center">
        Press in case of emergency. Alerts security and admin immediately.
      </p>
    </div>
  )
}