'use client'

import { useEffect, useState, useMemo } from 'react'
import { useCart } from '@/lib/store'
import { allergenMap, type MenuItem, type MenuResponse } from '@/lib/menu-api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Search, Star, Plus, Minus, ShoppingCart, AlertTriangle } from 'lucide-react'

// ─── Badge helper ──────────────────────────────────────────────────────────────
function ItemBadges({ item, size = 'sm' }: { item: MenuItem; size?: 'sm' | 'xs' }) {
  const badgeClass = size === 'xs' ? 'text-[9px]' : 'text-[10px]'
  return (
    <>
      {item.isPopular && (
        <Badge className={`bg-dragon-red text-white border-0 ${badgeClass}`}>
          <Star className="w-3 h-3 mr-0.5" /> TOP
        </Badge>
      )}
      {item.isSpicy && (
        <Badge className={`bg-orange-500 text-white border-0 ${badgeClass}`}>
          🌶 Pálivé
        </Badge>
      )}
      {item.isNew && (
        <Badge className={`bg-dragon-lime text-dragon-dark border-0 ${badgeClass}`}>
          NOVINKA
        </Badge>
      )}
      {item.isVegetarian && (
        <Badge className={`bg-green-500 text-white border-0 ${badgeClass}`}>
          🌿 Veg
        </Badge>
      )}
      {item.isAlcohol && (
        <Badge className={`bg-gray-800 text-white border-0 ${badgeClass}`}>
          🍺 18+
        </Badge>
      )}
      {item.isDailyDeal && (
        <Badge className={`bg-orange-500 text-white border-0 ${badgeClass}`}>
          🔥 AKCIA
        </Badge>
      )}
      {item.isWeeklySpecial && (
        <Badge className={`bg-purple-600 text-white border-0 ${badgeClass}`}>
          ⭐ ŠPECIÁL
        </Badge>
      )}
      {item.isDailyMenu && (
        <Badge className={`bg-blue-600 text-white border-0 ${badgeClass}`}>
          📋 MENU
        </Badge>
      )}
    </>
  )
}

// ─── Modifier group labels ─────────────────────────────────────────────────────
const modifierGroupLabels: Record<string, string> = {
  dressing: 'Výber dresingu',
  side: 'Príloha',
  spice_level: 'Pikantnosť',
  drink: 'Nápoj k menu',
}

// ─── Main component ────────────────────────────────────────────────────────────
export function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [menuData, setMenuData] = useState<MenuResponse>({ categories: [], items: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    let isMounted = true

    async function loadMenu() {
      try {
        setIsLoading(true)
        setError('')
        const response = await fetch('/api/menu', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Menu sa nepodarilo nacitat')
        }

        const json = await response.json()
        if (!json.success) {
          throw new Error(json.error || 'Menu sa nepodarilo nacitat')
        }

        if (isMounted) {
          setMenuData(json.data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Data sa nepodarilo nacitat')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMenu()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredItems = useMemo(() => {
    let items = menuData.items
    if (selectedCategory) {
      items = items.filter((i) => i.categoryId === selectedCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.nameSk.toLowerCase().includes(q) ||
          i.descriptionSk.toLowerCase().includes(q)
      )
    }
    return items
  }, [menuData.items, selectedCategory, searchQuery])

  const selectedItemData = selectedItem
    ? menuData.items.find((i) => i.id === selectedItem)
    : null

  return (
    <div className="animate-float-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-dragon-dark">
            Naše <span className="text-dragon-red">menu</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Vyberte si z našich street food špecialít
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Hľadať jedlo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-border/50"
          />
        </div>
      </div>

      {/* Sticky Category Tabs */}
      <div className="sticky top-16 sm:top-18 z-30 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-dragon-red text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Všetko
            </button>
            {menuData.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-dragon-red text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.nameSk}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading && Array.from({ length: 9 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-md">
              <div className="h-44 bg-muted animate-pulse" />
              <CardContent className="p-4 space-y-3">
                <div className="h-5 bg-muted rounded animate-pulse" />
                <div className="h-8 bg-muted rounded animate-pulse" />
                <div className="h-9 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}

          {!isLoading && filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`food-card-hover overflow-hidden border-0 shadow-md cursor-pointer group ${
                !item.isAvailable ? 'opacity-60' : ''
              }`}
              onClick={() => setSelectedItem(item.id)}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.nameSk}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <ItemBadges item={item} />
                  {!item.isAvailable && (
                    <Badge className="bg-gray-900/90 text-white border-0 text-xs font-bold">
                      Vypredané
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  {item.weight && (
                    <span className="bg-white/70 backdrop-blur-sm text-dragon-dark text-xs font-medium px-2 py-0.5 rounded-md">
                      {item.weight}
                    </span>
                  )}
                  <span className="bg-white/90 backdrop-blur-sm text-dragon-dark font-bold text-lg px-3 py-1 rounded-lg">
                    {item.price.toFixed(2)}€
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-dragon-dark">{item.nameSk}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.descriptionSk}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  {item.allergens.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <AlertTriangle className="w-3 h-3" />
                      Alergény: {item.allergens.join(', ')}
                    </div>
                  )}
                  <Button
                    className="bg-dragon-red hover:bg-dragon-red-dark text-white text-xs rounded-lg ml-auto"
                    size="sm"
                    disabled={!item.isAvailable}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!item.isAvailable) return
                      addItem({
                        id: `cart-${Date.now()}-${item.id}`,
                        menuItemId: item.id,
                        name: item.name,
                        nameSk: item.nameSk,
                        price: item.price,
                        quantity: 1,
                        image: item.image,
                        addons: [],
                        notes: '',
                        isSpicy: item.isSpicy,
                        isVegetarian: item.isVegetarian,
                        isAlcohol: item.isAlcohol,
                      })
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Pridať
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isLoading && error && (
          <div className="text-center py-16">
            <p className="text-dragon-red font-medium">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4 border-dragon-red text-dragon-red hover:bg-dragon-red/5"
            >
              Skusit znova
            </Button>
          </div>
        )}

        {!isLoading && !error && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground">Žiadne jedlá nezodpovedajú vášmu vyhľadávaniu</p>
          </div>
        )}
      </div>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItemData} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {selectedItemData && (
            <ItemDetail
              item={selectedItemData}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Item Detail Dialog Content ────────────────────────────────────────────────
function ItemDetail({
  item,
  onClose,
}: {
  item: MenuItem
  onClose: () => void
}) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState('')

  // Group addons by modifierGroup
  const groupedAddons = useMemo(() => {
    const groups: { group: string | null; label: string; addons: MenuItem['addons'] }[] = []
    const groupMap = new Map<string | null, MenuItem['addons']>()

    for (const addon of item.addons) {
      const key = addon.isModifier && addon.modifierGroup ? addon.modifierGroup : null
      if (!groupMap.has(key)) {
        groupMap.set(key, [])
      }
      groupMap.get(key)!.push(addon)
    }

    // Add modifier groups first (in order)
    const modifierOrder = ['dressing', 'side', 'spice_level', 'drink']
    for (const mg of modifierOrder) {
      const addons = groupMap.get(mg)
      if (addons) {
        groups.push({
          group: mg,
          label: modifierGroupLabels[mg] || mg,
          addons,
        })
      }
    }

    // Then add the "no group" addons (extras)
    const noGroupAddons = groupMap.get(null)
    if (noGroupAddons && noGroupAddons.length > 0) {
      groups.push({
        group: null,
        label: 'Prídavky',
        addons: noGroupAddons,
      })
    }

    return groups
  }, [item.addons])

  const addonsTotal =
    item.addons
      .filter((a) => selectedAddons.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0) +
    item.addons
      .filter((a) => Object.values(selectedModifiers).includes(a.id))
      .reduce((sum, a) => sum + a.price, 0)
  const itemTotal = (item.price + addonsTotal) * quantity

  const handleAdd = () => {
    if (!item.isAvailable) return
    const allSelectedAddonIds = [...selectedAddons, ...Object.values(selectedModifiers)]
    addItem({
      id: `cart-${Date.now()}-${item.id}`,
      menuItemId: item.id,
      name: item.name,
      nameSk: item.nameSk,
      price: item.price,
      quantity,
      image: item.image,
      addons: item.addons.filter((a) => allSelectedAddonIds.includes(a.id)),
      notes,
      isSpicy: item.isSpicy,
      isVegetarian: item.isVegetarian,
      isAlcohol: item.isAlcohol,
    })
    onClose()
  }

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    )
  }

  const selectModifier = (group: string, addonId: string) => {
    setSelectedModifiers((prev) => {
      if (prev[group] === addonId) {
        const next = { ...prev }
        delete next[group]
        return next
      }
      return { ...prev, [group]: addonId }
    })
  }

  return (
    <>
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.nameSk}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <ItemBadges item={item} />
          {!item.isAvailable && (
            <Badge className="bg-gray-900/90 text-white border-0 text-xs font-bold">
              Vypredané
            </Badge>
          )}
        </div>
      </div>
      <div className="p-6">
        <DialogTitle className="text-xl font-bold text-dragon-dark">
          {item.nameSk}
        </DialogTitle>
        <p className="text-sm text-muted-foreground mt-1">{item.descriptionSk}</p>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-2xl font-bold text-dragon-red">
            {item.price.toFixed(2)}€
          </span>
          {item.weight && (
            <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {item.weight}
            </span>
          )}
        </div>

        {/* Allergens */}
        {item.allergens.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-800 mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Alergény
            </div>
            <p className="text-xs text-amber-700">
              {item.allergens.map((a) => allergenMap[a] || a).join(', ')}
            </p>
          </div>
        )}

        {/* Grouped Addons / Modifiers */}
        {groupedAddons.length > 0 && (
          <div className="mt-4 space-y-4">
            {groupedAddons.map(({ group, label, addons }) => (
              <div key={group ?? 'extras'}>
                <h4 className="text-sm font-semibold text-dragon-dark mb-2">
                  {label}
                  {group && (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      (vyberte 1)
                    </span>
                  )}
                  {!group && (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      (vyberte ľubovoľný počet)
                    </span>
                  )}
                </h4>

                {group ? (
                  // Radio group for modifiers
                  <RadioGroup
                    value={selectedModifiers[group] || ''}
                    onValueChange={(val) => selectModifier(group, val)}
                    className="space-y-2"
                  >
                    {addons.map((addon) => (
                      <label
                        key={addon.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedModifiers[group] === addon.id
                            ? 'border-dragon-red bg-dragon-red/5'
                            : 'border-border hover:border-dragon-red/30'
                        }`}
                      >
                        <RadioGroupItem value={addon.id} id={addon.id} />
                        <div className="flex-1">
                          <Label htmlFor={addon.id} className="text-sm font-medium cursor-pointer">
                            {addon.nameSk}
                          </Label>
                        </div>
                        {addon.price > 0 && (
                          <span className="text-sm text-dragon-red font-medium">
                            +{addon.price.toFixed(2)}€
                          </span>
                        )}
                      </label>
                    ))}
                  </RadioGroup>
                ) : (
                  // Checkbox group for extras
                  <div className="space-y-2">
                    {addons.map((addon) => (
                      <label
                        key={addon.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedAddons.includes(addon.id)
                            ? 'border-dragon-red bg-dragon-red/5'
                            : 'border-border hover:border-dragon-red/30'
                        }`}
                      >
                        <Checkbox
                          checked={selectedAddons.includes(addon.id)}
                          onCheckedChange={() => toggleAddon(addon.id)}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium">{addon.nameSk}</span>
                        </div>
                        {addon.price > 0 && (
                          <span className="text-sm text-dragon-red font-medium">
                            +{addon.price.toFixed(2)}€
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        <div className="mt-4">
          <Label className="text-sm font-semibold">Poznámka k jedlu</Label>
          <Textarea
            placeholder="Napríklad: bez cibule, extra omáčka..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1.5 text-sm"
            rows={2}
          />
        </div>

        <Separator className="my-4" />

        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="font-bold w-8 text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleAdd}
            disabled={!item.isAvailable}
            className="flex-1 bg-dragon-red hover:bg-dragon-red-dark text-white py-5 text-sm font-semibold rounded-xl disabled:opacity-50"
          >
            {!item.isAvailable ? (
              'Vypredané'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Pridať za {itemTotal.toFixed(2)}€
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
