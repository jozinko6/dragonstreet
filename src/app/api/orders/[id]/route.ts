import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { findLeastBusyCourierId } from '@/lib/courier-assignment'
import { requireStaffAuth } from '@/lib/staff-auth'
import { OrderStatus } from '@prisma/client'

// Valid status transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  CREATED: ['PAYMENT_PENDING', 'PAID', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'PROBLEM'],
  PAYMENT_PENDING: ['PAID', 'REJECTED', 'CANCELLED', 'PROBLEM'],
  PAID: ['ACCEPTED', 'REFUNDED', 'CANCELLED', 'PROBLEM'],
  ACCEPTED: ['PREPARING', 'REJECTED', 'CANCELLED', 'PROBLEM'],
  REJECTED: ['REFUNDED'],
  PREPARING: ['READY_FOR_PICKUP', 'CANCELLED', 'PROBLEM'],
  READY_FOR_PICKUP: ['COURIER_ASSIGNED', 'PICKED_UP', 'COMPLETED', 'CANCELLED', 'PROBLEM'],
  COURIER_ASSIGNED: ['READY_FOR_PICKUP', 'COURIER_ON_WAY', 'PICKED_UP', 'CANCELLED', 'PROBLEM'],
  COURIER_ON_WAY: ['PICKED_UP', 'CANCELLED', 'PROBLEM'],
  PICKED_UP: ['OUT_FOR_DELIVERY', 'CANCELLED', 'PROBLEM'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED', 'PROBLEM'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: ['REFUNDED'],
  PROBLEM: ['CANCELLED'],
  CANCELLED: [],
  REFUNDED: [],
}

// GET /api/orders/[id] - Get order details with items
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin', 'kitchen', 'courier'])
    if (unauthorized) return unauthorized

    const { id } = await params

    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            selectedAddons: true,
          },
        },
        courier: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            vehicleType: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin', 'kitchen', 'courier'])
    if (unauthorized) return unauthorized

    const { id } = await params
    const body = await request.json()
    const { status, courierId, note, changedBy = 'admin' } = body

    // Find the existing order
    const existingOrder = await db.order.findUnique({
      where: { id },
    })

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}

    // Validate status transition if status is being changed
    if (status) {
      if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
        return NextResponse.json(
          { success: false, error: 'Invalid order status' },
          { status: 400 }
        )
      }

      const currentStatus = existingOrder.status
      const allowed = VALID_TRANSITIONS[currentStatus] || []

      if (!allowed.includes(status)) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot transition from ${currentStatus} to ${status}`,
          },
          { status: 400 }
        )
      }

      updateData.status = status

      // Create status history entry
      updateData.statusHistory = {
        create: {
          status: status as OrderStatus,
          note: note || `Status changed to ${status}`,
          changedBy,
        },
      }

      // Auto-update payment status when order is paid
      if (status === 'PAID') {
        updateData.paymentStatus = 'PAID'
      }

      // Auto-update payment status when order is refunded
      if (status === 'REFUNDED') {
        updateData.paymentStatus = 'REFUNDED'
      }
    }

    // Assign courier if provided
    if (courierId !== undefined) {
      updateData.courierId = courierId
    }

    const needsCourier =
      existingOrder.deliveryType === 'DELIVERY' &&
      !existingOrder.courierId &&
      courierId === undefined &&
      status &&
      ['READY_FOR_PICKUP', 'COURIER_ASSIGNED', 'COURIER_ON_WAY', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(status)

    if (needsCourier) {
      const autoCourierId = await findLeastBusyCourierId(existingOrder)
      if (autoCourierId) {
        updateData.courierId = autoCourierId
      } else if (status === 'COURIER_ASSIGNED') {
        return NextResponse.json(
          { success: false, error: 'No available courier found' },
          { status: 400 }
        )
      }
    }

    const updatedOrder = await db.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            selectedAddons: true,
          },
        },
        courier: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            vehicleType: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
