'use client'

import { useEffect, useState } from 'react'
import { statusLabels } from '@/lib/data'
import { mapApiOrder, type OrderListItem } from '@/lib/order-api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChefHat, Clock, AlertTriangle, Printer, CheckCircle2, Flame } from 'lucide-react'

export function KitchenPanel() {
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [error, setError] = useState('')

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders?limit=100', { cache: 'no-store' })
      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Objednavky sa nepodarilo nacitat')
      }
      setOrders(json.data.map(mapApiOrder))
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Objednavky sa nepodarilo nacitat')
    }
  }

  useEffect(() => {
    loadOrders()
    const intervalId = window.setInterval(loadOrders, 10000)
    return () => window.clearInterval(intervalId)
  }, [])

  const activeOrders = orders.filter((o) =>
    ['ACCEPTED', 'PREPARING'].includes(o.status)
  )
  const readyOrders = orders.filter((o) =>
    ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(o.status)
  )

  const changeStatus = async (orderId: string, newStatus: string) => {
    const previousOrders = orders
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: newStatus, changedBy: 'kitchen' }),
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

  const formatTime = (time: string) => {
    const now = new Date()
    const [h, m] = time.split(':').map(Number)
    const orderTime = new Date()
    orderTime.setHours(h, m, 0)
    const diff = Math.floor((now.getTime() - orderTime.getTime()) / 60000)
    return diff > 0 ? `${diff} min` : 'Teraz'
  }

  return (
    <div className="animate-float-up">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ChefHat className="w-6 h-6 text-dragon-red" />
            <h1 className="text-2xl font-bold text-dragon-dark">Kuchynský panel</h1>
          </div>
          <Badge className="bg-dragon-red text-white">
            {activeOrders.length} aktívnych
          </Badge>
        </div>

        <Tabs defaultValue="active">
          {error && <div className="mb-4 text-sm text-red-700 bg-red-50 rounded-lg p-3">{error}</div>}

          <TabsList className="bg-muted/50 mb-6">
            <TabsTrigger value="active" className="text-xs">
              <Flame className="w-3.5 h-3.5 mr-1.5" />
              Aktívne ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="ready" className="text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Hotové ({readyOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">👨‍🍳</div>
                <p className="text-muted-foreground">Žiadne aktívne objednávky</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeOrders.map((order) => (
                  <Card key={order.id} className="border-0 shadow-md overflow-hidden">
                    <div className={`h-1.5 ${
                      order.status === 'PREPARING' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-dragon-dark">#{order.orderNumber}</span>
                          <Badge className={`${statusLabels[order.status]?.color} text-[10px] border-0`}>
                            {statusLabels[order.status]?.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {order.createdAt}
                        </div>
                      </div>

                      {/* Type */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-[10px]">
                          {order.deliveryType === 'DELIVERY' ? '🛵 Doručenie' : '🏪 Osobný odber'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ETA: {order.estimatedTime}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="bg-dragon-red text-white text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center shrink-0">
                              {item.quantity}
                            </span>
                            <span className="font-medium">{item.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-3">
                          <div className="flex items-center gap-1 text-xs font-medium text-amber-800">
                            <AlertTriangle className="w-3 h-3" />
                            Poznámka zákazníka
                          </div>
                          <p className="text-xs text-amber-700 mt-0.5">{order.notes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        {order.status === 'ACCEPTED' && (
                          <Button
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs"
                            onClick={() => changeStatus(order.id, 'PREPARING')}
                          >
                            <Flame className="w-3.5 h-3.5 mr-1" />
                            Začať pripravovať
                          </Button>
                        )}
                        {order.status === 'PREPARING' && (
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                            onClick={() => changeStatus(order.id, 'READY_FOR_PICKUP')}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Hotové
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="text-xs">
                          <Printer className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ready">
            {readyOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-muted-foreground">Žiadne hotové objednávky</p>
              </div>
            ) : (
              <div className="space-y-3">
                {readyOrders.map((order) => (
                  <Card key={order.id} className="border-0 shadow-sm opacity-80">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">#{order.orderNumber}</span>
                          <Badge className={`${statusLabels[order.status]?.color} text-[10px] border-0`}>
                            {statusLabels[order.status]?.label}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {order.customerName} • {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        onClick={() => changeStatus(order.id, 'COMPLETED')}
                      >
                        Dokončiť
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
