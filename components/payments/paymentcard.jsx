'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function VisitorPass() {
  const [formData, setFormData] = useState({
    visitorName: '',
    phone: '',
    purpose: '',
    vehicleNumber: '',
    expectedArrival: '',
    expectedDeparture: '',
  })
  const [generatedPass, setGeneratedPass] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const generatePass = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/visitors/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedPass(data.pass)
      }
    } catch (error) {
      console.error('Error generating pass:', error)
    } finally {
      setLoading(false)
    }
  }

  if (generatedPass) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visitor Pass Generated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center">
              <img src={generatedPass.qrCode} alt="Visitor QR Code" className="w-48 h-48" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Pass Code</p>
                <p className="font-bold text-lg">{generatedPass.passCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PIN</p>
                <p className="font-bold text-lg">{generatedPass.pin}</p>
              </div>
            </div>
            <Button onClick={() => setGeneratedPass(null)} variant="outline">
              Generate Another Pass
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Visitor Pass</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="visitorName">Visitor Name</Label>
            <Input
              id="visitorName"
              name="visitorName"
              value={formData.visitorName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="purpose">Purpose of Visit</Label>
            <Input
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="vehicleNumber">Vehicle Number (Optional)</Label>
            <Input
              id="vehicleNumber"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expectedArrival">Expected Arrival</Label>
              <Input
                id="expectedArrival"
                name="expectedArrival"
                type="datetime-local"
                value={formData.expectedArrival}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="expectedDeparture">Expected Departure</Label>
              <Input
                id="expectedDeparture"
                name="expectedDeparture"
                type="datetime-local"
                value={formData.expectedDeparture}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <Button onClick={generatePass} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Visitor Pass'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}