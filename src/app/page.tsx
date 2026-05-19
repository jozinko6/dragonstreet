'use client'

import { useEffect } from 'react'
import { useNavigation, Page } from '@/lib/store'
import { Header } from '@/components/dragon/Header'
import { Footer } from '@/components/dragon/Footer'
import { HomePage } from '@/components/dragon/HomePage'
import { MenuPage } from '@/components/dragon/MenuPage'
import { CheckoutPage } from '@/components/dragon/CheckoutPage'
import { OrderTracking } from '@/components/dragon/OrderTracking'
import { AdminPanel } from '@/components/dragon/AdminPanel'
import { KitchenPanel } from '@/components/dragon/KitchenPanel'
import { CourierPanel } from '@/components/dragon/CourierPanel'
import { AboutPage } from '@/components/dragon/AboutPage'
import { ContactPage } from '@/components/dragon/ContactPage'
import { LegalPage } from '@/components/dragon/LegalPage'
import { CookieBanner } from '@/components/dragon/CookieBanner'
import { MobileAppNav } from '@/components/dragon/MobileAppNav'

const pageComponents: Record<Page, React.ComponentType> = {
  home: HomePage,
  menu: MenuPage,
  checkout: CheckoutPage,
  'order-tracking': OrderTracking,
  admin: AdminPanel,
  kitchen: KitchenPanel,
  courier: CourierPanel,
  about: AboutPage,
  contact: ContactPage,
  legal: LegalPage,
}

export default function Home() {
  const { currentPage, navigate, navigateLegal } = useNavigation()

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'legal-terms' || hash === 'legal-privacy') {
        navigateLegal(hash.replace('legal-', '') as 'terms' | 'privacy')
        return
      }
      if (hash && isValidPage(hash)) {
        navigate(hash as Page)
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [navigate])

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const PageComponent = pageComponents[currentPage] || HomePage

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16 sm:pt-18">
        <PageComponent />
      </main>
      <Footer />
      <CookieBanner />
      <MobileAppNav />
    </div>
  )
}

function isValidPage(hash: string): boolean {
  const validPages: Page[] = ['home', 'menu', 'checkout', 'order-tracking', 'admin', 'kitchen', 'courier', 'about', 'contact', 'legal']
  return validPages.includes(hash as Page)
}
