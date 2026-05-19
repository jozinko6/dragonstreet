'use client'

import { Clock, Facebook, Flame, Instagram, MapPin, Phone } from 'lucide-react'
import { useNavigation } from '@/lib/store'

export function Footer() {
  const { navigate, navigateLegal } = useNavigation()

  return (
    <footer className="bg-dragon-dark text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
              Moderné street food v srdci Hlohovca. Burgre, kebaby, pinsy, hot dogy a dezerty s rýchlym doručením.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Rýchle odkazy</h3>
            <nav className="flex flex-col gap-2">
              <button onClick={() => navigate('menu')} className="text-sm text-white/50 hover:text-dragon-orange transition-colors text-left">Menu</button>
              <button onClick={() => navigate('checkout')} className="text-sm text-white/50 hover:text-dragon-orange transition-colors text-left">Objednávka</button>
              <button onClick={() => navigate('about')} className="text-sm text-white/50 hover:text-dragon-orange transition-colors text-left">O nás</button>
              <button onClick={() => navigate('contact')} className="text-sm text-white/50 hover:text-dragon-orange transition-colors text-left">Kontakt</button>
            </nav>
          </div>

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
                  <div>Po: Zatvorené</div>
                  <div>Ut-Št: 11:30 - 22:20</div>
                  <div>Pi: 12:00 - 01:00</div>
                  <div>So: 12:30 - 01:00</div>
                  <div>Ne: 14:00 - 22:00</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Sledujte nás</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-dragon-red flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-dragon-red flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-white/30 mt-6">
              © {new Date().getFullYear()} Dragon Street Food Hlohovec
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-white/30">
            Všetky práva vyhradené - Dragon Street Food s.r.o.
          </span>
          <div className="flex gap-4">
            <button onClick={() => navigateLegal('privacy')} className="text-xs text-white/30 hover:text-white/50 cursor-pointer">Ochrana osobných údajov</button>
            <button onClick={() => navigateLegal('terms')} className="text-xs text-white/30 hover:text-white/50 cursor-pointer">Obchodné podmienky</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
