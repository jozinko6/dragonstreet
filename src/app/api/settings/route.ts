import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getOrderAvailability } from '@/lib/opening-hours'

// GET /api/settings - Return restaurant settings
export async function GET() {
  try {
    const [settings, deliveryZones, openingHoursRows, deliveryAvailability, pickupAvailability] = await Promise.all([
      db.restaurantSettings.findFirst(),
      db.deliveryZone.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      }),
      db.openingHours.findMany({
        orderBy: { dayOfWeek: 'asc' },
      }),
      getOrderAvailability('DELIVERY'),
      getOrderAvailability('PICKUP'),
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
        openingHoursRows,
        orderAvailability: {
          delivery: deliveryAvailability,
          pickup: pickupAvailability,
        },
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
