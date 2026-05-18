'use client'

import { useEffect, useState } from 'react'
import { useNavigation, useOrder } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Truck, ChefHat, Store, Clock, Phone, Package, Home, Share2, AlertTriangle, Car, Footprints } from 'lucide-react'

const trackingSteps = [
  { key: 'CREATED', label: 'Objednávka vytvorená', emoji: '📋' },
  { key: 'ACCEPTED', label: 'Prijatá reštauráciou', emoji: '✅' },
  { key: 'PREPARING', label: 'Pripravuje sa', emoji: '🍳' },
  { key: 'READY_FOR_PICKUP', label: 'Pripravená', emoji: '📦' },
  { key: 'COURIER_ASSIGNED', label: 'Kuriér pridelený', emoji: '🚗' },
  { key: 'COURIER_ON_WAY', label: 'Kuriér ide do prevádzky', emoji: '🚶' },
  { key: 'PICKED_UP', label: 'Vyzdvihnutá kuriérom', emoji: '📦' },
  { key: 'OUT_FOR_DELIVERY', label: 'Na ceste k vám', emoji: '🛵' },
  { key: 'DELIVERED', label: 'Doručená', emoji: '🏠' },
]

const statusOrder = [
  'CREATED',
  'ACCEPTED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'COURIER_ASSIGNED',
  'COURIER_ON_WAY',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
]

// Statuses that mean a problem occurred
const problemStatus = 'PROBLEM'

export function OrderTracking() {
  const { currentOrder, setCurrentOrder } = useOrder()
  const { navigate } = useNavigation()
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!currentOrder?.id) return

    let isMounted = true

    async function loadOrder() {
      try {
        const response = await fetch(`/api/orders/${currentOrder!.id}`, { cache: 'no-store' })
        const json = await response.json()
        if (!response.ok || !json.success) {
          throw new Error(json.error || 'Objednavku sa nepodarilo nacitat')
        }

        const order = json.data
        if (isMounted) {
          setCurrentOrder({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            estimatedDeliveryTime: order.estimatedDeliveryTime || currentOrder!.estimatedDeliveryTime,
            items: order.items.map((item: { menuItemName: string; menuItemNameSk: string; quantity: number; unitPrice: number }) => ({
              name: item.menuItemName,
              nameSk: item.menuItemNameSk || item.menuItemName,
              quantity: item.quantity,
              price: item.unitPrice,
            })),
            deliveryType: order.deliveryType,
            total: order.totalAmount,
          })
          setLoadError('')
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(err instanceof Error ? err.message : 'Objednavku sa nepodarilo nacitat')
        }
      }
    }

    loadOrder()
    const intervalId = window.setInterval(loadOrder, 7000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [currentOrder?.id, setCurrentOrder])

  if (!currentOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center animate-float-up">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-dragon-dark mb-2">Žiadna aktívna objednávka</h2>
        <p className="text-muted-foreground mb-6">Nemáte momentálne žiadnu objednávku na sledovanie</p>
        <Button
          onClick={() => navigate('menu')}
          className="bg-dragon-red hover:bg-dragon-red-dark text-white rounded-xl px-8"
        >
          Objednať jedlo
        </Button>
      </div>
    )
  }

  const isProblem = currentOrder.status === problemStatus
  const currentStatusIndex = isProblem ? -1 : statusOrder.indexOf(currentOrder.status)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 animate-float-up">
      {/* Order Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">
          {isProblem ? '⚠️' : currentOrder.status === 'DELIVERED' ? '🎉' : 
           currentOrder.status === 'OUT_FOR_DELIVERY' ? '🛵' : 
           currentOrder.status === 'COURIER_ON_WAY' ? '🚶' :
           currentOrder.status === 'COURIER_ASSIGNED' ? '🚗' :
           currentOrder.status === 'PICKED_UP' ? '📦' :
           currentOrder.status === 'PREPARING' ? '🍳' : '📋'}
        </div>
        <h1 className="text-2xl font-bold text-dragon-dark mb-1">
          {isProblem
            ? 'Problém s objednávkou'
            : currentOrder.status === 'DELIVERED'
            ? 'Objednávka doručená!'
            : currentOrder.status === 'OUT_FOR_DELIVERY'
            ? 'Kuriér je na ceste k vám!'
            : currentOrder.status === 'PICKED_UP'
            ? 'Kuriér vyzdvihol objednávku!'
            : currentOrder.status === 'COURIER_ON_WAY'
            ? 'Kuriér ide do prevádzky!'
            : currentOrder.status === 'COURIER_ASSIGNED'
            ? 'Kuriér bol pridelený!'
            : 'Vaša objednávka sa pripravuje'}
        </h1>
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <span>Objednávka #{currentOrder.orderNumber}</span>
          <Badge className="bg-dragon-red/10 text-dragon-red border-dragon-red/20 text-xs">
            {currentOrder.deliveryType === 'DELIVERY' ? 'Doručenie' : 'Osobný odber'}
          </Badge>
        </div>
      </div>

      {loadError && (
        <Card className="border-0 shadow-sm mb-6 bg-amber-50 border-amber-200">
          <CardContent className="p-4 text-sm text-amber-800">
            {loadError}
          </CardContent>
        </Card>
      )}

      {/* Problem Banner */}
      {isProblem && (
        <Card className="border-0 shadow-sm mb-6 bg-amber-50 border-amber-200">
          <CardContent className="p-5 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-amber-800">Problém s objednávkou</div>
              <div className="text-sm text-amber-700 mt-1">
                Nastala chyba pri spracovaní vašej objednávky. Prosím, kontaktujte nás na telefónnom čísle nižšie.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ETA */}
      {currentOrder.status !== 'DELIVERED' && !isProblem && (
        <Card className="border-0 shadow-sm mb-6 bg-dragon-dark text-white">
          <CardContent className="p-5 flex items-center gap-4">
            <Clock className="w-8 h-8 text-dragon-orange" />
            <div>
              <div className="text-sm text-white/50">Odhadovaný čas</div>
              <div className="text-xl font-bold">{currentOrder.estimatedDeliveryTime}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Tracker */}
      {!isProblem && (
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold text-dragon-dark mb-6">Stav objednávky</h3>
            <div className="space-y-0">
              {trackingSteps.map((step, index) => {
                const isCompleted = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex
                const isLast = index === trackingSteps.length - 1

                return (
                  <div key={step.key} className="flex gap-4">
                    {/* Line + Circle */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all text-sm ${
                          isCompleted
                            ? 'bg-dragon-red text-white'
                            : 'bg-muted text-muted-foreground'
                        } ${isCurrent ? 'animate-dragon-glow' : ''}`}
                      >
                        {step.emoji}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 h-8 ${
                            index < currentStatusIndex ? 'bg-dragon-red' : 'bg-muted'
                          }`}
                        />
                      )}
                    </div>
                    {/* Label */}
                    <div className="pt-1">
                      <span
                        className={`text-sm font-medium ${
                          isCompleted ? 'text-dragon-dark' : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Items */}
      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-5">
          <h3 className="font-bold text-dragon-dark mb-3">Položky objednávky</h3>
          <div className="space-y-2">
            {currentOrder.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.nameSk}
                </span>
                <span className="font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between font-bold">
            <span>Celkom</span>
            <span className="text-dragon-red">{currentOrder.total.toFixed(2)}€</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <Phone className="w-5 h-5 text-dragon-red" />
            <div>
              <div className="text-xs text-muted-foreground">Potrebujete pomoc?</div>
              <div className="text-sm font-semibold">+421 912 345 678</div>
            </div>
          </CardContent>
        </Card>
        <Button
          variant="outline"
          className="h-auto py-4 rounded-xl border-dragon-red/20 text-dragon-red hover:bg-dragon-red/5"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Zdieľať objednávku
        </Button>
      </div>

      {currentOrder.status === 'DELIVERED' && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => navigate('menu')}
            className="bg-dragon-red hover:bg-dragon-red-dark text-white rounded-xl px-8"
          >
            Objednať znova
          </Button>
        </div>
      )}
    </div>
  )
}
