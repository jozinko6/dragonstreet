'use client'

import { useEffect, useMemo, useState } from 'react'
import { useCart, useNavigation } from '@/lib/store'
import type { MenuResponse, OpeningHour } from '@/lib/menu-api'
import { defaultHomeContent, type HomeContent } from '@/lib/site-content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, ChevronRight, Clock, Flame, Heart, MapPin, MessageCircle, Phone, Star, Store, Tag, Truck } from 'lucide-react'

const benefitIcons = [
  <Store key="store" className="w-6 h-6 text-dragon-red" />,
  <Tag key="tag" className="w-6 h-6 text-dragon-orange" />,
  <MessageCircle key="message" className="w-6 h-6 text-dragon-lime" />,
  <Heart key="heart" className="w-6 h-6 text-pink-500" />,
]

const statIcons = [
  <Truck key="truck" className="w-5 h-5 text-dragon-red" />,
  <Clock key="clock" className="w-5 h-5 text-dragon-orange" />,
  <Star key="star" className="w-5 h-5 text-dragon-lime" />,
  <MapPin key="map" className="w-5 h-5 text-white" />,
]

export function HomePage() {
  const { navigate } = useNavigation()
  const { addItem } = useCart()
  const [menuData, setMenuData] = useState<MenuResponse>({ categories: [], items: [] })
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([])
  const [content, setContent] = useState<HomeContent>(defaultHomeContent)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadHomeData() {
      try {
        setIsLoading(true)
        setError('')
        const [menuResponse, settingsResponse, contentResponse] = await Promise.all([
          fetch('/api/menu', { cache: 'no-store' }),
          fetch('/api/settings', { cache: 'no-store' }),
          fetch('/api/site-content', { cache: 'no-store' }),
        ])

        if (!menuResponse.ok) throw new Error('Menu sa nepodarilo načítať')
        const menuJson = await menuResponse.json()
        if (!menuJson.success) throw new Error(menuJson.error || 'Menu sa nepodarilo načítať')

        let hours: OpeningHour[] = []
        if (settingsResponse.ok) {
          const settingsJson = await settingsResponse.json()
          if (settingsJson.success && Array.isArray(settingsJson.data.openingHours)) {
            hours = settingsJson.data.openingHours
          }
        }

        let homeContent = defaultHomeContent
        if (contentResponse.ok) {
          const contentJson = await contentResponse.json()
          if (contentJson.success && contentJson.data?.home) {
            homeContent = { ...defaultHomeContent, ...contentJson.data.home }
          }
        }

        if (isMounted) {
          setMenuData(menuJson.data)
          setOpeningHours(hours)
          setContent(homeContent)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Dáta sa nepodarilo načítať')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadHomeData()
    return () => {
      isMounted = false
    }
  }, [])

  const popularItems = useMemo(
    () => menuData.items.filter((i) => i.isPopular && i.isAvailable).slice(0, 4),
    [menuData.items]
  )

  const mainCategories = useMemo(() => {
    const skipCategorySlugs = new Set(['denne-menu', 'polievka-dna', 'dresingy', 'nocny-rozvoz'])
    return menuData.categories.filter((c) => !skipCategorySlugs.has(c.slug)).slice(0, 12)
  }, [menuData.categories])

  return (
    <div className="animate-float-up">
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={content.hero.image} alt="Dragon Street Food" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <Badge className="bg-dragon-red/20 text-dragon-red border-dragon-red/30 mb-4 text-xs font-medium">
              <Flame className="w-3 h-3 mr-1" />
              {content.hero.badge}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {content.hero.title} <span className="text-dragon-red">{content.hero.highlight}</span>
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">{content.hero.description}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => navigate('menu')} className="bg-dragon-red hover:bg-dragon-red-dark text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-dragon-red/25" size="lg">
                {content.hero.primaryCta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button onClick={() => navigate('menu')} variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base rounded-xl" size="lg">
                {content.hero.secondaryCta}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dragon-dark py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.stats.map((stat, i) => (
              <div key={`${stat.label}-${i}`} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                {statIcons[i] || statIcons[0]}
                <div>
                  <div className="text-white font-semibold text-sm">{stat.value}</div>
                  <div className="text-white/40 text-xs">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge className="bg-dragon-red/10 text-dragon-red border-dragon-red/20 mb-2">
                <Flame className="w-3 h-3 mr-1" />
                {content.popular.badge}
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark">{content.popular.title}</h2>
              <p className="text-muted-foreground text-sm mt-1">{content.popular.description}</p>
            </div>
            <Button onClick={() => navigate('menu')} variant="ghost" className="hidden sm:flex text-dragon-red hover:text-dragon-red-dark">
              {content.popular.cta} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading && Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-md">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-5 bg-muted rounded animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse" />
                  <div className="h-9 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}

            {!isLoading && popularItems.map((item) => (
              <Card key={item.id} className="food-card-hover overflow-hidden border-0 shadow-md cursor-pointer group mobile-app-surface" onClick={() => navigate('menu')}>
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.nameSk} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {item.isPopular && <Badge className="bg-dragon-red text-white text-[10px] border-0"><Star className="w-3 h-3 mr-0.5" /> TOP</Badge>}
                    {item.isSpicy && <Badge className="bg-orange-500 text-white text-[10px] border-0">🌶 Pálivé</Badge>}
                    {item.isVegetarian && <Badge className="bg-green-500 text-white text-[10px] border-0">🌿 Veg</Badge>}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-dragon-dark font-bold text-lg px-3 py-1 rounded-lg">{item.price.toFixed(2)}€</span>
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

          {!isLoading && error && <p className="text-sm text-dragon-red mt-4">{error}</p>}
          {!isLoading && !error && popularItems.length === 0 && <p className="text-sm text-muted-foreground mt-4">Obľúbené jedlá zatiaľ nie sú dostupné.</p>}
        </div>
      </section>

      <section className="py-16 bg-dragon-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {content.categories.title} <span className="text-dragon-red">{content.categories.highlight}</span>?
            </h2>
            <p className="text-white/50 text-sm mt-2">{content.categories.description}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading && Array.from({ length: 8 }).map((_, index) => <div key={index} className="rounded-2xl aspect-square bg-white/10 animate-pulse" />)}
            {!isLoading && mainCategories.map((cat) => (
              <button key={cat.id} onClick={() => navigate('menu')} className="group relative overflow-hidden rounded-2xl aspect-square">
                <img src={cat.image} alt={cat.nameSk} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-dragon-red/10 text-dragon-red border-dragon-red/20 mb-2">{content.benefits.badge}</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark">
              {content.benefits.title} <span className="text-dragon-red">{content.benefits.highlight}</span>?
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-2xl mx-auto">{content.benefits.description}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.benefits.cards.map((card, i) => (
              <div key={`${card.title}-${i}`} className="text-center p-6 rounded-2xl bg-white shadow-sm border border-border/50 hover:shadow-md transition-shadow mobile-app-surface">
                <div className="flex justify-center mb-3 w-12 h-12 rounded-xl bg-dragon-red/10 items-center mx-auto">{benefitIcons[i] || benefitIcons[0]}</div>
                <h3 className="font-bold text-dragon-dark mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark">
              {content.steps.title} <span className="text-dragon-red">{content.steps.highlight}</span>?
            </h2>
            <p className="text-muted-foreground text-sm mt-2">{content.steps.description}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.steps.items.map((step, index) => (
              <div key={`${step.title}-${index}`} className="text-center p-6 rounded-2xl bg-white shadow-sm border border-border/50 hover:shadow-md transition-shadow mobile-app-surface">
                <div className="text-4xl mb-3">{step.icon}</div>
                <div className="text-dragon-red font-bold text-xs mb-1">KROK {String(index + 1).padStart(2, '0')}</div>
                <h3 className="font-bold text-dragon-dark mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gradient-to-r from-dragon-dark to-dragon-darker">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Badge className="bg-dragon-red/20 text-dragon-red border-dragon-red/30 mb-4">{content.cta.badge}</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{content.cta.title}</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto text-sm">
            {content.cta.description} <span className="text-dragon-orange font-mono font-bold">{content.cta.promoCode}</span>
          </p>
          <Button onClick={() => navigate('menu')} className="bg-dragon-red hover:bg-dragon-red-dark text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-dragon-red/25" size="lg">
            {content.cta.button} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <section className="py-10 bg-dragon-dark/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/60 text-sm mb-4">{content.social.text}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              className="border-dragon-cream/80 bg-dragon-cream !text-dragon-dark hover:border-white hover:bg-white hover:!text-dragon-darker focus-visible:ring-dragon-orange/60 rounded-xl gap-2 shadow-md shadow-black/15"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400')}
            >
              {content.social.facebookButton}
            </Button>
            <Button
              variant="outline"
              className="border-dragon-cream/80 bg-dragon-cream !text-dragon-dark hover:border-white hover:bg-white hover:!text-dragon-darker focus-visible:ring-dragon-orange/60 rounded-xl gap-2 shadow-md shadow-black/15"
              onClick={() => navigator.clipboard?.writeText(`${content.social.instagramShareText} ${window.location.href}`)}
            >
              {content.social.instagramButton}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-dragon-red/10 text-dragon-red border-dragon-red/20 mb-4">{content.about.badge}</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark mb-4">
                {content.about.title} <span className="text-dragon-red">{content.about.highlight}</span>
              </h2>
              {content.about.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p>
              ))}
              <div className="flex gap-6">
                {content.about.stats.map((stat, index) => (
                  <div key={`${stat.label}-${index}`}>
                    <div className="text-2xl font-bold text-dragon-red">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src={content.about.images[0] || '/images/kebab.jpg'} alt="" className="rounded-2xl shadow-lg w-full h-40 object-cover" />
                  <img src={content.about.images[1] || '/images/hotdog.jpg'} alt="" className="rounded-2xl shadow-lg w-full h-52 object-cover" />
                </div>
                <div className="space-y-4 pt-8">
                  <img src={content.about.images[2] || '/images/chicken-wings.jpg'} alt="" className="rounded-2xl shadow-lg w-full h-52 object-cover" />
                  <img src={content.about.images[3] || '/images/fries.jpg'} alt="" className="rounded-2xl shadow-lg w-full h-40 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-sm mobile-app-surface">
              <CardContent className="p-6">
                <h3 className="font-bold text-dragon-dark text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-dragon-red" />
                  {content.contact.hoursTitle}
                </h3>
                <div className="space-y-3">
                  {openingHours.length > 0 ? openingHours.map((h, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{h.day}</span>
                      <span className={`text-sm ${h.isClosed ? 'text-dragon-red font-medium' : 'text-muted-foreground'}`}>{h.hours}</span>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">{content.contact.hoursFallback}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm mobile-app-surface">
              <CardContent className="p-6">
                <h3 className="font-bold text-dragon-dark text-lg mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-dragon-red" />
                  {content.contact.contactTitle}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-dragon-red shrink-0" /><span className="text-sm">{content.contact.address}</span></div>
                  <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-dragon-red shrink-0" /><span className="text-sm">{content.contact.phone}</span></div>
                  <div className="flex items-center gap-3"><Truck className="w-4 h-4 text-dragon-red shrink-0" /><span className="text-sm">{content.contact.deliveryText}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
