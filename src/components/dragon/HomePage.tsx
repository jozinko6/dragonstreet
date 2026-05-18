'use client'

import { useNavigation, useCart } from '@/lib/store'
import { menuItems, categories, openingHours } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Flame, Truck, Clock, Star, ChevronRight, MapPin, Phone, ArrowRight, Send, Store, Tag, MessageCircle, Heart } from 'lucide-react'

export function HomePage() {
  const { navigate } = useNavigation()
  const { addItem } = useCart()
  const popularItems = menuItems.filter((i) => i.isPopular && i.isAvailable).slice(0, 4)

  // Categories to skip for the homepage display
  const skipCategoryIds = ['cat-3', 'cat-4', 'cat-22', 'cat-24'] // Denné menu, Polievka dňa, Dresingy, Nočný rozvoz
  const mainCategories = categories.filter((c) => !skipCategoryIds.includes(c.id)).slice(0, 12)

  return (
    <div className="animate-float-up">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.jpg"
            alt="Dragon Street Food"
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <Badge className="bg-dragon-red/20 text-dragon-red border-dragon-red/30 mb-4 text-xs font-medium">
              <Flame className="w-3 h-3 mr-1" />
              STREET FOOD HLOHOVEC
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Street-food klasiky z Hlohovca{' '}
              <span className="text-dragon-red">priamo k tebe</span>
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
              Burgre, kebab, pinsa, hot-dogy, boxy, wrapy, dezerty a rodinné combá. Objednaj si rýchlo cez náš vlastný systém – na rozvoz alebo osobný odber.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate('menu')}
                className="bg-dragon-red hover:bg-dragon-red-dark text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-dragon-red/25"
                size="lg"
              >
                Objednať online
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => navigate('menu')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base rounded-xl"
                size="lg"
              >
                Pozrieť menu
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-dragon-dark py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Truck className="w-5 h-5 text-dragon-red" />, label: 'Doručenie', value: '25-45 min' },
              { icon: <Clock className="w-5 h-5 text-dragon-orange" />, label: 'Otváracie hodiny', value: 'Ut-Ne (Po zatv.)' },
              { icon: <Star className="w-5 h-5 text-dragon-lime" />, label: 'Hodnotenie', value: '4.8 ★' },
              { icon: <MapPin className="w-5 h-5 text-white" />, label: 'Lokalita', value: 'Hlohovec a okolie' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                {stat.icon}
                <div>
                  <div className="text-white font-semibold text-sm">{stat.value}</div>
                  <div className="text-white/40 text-xs">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge className="bg-dragon-red/10 text-dragon-red border-dragon-red/20 mb-2">
                <Flame className="w-3 h-3 mr-1" />
                OBĽÚBENÉ
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark">
                Naše najobľúbenejšie jedlá
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                To, čo si naši zákazníci objednávajú najčastejšie
              </p>
            </div>
            <Button
              onClick={() => navigate('menu')}
              variant="ghost"
              className="hidden sm:flex text-dragon-red hover:text-dragon-red-dark"
            >
              Celé menu <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularItems.map((item) => (
              <Card
                key={item.id}
                className="food-card-hover overflow-hidden border-0 shadow-md cursor-pointer group"
                onClick={() => navigate('menu')}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.nameSk}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
                  <h3 className="font-bold text-dragon-dark">{item.nameSk}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.descriptionSk}</p>
                  <Button
                    className="w-full mt-3 bg-dragon-red hover:bg-dragon-red-dark text-white text-xs rounded-lg"
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
                    Pridať do košíka
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Button
              onClick={() => navigate('menu')}
              variant="outline"
              className="border-dragon-red text-dragon-red hover:bg-dragon-red/5"
            >
              Zobraziť celé menu <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-dragon-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Čo si dnes <span className="text-dragon-red">chutí</span>?
            </h2>
            <p className="text-white/50 text-sm mt-2">Vyberte si z našich kategórií</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mainCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate('menu')}
                className="group relative overflow-hidden rounded-2xl aspect-square"
              >
                <img
                  src={cat.image}
                  alt={cat.nameSk}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dragon-dark/90 via-dragon-dark/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-sm">{cat.nameSk}</h3>
                  <p className="text-white/50 text-[10px]">{cat.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Order Direct */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-dragon-red/10 text-dragon-red border-dragon-red/20 mb-2">
              PREČO MY
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark">
              Prečo objednať <span className="text-dragon-red">priamo u nás</span>?
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-2xl mx-auto">
              Keď objednávaš priamo cez Dragon, podporuješ lokálnu prevádzku a získavaš prístup k vlastným akciám, špeciálom a rýchlejšej komunikácii.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Store className="w-6 h-6 text-dragon-red" />, title: 'Priama objednávka', desc: 'Objednávka ide priamo do našej kuchyne – žiadni sprostredkovatelia' },
              { icon: <Tag className="w-6 h-6 text-dragon-orange" />, title: 'Vlastné akcie', desc: 'Prístup k akciám dňa, týždenným špeciálom a promo kódom' },
              { icon: <MessageCircle className="w-6 h-6 text-dragon-lime" />, title: 'Rýchlejší kontakt', desc: 'Zmena objednávky alebo otázka priamo u nás' },
              { icon: <Heart className="w-6 h-6 text-pink-500" />, title: 'Podpora lokálnej prevádzky', desc: 'Podporuješ miestnu reštauráciu namiesto nadnárodných platforiem' },
            ].map((card, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-3 w-12 h-12 rounded-xl bg-dragon-red/10 items-center">
                  {card.icon}
                </div>
                <h3 className="font-bold text-dragon-dark mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark">
              Ako to <span className="text-dragon-red">funguje</span>?
            </h2>
            <p className="text-muted-foreground text-sm mt-2">Objednajte si za menej než 60 sekúnd</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Vyberte si jedlo', desc: 'Prechádzajte naším menu a pridajte obľúbené položky do košíka', icon: '🍔' },
              { step: '02', title: 'Zvoľte doručenie', desc: 'Doručenie k vám domov alebo osobný odber v reštaurácii', icon: '🛵' },
              { step: '03', title: 'Zaplaťte', desc: 'Online kartou alebo hotovosťou pri doručení – vyberte si', icon: '💳' },
              { step: '04', title: 'Užite si jedlo', desc: 'Sledujte stav objednávky v reálnom čase a užite si skvelé jedlo', icon: '🎉' },
            ].map((s) => (
              <div key={s.step} className="text-center p-6 rounded-2xl bg-white shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="text-dragon-red font-bold text-xs mb-1">KROK {s.step}</div>
                <h3 className="font-bold text-dragon-dark mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-dragon-dark to-dragon-darker">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Badge className="bg-dragon-red/20 text-dragon-red border-dragon-red/30 mb-4">
            🔥 ŠPECIÁLNA PONUKA
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Prvá online objednávka so zľavou 10%
          </h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto text-sm">
            Použite promo kód <span className="text-dragon-orange font-mono font-bold">DRAGON10</span> pri vašej prvej objednávke a získajte 10% zľavu.
          </p>
          <Button
            onClick={() => navigate('menu')}
            className="bg-dragon-red hover:bg-dragon-red-dark text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-dragon-red/25"
            size="lg"
          >
            Objednať teraz <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Social Sharing Buttons */}
      <section className="py-10 bg-dragon-dark/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/60 text-sm mb-4">Zdieľajte nás so priateľmi!</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-xl gap-2"
              onClick={() => {
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                  '_blank',
                  'width=600,height=400'
                )
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Zdieľať na Facebooku
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-xl gap-2"
              onClick={() => {
                const text = 'Skvelé street food v Hlohovci! Burgre, kebab, pinsa a viac – objednaj online na Dragon Street Food!'
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(text + ' ' + window.location.href)
                }
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Zdieľať na Instagrame
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-dragon-red/10 text-dragon-red border-dragon-red/20 mb-4">
                O NÁS
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark mb-4">
                Street food s <span className="text-dragon-red">dušou</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Dragon Street Food vznikol z vášne k street foodu a túžby priniesť tie najlepšie chute do Hlohovca. Naše jedlá pripravujeme z čerstvých surovín s dôrazom na kvalitu a rýchlosť.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Burgre, kebaby, pinsy, hot dogy, wrapy – všetko, čo máš rád, na jednom mieste. A ak nemáš čas zájsť k nám, radi vám doručíme až domov.
              </p>
              <div className="flex gap-6">
                <div>
                  <div className="text-2xl font-bold text-dragon-red">500+</div>
                  <div className="text-xs text-muted-foreground">Doručení</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-dragon-red">4.8</div>
                  <div className="text-xs text-muted-foreground">Hodnotenie</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-dragon-red">80+</div>
                  <div className="text-xs text-muted-foreground">Jedál v menu</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src="/images/kebab.jpg" alt="Kebab" className="rounded-2xl shadow-lg w-full h-40 object-cover" />
                  <img src="/images/hotdog.jpg" alt="Hot dog" className="rounded-2xl shadow-lg w-full h-52 object-cover" />
                </div>
                <div className="space-y-4 pt-8">
                  <img src="/images/chicken-wings.jpg" alt="Kuracie krídla" className="rounded-2xl shadow-lg w-full h-52 object-cover" />
                  <img src="/images/fries.jpg" alt="Hranolky" className="rounded-2xl shadow-lg w-full h-40 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours & Contact */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hours */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-dragon-dark text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-dragon-red" />
                  Otváracie hodiny
                </h3>
                <div className="space-y-3">
                  {openingHours.map((h, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{h.day}</span>
                      <span className={`text-sm ${h.isClosed ? 'text-dragon-red font-medium' : 'text-muted-foreground'}`}>{h.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-dragon-dark text-lg mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-dragon-red" />
                  Kontakt
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-dragon-red shrink-0" />
                    <span className="text-sm">Hlavná 42, 931 01 Hlohovec</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-dragon-red shrink-0" />
                    <span className="text-sm">+421 912 345 678</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-dragon-red shrink-0" />
                    <span className="text-sm">Doručujeme v Hlohovci a okolí</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
