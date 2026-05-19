'use client'

import { useNavigation, useCart, type Page } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Bike, ChefHat, Flame, Home, ShoppingCart } from 'lucide-react'

const appItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'home', label: 'Domov', icon: <Home className="w-5 h-5" /> },
  { page: 'menu', label: 'Menu', icon: <ChefHat className="w-5 h-5" /> },
  { page: 'checkout', label: 'Košík', icon: <ShoppingCart className="w-5 h-5" /> },
  { page: 'order-tracking', label: 'Stav', icon: <Bike className="w-5 h-5" /> },
  { page: 'contact', label: 'Kontakt', icon: <Flame className="w-5 h-5" /> },
]

export function MobileAppNav() {
  const { currentPage, navigate } = useNavigation()
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/95 backdrop-blur-xl shadow-[0_-12px_30px_rgba(26,26,46,0.12)] md:hidden">
      <div className="grid grid-cols-5 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        {appItems.map((item) => {
          const isActive = currentPage === item.page
          return (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`relative flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-all ${
                isActive ? 'bg-dragon-red text-white shadow-lg shadow-dragon-red/20' : 'text-dragon-dark/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.page === 'checkout' && itemCount > 0 && (
                <Badge className="absolute -top-1 right-3 h-5 min-w-5 rounded-full bg-dragon-orange text-dragon-dark p-0 text-[10px]">
                  {itemCount}
                </Badge>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
