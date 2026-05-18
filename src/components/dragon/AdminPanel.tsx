'use client'

import { useState } from 'react'
import { useAdmin } from '@/lib/store'
import { mockOrders, mockCouriers, statusLabels, menuItems, deliveryZones } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Settings, ShoppingBag, UtensilsCrossed, Bike, BarChart3,
  Clock, Phone, MapPin, ChevronRight, Search, Eye, UserPlus,
  AlertTriangle, Copy, Check, Megaphone, Star, Flame
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
          <TabsList className="bg-muted/50 mb-6 flex-wrap h-auto gap-1">
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
            <TabsTrigger value="marketing" className="text-xs">
              <Megaphone className="w-3.5 h-3.5 mr-1.5" />
              Marketing
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
          <TabsContent value="marketing">
            <MarketingTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ─── Orders Tab ──────────────────────────────────────────────────────────────────

function OrdersTab() {
  const [search, setSearch] = useState('')
  const [orders, setOrders] = useState(mockOrders)
  const [problemOrderId, setProblemOrderId] = useState<string | null>(null)
  const [problemReason, setProblemReason] = useState('')

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
    setProblemOrderId(null)
    setProblemReason('')
  }

  const handleProblem = (orderId: string) => {
    if (problemReason.trim()) {
      changeStatus(orderId, 'PROBLEM')
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Nové', count: orders.filter((o) => o.status === 'CREATED').length, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pripravujú sa', count: orders.filter((o) => ['ACCEPTED', 'PREPARING'].includes(o.status)).length, color: 'text-orange-600 bg-orange-50' },
          { label: 'Na ceste', count: orders.filter((o) => ['OUT_FOR_DELIVERY', 'PICKED_UP', 'COURIER_ON_WAY', 'COURIER_ASSIGNED'].includes(o.status)).length, color: 'text-dragon-red bg-dragon-red/10' },
          { label: 'Problém', count: orders.filter((o) => o.status === 'PROBLEM').length, color: 'text-red-600 bg-red-50' },
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Hľadať podľa mena alebo čísla objednávky..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Active Orders */}
      <div>
        <h3 className="font-bold text-dragon-dark mb-3">Aktívne objednávky</h3>
        <div className="space-y-3">
          {activeOrders
            .filter((o) => !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.orderNumber.toLowerCase().includes(search.toLowerCase()))
            .map((order) => (
            <Card key={order.id} className={`border-0 shadow-sm overflow-hidden ${order.status === 'PROBLEM' ? 'ring-2 ring-red-300' : ''}`}>
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-sm text-dragon-dark">#{order.orderNumber}</span>
                      <Badge className={`${statusLabels[order.status]?.color} text-[10px] border-0`}>
                        {statusLabels[order.status]?.icon} {statusLabels[order.status]?.label}
                      </Badge>
                      {order.deliveryType === 'DELIVERY' ? (
                        <Badge variant="outline" className="text-[10px]"><TruckIcon className="w-3 h-3 mr-0.5" /> Doručenie</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]"><StoreIcon className="w-3 h-3 mr-0.5" /> Odber</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">{order.customerName}</span> • {order.createdAt} • {order.total.toFixed(2)}€
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                    {order.deliveryType === 'DELIVERY' && order.address && (
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {order.address}
                      </div>
                    )}
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
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7" onClick={() => changeStatus(order.id, 'COURIER_ASSIGNED')}>
                        Prideliť kuriéra
                      </Button>
                    )}
                    {/* Problem button */}
                    {!['DELIVERED', 'COMPLETED', 'CANCELLED', 'PROBLEM'].includes(order.status) && problemOrderId !== order.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-7"
                        onClick={() => setProblemOrderId(order.id)}
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Problém
                      </Button>
                    )}
                    {problemOrderId === order.id && (
                      <div className="space-y-1">
                        <Input
                          placeholder="Dôvod problému..."
                          value={problemReason}
                          onChange={(e) => setProblemReason(e.target.value)}
                          className="text-xs h-7"
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white text-[10px] h-6 flex-1"
                            onClick={() => handleProblem(order.id)}
                            disabled={!problemReason.trim()}
                          >
                            Nahlásiť
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[10px] h-6"
                            onClick={() => { setProblemOrderId(null); setProblemReason('') }}
                          >
                            Zrušiť
                          </Button>
                        </div>
                      </div>
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

      {/* Completed orders */}
      {completedOrders.length > 0 && (
        <div>
          <h3 className="font-bold text-dragon-dark mb-3 text-muted-foreground">Dokončené objednávky</h3>
          <div className="space-y-2 opacity-60">
            {completedOrders.map((order) => (
              <Card key={order.id} className="border-0 shadow-sm">
                <CardContent className="p-3 flex items-center gap-3">
                  <span className="font-medium text-sm">#{order.orderNumber}</span>
                  <Badge className={`${statusLabels[order.status]?.color} text-[10px] border-0`}>
                    {statusLabels[order.status]?.icon} {statusLabels[order.status]?.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{order.customerName}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{order.total.toFixed(2)}€</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Menu Tab ────────────────────────────────────────────────────────────────────

function MenuTab() {
  const dailyMenuItems = menuItems.filter((i) => i.isDailyMenu)
  const weeklySpecialItems = menuItems.filter((i) => i.isWeeklySpecial)

  const categoryList = [
    { name: 'Burgre', count: menuItems.filter((i) => i.categoryId === 'cat-7').length },
    { name: 'Kebab', count: menuItems.filter((i) => i.categoryId === 'cat-10').length },
    { name: 'Pinsa', count: menuItems.filter((i) => i.categoryId === 'cat-6').length },
    { name: 'Hot dog', count: menuItems.filter((i) => i.categoryId === 'cat-9').length },
    { name: 'Wrapy', count: menuItems.filter((i) => i.categoryId === 'cat-15').length },
    { name: 'Dezerty', count: menuItems.filter((i) => i.categoryId === 'cat-20').length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-dragon-dark">Správa menu</h3>
        <Button className="bg-dragon-red hover:bg-dragon-red-dark text-white text-xs">
          + Pridať položku
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {categoryList.map((cat, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="font-medium text-sm">{cat.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({cat.count} položiek)
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs">Upraviť</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Denné menu section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="font-bold text-dragon-dark">Denné menu</h3>
          <Badge className="bg-orange-100 text-orange-700 text-[10px] border-0">
            {dailyMenuItems.length} položiek
          </Badge>
        </div>
        <div className="space-y-2">
          {dailyMenuItems.map((item) => (
            <Card key={item.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-lg">
                    📋
                  </div>
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.price.toFixed(2)}€ • {item.weight}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-700 text-[10px] border-0">Aktívne</Badge>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Týždenný špeciál section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-dragon-dark">Týždenný špeciál</h3>
          <Badge className="bg-purple-100 text-purple-700 text-[10px] border-0">
            {weeklySpecialItems.length} položiek
          </Badge>
        </div>
        <div className="space-y-2">
          {weeklySpecialItems.map((item) => (
            <Card key={item.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-lg">
                    ⭐
                  </div>
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.price.toFixed(2)}€ • {item.weight}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-700 text-[10px] border-0">Aktívne</Badge>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Couriers Tab ────────────────────────────────────────────────────────────────

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

// ─── Stats Tab ───────────────────────────────────────────────────────────────────

function StatsTab() {
  return (
    <div className="space-y-6">
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

      {/* Chart */}
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

      {/* Delivery Zones */}
      <div className="mt-8">
        <h3 className="font-bold text-dragon-dark mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-dragon-red" />
          Doručovacie zóny
        </h3>
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium text-xs">Zóna</th>
                  <th className="text-center p-3 font-medium text-xs">Doručovné</th>
                  <th className="text-center p-3 font-medium text-xs">Free delivery od</th>
                  <th className="text-center p-3 font-medium text-xs">Min. objednávka</th>
                  <th className="text-center p-3 font-medium text-xs">Čas doručenia</th>
                </tr>
              </thead>
              <tbody>
                {deliveryZones.map((zone, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/20'}>
                    <td className="p-3 font-medium text-xs">{zone.name}</td>
                    <td className="p-3 text-center text-xs">{zone.fee.toFixed(2)}€</td>
                    <td className="p-3 text-center text-xs">
                      {zone.freeDeliveryThreshold > 0 ? `${zone.freeDeliveryThreshold.toFixed(2)}€` : '—'}
                    </td>
                    <td className="p-3 text-center text-xs">{zone.minOrder}€</td>
                    <td className="p-3 text-center text-xs">{zone.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Marketing Tab ───────────────────────────────────────────────────────────────

function MarketingTab() {
  const [selectedItem, setSelectedItem] = useState('')
  const [postType, setPostType] = useState<'facebook' | 'instagram' | 'story'>('facebook')
  const [generatedText, setGeneratedText] = useState('')
  const [copied, setCopied] = useState(false)

  // Get unique menu item names for dropdown
  const menuItemNames = menuItems
    .filter((i) => i.isAvailable)
    .map((i) => i.name)
    .filter((name, idx, arr) => arr.indexOf(name) === idx)
    .slice(0, 30) // Limit to 30 items for the dropdown

  const generatePost = () => {
    const item = selectedItem || 'Dragon Burger'
    switch (postType) {
      case 'facebook':
        setGeneratedText(`Dnes mám chuť na ${item} z Dragon Street Food Hlohovec. Kto sa pridá? 🍔🔥`)
        break
      case 'instagram':
        setGeneratedText(`🍔 ${item} z Dragon Street Food – objednaj si priamo cez náš web! Link v bio. #dragonstreetfood #hlohovec #streetfood`)
        break
      case 'story':
        setGeneratedText(`${item} 🔥 Objednaj: dragonstreetfood.sk`)
        break
    }
    setCopied(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = generatedText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const hashtags = ['#dragonstreetfood', '#hlohovec', '#streetfood', '#burger', '#kebab', '#pinsa']

  // Pre-generated example posts
  const examplePosts = [
    {
      type: 'Facebook',
      icon: '📘',
      text: 'Dnes mám chuť na Dragon Burger z Dragon Street Food Hlohovec. Kto sa pridá? 🍔🔥',
    },
    {
      type: 'Instagram',
      icon: '📸',
      text: '🍔 Kebab v chlebe z Dragon Street Food – objednaj si priamo cez náš web! Link v bio. #dragonstreetfood #hlohovec #streetfood',
    },
    {
      type: 'Story',
      icon: '📱',
      text: 'Pinsa Quattro Formaggi 🔥 Objednaj: dragonstreetfood.sk',
    },
  ]

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-dragon-dark flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-dragon-red" />
        Marketingové príspevky
      </h3>

      {/* Generator */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-dragon-dark mb-2 block">Jedlo z menu</label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte jedlo z menu..." />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {menuItemNames.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-dragon-dark mb-2 block">Typ príspevku</label>
            <div className="flex gap-2">
              {[
                { value: 'facebook' as const, label: 'Facebook', icon: '📘' },
                { value: 'instagram' as const, label: 'Instagram', icon: '📸' },
                { value: 'story' as const, label: 'Story', icon: '📱' },
              ].map((pt) => (
                <Button
                  key={pt.value}
                  variant={postType === pt.value ? 'default' : 'outline'}
                  className={`text-xs ${postType === pt.value ? 'bg-dragon-red hover:bg-dragon-red-dark text-white' : ''}`}
                  onClick={() => setPostType(pt.value)}
                >
                  {pt.icon} {pt.label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="w-full bg-dragon-red hover:bg-dragon-red-dark text-white"
            onClick={generatePost}
          >
            <Megaphone className="w-4 h-4 mr-2" />
            Vygenerovať príspevok
          </Button>

          {generatedText && (
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{generatedText}</p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    Skopírované!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Kopírovať text
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hashtag suggestions */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h4 className="font-medium text-sm text-dragon-dark mb-3">Navrhované hashtagy</h4>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <Badge
                key={tag}
                className="bg-dragon-red/10 text-dragon-red border-0 cursor-pointer hover:bg-dragon-red/20 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(tag).catch(() => {})
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Kliknutím skopírujete hashtag</p>
        </CardContent>
      </Card>

      {/* Example pre-generated posts */}
      <div>
        <h4 className="font-medium text-sm text-dragon-dark mb-3">Predgenerované príspevky</h4>
        <div className="space-y-3">
          {examplePosts.map((post, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{post.icon}</span>
                  <div className="flex-1 min-w-0">
                    <Badge className="bg-muted text-muted-foreground text-[10px] border-0 mb-2">
                      {post.type}
                    </Badge>
                    <p className="text-sm">{post.text}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs shrink-0"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(post.text)
                      } catch {
                        const textArea = document.createElement('textarea')
                        textArea.value = post.text
                        document.body.appendChild(textArea)
                        textArea.select()
                        document.execCommand('copy')
                        document.body.removeChild(textArea)
                      }
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Kopírovať
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Inline SVG Icons ────────────────────────────────────────────────────────────

function TruckIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
    </svg>
  )
}

function StoreIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
    </svg>
  )
}
