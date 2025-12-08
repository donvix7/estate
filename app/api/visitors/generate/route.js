import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import QRCode from 'qrcode'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      visitorName, 
      phone, 
      purpose, 
      vehicleNumber,
      expectedArrival,
      expectedDeparture 
    } = await request.json()

    // Generate unique pass code
    const passCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const pin = Math.floor(1000 + Math.random() * 9000).toString()

    // Create visitor pass
    const visitorPass = await db.visitorPass.create({
      data: {
        residentId: session.user.id,
        visitorName,
        phone,
        purpose,
        vehicleNumber,
        expectedArrival: new Date(expectedArrival),
        expectedDeparture: new Date(expectedDeparture),
        passCode,
        pin,
        status: 'pending',
      },
    })

    // Generate QR code
    const qrData = JSON.stringify({
      id: visitorPass.id,
      passCode,
      resident: session.user.name,
      unit: session.user.unit,
    })

    const qrCode = await QRCode.toDataURL(qrData)

    return NextResponse.json({
      success: true,
      pass: {
        ...visitorPass,
        qrCode,
      },
    })
  } catch (error) {
    console.error('Visitor pass error:', error)
    return NextResponse.json(
      { error: 'Failed to generate visitor pass' },
      { status: 500 }
    )
  }
}