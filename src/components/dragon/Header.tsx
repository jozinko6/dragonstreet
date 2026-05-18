'use client'

import { useNavigation, useCart, Page } from '@/lib/store'
import { ShoppingCart, Menu, X, ChefHat, Bike, Settings, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useState, useEffect } from 'react'

const navItems: { page: Page; label: string; icon: React.ReactNode; group: 'public' | 'staff' }[] = [
  { page: 'home', label: 'Domov', icon: <Flame className="w-4 h-4" />, group: 'public' },
  { page: 'menu', label: 'Menu', icon: <ChefHat className="w-4 h-4" />, group: 'public' },
  { page: 'admin', label: 'Admin', icon: <Settings className="w-4 h-4" />, group: 'staff' },
  { page: 'kitchen', label: 'Kuchyňa', icon: <ChefHat className="w-4 h-4" />, group: 'staff' },
  { page: 'courier', label: 'Kuriér', icon: <Bike className="w-4 h-4" />, group: 'staff' },
]

export function Header() {
  const { currentPage, navigate } = useNavigation()
  const { getItemCount, getTotal } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const itemCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = (page: Page) => {
    navigate(page)
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dragon-dark/95 backdrop-blur-md shadow-lg'
          : 'bg-dragon-dark'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-lg bg-dragon-red flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight tracking-tight">
                DRAGON
              </span>
              <span className="text-dragon-orange text-[10px] font-medium tracking-widest uppercase leading-tight">
                Street Food
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.page
                    ? 'bg-dragon-red text-white'
                    : item.group === 'staff'
                    ? 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                {item.label}
                {item.group === 'staff' && (
                  <Badge variant="outline" className="text-[9px] px-1 py-0 border-white/20 text-white/40">
                    STAFF
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart button */}
            <Button
              onClick={() => handleNav('checkout')}
              className={`relative bg-dragon-red hover:bg-dragon-red-dark text-white rounded-full transition-all ${
                itemCount > 0 ? 'animate-cart-bounce' : ''
              }`}
              size="sm"
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-dragon-orange text-dragon-dark text-[10px] font-bold w-5 h-5 flex items-center justify-center p-0 border-0">
                  {itemCount}
                </Badge>
              )}
              {itemCount > 0 && (
                <span className="ml-1 hidden sm:inline text-xs">
                  {getTotal().toFixed(2)}€
                </span>
              )}
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-dragon-dark border-white/10 w-72">
                <SheetTitle className="text-white flex items-center gap-2 mb-6">
                  <Flame className="w-5 h-5 text-dragon-red" />
                  Dragon Street Food
                </SheetTitle>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => handleNav(item.page)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        currentPage === item.page
                          ? 'bg-dragon-red text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                      {item.group === 'staff' && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-white/20 text-white/40 ml-auto">
                          STAFF
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
