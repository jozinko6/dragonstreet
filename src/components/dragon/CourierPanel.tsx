'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { statusLabels } from '@/lib/data'
import { mapApiOrder, type OrderListItem } from '@/lib/order-api'
import { StaffGate } from '@/components/dragon/StaffGate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  Bell,
  Bike,
  CheckCircle2,
  Clock,
  Download,
  Footprints,
  LogOut,
  MapPin,
  Navigation,
  Package,
  Phone,
  Volume2,
  XCircle,
} from 'lucide-react'

type CourierOption = {
  id: string
  firstName: string
  lastName: string
  phone: string
  isAvailable: boolean
  isOnline: boolean
}

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const ACTIVE_STATUSES = ['COURIER_ASSIGNED', 'COURIER_ON_WAY', 'PICKED_UP', 'OUT_FOR_DELIVERY']
const COURIER_STEPS = [
  { step: 1, status: 'COURIER_ASSIGNED', label: 'Prijaté' },
  { step: 2, status: 'COURIER_ON_WAY', label: 'Idem po jedlo' },
  { step: 3, status: 'PICKED_UP', label: 'Vyzdvihnuté' },
  { step: 4, status: 'OUT_FOR_DELIVERY', label: 'Na ceste' },
] as const

function eur(value: number) {
  return `${value.toFixed(2)}€`
}

function getStepForStatus(status: string) {
  const index = COURIER_STEPS.findIndex((step) => step.status === status)
  return index >= 0 ? index + 1 : 0
}

function getNextAction(status: string): { label: string; nextStatus: string } | null {
  switch (status) {
    case 'COURIER_ASSIGNED':
      return { label: 'Idem po jedlo', nextStatus: 'COURIER_ON_WAY' }
    case 'COURIER_ON_WAY':
      return { label: 'Vyzdvihnuté', nextStatus: 'PICKED_UP' }
    case 'PICKED_UP':
      return { label: 'Na ceste k zákazníkovi', nextStatus: 'OUT_FOR_DELIVERY' }
    case 'OUT_FOR_DELIVERY':
      return { label: 'Doručené', nextStatus: 'DELIVERED' }
    default:
      return null
  }
}

function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, context.currentTime)
    oscillator.frequency.setValueAtTime(660, context.currentTime + 0.12)
    gain.gain.setValueAtTime(0.001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.25, context.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.4)
  } catch {
    // Sound is optional; browsers may block it until user interaction.
  }
}

function OrderSummary({ order }: { order: OrderListItem }) {
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 text-dragon-red shrink-0 mt-0.5" />
        <span className="font-medium text-dragon-dark">{order.address || 'Adresa nie je vyplnená'}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Phone className="w-3.5 h-3.5" />
        <a href={`tel:${order.customerPhone}`} className="hover:text-dragon-red">{order.customerPhone || 'Bez telefónu'}</a>
      </div>
      <div className="rounded-xl bg-muted/60 p-3">
        <div className="font-semibold text-dragon-dark mb-1">Položky</div>
        {order.items.map((item, index) => (
          <div key={`${item.name}-${index}`} className="flex justify-between gap-3 py-0.5">
            <span>{item.quantity}x {item.name}</span>
            <span className="font-medium">{eur(item.quantity * item.price)}</span>
          </div>
        ))}
      </div>
      {order.notes && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-800">
          {order.notes}
        </div>
      )}
    </div>
  )
}

function OrderEarningDetails({ order }: { order: OrderListItem }) {
  return (
    <div className="space-y-2 text-xs mb-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-dragon-red/10 border border-dragon-red/15 p-3">
          <div className="text-[10px] uppercase tracking-wide text-dragon-red font-semibold">Zárobok kuriéra</div>
          <div className="text-xl font-bold text-dragon-red">{eur(order.courierEarning)}</div>
        </div>
        <div className="rounded-2xl bg-muted/60 border border-border p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Cena objednávky</div>
          <div className="text-xl font-bold text-dragon-dark">{eur(order.total)}</div>
        </div>
      </div>
      <div className="rounded-2xl bg-white border border-border p-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-dragon-red shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Kam smeruje objednávka</div>
            <div className="font-medium text-dragon-dark">{order.address || 'Adresa nie je vyplnená'}</div>
          </div>
        </div>
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Zárobok kuriéra je poplatok za doručenie pri tejto objednávke. Cena objednávky je celková suma platená zákazníkom.
      </p>
    </div>
  )
}

export function CourierPanel() {
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [couriers, setCouriers] = useState<CourierOption[]>([])
  const [selectedCourierId, setSelectedCourierId] = useState('')
  const [problemOrderId, setProblemOrderId] = useState<string | null>(null)
  const [problemReason, setProblemReason] = useState('')
  const [error, setError] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [dismissedOrderIds, setDismissedOrderIds] = useState<Set<string>>(new Set())
  const seenNewOrderIds = useRef<Set<string>>(new Set())
  const hasLoadedOnce = useRef(false)

  const selectedCourier = couriers.find((courier) => courier.id === selectedCourierId)

  const loadSession = async () => {
    const response = await fetch('/api/staff-auth?role=courier', { cache: 'no-store' })
    const json = await response.json()
    if (json.success && json.courierId) {
      setSelectedCourierId(json.courierId)
    }
  }

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders?limit=100', { cache: 'no-store' })
      const json = await response.json()
      if (!response.ok || !json.success) throw new Error(json.error || 'Objednávky sa nepodarilo načítať')
      const deliveryOrders = json.data.map(mapApiOrder).filter((order: OrderListItem) => order.deliveryType === 'DELIVERY')
      setOrders(deliveryOrders)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Objednávky sa nepodarilo načítať')
    }
  }

  const loadCouriers = async () => {
    try {
      const response = await fetch('/api/couriers', { cache: 'no-store' })
      const json = await response.json()
      if (!response.ok || !json.success) throw new Error(json.error || 'Kuriérov sa nepodarilo načítať')
      setCouriers(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kuriérov sa nepodarilo načítať')
    }
  }

  useEffect(() => {
    loadSession()
    loadOrders()
    loadCouriers()
    const intervalId = window.setInterval(() => {
      loadOrders()
      loadCouriers()
    }, 10000)

    const installListener = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', installListener)

    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('beforeinstallprompt', installListener)
    }
  }, [])

  const waitingOrders = useMemo(
    () => orders.filter((order) => order.status === 'READY_FOR_PICKUP' && !dismissedOrderIds.has(order.id) && (!order.courierId || order.courierId === selectedCourierId)),
    [orders, selectedCourierId, dismissedOrderIds]
  )
  const activeOrders = useMemo(
    () => orders.filter((order) => ACTIVE_STATUSES.includes(order.status) && order.courierId === selectedCourierId),
    [orders, selectedCourierId]
  )
  const completedOrders = useMemo(
    () => orders.filter((order) => ['DELIVERED', 'COMPLETED'].includes(order.status) && order.courierId === selectedCourierId),
    [orders, selectedCourierId]
  )
  const problemOrders = useMemo(
    () => orders.filter((order) => order.status === 'PROBLEM' && (!order.courierId || order.courierId === selectedCourierId)),
    [orders, selectedCourierId]
  )

  useEffect(() => {
    if (!hasLoadedOnce.current) {
      waitingOrders.forEach((order) => seenNewOrderIds.current.add(order.id))
      hasLoadedOnce.current = true
      return
    }

    const freshOrders = waitingOrders.filter((order) => !seenNewOrderIds.current.has(order.id))
    if (freshOrders.length > 0) {
      if (soundEnabled) playNotificationSound()
      if (notificationsEnabled && 'Notification' in window) {
        freshOrders.slice(0, 3).forEach((order) => {
          new Notification(`Nová objednávka ${order.orderNumber}`, {
            body: `${order.address || 'Rozvoz'} - zárobok ${eur(order.courierEarning)}, objednávka ${eur(order.total)}`,
            icon: '/images/dragon-logo.png',
          })
        })
      }
      freshOrders.forEach((order) => seenNewOrderIds.current.add(order.id))
    }
  }, [waitingOrders, notificationsEnabled, soundEnabled])

  const totals = useMemo(() => {
    const deliveredOrderTotal = completedOrders.reduce((sum, order) => sum + order.total, 0)
    const deliveredEarnings = completedOrders.reduce((sum, order) => sum + order.courierEarning, 0)
    const activeEarnings = activeOrders.reduce((sum, order) => sum + order.courierEarning, 0)
    return { deliveredOrderTotal, deliveredEarnings, activeEarnings }
  }, [activeOrders, completedOrders])

  const updateAvailability = async (available: boolean) => {
    if (!selectedCourierId) return
    try {
      const response = await fetch('/api/couriers', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: selectedCourierId, isAvailable: available, isOnline: true }),
      })
      const json = await response.json()
      if (!response.ok || !json.success) throw new Error(json.error || 'Dostupnosť sa nepodarilo uložiť')
      await loadCouriers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dostupnosť sa nepodarilo uložiť')
    }
  }

  const changeOrder = async (orderId: string, status: string, note?: string, courierId: string | null | undefined = selectedCourierId) => {
    const previousOrders = orders
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status, courierId: courierId || '' } : order)))
    setProblemOrderId(null)
    setProblemReason('')

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status, courierId, note, changedBy: 'courier' }),
      })
      const json = await response.json()
      if (!response.ok || !json.success) throw new Error(json.error || 'Stav sa nepodarilo uložiť')
      await loadOrders()
    } catch (err) {
      setOrders(previousOrders)
      setError(err instanceof Error ? err.message : 'Stav sa nepodarilo uložiť')
    }
  }

  const releaseOrder = async (orderId: string) => {
    const previousOrders = orders
    setDismissedOrderIds((prev) => new Set(prev).add(orderId))
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, courierId: '' } : order)))

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ courierId: null, changedBy: 'courier' }),
      })
      const json = await response.json()
      if (!response.ok || !json.success) throw new Error(json.error || 'Objednávku sa nepodarilo odmietnuť')
      await loadOrders()
    } catch (err) {
      setOrders(previousOrders)
      setError(err instanceof Error ? err.message : 'Objednávku sa nepodarilo odmietnuť')
    }
  }

  const requestNotifications = async () => {
    if (!('Notification' in window)) {
      setError('Tento prehliadač nepodporuje notifikácie.')
      return
    }
    const permission = await Notification.requestPermission()
    setNotificationsEnabled(permission === 'granted')
    if (permission === 'granted') {
      new Notification('Notifikácie sú zapnuté', {
        body: 'Nové objednávky sa zobrazia aj ako upozornenie.',
        icon: '/images/dragon-logo.png',
      })
    }
  }

  const installApp = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  const logoutCourier = async () => {
    await fetch('/api/staff-auth', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ role: 'courier' }),
    })
    window.location.reload()
  }

  return (
    <StaffGate role="courier" title="Kuriérsky panel">
      <div className="animate-float-up bg-muted/30 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <div className="rounded-3xl bg-dragon-dark text-white p-5 shadow-xl shadow-dragon-dark/15 mb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-dragon-red flex items-center justify-center">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Kuriérsky panel</h1>
                  <p className="text-xs text-white/60">
                    {selectedCourier ? `${selectedCourier.firstName} ${selectedCourier.lastName}` : 'Prihlásený kuriér'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="availability" className="text-xs text-white/70">
                    {selectedCourier?.isAvailable ? 'Dostupný' : 'Pauza'}
                  </Label>
                  <Switch id="availability" checked={Boolean(selectedCourier?.isAvailable)} onCheckedChange={updateAvailability} />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={logoutCourier}
                  className="h-8 rounded-full bg-white/10 px-3 text-xs text-white hover:bg-white/20 hover:text-white"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  Odhlásiť
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="rounded-2xl bg-white/8 p-3">
                <div className="text-lg font-bold">{waitingOrders.length}</div>
                <div className="text-[10px] text-white/50">Nové</div>
              </div>
              <div className="rounded-2xl bg-white/8 p-3">
                <div className="text-lg font-bold">{eur(totals.activeEarnings)}</div>
                <div className="text-[10px] text-white/50">Zárobok aktívne</div>
              </div>
              <div className="rounded-2xl bg-white/8 p-3">
                <div className="text-lg font-bold">{eur(totals.deliveredEarnings)}</div>
                <div className="text-[10px] text-white/50">Zárobok doručené</div>
              </div>
            </div>
          </div>

          {error && <div className="mb-4 text-sm text-red-700 bg-red-50 rounded-xl p-3">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <Button variant="outline" className="justify-start rounded-2xl bg-white" onClick={requestNotifications}>
              <Bell className="w-4 h-4 mr-2 text-dragon-red" />
              {notificationsEnabled ? 'Notifikácie zapnuté' : 'Zapnúť notifikácie'}
            </Button>
            <Button variant="outline" className="justify-start rounded-2xl bg-white" onClick={() => {
              setSoundEnabled((value) => !value)
              if (!soundEnabled) playNotificationSound()
            }}>
              <Volume2 className="w-4 h-4 mr-2 text-dragon-red" />
              Zvuk {soundEnabled ? 'zapnutý' : 'vypnutý'}
            </Button>
            <Button variant="outline" className="justify-start rounded-2xl bg-white" onClick={installApp} disabled={!installPrompt}>
              <Download className="w-4 h-4 mr-2 text-dragon-red" />
              Pridať na plochu
            </Button>
          </div>
          {!installPrompt && (
            <p className="text-[11px] text-muted-foreground mb-4">
              Ak tlačidlo nie je aktívne, použite v mobile menu prehliadača a voľbu Pridať na plochu / Add to Home Screen.
            </p>
          )}

          <Tabs defaultValue="new" className="space-y-4">
            <TabsList className="grid grid-cols-4 h-auto rounded-2xl bg-white p-1 shadow-sm">
              <TabsTrigger value="new" className="rounded-xl text-xs">Nové ({waitingOrders.length})</TabsTrigger>
              <TabsTrigger value="active" className="rounded-xl text-xs">Aktívne ({activeOrders.length})</TabsTrigger>
              <TabsTrigger value="done" className="rounded-xl text-xs">Doručené ({completedOrders.length})</TabsTrigger>
              <TabsTrigger value="problem" className="rounded-xl text-xs">Problém ({problemOrders.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="space-y-3">
              {waitingOrders.length === 0 && <EmptyState title="Žiadne nové objednávky" text="Keď kuchyňa označí objednávku ako hotovú, zobrazí sa tu." />}
              {waitingOrders.map((order) => (
                <Card key={order.id} className="border-0 shadow-md rounded-3xl overflow-hidden">
                  <CardContent className="p-4">
                    <OrderHeader order={order} />
                    <OrderEarningDetails order={order} />
                    <OrderSummary order={order} />
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button className="bg-dragon-red hover:bg-dragon-red-dark text-white rounded-2xl" onClick={() => changeOrder(order.id, 'COURIER_ASSIGNED', 'Kurier prijal objednavku')}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Prijať
                      </Button>
                      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 rounded-2xl" onClick={() => releaseOrder(order.id)}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Odmietnuť
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="active" className="space-y-3">
              {activeOrders.length === 0 && <EmptyState title="Žiadne aktívne doručenia" text="Prijaté objednávky sa zobrazia tu." />}
              {activeOrders.map((order) => {
                const nextAction = getNextAction(order.status)
                return (
                  <Card key={order.id} className="border-0 shadow-md rounded-3xl overflow-hidden">
                    <CardContent className="p-4">
                      <OrderHeader order={order} />
                      <StepBar status={order.status} />
                      <OrderEarningDetails order={order} />
                      <OrderSummary order={order} />
                      {nextAction && (
                        <Button className="w-full bg-dragon-red hover:bg-dragon-red-dark text-white rounded-2xl mt-4" onClick={() => changeOrder(order.id, nextAction.nextStatus)}>
                          {order.status === 'COURIER_ASSIGNED' && <Footprints className="w-4 h-4 mr-2" />}
                          {order.status === 'COURIER_ON_WAY' && <Package className="w-4 h-4 mr-2" />}
                          {order.status === 'PICKED_UP' && <Navigation className="w-4 h-4 mr-2" />}
                          {order.status === 'OUT_FOR_DELIVERY' && <CheckCircle2 className="w-4 h-4 mr-2" />}
                          {nextAction.label}
                        </Button>
                      )}
                      {problemOrderId === order.id ? (
                        <div className="space-y-2 mt-3">
                          <Input placeholder="Dôvod problému..." value={problemReason} onChange={(event) => setProblemReason(event.target.value)} />
                          <div className="grid grid-cols-2 gap-2">
                            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-2xl" disabled={!problemReason.trim()} onClick={() => changeOrder(order.id, 'PROBLEM', problemReason)}>
                              Nahlásiť
                            </Button>
                            <Button variant="outline" className="rounded-2xl" onClick={() => setProblemOrderId(null)}>
                              Zrušiť
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 rounded-2xl mt-2" onClick={() => setProblemOrderId(order.id)}>
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Problém s objednávkou
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            <TabsContent value="done" className="space-y-3">
              <Card className="border-0 shadow-sm rounded-3xl">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Doručené objednávky</div>
                    <div className="text-2xl font-bold text-dragon-dark">{completedOrders.length}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Zárobok kuriéra</div>
                    <div className="text-2xl font-bold text-dragon-red">{eur(totals.deliveredEarnings)}</div>
                    <div className="text-[11px] text-muted-foreground">Tržba {eur(totals.deliveredOrderTotal)}</div>
                  </div>
                </CardContent>
              </Card>
              {completedOrders.length === 0 && <EmptyState title="Zatiaľ nič doručené" text="Po doručení objednávky sa zobrazí história a suma." />}
              {completedOrders.map((order) => (
                <Card key={order.id} className="border-0 shadow-sm rounded-3xl">
                  <CardContent className="p-4">
                    <OrderHeader order={order} compact />
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div className="rounded-xl bg-dragon-red/10 p-2">
                        <div className="text-[10px] text-dragon-red font-semibold">Zárobok</div>
                        <div className="font-bold text-dragon-red">{eur(order.courierEarning)}</div>
                      </div>
                      <div className="rounded-xl bg-muted/60 p-2">
                        <div className="text-[10px] text-muted-foreground font-semibold">Cena objednávky</div>
                        <div className="font-bold text-dragon-dark">{eur(order.total)}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Kam smeruje: {order.customerName} - {order.address}</div>
                    <div className="text-xs text-muted-foreground mt-1">{order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}</div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="problem" className="space-y-3">
              {problemOrders.length === 0 && <EmptyState title="Žiadne problémové objednávky" text="Tu sa objavia objednávky označené ako problém." />}
              {problemOrders.map((order) => (
                <Card key={order.id} className="border-0 shadow-md rounded-3xl bg-red-50">
                  <CardContent className="p-4">
                    <OrderHeader order={order} compact />
                    <OrderEarningDetails order={order} />
                    <OrderSummary order={order} />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StaffGate>
  )
}

function OrderHeader({ order, compact = false }: { order: OrderListItem; compact?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-3">
      <div>
        <div className="flex items-center gap-2">
          <span className={`${compact ? 'text-base' : 'text-lg'} font-bold text-dragon-dark`}>#{order.orderNumber}</span>
          <Badge className={`${statusLabels[order.status]?.color || 'bg-muted text-foreground'} text-[10px] border-0`}>
            {statusLabels[order.status]?.label || order.status}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <Clock className="w-3 h-3" />
          {order.createdAt || order.estimatedTime}
        </div>
      </div>
      <div className="text-right">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Zarobíš</div>
        <div className="text-xl font-bold text-dragon-red">{eur(order.courierEarning)}</div>
        <div className="text-[10px] text-muted-foreground">Cena {eur(order.total)} · {order.paymentMethod}</div>
      </div>
    </div>
  )
}

function StepBar({ status }: { status: string }) {
  const currentStep = getStepForStatus(status)
  return (
    <div className="flex items-center justify-between mb-4 px-1">
      {COURIER_STEPS.map((step, index) => {
        const isActive = currentStep >= step.step
        const isCurrent = currentStep === step.step
        return (
          <div key={step.status} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCurrent ? 'bg-dragon-red text-white ring-4 ring-dragon-red/15' : isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {isActive && !isCurrent ? '✓' : step.step}
              </div>
              <span className={`text-[9px] mt-1 text-center max-w-[58px] leading-tight ${isCurrent ? 'text-dragon-red font-semibold' : 'text-muted-foreground'}`}>{step.label}</span>
            </div>
            {index < COURIER_STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 -mt-4 ${currentStep > step.step ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        )
      })}
    </div>
  )
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="text-center py-14 rounded-3xl bg-white shadow-sm">
      <div className="text-4xl mb-3">🛵</div>
      <h2 className="text-lg font-bold text-dragon-dark">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">{text}</p>
    </div>
  )
}
