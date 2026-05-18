'use client'

import { Flame, MapPin, Phone, Clock, Facebook, Instagram } from 'lucide-react'
import { useNavigation } from '@/lib/store'

export function Footer() {
  const { navigate } = useNavigation()

  return (
    <footer className="bg-dragon-dark text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-dragon-red flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-lg tracking-tight">DRAGON</span>
                <span className="text-dragon-orange text-[10px] font-medium tracking-widest uppercase block leading-tight">Street Food</span>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Moderné ázijské street food v srdci Hlohovca. Čerstvé ingrediencie, autentické chute, rýchle doručenie.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Rýchle odkazy</h3>
            <nav className="flex flex-col gap-2">
              <button onClick={() => navigate('menu')} className="text-sm text-white/50 hover:text-dragon-orange transition-colors text-left">Menu</button>
              <button onClick={() => navigate('checkout')} className="text-sm text-white/50 hover:text-dragon-orange transition-colors text-left">Objednávka</button>
              <button onClick={() => navigate('about')} className="text-sm text-white/50 hover:text-dragon-orange transition-colors text-left">O nás</button>
              <button onClick={() => navigate('contact')} className="text-sm text-white/50 hover:text-dragon-orange transition-colors text-left">Kontakt</button>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Kontakt</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-dragon-red shrink-0 mt-0.5" />
                <span className="text-sm text-white/50">Hlavná 42, 931 01 Hlohovec</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-dragon-red shrink-0" />
                <span className="text-sm text-white/50">+421 912 345 678</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-dragon-red shrink-0 mt-0.5" />
                <div className="text-sm text-white/50">
                  <div>Po-Št: 10:00 – 21:00</div>
                  <div>Pi: 10:00 – 22:00</div>
                  <div>So: 11:00 – 22:00</div>
                  <div>Ne: 11:00 – 20:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Sledujte nás</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-dragon-red flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-dragon-red flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-white/30 mt-6">
              © {new Date().getFullYear()} Dragon Street Food Hlohovec
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-white/30">
            Všetky práva vyhradené • Dragon Street Food s.r.o.
          </span>
          <div className="flex gap-4">
            <span className="text-xs text-white/30 hover:text-white/50 cursor-pointer">Ochrana osobných údajov</span>
            <span className="text-xs text-white/30 hover:text-white/50 cursor-pointer">Obchodné podmienky</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
