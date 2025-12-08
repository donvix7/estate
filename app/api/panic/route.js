import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendPushNotification } from '@/lib/notifications'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, location, pin } = await request.json()

    // Log panic event
    const panicEvent = await db.panicEvent.create({
      data: {
        userId,
        location,
        verifiedByPin: !!pin,
        status: 'active',
      },
    })

    // Notify security team
    await sendPushNotification({
      title: '🚨 PANIC ALERT',
      body: `Emergency alert from resident ${session.user.name}`,
      data: { 
        eventId: panicEvent.id,
        location,
        userId 
      },
    })

    // Notify admins
    const admins = await db.user.findMany({
      where: { role: 'admin' },
    })

    for (const admin of admins) {
      await sendPushNotification({
        to: admin.id,
        title: 'Emergency Alert',
        body: `Panic button pressed by ${session.user.name}`,
      })
    }

    return NextResponse.json({ 
      success: true, 
      eventId: panicEvent.id,
      message: 'Emergency services notified' 
    })
  } catch (error) {
    console.error('Panic error:', error)
    return NextResponse.json(
      { error: 'Failed to process panic alert' },
      { status: 500 }
    )
  }
}