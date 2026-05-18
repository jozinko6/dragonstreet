'use client'

import { useNavigation, useCart } from '@/lib/store'
import { menuItems, categories, openingHours } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Flame, Truck, Clock, Star, ChevronRight, MapPin, Phone, ArrowRight } from 'lucide-react'

export function HomePage() {
  const { navigate } = useNavigation()
  const { addItem } = useCart()
  const popularItems = menuItems.filter((i) => i.isPopular && i.isAvailable).slice(0, 4)

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
              NOVÉ V HLOHOVCI
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Ázijské street food.{' '}
              <span className="text-dragon-red">Doručíme až k vám.</span>
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
              Autentické chute Ázie v modernom prevedení. Čerstvé ingrediencie, rýchla príprava a doručenie až k vašim dverám v Hlohovci a okolí.
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
                Zobraziť menu
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
              { icon: <Clock className="w-5 h-5 text-dragon-orange" />, label: 'Otváracie hodiny', value: '10:00 - 22:00' },
              { icon: <Star className="w-5 h-5 text-dragon-lime" />, label: 'Hodnotenie', value: '4.8 ★' },
              { icon: <MapPin className="w-5 h-5 text-white" />, label: 'Lokalita', value: 'Hlohovec' },
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
                OBĽUBENÉ
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark">
                Naše naj obľúbené jedlá
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
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

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark">
              Ako to <span className="text-dragon-red">funguje</span>?
            </h2>
            <p className="text-muted-foreground text-sm mt-2">Objednajte si za menej než 60 sekúnd</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Vyberte si jedlo', desc: 'Prechádzajte naším menu a pridajte obľúbené položky do košíka', icon: '🍽️' },
              { step: '02', title: 'Zvoľte doručenie', desc: 'Doručenie k vám domov alebo osobný odber v reštaurácii', icon: '🛵' },
              { step: '03', title: 'Zaplaťte', desc: 'Online kartou alebo hotovosťou pri doručení – vyberte si', icon: '💳' },
              { step: '04', title: 'Užite si jedlo', desc: 'Sledujte stav objednávky v reálnom čase a užite si chuť Ázie', icon: '🎉' },
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

      {/* About Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-dragon-red/10 text-dragon-red border-dragon-red/20 mb-4">
                O NÁS
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark mb-4">
                Street food s <span className="text-dragon-red">dušou Ázie</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Dragon Street Food vznikol z vášne k ázijskej kuchyni a túžby priniesť autentické chute street foodu do Hlohovca. Naše jedlá pripravujeme z čerstvých surovín s rešpektom k tradičným receptúram.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Veríme, že dobré jedlo nemusí byť komplikované. Stačí čerstvosť, chuť a rýchlosť. Presne to, čo street food znamená.
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
                  <div className="text-2xl font-bold text-dragon-red">15+</div>
                  <div className="text-xs text-muted-foreground">Jedál v menu</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src="/images/ramen.jpg" alt="Ramen" className="rounded-2xl shadow-lg w-full h-40 object-cover" />
                  <img src="/images/spring-rolls.jpg" alt="Spring Rolls" className="rounded-2xl shadow-lg w-full h-52 object-cover" />
                </div>
                <div className="space-y-4 pt-8">
                  <img src="/images/kung-pao.jpg" alt="Kung Pao" className="rounded-2xl shadow-lg w-full h-52 object-cover" />
                  <img src="/images/dumplings.jpg" alt="Dumplings" className="rounded-2xl shadow-lg w-full h-40 object-cover" />
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
                      <span className="text-sm text-muted-foreground">{h.hours}</span>
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
