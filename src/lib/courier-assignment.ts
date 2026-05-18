import { db } from '@/lib/db'
import { OrderStatus } from '@prisma/client'

const ACTIVE_COURIER_STATUSES: OrderStatus[] = [
  OrderStatus.COURIER_ASSIGNED,
  OrderStatus.COURIER_ON_WAY,
  OrderStatus.PICKED_UP,
  OrderStatus.OUT_FOR_DELIVERY,
]

export async function findLeastBusyCourierId(): Promise<string | null> {
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
        },
      },
    },
  })

  if (couriers.length === 0) {
    return null
  }

  return [...couriers].sort((a, b) => a.orders.length - b.orders.length)[0].id
}
