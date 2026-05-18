'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Clock, Mail, Facebook, Instagram, Send } from 'lucide-react'

export function ContactPage() {
  return (
    <div className="animate-float-up">
      {/* Hero */}
      <section className="relative py-20 bg-dragon-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Badge className="bg-dragon-red/20 text-dragon-red border-dragon-red/30 mb-4">
            KONTAKT
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ozvite sa nám
          </h1>
          <p className="text-white/60 max-w-lg mx-auto">
            Máte otázky, pripomienky alebo chcete objednať väčšie množstvo? Neváhajte nás kontaktovať.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-dragon-red/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-dragon-red" />
                </div>
                <div>
                  <h3 className="font-semibold text-dragon-dark text-sm">Adresa</h3>
                  <p className="text-sm text-muted-foreground">Hlavná 42, 931 01 Hlohovec</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-dragon-orange/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-dragon-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-dragon-dark text-sm">Telefón</h3>
                  <p className="text-sm text-muted-foreground">+421 912 345 678</p>
                  <p className="text-xs text-muted-foreground">Ut-Ne (Po zatvorené)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-dragon-dark text-sm">E-mail</h3>
                  <p className="text-sm text-muted-foreground">info@dragonstreetfood.sk</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-dragon-dark text-sm">Otváracie hodiny</h3>
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <div>Po: Zatvorené</div>
                    <div>Ut-Št: 11:30 – 22:20</div>
                    <div>Pi: 12:00 – 01:00</div>
                    <div>So: 12:30 – 01:00</div>
                    <div>Ne: 14:00 – 22:00</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social */}
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="font-bold text-dragon-dark text-lg mb-4">Napíšte nám</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs">Meno</Label>
                  <Input placeholder="Vaše meno" className="mt-1 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">E-mail</Label>
                  <Input placeholder="vas@email.sk" type="email" className="mt-1 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Telefón</Label>
                  <Input placeholder="+421 9XX XXX XXX" className="mt-1 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Správa</Label>
                  <Textarea placeholder="Vaša správa..." className="mt-1 text-sm" rows={4} />
                </div>
                <Button className="w-full bg-dragon-red hover:bg-dragon-red-dark text-white rounded-xl">
                  <Send className="w-4 h-4 mr-2" />
                  Odoslať správu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
