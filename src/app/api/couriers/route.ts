import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { autoAssignReadyOrders } from '@/lib/courier-assignment'
import { requireStaffAuth } from '@/lib/staff-auth'

// GET /api/couriers - List all couriers with their status
export async function GET(request: NextRequest) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin', 'courier'])
    if (unauthorized) return unauthorized

    const couriers = await db.courier.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        orders: {
          where: {
            status: {
              in: ['COURIER_ASSIGNED', 'COURIER_ON_WAY', 'PICKED_UP', 'OUT_FOR_DELIVERY'],
            },
          },
          select: {
            id: true,
            orderNumber: true,
            status: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: couriers,
    })
  } catch (error) {
    console.error('Error fetching couriers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch couriers' },
      { status: 500 }
    )
  }
}

// POST /api/couriers - Create a courier from admin panel
export async function POST(request: NextRequest) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin'])
    if (unauthorized) return unauthorized

    const body = await request.json()
    const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : ''
    const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const vehicleType = typeof body.vehicleType === 'string' && body.vehicleType.trim() ? body.vehicleType.trim() : 'car'

    if (!firstName || !lastName || !phone || !email) {
      return NextResponse.json(
        { success: false, error: 'Name, phone and email are required' },
        { status: 400 }
      )
    }

    const existingCourier = await db.courier.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: { id: true },
    })
    if (existingCourier) {
      return NextResponse.json(
        { success: false, error: 'Courier with this email already exists' },
        { status: 409 }
      )
    }

    const courier = await db.courier.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        vehicleType,
        isAvailable: true,
        isOnline: false,
      },
    })

    return NextResponse.json({ success: true, data: courier }, { status: 201 })
  } catch (error) {
    console.error('Error creating courier:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create courier' },
      { status: 500 }
    )
  }
}

// PATCH /api/couriers - Update courier availability
export async function PATCH(request: NextRequest) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin', 'courier'])
    if (unauthorized) return unauthorized

    const body = await request.json()
    const { id, isAvailable, isOnline } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Courier ID is required' },
        { status: 400 }
      )
    }

    const courier = await db.courier.findUnique({
      where: { id },
    })

    if (!courier) {
      return NextResponse.json(
        { success: false, error: 'Courier not found' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (isAvailable !== undefined) {
      updateData.isAvailable = isAvailable
    }
    if (isOnline !== undefined) {
      updateData.isOnline = isOnline
    }

    const updatedCourier = await db.courier.update({
      where: { id },
      data: updateData,
    })

    if (updatedCourier.isAvailable && updatedCourier.isOnline) {
      await autoAssignReadyOrders()
    }

    return NextResponse.json({
      success: true,
      data: updatedCourier,
    })
  } catch (error) {
    console.error('Error updating courier:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update courier' },
      { status: 500 }
    )
  }
}
