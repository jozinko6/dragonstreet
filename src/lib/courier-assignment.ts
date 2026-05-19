import { db } from '@/lib/db'
import { DeliveryType, OrderStatus, type Order } from '@prisma/client'

const ACTIVE_COURIER_STATUSES: OrderStatus[] = [
  OrderStatus.READY_FOR_PICKUP,
  OrderStatus.COURIER_ASSIGNED,
  OrderStatus.COURIER_ON_WAY,
  OrderStatus.PICKED_UP,
  OrderStatus.OUT_FOR_DELIVERY,
]

type AssignmentOrder = Pick<Order, 'deliveryCity' | 'deliveryPostalCode' | 'totalAmount' | 'deliveryFee'>

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function getVehicleScore(vehicleType: string, order?: AssignmentOrder | null) {
  const vehicle = normalize(vehicleType)
  const city = normalize(order?.deliveryCity || '')
  const isLongerDelivery = Boolean(order && city && city !== 'hlohovec') || (order?.deliveryFee || 0) >= 2

  if (isLongerDelivery) {
    if (vehicle === 'car') return -8
    if (vehicle === 'motorcycle') return -5
    return 8
  }

  if (vehicle === 'bicycle') return -2
  if (vehicle === 'motorcycle') return -1
  return 0
}

export async function findBestCourierId(order?: AssignmentOrder | null): Promise<string | null> {
  const recentThreshold = new Date(Date.now() - 45 * 60 * 1000)
  const couriers = await db.courier.findMany({
    where: {
      isAvailable: true,
      isOnline: true,
    },
    include: {
      orders: {
        where: {
          status: {
            in: ACTIVE_COURIER_STATUSES,
          },
        },
        select: {
          id: true,
          updatedAt: true,
        },
      },
    },
  })

  if (couriers.length === 0) {
    return null
  }

  return [...couriers].sort((a, b) => {
    const aRecent = a.orders.filter((item) => item.updatedAt >= recentThreshold).length
    const bRecent = b.orders.filter((item) => item.updatedAt >= recentThreshold).length
    const aScore = a.orders.length * 100 + aRecent * 12 + getVehicleScore(a.vehicleType, order)
    const bScore = b.orders.length * 100 + bRecent * 12 + getVehicleScore(b.vehicleType, order)

    if (aScore !== bScore) return aScore - bScore
    return a.createdAt.getTime() - b.createdAt.getTime()
  })[0].id
}

export async function autoAssignReadyOrders(limit = 10) {
  const readyOrders = await db.order.findMany({
    where: {
      deliveryType: DeliveryType.DELIVERY,
      courierId: null,
      status: OrderStatus.READY_FOR_PICKUP,
    },
    orderBy: { createdAt: 'asc' },
    take: limit,
  })

  let assigned = 0
  for (const order of readyOrders) {
    const courierId = await findBestCourierId(order)
    if (!courierId) break

    await db.order.update({
      where: { id: order.id },
      data: {
        courierId,
        statusHistory: {
          create: {
            status: OrderStatus.READY_FOR_PICKUP,
            note: 'Kuriér bol automaticky priradený podľa dostupnosti a vyťaženia.',
            changedBy: 'auto-dispatch',
          },
        },
      },
    })
    assigned += 1
  }

  return assigned
}

export const findLeastBusyCourierId = findBestCourierId
