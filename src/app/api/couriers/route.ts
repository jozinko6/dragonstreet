import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/couriers - List all couriers with their status
export async function GET() {
  try {
    const couriers = await db.courier.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        orders: {
          where: {
            status: {
              in: ['ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'COURIER_ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'],
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

// PATCH /api/couriers - Update courier availability
export async function PATCH(request: NextRequest) {
  try {
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
