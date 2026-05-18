'use client'

import { useEffect, useState } from 'react'
import { statusLabels } from '@/lib/data'
import { mapApiOrder, type OrderListItem } from '@/lib/order-api'
import { StaffGate } from '@/components/dragon/StaffGate'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Bike, Phone, MapPin, Package, CheckCircle2, Clock,
  Navigation, DollarSign, TrendingUp, AlertTriangle, Footprints
} from 'lucide-react'

type CourierOption = {
  id: string
  firstName: string
  lastName: string
  phone: string
  isAvailable: boolean
  isOnline: boolean
}

// Step mapping for courier delivery flow
const COURIER_STEPS = [
  { step: 1, status: 'COURIER_ASSIGNED', label: 'Idem do prevádzky', icon: '🚶' },
  { step: 2, status: 'COURIER_ON_WAY', label: 'Vyzdvihnuté', icon: '📦' },
  { step: 3, status: 'PICKED_UP', label: 'Na ceste', icon: '🛵' },
  { step: 4, status: 'OUT_FOR_DELIVERY', label: 'Doručené', icon: '🏠' },
] as const

function getStepForStatus(status: string): number {
  const idx = COURIER_STEPS.findIndex(s => s.status === status)
  return idx >= 0 ? idx + 1 : 0
}

function getNextAction(status: string): { label: string; nextStatus: string } | null {
  switch (status) {
    case 'COURIER_ASSIGNED':
      return { label: 'Idem do prevádzky', nextStatus: 'COURIER_ON_WAY' }
    case 'COURIER_ON_WAY':
      return { label: 'Vyzdvihnuté', nextStatus: 'PICKED_UP' }
    case 'PICKED_UP':
      return { label: 'Na ceste', nextStatus: 'OUT_FOR_DELIVERY' }
    case 'OUT_FOR_DELIVERY':
      return { label: 'Doručené', nextStatus: 'DELIVERED' }
    default:
      return null
  }
}

export function CourierPanel() {
  const [isAvailable, setIsAvailable] = useState(true)
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [couriers, setCouriers] = useState<CourierOption[]>([])
  const [selectedCourierId, setSelectedCourierId] = useState('')
  const [problemOrderId, setProblemOrderId] = useState<string | null>(null)
  const [problemReason, setProblemReason] = useState('')
  const [error, setError] = useState('')
  const selectedCourier = couriers.find((courier) => courier.id === selectedCourierId)

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders?limit=100', { cache: 'no-store' })
      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Objednavky sa nepodarilo nacitat')
      }
      setOrders(json.data.map(mapApiOrder).filter((order: OrderListItem) => order.deliveryType === 'DELIVERY'))
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Objednavky sa nepodarilo nacitat')
    }
  }

  const loadCouriers = async () => {
    try {
      const response = await fetch('/api/couriers', { cache: 'no-store' })
      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Kurierov sa nepodarilo nacitat')
      }
      setCouriers(json.data)
      setSelectedCourierId((current) => {
        if (current && json.data.some((courier: CourierOption) => courier.id === current)) {
          return current
        }
        const stored = window.localStorage.getItem('dragon-courier-id') || ''
        if (stored && json.data.some((courier: CourierOption) => courier.id === stored)) {
          return stored
        }
        return json.data[0]?.id || ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kurierov sa nepodarilo nacitat')
    }
  }

  useEffect(() => {
    loadOrders()
    loadCouriers()
    const intervalId = window.setInterval(() => {
      loadOrders()
      loadCouriers()
    }, 10000)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (selectedCourierId) {
      window.localStorage.setItem('dragon-courier-id', selectedCourierId)
    }
  }, [selectedCourierId])

  const updateAvailability = async (available: boolean) => {
    setIsAvailable(available)
    if (!selectedCourierId) return

    try {
      const response = await fetch('/api/couriers', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: selectedCourierId, isAvailable: available, isOnline: true }),
      })
      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Dostupnost sa nepodarilo ulozit')
      }
      await loadCouriers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dostupnost sa nepodarilo ulozit')
    }
  }

  const activeStatuses = ['COURIER_ASSIGNED', 'COURIER_ON_WAY', 'PICKED_UP', 'OUT_FOR_DELIVERY']
  const assignedOrders = orders.filter((o) => activeStatuses.includes(o.status) && (!selectedCourierId || o.courierId === selectedCourierId))
  const completedOrders = orders.filter((o) => ['DELIVERED', 'COMPLETED'].includes(o.status) && (!selectedCourierId || o.courierId === selectedCourierId))
  const waitingOrders = orders.filter((o) =>
    ['READY_FOR_PICKUP'].includes(o.status) && (!selectedCourierId || !o.courierId || o.courierId === selectedCourierId)
  )
  const problemOrders = orders.filter((o) => o.status === 'PROBLEM' && (!selectedCourierId || o.courierId === selectedCourierId))

  const changeStatus = async (orderId: string, newStatus: string, note?: string) => {
    const previousOrders = orders
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, courierId: o.courierId || selectedCourierId } : o)))
    setProblemOrderId(null)
    setProblemReason('')

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: newStatus, courierId: selectedCourierId || undefined, note, changedBy: 'courier' }),
      })
      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Stav sa nepodarilo ulozit')
      }
      await loadOrders()
    } catch (err) {
      setOrders(previousOrders)
      setError(err instanceof Error ? err.message : 'Stav sa nepodarilo ulozit')
    }
  }

  const handleProblem = (orderId: string) => {
    if (problemReason.trim()) {
      changeStatus(orderId, 'PROBLEM', problemReason)
    }
  }

  return (
    <StaffGate role="courier" title="Kuriersky panel">
    <div className="animate-float-up">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bike className="w-6 h-6 text-dragon-red" />
            <div>
              <h1 className="text-xl font-bold text-dragon-dark">Kuriérsky panel</h1>
              <p className="text-xs text-muted-foreground">
                {selectedCourier ? `${selectedCourier.firstName} ${selectedCourier.lastName}` : 'Vyberte kuriera'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="availability" className="text-xs text-muted-foreground">
              {(selectedCourier?.isAvailable ?? isAvailable) ? 'Dostupny' : 'Nedostupny'}
            </Label>
            <Switch
              id="availability"
              checked={selectedCourier?.isAvailable ?? isAvailable}
              onCheckedChange={updateAvailability}
            />
          </div>
        </div>

        <div className="mb-4">
          <Select value={selectedCourierId || 'none'} onValueChange={(value) => setSelectedCourierId(value === 'none' ? '' : value)}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Vyber kuriera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Vsetci kurieri</SelectItem>
              {couriers.map((courier) => (
                <SelectItem key={courier.id} value={courier.id}>
                  {courier.firstName} {courier.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        {error && <div className="mb-4 text-sm text-red-700 bg-red-50 rounded-lg p-3">{error}</div>}

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-dragon-red">
                <DollarSign className="w-4 h-4" />
                48.50€
              </div>
              <div className="text-[10px] text-muted-foreground">Dnešný zárobok</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-dragon-dark">{completedOrders.length}</div>
              <div className="text-[10px] text-muted-foreground">Doručení</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-green-600">
                <TrendingUp className="w-4 h-4" />
                4.9★
              </div>
              <div className="text-[10px] text-muted-foreground">Hodnotenie</div>
            </CardContent>
          </Card>
        </div>

        {/* Waiting for pickup */}
        {waitingOrders.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-sm text-dragon-dark mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-dragon-orange" />
              Čaká na vyzdvihnutie ({waitingOrders.length})
            </h3>
            <div className="space-y-3">
              {waitingOrders.map((order) => (
                <Card key={order.id} className="border-0 shadow-md bg-dragon-orange/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-dragon-dark">#{order.orderNumber}</span>
                      <Badge className={`${statusLabels[order.status]?.color} text-[10px] border-0`}>
                        {statusLabels[order.status]?.icon} {statusLabels[order.status]?.label}
                      </Badge>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-start gap-2 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-dragon-red shrink-0 mt-0.5" />
                        <span>{order.address || 'Hlavná 42, Hlohovec'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pripravené od: {order.estimatedTime}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-dragon-red hover:bg-dragon-red-dark text-white text-xs"
                        onClick={() => changeStatus(order.id, 'COURIER_ASSIGNED')}
                      >
                        <Navigation className="w-3.5 h-3.5 mr-1" />
                        Prevziať objednávku
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Phone className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active deliveries */}
        {assignedOrders.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-sm text-dragon-dark mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-dragon-red" />
              Na ceste ({assignedOrders.length})
            </h3>
            <div className="space-y-3">
              {assignedOrders.map((order) => {
                const currentStep = getStepForStatus(order.status)
                const nextAction = getNextAction(order.status)

                return (
                  <Card key={order.id} className="border-0 shadow-md bg-dragon-red/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-sm text-dragon-dark">#{order.orderNumber}</span>
                        <Badge className={`${statusLabels[order.status]?.color} text-[10px] border-0`}>
                          {statusLabels[order.status]?.icon} {statusLabels[order.status]?.label}
                        </Badge>
                      </div>

                      {/* Step indicator 1→2→3→4 */}
                      <div className="flex items-center justify-between mb-4 px-1">
                        {COURIER_STEPS.map((cs, idx) => {
                          const isActive = currentStep >= cs.step
                          const isCurrentStep = currentStep === cs.step
                          return (
                            <div key={cs.step} className="flex items-center flex-1">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isCurrentStep
                                      ? 'bg-dragon-red text-white ring-2 ring-dragon-red/30 scale-110'
                                      : isActive
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-400'
                                  }`}
                                >
                                  {isActive ? (currentStep > cs.step ? '✓' : cs.step) : cs.step}
                                </div>
                                <span className={`text-[9px] mt-1 text-center max-w-[60px] leading-tight ${
                                  isCurrentStep ? 'text-dragon-red font-semibold' : isActive ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                  {cs.label}
                                </span>
                              </div>
                              {idx < COURIER_STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1 mt-[-12px] ${
                                  currentStep > cs.step ? 'bg-green-500' : 'bg-gray-200'
                                }`} />
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Order details */}
                      <div className="bg-white rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-dragon-red shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium">{order.address || 'Hlavná 15, Hlohovec'}</div>
                            <div className="text-xs text-muted-foreground">Hlohovec</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{order.customerPhone}</span>
                        </div>
                      </div>

                      {/* Items summary */}
                      <div className="text-xs text-muted-foreground mb-3">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>

                      {order.paymentMethod.includes('Hotovosť') && (
                        <div className="bg-amber-50 rounded-lg p-2 mb-3 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-amber-600" />
                          <span className="text-xs text-amber-700 font-medium">
                            Hotovosť: {order.total.toFixed(2)}€
                          </span>
                        </div>
                      )}

                      {order.notes && (
                        <div className="text-xs text-muted-foreground mb-3">
                          📝 {order.notes}
                        </div>
                      )}

                      {/* Action button based on current status */}
                      {nextAction && (
                        <Button
                          className="w-full bg-dragon-red hover:bg-dragon-red-dark text-white text-xs mb-2"
                          onClick={() => changeStatus(order.id, nextAction.nextStatus)}
                        >
                          {order.status === 'COURIER_ASSIGNED' && <Footprints className="w-3.5 h-3.5 mr-1" />}
                          {order.status === 'COURIER_ON_WAY' && <Package className="w-3.5 h-3.5 mr-1" />}
                          {order.status === 'PICKED_UP' && <Navigation className="w-3.5 h-3.5 mr-1" />}
                          {order.status === 'OUT_FOR_DELIVERY' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                          {nextAction.label}
                        </Button>
                      )}

                      {/* Problem button */}
                      {problemOrderId === order.id ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Dôvod problému..."
                            value={problemReason}
                            onChange={(e) => setProblemReason(e.target.value)}
                            className="text-xs border-red-300 focus:border-red-500"
                          />
                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs"
                              onClick={() => handleProblem(order.id)}
                              disabled={!problemReason.trim()}
                            >
                              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                              Nahlásiť problém
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => { setProblemOrderId(null); setProblemReason('') }}
                            >
                              Zrušiť
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full text-red-600 border-red-200 hover:bg-red-50 text-xs"
                          onClick={() => setProblemOrderId(order.id)}
                        >
                          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                          Problém s objednávkou
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Problem orders */}
        {problemOrders.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-sm text-red-600 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Problémové objednávky
            </h3>
            <div className="space-y-3">
              {problemOrders.map((order) => (
                <Card key={order.id} className="border-0 shadow-md bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-red-700">#{order.orderNumber}</span>
                      <Badge className="bg-red-100 text-red-700 text-[10px] border-0">
                        ⚠️ Problém
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {order.address} • {order.customerName}
                    </div>
                    {order.notes && (
                      <div className="text-xs text-red-600 bg-red-100 rounded p-2 mb-2">
                        📝 {order.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {assignedOrders.length === 0 && waitingOrders.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🛵</div>
            <h2 className="text-xl font-bold text-dragon-dark mb-2">Žiadne aktívne doručenia</h2>
            <p className="text-sm text-muted-foreground">
              {isAvailable
                ? 'Keď bude nová objednávka, zobrazí sa tu'
                : 'Zapnite dostupnosť, aby ste mohli prijímať objednávky'}
            </p>
          </div>
        )}
      </div>
    </div>
    </StaffGate>
  )
}
