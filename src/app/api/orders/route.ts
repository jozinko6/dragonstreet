import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getOrderAvailability } from '@/lib/opening-hours'
import { requireStaffAuth } from '@/lib/staff-auth'
import { OrderStatus, DeliveryType, PaymentMethod, PaymentStatus } from '@prisma/client'

type OrderItemCreateData = {
  menuItemId: string
  menuItemName: string
  menuItemNameSk: string
  quantity: number
  unitPrice: number
  addonsPrice: number
  totalPrice: number
  notes: string
  selectedAddons: {
    create: Array<{
      addonId: string
      addonName: string
      addonNameSk: string
      price: number
    }>
  }
}

// Generate a unique order number like DSF-001
async function generateOrderNumber(): Promise<string> {
  const lastOrder = await db.order.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { orderNumber: true },
  })

  let nextNum = 1
  if (lastOrder?.orderNumber) {
    const match = lastOrder.orderNumber.match(/DSF-(\d+)/)
    if (match) {
      nextNum = parseInt(match[1], 10) + 1
    }
  }

  return `DSF-${String(nextNum).padStart(3, '0')}`
}

// GET /api/orders - List orders (admin, with filtering)
export async function GET(request: NextRequest) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin', 'kitchen', 'courier'])
    if (unauthorized) return unauthorized

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const where: Record<string, unknown> = {}
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
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
        },
      }),
      db.order.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        total,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order (guest checkout supported)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      // Customer info (guest)
      guestEmail,
      guestPhone,
      guestFirstName,
      guestLastName,
      // Delivery info
      deliveryType = 'DELIVERY',
      deliveryAddress,
      deliveryCity,
      deliveryPostalCode,
      deliveryNotes,
      pickupTime,
      // Payment
      paymentMethod = 'CASH_ON_DELIVERY',
      // Items
      items = [],
      // Promo
      promoCode,
      // Notes
      notes,
      // Customer ID (if logged in)
      customerId,
    } = body

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must have at least one item' },
        { status: 400 }
      )
    }

    if (deliveryType === 'DELIVERY' && !deliveryAddress) {
      return NextResponse.json(
        { success: false, error: 'Delivery address is required for delivery orders' },
        { status: 400 }
      )
    }

    // Validate delivery type
    if (!Object.values(DeliveryType).includes(deliveryType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid delivery type' },
        { status: 400 }
      )
    }

    const availability = await getOrderAvailability(deliveryType)
    if (!availability.isOpen) {
      return NextResponse.json(
        { success: false, error: availability.message },
        { status: 409 }
      )
    }

    // Validate payment method
    if (!Object.values(PaymentMethod).includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Calculate subtotal from items
    let subtotal = 0
    const orderItemsData: OrderItemCreateData[] = []

    for (const item of items) {
      // Fetch menu item to get current price
      const menuItem = await db.menuItem.findUnique({
        where: { id: item.menuItemId },
        include: { addons: true },
      })

      if (!menuItem) {
        return NextResponse.json(
          { success: false, error: `Menu item ${item.menuItemId} not found` },
          { status: 400 }
        )
      }

      if (!menuItem.isAvailable) {
        return NextResponse.json(
          { success: false, error: `Menu item "${menuItem.name}" is not available` },
          { status: 400 }
        )
      }

      const quantity = item.quantity || 1
      const unitPrice = menuItem.price
      let addonsPrice = 0

      // Process addons
      const selectedAddonsData: OrderItemCreateData['selectedAddons']['create'] = []
      if (item.addons && Array.isArray(item.addons)) {
        for (const addonId of item.addons) {
          const addon = menuItem.addons.find((a) => a.id === addonId)
          if (addon) {
            addonsPrice += addon.price
            selectedAddonsData.push({
              addonId: addon.id,
              addonName: addon.name,
              addonNameSk: addon.nameSk,
              price: addon.price,
            })
          }
        }
      }

      const totalPrice = (unitPrice + addonsPrice) * quantity
      subtotal += totalPrice

      orderItemsData.push({
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        menuItemNameSk: menuItem.nameSk,
        quantity,
        unitPrice,
        addonsPrice,
        totalPrice,
        notes: item.notes || '',
        selectedAddons: {
          create: selectedAddonsData,
        },
      })
    }

    // Calculate delivery fee
    let deliveryFee = 0
    if (deliveryType === 'DELIVERY') {
      // Find matching delivery zone
      const zones = await db.deliveryZone.findMany({
        where: { isActive: true },
      })
      const matchingZone = zones.find((zone) => {
        const codes = zone.postalCodes.split(',').map((c) => c.trim())
        return codes.includes(deliveryPostalCode || '')
      })
      deliveryFee = matchingZone?.deliveryFee ?? 2.0

      // Check minimum order amount
      const minOrder = matchingZone?.minOrderAmount ?? 0
      if (subtotal < minOrder) {
        return NextResponse.json(
          {
            success: false,
            error: `Minimum order amount for this zone is €${minOrder.toFixed(2)}`,
          },
          { status: 400 }
        )
      }
    }

    // Calculate discount from promo code
    let discount = 0
    if (promoCode) {
      const promo = await db.promoCode.findUnique({
        where: { code: promoCode },
      })

      if (!promo || !promo.isActive) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired promo code' },
          { status: 400 }
        )
      }

      const now = new Date()
      if (promo.validFrom > now) {
        return NextResponse.json(
          { success: false, error: 'Promo code is not yet active' },
          { status: 400 }
        )
      }

      if (promo.validTo && promo.validTo < now) {
        return NextResponse.json(
          { success: false, error: 'Promo code has expired' },
          { status: 400 }
        )
      }

      if (promo.maxUses > 0 && promo.currentUses >= promo.maxUses) {
        return NextResponse.json(
          { success: false, error: 'Promo code has reached its usage limit' },
          { status: 400 }
        )
      }

      if (subtotal < promo.minOrderAmount) {
        return NextResponse.json(
          {
            success: false,
            error: `Minimum order amount for this promo code is €${promo.minOrderAmount.toFixed(2)}`,
          },
          { status: 400 }
        )
      }

      if (promo.discountType === 'PERCENTAGE') {
        discount = subtotal * (promo.discountValue / 100)
      } else {
        discount = promo.discountValue
      }

      // Don't allow discount greater than subtotal
      discount = Math.min(discount, subtotal)
    }

    const totalAmount = subtotal + deliveryFee - discount

    // Generate order number
    const orderNumber = await generateOrderNumber()

    // Determine initial payment status
    const paymentStatus: PaymentStatus =
      paymentMethod === 'CASH_ON_DELIVERY' || paymentMethod === 'PICKUP_PAY'
        ? PaymentStatus.PENDING
        : PaymentStatus.PENDING

    // Create the order
    const order = await db.order.create({
      data: {
        orderNumber,
        customerId: customerId || null,
        guestEmail: guestEmail || '',
        guestPhone: guestPhone || '',
        guestFirstName: guestFirstName || '',
        guestLastName: guestLastName || '',
        deliveryType: deliveryType as DeliveryType,
        status: OrderStatus.CREATED,
        deliveryAddress: deliveryAddress || '',
        deliveryCity: deliveryCity || '',
        deliveryPostalCode: deliveryPostalCode || '',
        deliveryNotes: deliveryNotes || '',
        pickupTime: pickupTime || '',
        subtotal,
        deliveryFee,
        discount,
        totalAmount,
        paymentMethod: paymentMethod as PaymentMethod,
        paymentStatus,
        promoCode: promoCode || '',
        notes: notes || '',
        items: {
          create: orderItemsData,
        },
        statusHistory: {
          create: {
            status: OrderStatus.CREATED,
            note: 'Order created',
            changedBy: customerId || 'guest',
          },
        },
      },
      include: {
        items: {
          include: {
            selectedAddons: true,
          },
        },
      },
    })

    // Increment promo code usage if applied
    if (promoCode) {
      await db.promoCode.update({
        where: { code: promoCode },
        data: { currentUses: { increment: 1 } },
      })
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
