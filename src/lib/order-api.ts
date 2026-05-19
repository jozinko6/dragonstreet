export interface OrderListItem {
  id: string
  orderNumber: string
  status: string
  customerName: string
  customerPhone: string
  deliveryType: 'DELIVERY' | 'PICKUP'
  address: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  deliveryFee: number
  courierEarning: number
  paymentMethod: string
  notes: string
  createdAt: string
  estimatedTime: string
  courierId: string
  courierName: string
}

interface ApiOrderItem {
  menuItemName: string
  menuItemNameSk?: string
  quantity: number
  unitPrice: number
}

interface ApiOrder {
  id: string
  orderNumber: string
  status: string
  guestFirstName?: string
  guestLastName?: string
  guestPhone?: string
  deliveryType: 'DELIVERY' | 'PICKUP'
  deliveryAddress?: string
  deliveryCity?: string
  deliveryNotes?: string
  totalAmount: number
  deliveryFee?: number
  paymentMethod: string
  notes?: string
  createdAt: string
  estimatedDeliveryTime?: string
  pickupTime?: string
  courierId?: string | null
  courier?: {
    id: string
    firstName: string
    lastName: string
    phone?: string
  } | null
  items: ApiOrderItem[]
}

export function mapApiOrder(order: ApiOrder): OrderListItem {
  const createdAt = new Date(order.createdAt)
  const customerName = [order.guestFirstName, order.guestLastName].filter(Boolean).join(' ') || 'Zakaznik'

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    customerName,
    customerPhone: order.guestPhone || '',
    deliveryType: order.deliveryType,
    address: [order.deliveryAddress, order.deliveryCity].filter(Boolean).join(', '),
    items: order.items.map((item) => ({
      name: item.menuItemNameSk || item.menuItemName,
      quantity: item.quantity,
      price: item.unitPrice,
    })),
    total: order.totalAmount,
    deliveryFee: order.deliveryFee || 0,
    courierEarning: order.deliveryFee || 0,
    paymentMethod: order.paymentMethod,
    notes: [order.notes, order.deliveryNotes].filter(Boolean).join(' | '),
    createdAt: Number.isNaN(createdAt.getTime())
      ? ''
      : createdAt.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' }),
    estimatedTime: order.estimatedDeliveryTime || order.pickupTime || '30-45 min',
    courierId: order.courierId || order.courier?.id || '',
    courierName: order.courier
      ? [order.courier.firstName, order.courier.lastName].filter(Boolean).join(' ')
      : '',
  }
}
