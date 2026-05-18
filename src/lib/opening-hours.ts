import { db } from '@/lib/db'

type OpeningRow = {
  dayOfWeek: number
  openTime: string
  closeTime: string
  isClosed: boolean
  isDelivery: boolean
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map((part) => Number.parseInt(part, 10))
  return hours * 60 + minutes
}

function getBratislavaNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Bratislava',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)

  const weekday = parts.find((part) => part.type === 'weekday')?.value || 'Mon'
  const hour = Number.parseInt(parts.find((part) => part.type === 'hour')?.value || '0', 10)
  const minute = Number.parseInt(parts.find((part) => part.type === 'minute')?.value || '0', 10)
  const weekdayIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(weekday)

  return {
    dayOfWeek: weekdayIndex >= 0 ? weekdayIndex : 0,
    minutes: hour * 60 + minute,
  }
}

function isRowOpen(row: OpeningRow, minutes: number, requireDelivery: boolean, previousDay = false) {
  if (row.isClosed || (requireDelivery && !row.isDelivery)) {
    return false
  }

  const open = timeToMinutes(row.openTime)
  const close = timeToMinutes(row.closeTime)

  if (open === close) {
    return false
  }

  if (open < close) {
    return !previousDay && minutes >= open && minutes < close
  }

  return previousDay ? minutes < close : minutes >= open
}

export async function getOrderAvailability(deliveryType: 'DELIVERY' | 'PICKUP' = 'DELIVERY') {
  const [settings, rows] = await Promise.all([
    db.restaurantSettings.findFirst(),
    db.openingHours.findMany(),
  ])

  if (settings && (!settings.isActive || !settings.acceptOnlineOrders)) {
    return {
      isOpen: false,
      message: 'Prevadzka aktualne neprijima online objednavky.',
    }
  }

  if (rows.length === 0) {
    return {
      isOpen: true,
      message: '',
    }
  }

  const { dayOfWeek, minutes } = getBratislavaNow()
  const requireDelivery = deliveryType === 'DELIVERY'
  const today = rows.find((row) => row.dayOfWeek === dayOfWeek)
  const previous = rows.find((row) => row.dayOfWeek === (dayOfWeek + 6) % 7)
  const isOpen =
    (today ? isRowOpen(today, minutes, requireDelivery) : false) ||
    (previous ? isRowOpen(previous, minutes, requireDelivery, true) : false)

  return {
    isOpen,
    message: isOpen
      ? ''
      : deliveryType === 'DELIVERY'
        ? 'Rozvoz je momentalne mimo otvaracich hodin.'
        : 'Prevadzka je momentalne zatvorena.',
  }
}
