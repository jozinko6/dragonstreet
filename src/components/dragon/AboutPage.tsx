'use client'

import { useNavigation } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Clock, Mail, Flame, ArrowRight, Heart, Users, Award } from 'lucide-react'

export function AboutPage() {
  const { navigate } = useNavigation()

  return (
    <div className="animate-float-up">
      {/* Hero */}
      <section className="relative py-20 bg-dragon-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Badge className="bg-dragon-red/20 text-dragon-red border-dragon-red/30 mb-4">
            <Flame className="w-3 h-3 mr-1" /> O NÁS
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Dragon Street Food
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Príbeh o vášni k ázijskej kuchyni, ktorá priniesla autentické street food chute do srdca Hlohovca.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Story */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-dragon-dark mb-4">Náš príbeh</h2>
          <div className="prose max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Dragon Street Food vznikol z jednoduchej myšlienky: priniesť autentické ázijské street food chute do Hlohovca. Naše korene siahajú k tradičným receptúram z Thajska, Číny a Japonska, ktoré sme obohatili o moderný prístup a lokálne suroviny.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Veríme, že skvelé jedlo nemusí byť komplikované ani drahé. Musí byť čerstvé, chutné a pripravené s láskou. Presne to, čo street food znamená po celom svete – rýchle, jednoduché a nezabudnuteľné.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Naše jedlá pripravujeme každý deň z čerstvých surovín. Rezance, curry, wok jedlá – všetko vzniká priamo pred vašimi očami v našej kuchyni. A ak nemáte čas zájsť k nám, radi vám doručíme až domov.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-dragon-dark mb-6">Naše hodnoty</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Heart className="w-6 h-6 text-dragon-red" />, title: 'Vášeň', desc: 'Každé jedlo pripravujeme s vášňou a rešpektom k tradičným receptúram' },
              { icon: <Users className="w-6 h-6 text-dragon-orange" />, title: 'Komunita', desc: 'Sme hrdou súčasťou Hlohovca a radi prispejeme k jeho rozvoju' },
              { icon: <Award className="w-6 h-6 text-dragon-lime" />, title: 'Kvalita', desc: 'Používame len čerstvé suroviny a najlepšie ingrediencie' },
            ].map((v, i) => (
              <Card key={i} className="border-0 shadow-sm text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-3">{v.icon}</div>
                  <h3 className="font-bold text-dragon-dark mb-2">{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-8 bg-dragon-dark rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-2">Ochutnajte naše jedlá</h3>
          <p className="text-white/50 text-sm mb-4">Objednajte si online a vychutnajte si chuť Ázie doma</p>
          <Button
            onClick={() => navigate('menu')}
            className="bg-dragon-red hover:bg-dragon-red-dark text-white rounded-xl px-8"
          >
            Zobraziť menu <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
