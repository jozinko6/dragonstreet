'use client'

import { useNavigation, useOrder } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Truck, ChefHat, Store, Clock, Phone, Package, Home, Share2 } from 'lucide-react'

const trackingSteps = [
  { key: 'CREATED', label: 'Objednávka vytvorená', icon: <Check className="w-4 h-4" /> },
  { key: 'ACCEPTED', label: 'Prijatá reštauráciou', icon: <Store className="w-4 h-4" /> },
  { key: 'PREPARING', label: 'Pripravuje sa', icon: <ChefHat className="w-4 h-4" /> },
  { key: 'READY_FOR_PICKUP', label: 'Pripravená', icon: <Package className="w-4 h-4" /> },
  { key: 'OUT_FOR_DELIVERY', label: 'Na ceste k vám', icon: <Truck className="w-4 h-4" /> },
  { key: 'DELIVERED', label: 'Doručená', icon: <Home className="w-4 h-4" /> },
]

const statusOrder = ['CREATED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED']

export function OrderTracking() {
  const { currentOrder } = useOrder()
  const { navigate } = useNavigation()

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

  const currentStatusIndex = statusOrder.indexOf(currentOrder.status)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 animate-float-up">
      {/* Order Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">
          {currentOrder.status === 'DELIVERED' ? '🎉' : currentOrder.status === 'OUT_FOR_DELIVERY' ? '🛵' : '🍳'}
        </div>
        <h1 className="text-2xl font-bold text-dragon-dark mb-1">
          {currentOrder.status === 'DELIVERED'
            ? 'Objednávka doručená!'
            : currentOrder.status === 'OUT_FOR_DELIVERY'
            ? 'Kuriér je na ceste!'
            : 'Vaša objednávka sa pripravuje'}
        </h1>
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <span>Objednávka #{currentOrder.orderNumber}</span>
          <Badge className="bg-dragon-red/10 text-dragon-red border-dragon-red/20 text-xs">
            {currentOrder.deliveryType === 'DELIVERY' ? 'Doručenie' : 'Osobný odber'}
          </Badge>
        </div>
      </div>

      {/* ETA */}
      {currentOrder.status !== 'DELIVERED' && (
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-dragon-red text-white'
                          : 'bg-muted text-muted-foreground'
                      } ${isCurrent ? 'animate-dragon-glow' : ''}`}
                    >
                      {step.icon}
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
