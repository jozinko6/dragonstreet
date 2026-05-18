'use client'

import { useState } from 'react'
import { useAdmin } from '@/lib/store'
import { mockOrders, mockCouriers, statusLabels } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Settings, ShoppingBag, UtensilsCrossed, Bike, BarChart3,
  Clock, Phone, MapPin, ChevronRight, Search, Eye, UserPlus
} from 'lucide-react'

export function AdminPanel() {
  const { adminTab, setAdminTab } = useAdmin()

  return (
    <div className="animate-float-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-dragon-red" />
          <h1 className="text-2xl font-bold text-dragon-dark">Admin panel</h1>
        </div>

        <Tabs value={adminTab} onValueChange={(v) => setAdminTab(v as typeof adminTab)}>
          <TabsList className="bg-muted/50 mb-6">
            <TabsTrigger value="orders" className="text-xs">
              <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
              Objednávky
              <Badge className="ml-1.5 bg-dragon-red text-white text-[9px] h-4 px-1.5">
                {mockOrders.filter((o) => ['CREATED', 'ACCEPTED', 'PREPARING'].includes(o.status)).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="menu" className="text-xs">
              <UtensilsCrossed className="w-3.5 h-3.5 mr-1.5" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="couriers" className="text-xs">
              <Bike className="w-3.5 h-3.5 mr-1.5" />
              Kuriéri
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
              Štatistiky
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
          <TabsContent value="menu">
            <MenuTab />
          </TabsContent>
          <TabsContent value="couriers">
            <CouriersTab />
          </TabsContent>
          <TabsContent value="stats">
            <StatsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function OrdersTab() {
  const [search, setSearch] = useState('')
  const [orders, setOrders] = useState(mockOrders)

  const activeOrders = orders.filter((o) =>
    !['DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED'].includes(o.status)
  )
  const completedOrders = orders.filter((o) =>
    ['DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED'].includes(o.status)
  )

  const changeStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Nové', count: orders.filter((o) => o.status === 'CREATED').length, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pripravujú sa', count: orders.filter((o) => ['ACCEPTED', 'PREPARING'].includes(o.status)).length, color: 'text-orange-600 bg-orange-50' },
          { label: 'Na ceste', count: orders.filter((o) => ['OUT_FOR_DELIVERY', 'PICKED_UP'].includes(o.status)).length, color: 'text-dragon-red bg-dragon-red/10' },
          { label: 'Dokončené', count: completedOrders.length, color: 'text-green-600 bg-green-50' },
        ].map((s, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${s.color.split(' ')[0]}`}>{s.count}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Orders */}
      <div>
        <h3 className="font-bold text-dragon-dark mb-3">Aktívne objednávky</h3>
        <div className="space-y-3">
          {activeOrders.map((order) => (
            <Card key={order.id} className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-dragon-dark">#{order.orderNumber}</span>
                      <Badge className={`${statusLabels[order.status]?.color} text-[10px] border-0`}>
                        {statusLabels[order.status]?.icon} {statusLabels[order.status]?.label}
                      </Badge>
                      {order.deliveryType === 'DELIVERY' ? (
                        <Badge variant="outline" className="text-[10px]"><Truck className="w-3 h-3 mr-0.5" /> Doručenie</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]"><Store className="w-3 h-3 mr-0.5" /> Odber</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">{order.customerName}</span> • {order.createdAt} • {order.total.toFixed(2)}€
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                    {order.notes && (
                      <div className="text-xs text-amber-600 mt-1">📝 {order.notes}</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {order.status === 'CREATED' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7" onClick={() => changeStatus(order.id, 'ACCEPTED')}>
                        Prijať
                      </Button>
                    )}
                    {order.status === 'ACCEPTED' && (
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-7" onClick={() => changeStatus(order.id, 'PREPARING')}>
                        Pripravovať
                      </Button>
                    )}
                    {order.status === 'PREPARING' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-7" onClick={() => changeStatus(order.id, 'READY_FOR_PICKUP')}>
                        Hotové
                      </Button>
                    )}
                    {order.status === 'READY_FOR_PICKUP' && order.deliveryType === 'DELIVERY' && (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7" onClick={() => changeStatus(order.id, 'OUT_FOR_DELIVERY')}>
                        Prideliť kuriéra
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-xs h-7">
                      <Eye className="w-3 h-3 mr-1" /> Detail
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function Truck(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
    </svg>
  )
}

function Store(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
    </svg>
  )
}

function MenuTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-dragon-dark">Správa menu</h3>
        <Button className="bg-dragon-red hover:bg-dragon-red-dark text-white text-xs">
          + Pridať položku
        </Button>
      </div>
      <div className="space-y-2">
        {['Rezance', 'Ryžové jedlá', 'Kura', 'Predjedlá', 'Curry', 'Nápoje'].map((cat, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="font-medium text-sm">{cat}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({[3, 2, 3, 3, 3, 3][i]} položiek)
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs">Upraviť</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CouriersTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-dragon-dark">Kuriéri</h3>
        <Button className="bg-dragon-red hover:bg-dragon-red-dark text-white text-xs">
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          Pridať kuriéra
        </Button>
      </div>
      <div className="space-y-3">
        {mockCouriers.map((courier) => (
          <Card key={courier.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  courier.isOnline ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Bike className={`w-5 h-5 ${courier.isOnline ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{courier.name}</span>
                    <Badge className={`text-[10px] border-0 ${
                      courier.isOnline
                        ? courier.isAvailable ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {courier.isOnline ? (courier.isAvailable ? 'Dostupný' : 'Obsadený') : 'Offline'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {courier.vehicleType} • {courier.location} • {courier.activeOrders} aktívnych
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Phone className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function StatsTab() {
  return (
    <div>
      <h3 className="font-bold text-dragon-dark mb-4">Štatistiky</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Objednávky dnes', value: '24', change: '+12%' },
          { label: 'Tržby dnes', value: '486€', change: '+8%' },
          { label: 'Priem. čas doručenia', value: '32 min', change: '-5%' },
          { label: 'Spokojnosť', value: '4.8★', change: '+0.1' },
        ].map((s, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-dragon-dark">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-xs text-green-600 mt-1">{s.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Simple chart placeholder */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h4 className="font-medium text-sm text-dragon-dark mb-4">Objednávky za posledných 7 dní</h4>
          <div className="flex items-end gap-2 h-40">
            {[18, 22, 15, 28, 24, 32, 24].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-dragon-red/80 rounded-t-sm transition-all hover:bg-dragon-red"
                  style={{ height: `${(v / 32) * 100}%` }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'][i]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
