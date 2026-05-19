'use client'

import { useEffect, useState } from 'react'
import { useNavigation } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText } from 'lucide-react'

type LegalDocument = {
  slug: string
  title: string
  content: string
}

function markdownToBlocks(content: string) {
  return content.split('\n').map((line, index) => {
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-3xl font-bold text-dragon-dark mb-4">{line.slice(2)}</h1>
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-xl font-bold text-dragon-dark mt-7 mb-2">{line.slice(3)}</h2>
    }
    if (!line.trim()) {
      return <div key={index} className="h-2" />
    }
    return <p key={index} className="text-muted-foreground leading-relaxed mb-3">{line}</p>
  })
}

export function LegalPage() {
  const { legalSlug, navigate } = useNavigation()
  const [document, setDocument] = useState<LegalDocument | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    async function loadDocument() {
      try {
        const response = await fetch(`/api/legal/${legalSlug}`, { cache: 'no-store' })
        const json = await response.json()
        if (!response.ok || !json.success) {
          throw new Error(json.error || 'Dokument sa nepodarilo načítať')
        }
        if (isMounted) {
          setDocument(json.data)
          setError('')
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Dokument sa nepodarilo načítať')
        }
      }
    }
    loadDocument()
    return () => {
      isMounted = false
    }
  }, [legalSlug])

  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Button variant="ghost" className="mb-6 text-dragon-red" onClick={() => navigate('home')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Späť na domov
        </Button>
        <div className="bg-white rounded-2xl border border-border/70 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-dragon-red/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-dragon-red" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Právny dokument</p>
              <h1 className="text-2xl font-bold text-dragon-dark">{document?.title || 'Načítavam...'}</h1>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {document && <div>{markdownToBlocks(document.content)}</div>}
        </div>
      </div>
    </section>
  )
}
