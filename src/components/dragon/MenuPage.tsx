'use client'

import { useState, useMemo } from 'react'
import { useNavigation, useCart, CartItem } from '@/lib/store'
import { menuItems, categories, allergenMap } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Search, Star, Flame, Leaf, Plus, Minus, ShoppingCart, ChevronRight, AlertTriangle } from 'lucide-react'

export function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const { addItem } = useCart()
  const { navigate } = useNavigation()

  const filteredItems = useMemo(() => {
    let items = menuItems.filter((i) => i.isAvailable)
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
  }, [selectedCategory, searchQuery])

  const selectedItemData = selectedItem
    ? menuItems.find((i) => i.id === selectedItem)
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
            Vyberte si z našich ázijských špecialít
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

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
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
          {categories.map((cat) => (
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

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="food-card-hover overflow-hidden border-0 shadow-md cursor-pointer group"
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
                  {item.isPopular && (
                    <Badge className="bg-dragon-red text-white text-[10px] border-0">
                      <Star className="w-3 h-3 mr-0.5" /> TOP
                    </Badge>
                  )}
                  {item.isSpicy && (
                    <Badge className="bg-orange-500 text-white text-[10px] border-0">
                      🌶 Pálivé
                    </Badge>
                  )}
                  {item.isNew && (
                    <Badge className="bg-dragon-lime text-dragon-dark text-[10px] border-0">
                      NOVINKA
                    </Badge>
                  )}
                  {item.isVegetarian && (
                    <Badge className="bg-green-500 text-white text-[10px] border-0">
                      🌿 Veg
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-3 right-3">
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
                    onClick={(e) => {
                      e.stopPropagation()
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

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground">Žiadne jedlá nezodpovedajú vášmu vyhľadávaniu</p>
          </div>
        )}
      </div>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItemData} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
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

function ItemDetail({
  item,
  onClose,
}: {
  item: (typeof menuItems)[0]
  onClose: () => void
}) {
  const { addItem } = useCart()
  const { navigate } = useNavigation()
  const [quantity, setQuantity] = useState(1)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  const addonsTotal = item.addons
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0)
  const itemTotal = (item.price + addonsTotal) * quantity

  const handleAdd = () => {
    addItem({
      id: `cart-${Date.now()}-${item.id}`,
      menuItemId: item.id,
      name: item.name,
      nameSk: item.nameSk,
      price: item.price,
      quantity,
      image: item.image,
      addons: item.addons.filter((a) => selectedAddons.includes(a.id)),
      notes,
      isSpicy: item.isSpicy,
      isVegetarian: item.isVegetarian,
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

  return (
    <>
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.nameSk}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {item.isPopular && (
            <Badge className="bg-dragon-red text-white text-[10px] border-0">
              <Star className="w-3 h-3 mr-0.5" /> TOP
            </Badge>
          )}
          {item.isSpicy && (
            <Badge className="bg-orange-500 text-white text-[10px] border-0">
              🌶 Pálivé
            </Badge>
          )}
          {item.isNew && (
            <Badge className="bg-dragon-lime text-dragon-dark text-[10px] border-0">
              NOVINKA
            </Badge>
          )}
          {item.isVegetarian && (
            <Badge className="bg-green-500 text-white text-[10px] border-0">
              🌿 Vegetariánske
            </Badge>
          )}
        </div>
      </div>
      <div className="p-6">
        <DialogTitle className="text-xl font-bold text-dragon-dark">
          {item.nameSk}
        </DialogTitle>
        <p className="text-sm text-muted-foreground mt-1">{item.descriptionSk}</p>
        <div className="text-2xl font-bold text-dragon-red mt-3">
          {item.price.toFixed(2)}€
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

        {/* Addons */}
        {item.addons.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-dragon-dark mb-2">
              Prídavky
            </h4>
            <div className="space-y-2">
              {item.addons.map((addon) => (
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
          </div>
        )}

        {/* Notes */}
        <div className="mt-4">
          <Label className="text-sm font-semibold">Poznámka k jedlu</Label>
          <Textarea
            placeholder="Napríklad: bez arašidov, extra omáčka..."
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
            className="flex-1 bg-dragon-red hover:bg-dragon-red-dark text-white py-5 text-sm font-semibold rounded-xl"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Pridať za {itemTotal.toFixed(2)}€
          </Button>
        </div>
      </div>
    </>
  )
}
