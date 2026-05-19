'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Cookie } from 'lucide-react'
import { defaultCookieContent, type CookieContent } from '@/lib/site-content'
import { useNavigation } from '@/lib/store'

const COOKIE_KEY = 'dragon-cookie-consent'

export function CookieBanner() {
  const { navigateLegal } = useNavigation()
  const [content, setContent] = useState<CookieContent>(defaultCookieContent)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(window.localStorage.getItem(COOKIE_KEY) !== 'accepted')

    fetch('/api/site-content', { cache: 'no-store' })
      .then((response) => response.json())
      .then((json) => {
        if (json.success && json.data?.cookies) {
          setContent(json.data.cookies)
        }
      })
      .catch(() => undefined)
  }, [])

  const close = (value: 'accepted' | 'necessary') => {
    window.localStorage.setItem(COOKIE_KEY, value === 'accepted' ? 'accepted' : 'necessary')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-3 bottom-20 z-[60] sm:bottom-4 sm:left-auto sm:right-4 sm:max-w-md">
      <div className="rounded-2xl border border-white/10 bg-dragon-dark text-white shadow-2xl shadow-black/25 p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-dragon-red flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold">{content.title}</h2>
            <p className="text-sm text-white/70 mt-1 leading-relaxed">{content.text}</p>
            <button
              className="text-xs text-dragon-orange hover:text-white mt-2"
              onClick={() => navigateLegal('privacy')}
            >
              {content.privacyLink}
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button className="bg-dragon-red hover:bg-dragon-red-dark text-white flex-1" onClick={() => close('accepted')}>
            {content.acceptButton}
          </Button>
          <Button variant="outline" className="border-dragon-cream bg-dragon-cream text-dragon-dark hover:bg-white hover:text-dragon-dark flex-1" onClick={() => close('necessary')}>
            {content.rejectButton}
          </Button>
        </div>
      </div>
    </div>
  )
}
