'use client'

import { useState } from 'react'
import { mockOrders, statusLabels } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Bike, Phone, MapPin, Package, CheckCircle2, Clock,
  ChevronRight, Navigation, DollarSign, TrendingUp
} from 'lucide-react'

export function CourierPanel() {
  const [isAvailable, setIsAvailable] = useState(true)
  const [orders, setOrders] = useState(mockOrders.filter((o) => o.deliveryType === 'DELIVERY'))

  const assignedOrders = orders.filter((o) =>
    ['OUT_FOR_DELIVERY', 'COURIER_ASSIGNED', 'PICKED_UP'].includes(o.status)
  )
  const completedOrders = orders.filter((o) => ['DELIVERED', 'COMPLETED'].includes(o.status))
  const waitingOrders = orders.filter((o) =>
    ['READY_FOR_PICKUP'].includes(o.status)
  )

  const changeStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  return (
    <div className="animate-float-up">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bike className="w-6 h-6 text-dragon-red" />
            <div>
              <h1 className="text-xl font-bold text-dragon-dark">Kuriérsky panel</h1>
              <p className="text-xs text-muted-foreground">Milan Števko</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="availability" className="text-xs text-muted-foreground">
              {isAvailable ? 'Dostupný' : 'Nedostupný'}
            </Label>
            <Switch
              id="availability"
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
            />
          </div>
        </div>

        {/* Stats */}
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
              <div className="text-lg font-bold text-dragon-dark">7</div>
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
                        {statusLabels[order.status]?.label}
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
                        onClick={() => changeStatus(order.id, 'OUT_FOR_DELIVERY')}
                      >
                        <Package className="w-3.5 h-3.5 mr-1" />
                        Vyzdvihnúť
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
              {assignedOrders.map((order) => (
                <Card key={order.id} className="border-0 shadow-md bg-dragon-red/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-dragon-dark">#{order.orderNumber}</span>
                      <Badge className="bg-dragon-red/10 text-dragon-red text-[10px] border-0">
                        🛵 Na ceste
                      </Badge>
                    </div>

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

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
                      onClick={() => changeStatus(order.id, 'DELIVERED')}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Doručené
                    </Button>
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
  )
}
