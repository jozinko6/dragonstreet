'use client'

import { useState } from 'react'
import { useNavigation, useCart } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useOrder } from '@/lib/store'
import {
  ShoppingCart, Plus, Minus, Trash2, Truck, Store,
  CreditCard, Banknote, ArrowRight, ArrowLeft, Tag, Check, X
} from 'lucide-react'

export function CheckoutPage() {
  const {
    items,
    deliveryType,
    setDeliveryType,
    promoCode,
    promoDiscount,
    applyPromo,
    clearPromo,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    clearCart,
  } = useCart()
  const { navigate } = useNavigation()
  const { setCurrentOrder } = useOrder()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: 'Hlohovec',
    postalCode: '931 01',
    deliveryNotes: '',
    paymentMethod: 'CASH_ON_DELIVERY' as 'CASH_ON_DELIVERY' | 'CARD_ONLINE' | 'PICKUP_PAY',
  })
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = getSubtotal()
  const deliveryFee = getDeliveryFee()
  const total = getTotal()

  const handleApplyPromo = () => {
    if (promoInput.toUpperCase() === 'DRAGON10') {
      const discount = subtotal * 0.1
      applyPromo('DRAGON10', discount)
      setPromoError('')
    } else {
      setPromoError('Neplatný promo kód')
    }
    setPromoInput('')
  }

  const handleSubmit = async () => {
    if (items.length === 0) return

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      return
    }
    if (deliveryType === 'DELIVERY' && (!formData.street || !formData.city)) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const orderNumber = `DSF-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`

    setCurrentOrder({
      id: `order-${Date.now()}`,
      orderNumber,
      status: 'CREATED',
      estimatedDeliveryTime: deliveryType === 'DELIVERY' ? '30-45 min' : '15-20 min',
      items: items.map((i) => ({
        name: i.name,
        nameSk: i.nameSk,
        quantity: i.quantity,
        price: i.price,
      })),
      deliveryType,
      total,
    })

    clearCart()
    setIsSubmitting(false)
    navigate('order-tracking')
  }

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center animate-float-up">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-dragon-dark mb-2">Váš košík je prázdny</h2>
        <p className="text-muted-foreground mb-6">Pridajte si niečo dobré z nášho menu!</p>
        <Button
          onClick={() => navigate('menu')}
          className="bg-dragon-red hover:bg-dragon-red-dark text-white rounded-xl px-8"
        >
          Zobraziť menu <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-float-up">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('menu')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-dragon-dark">Košík & Objednávka</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items + Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <h2 className="font-bold text-dragon-dark flex items-center gap-2 mb-4">
                <ShoppingCart className="w-4 h-4 text-dragon-red" />
                Vaše položky ({items.length})
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-muted/50">
                    <img
                      src={item.image}
                      alt={item.nameSk}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-sm text-dragon-dark">{item.nameSk}</h4>
                          {item.addons.length > 0 && (
                            <p className="text-[10px] text-muted-foreground">
                              + {item.addons.map((a) => a.nameSk).join(', ')}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-[10px] text-muted-foreground italic">
                              {item.notes}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-md"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-md"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="font-bold text-sm text-dragon-red">
                          {((item.price + item.addons.reduce((s, a) => s + a.price, 0)) * item.quantity).toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Type */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <h2 className="font-bold text-dragon-dark mb-4">Spôsob prevzatia</h2>
              <RadioGroup
                value={deliveryType}
                onValueChange={(v) => setDeliveryType(v as 'DELIVERY' | 'PICKUP')}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryType === 'DELIVERY'
                      ? 'border-dragon-red bg-dragon-red/5'
                      : 'border-border hover:border-dragon-red/30'
                  }`}
                >
                  <RadioGroupItem value="DELIVERY" />
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <Truck className="w-4 h-4 text-dragon-red" />
                      Doručenie
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      25-45 min • {deliveryFee === 0 ? 'ZADARMO' : `${deliveryFee.toFixed(2)}€`}
                    </p>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryType === 'PICKUP'
                      ? 'border-dragon-red bg-dragon-red/5'
                      : 'border-border hover:border-dragon-red/30'
                  }`}
                >
                  <RadioGroupItem value="PICKUP" />
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <Store className="w-4 h-4 text-dragon-orange" />
                      Osobný odber
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      15-20 min • ZADARMO
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Contact & Address */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <h2 className="font-bold text-dragon-dark mb-4">Kontaktné údaje</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Meno *</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Ján"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Priezvisko *</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Novák"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Telefón *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+421 912 345 678"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">E-mail</Label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jan@email.sk"
                    className="mt-1 text-sm"
                    type="email"
                  />
                </div>
              </div>

              {deliveryType === 'DELIVERY' && (
                <>
                  <Separator className="my-4" />
                  <h3 className="font-semibold text-sm text-dragon-dark mb-3">Adresa doručenia</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Ulica a číslo *</Label>
                      <Input
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        placeholder="Hlavná 15"
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Mesto *</Label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">PSČ</Label>
                      <Input
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Poznámka k doručeniu</Label>
                      <Textarea
                        value={formData.deliveryNotes}
                        onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                        placeholder="Napríklad: 2. poschodie, zvonček..."
                        className="mt-1 text-sm"
                        rows={2}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <h2 className="font-bold text-dragon-dark mb-4">Platba</h2>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(v) =>
                  setFormData({ ...formData, paymentMethod: v as typeof formData.paymentMethod })
                }
                className="space-y-3"
              >
                {deliveryType === 'DELIVERY' && (
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'CASH_ON_DELIVERY'
                        ? 'border-dragon-red bg-dragon-red/5'
                        : 'border-border hover:border-dragon-red/30'
                    }`}
                  >
                    <RadioGroupItem value="CASH_ON_DELIVERY" />
                    <Banknote className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-sm">Hotovosť pri doručení</div>
                      <p className="text-xs text-muted-foreground">Zaplatíte kuriérovi v hotovosti</p>
                    </div>
                  </label>
                )}
                {deliveryType === 'PICKUP' && (
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'PICKUP_PAY'
                        ? 'border-dragon-red bg-dragon-red/5'
                        : 'border-border hover:border-dragon-red/30'
                    }`}
                  >
                    <RadioGroupItem value="PICKUP_PAY" />
                    <Banknote className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-sm">Platba pri prevzatí</div>
                      <p className="text-xs text-muted-foreground">Zaplatíte v reštaurácii</p>
                    </div>
                  </label>
                )}
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'CARD_ONLINE'
                      ? 'border-dragon-red bg-dragon-red/5'
                      : 'border-border hover:border-dragon-red/30'
                  }`}
                >
                  <RadioGroupItem value="CARD_ONLINE" />
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-sm">Online platba kartou</div>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, Apple Pay</p>
                  </div>
                </label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary */}
        <div>
          <Card className="border-0 shadow-sm sticky top-24">
            <CardContent className="p-5">
              <h2 className="font-bold text-dragon-dark mb-4">Súhrn objednávky</h2>

              {/* Promo Code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Promo kód"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="pl-9 text-sm h-9"
                    />
                  </div>
                  <Button
                    onClick={handleApplyPromo}
                    variant="outline"
                    size="sm"
                    className="h-9"
                  >
                    Použiť
                  </Button>
                </div>
                {promoError && (
                  <p className="text-xs text-destructive mt-1">{promoError}</p>
                )}
                {promoCode && (
                  <div className="flex items-center gap-2 mt-2 bg-green-50 p-2 rounded-lg">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">{promoCode} aplikovaný</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-auto"
                      onClick={clearPromo}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Medzisúčet</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                {deliveryType === 'DELIVERY' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Doprava</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                      {deliveryFee === 0 ? 'ZADARMO' : `${deliveryFee.toFixed(2)}€`}
                    </span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Zľava ({promoCode})</span>
                    <span className="text-green-600">-{promoDiscount.toFixed(2)}€</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Celkom</span>
                  <span className="text-dragon-red">{total.toFixed(2)}€</span>
                </div>
              </div>

              {subtotal < 10 && deliveryType === 'DELIVERY' && (
                <p className="text-xs text-amber-600 mt-3">
                  Minimálna objednávka na doručenie je 10€
                </p>
              )}

              {deliveryType === 'DELIVERY' && subtotal < 30 && subtotal >= 10 && (
                <p className="text-xs text-muted-foreground mt-3">
                  Pridajte ešte za {(30 - subtotal).toFixed(2)}€ a doručenie budete mať zadarmo!
                </p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || items.length === 0 || (deliveryType === 'DELIVERY' && subtotal < 10)}
                className="w-full mt-4 bg-dragon-red hover:bg-dragon-red-dark text-white py-5 text-sm font-semibold rounded-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Odosielam...
                  </div>
                ) : (
                  <>
                    Objednať za {total.toFixed(2)}€
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-[10px] text-center text-muted-foreground mt-3">
                Objednaním súhlasíte s obchodnými podmienkami a ochranou osobných údajov
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
