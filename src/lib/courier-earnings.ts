type CourierEarningInput = {
  vehicleType?: string
  deliveryCity?: string
  deliveryPostalCode?: string
  deliveryFee?: number
  createdAt?: string | Date
}

export type CourierEarningBreakdown = {
  total: number
  baseRate: number
  perKmRate: number
  distanceKm: number
  peakMultiplier: number
  isPeak: boolean
  vehicleType: 'bicycle' | 'car'
}

const POSTAL_CODE_DISTANCE_KM: Record<string, number> = {
  '91701': 23,
  '92001': 2,
  '92031': 10,
  '92032': 10,
  '92033': 13,
  '92034': 16,
  '92035': 18,
  '92041': 3,
  '92042': 6,
  '92043': 8,
  '92044': 9,
  '92061': 6,
  '92062': 8,
  '92101': 22,
  '92102': 25,
  '92103': 21,
  '92104': 27,
  '92601': 15,
  '92602': 14,
  '92603': 19,
  '92651': 25,
}

const CITY_DISTANCE_KM: Record<string, number> = {
  banka: 25,
  binovce: 16,
  cervenik: 9,
  dolneotrokovce: 10,
  hlohovec: 2,
  horneotrokovce: 13,
  hradiste: 8,
  hubina: 27,
  klacany: 6,
  krizovanynaddudvahom: 18,
  leopoldov: 6,
  madunice: 8,
  pecenady: 10,
  piestany: 22,
  ratnovce: 21,
  sered: 15,
  sladkovicovo: 25,
  sulekovo: 3,
  trnava: 23,
  tvrdomestice: 19,
  vinohradynadvahom: 14,
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function normalizePostalCode(value: string) {
  return value.replace(/\D/g, '')
}

function resolveVehicleType(vehicleType?: string): 'bicycle' | 'car' {
  const normalized = normalize(vehicleType || '')
  return normalized.includes('bike') || normalized.includes('bicykel') || normalized.includes('bicycle')
    ? 'bicycle'
    : 'car'
}

function estimateDistanceFromDeliveryFee(deliveryFee?: number) {
  if (!deliveryFee || deliveryFee <= 1) return 2
  if (deliveryFee <= 2.5) return 8
  if (deliveryFee <= 3) return 14
  if (deliveryFee <= 3.5) return 20
  if (deliveryFee <= 4) return 24
  return 28
}

export function getCourierDistanceKm(input: CourierEarningInput) {
  const postalCode = normalizePostalCode(input.deliveryPostalCode || '')
  if (postalCode && POSTAL_CODE_DISTANCE_KM[postalCode] !== undefined) {
    return POSTAL_CODE_DISTANCE_KM[postalCode]
  }

  const city = normalize(input.deliveryCity || '')
  if (city && CITY_DISTANCE_KM[city] !== undefined) {
    return CITY_DISTANCE_KM[city]
  }

  return estimateDistanceFromDeliveryFee(input.deliveryFee)
}

export function isPeakCourierTime(value?: string | Date) {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return false

  const day = date.getDay()
  const minutes = date.getHours() * 60 + date.getMinutes()
  const lunchPeak = minutes >= 11 * 60 + 30 && minutes <= 13 * 60 + 30
  const dinnerPeak = minutes >= 18 * 60 && minutes <= 21 * 60
  const weekendDinnerPeak = (day === 5 || day === 6) && minutes >= 18 * 60 && minutes <= 22 * 60 + 30

  return lunchPeak || dinnerPeak || weekendDinnerPeak
}

export function calculateCourierEarning(input: CourierEarningInput): CourierEarningBreakdown {
  const vehicleType = resolveVehicleType(input.vehicleType)
  const distanceKm = getCourierDistanceKm(input)
  const baseRate = vehicleType === 'bicycle' ? 2 : 3
  const perKmRate = vehicleType === 'bicycle' ? 0.4 : 0.55
  const isPeak = isPeakCourierTime(input.createdAt)
  const peakMultiplier = isPeak ? 1.2 : 1
  const total = (baseRate + perKmRate * distanceKm) * peakMultiplier

  return {
    total: Math.round(total * 100) / 100,
    baseRate,
    perKmRate,
    distanceKm,
    peakMultiplier,
    isPeak,
    vehicleType,
  }
}

export function formatCourierEarningFormula(earning: CourierEarningBreakdown) {
  const peak = earning.isPeak ? ' × peak 1.20' : ''
  return `${earning.baseRate.toFixed(2)}€ + ${earning.distanceKm.toFixed(1)} km × ${earning.perKmRate.toFixed(2)}€${peak}`
}
