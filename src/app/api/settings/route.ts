import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/settings - Return restaurant settings
export async function GET() {
  try {
    const [settings, deliveryZones] = await Promise.all([
      db.restaurantSettings.findFirst(),
      db.deliveryZone.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Restaurant settings not found' },
        { status: 404 }
      )
    }

    // Parse opening hours JSON
    let openingHours = {}
    try {
      openingHours = JSON.parse(settings.openingHours)
    } catch {
      openingHours = {}
    }

    return NextResponse.json({
      success: true,
      data: {
        ...settings,
        openingHours,
        deliveryZones,
      },
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
