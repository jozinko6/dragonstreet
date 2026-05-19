'use client'

import { useEffect, useState } from 'react'
import { defaultCookieContent, defaultHomeContent, defaultLegalDocuments, type CookieContent, type HomeContent, type LegalSeed } from '@/lib/site-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Upload } from 'lucide-react'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input value={value || ''} onChange={(event) => onChange(event.target.value)} className="h-9 text-sm" />
    </div>
  )
}

function Area({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Textarea value={value || ''} onChange={(event) => onChange(event.target.value)} rows={rows} className="text-sm" />
    </div>
  )
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [isUploading, setIsUploading] = useState(false)

  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

  const upload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Nahratie obrázka zlyhalo')
      }
      onChange(json.data.url)
    } catch {
      onChange(await readAsDataUrl(file))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Field label={label} value={value} onChange={onChange} />
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="" className="h-14 w-20 rounded-lg object-cover border" />}
        <label className="inline-flex items-center gap-2 text-xs font-medium text-dragon-red cursor-pointer">
          <Upload className="w-4 h-4" />
          {isUploading ? 'Nahrávam...' : 'Nahrať obrázok'}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) upload(file).catch(() => undefined)
          }} />
        </label>
      </div>
    </div>
  )
}

export function AdminContentTab() {
  const [home, setHome] = useState<HomeContent>(defaultHomeContent)
  const [cookies, setCookies] = useState<CookieContent>(defaultCookieContent)
  const [documents, setDocuments] = useState<LegalSeed[]>(defaultLegalDocuments)
  const [state, setState] = useState<SaveState>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [contentResponse, legalResponse] = await Promise.all([
          fetch('/api/admin/site-content', { cache: 'no-store' }),
          fetch('/api/admin/legal', { cache: 'no-store' }),
        ])
        const contentJson = await contentResponse.json()
        const legalJson = await legalResponse.json()
        if (contentJson.success) {
          setHome({ ...defaultHomeContent, ...contentJson.data.home })
          setCookies({ ...defaultCookieContent, ...contentJson.data.cookies })
        }
        if (legalJson.success) {
          setDocuments(legalJson.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Obsah sa nepodarilo načítať')
      }
    }
    load()
  }, [])

  const save = async () => {
    setState('saving')
    setError('')
    try {
      const [contentResponse, legalResponse] = await Promise.all([
        fetch('/api/admin/site-content', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ home, cookies }),
        }),
        fetch('/api/admin/legal', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ documents }),
        }),
      ])
      if (!contentResponse.ok || !legalResponse.ok) {
        throw new Error('Uloženie zlyhalo')
      }
      setState('saved')
      window.setTimeout(() => setState('idle'), 2000)
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Uloženie zlyhalo')
    }
  }

  const updateDoc = (slug: string, patch: Partial<LegalSeed>) => {
    setDocuments((prev) => prev.map((doc) => (doc.slug === slug ? { ...doc, ...patch } : doc)))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-dragon-dark">Obsah webu</h2>
          <p className="text-sm text-muted-foreground">Upravte texty úvodnej stránky, obrázky, cookies a právne dokumenty.</p>
        </div>
        <Button onClick={save} disabled={state === 'saving'} className="bg-dragon-red hover:bg-dragon-red-dark text-white">
          <Save className="w-4 h-4 mr-2" />
          {state === 'saving' ? 'Ukladám...' : state === 'saved' ? 'Uložené' : 'Uložiť obsah'}
        </Button>
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <Tabs defaultValue="home">
        <TabsList className="bg-muted/50 mb-4 flex-wrap h-auto">
          <TabsTrigger value="home">Úvod</TabsTrigger>
          <TabsTrigger value="sections">Sekcie</TabsTrigger>
          <TabsTrigger value="cookies">Cookies</TabsTrigger>
          <TabsTrigger value="legal">Podmienky</TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Hero badge" value={home.hero.badge} onChange={(v) => setHome({ ...home, hero: { ...home.hero, badge: v } })} />
              <ImageField label="Hero obrázok URL" value={home.hero.image} onChange={(v) => setHome({ ...home, hero: { ...home.hero, image: v } })} />
              <Field label="Hero nadpis" value={home.hero.title} onChange={(v) => setHome({ ...home, hero: { ...home.hero, title: v } })} />
              <Field label="Hero zvýraznený text" value={home.hero.highlight} onChange={(v) => setHome({ ...home, hero: { ...home.hero, highlight: v } })} />
              <Area label="Hero popis" value={home.hero.description} onChange={(v) => setHome({ ...home, hero: { ...home.hero, description: v } })} />
              <div className="grid grid-cols-1 gap-4">
                <Field label="Primárne tlačidlo" value={home.hero.primaryCta} onChange={(v) => setHome({ ...home, hero: { ...home.hero, primaryCta: v } })} />
                <Field label="Sekundárne tlačidlo" value={home.hero.secondaryCta} onChange={(v) => setHome({ ...home, hero: { ...home.hero, secondaryCta: v } })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <div className="space-y-4">
            <Card className="border-0 shadow-sm"><CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Obľúbené - badge" value={home.popular.badge} onChange={(v) => setHome({ ...home, popular: { ...home.popular, badge: v } })} />
              <Field label="Obľúbené - nadpis" value={home.popular.title} onChange={(v) => setHome({ ...home, popular: { ...home.popular, title: v } })} />
              <Area label="Obľúbené - popis" value={home.popular.description} onChange={(v) => setHome({ ...home, popular: { ...home.popular, description: v } })} />
              <Field label="Obľúbené - tlačidlo" value={home.popular.cta} onChange={(v) => setHome({ ...home, popular: { ...home.popular, cta: v } })} />
            </CardContent></Card>

            <Card className="border-0 shadow-sm"><CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Kategórie - nadpis" value={home.categories.title} onChange={(v) => setHome({ ...home, categories: { ...home.categories, title: v } })} />
              <Field label="Kategórie - zvýraznenie" value={home.categories.highlight} onChange={(v) => setHome({ ...home, categories: { ...home.categories, highlight: v } })} />
              <Area label="Kategórie - popis" value={home.categories.description} onChange={(v) => setHome({ ...home, categories: { ...home.categories, description: v } })} />
            </CardContent></Card>

            <Card className="border-0 shadow-sm"><CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="CTA badge" value={home.cta.badge} onChange={(v) => setHome({ ...home, cta: { ...home.cta, badge: v } })} />
              <Field label="CTA nadpis" value={home.cta.title} onChange={(v) => setHome({ ...home, cta: { ...home.cta, title: v } })} />
              <Area label="CTA popis" value={home.cta.description} onChange={(v) => setHome({ ...home, cta: { ...home.cta, description: v } })} />
              <Field label="Promo kód" value={home.cta.promoCode} onChange={(v) => setHome({ ...home, cta: { ...home.cta, promoCode: v } })} />
              <Field label="CTA tlačidlo" value={home.cta.button} onChange={(v) => setHome({ ...home, cta: { ...home.cta, button: v } })} />
            </CardContent></Card>

            <Card className="border-0 shadow-sm"><CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="O nás badge" value={home.about.badge} onChange={(v) => setHome({ ...home, about: { ...home.about, badge: v } })} />
              <Field label="O nás nadpis" value={home.about.title} onChange={(v) => setHome({ ...home, about: { ...home.about, title: v } })} />
              <Field label="O nás zvýraznenie" value={home.about.highlight} onChange={(v) => setHome({ ...home, about: { ...home.about, highlight: v } })} />
              <Area label="O nás texty - každý odsek na nový riadok" rows={5} value={home.about.paragraphs.join('\n')} onChange={(v) => setHome({ ...home, about: { ...home.about, paragraphs: v.split('\n').filter(Boolean) } })} />
              {home.about.images.map((image, index) => (
                <ImageField key={index} label={`O nás obrázok ${index + 1}`} value={image} onChange={(v) => {
                  const images = [...home.about.images]
                  images[index] = v
                  setHome({ ...home, about: { ...home.about, images } })
                }} />
              ))}
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="cookies">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nadpis banneru" value={cookies.title} onChange={(v) => setCookies({ ...cookies, title: v })} />
              <Field label="Link na súkromie" value={cookies.privacyLink} onChange={(v) => setCookies({ ...cookies, privacyLink: v })} />
              <Area label="Text banneru" value={cookies.text} onChange={(v) => setCookies({ ...cookies, text: v })} />
              <div className="grid grid-cols-1 gap-4">
                <Field label="Súhlasím tlačidlo" value={cookies.acceptButton} onChange={(v) => setCookies({ ...cookies, acceptButton: v })} />
                <Field label="Len nevyhnutné tlačidlo" value={cookies.rejectButton} onChange={(v) => setCookies({ ...cookies, rejectButton: v })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal">
          <div className="space-y-4">
            {documents.map((document) => (
              <Card key={document.slug} className="border-0 shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <Field label="Názov dokumentu" value={document.title} onChange={(v) => updateDoc(document.slug, { title: v })} />
                  <Area label="Obsah dokumentu (podporuje # a ## nadpisy)" rows={14} value={document.content} onChange={(v) => updateDoc(document.slug, { content: v })} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
