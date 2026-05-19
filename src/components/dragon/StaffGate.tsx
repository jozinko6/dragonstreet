'use client'

import { FormEvent, ReactNode, useEffect, useState } from 'react'
import { Lock, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface StaffGateProps {
  role: 'admin' | 'kitchen' | 'courier'
  title: string
  children: ReactNode
}

export function StaffGate({ role, title, children }: StaffGateProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(`/api/staff-auth?role=${role}`, { cache: 'no-store' })
        const json = await response.json()
        setIsAuthenticated(Boolean(json.authenticated))
      } catch {
        setError('Overenie pristupu sa nepodarilo.')
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [role])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/staff-auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ role, password, email }),
      })
      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Prihlasenie sa nepodarilo.')
      }
      setIsAuthenticated(true)
      setPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prihlasenie sa nepodarilo.')
    }
  }

  const logout = async () => {
    setError('')
    try {
      await fetch('/api/staff-auth', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ role }),
      })
    } finally {
      setIsAuthenticated(false)
      setEmail('')
      setPassword('')
    }
  }

  if (isChecking) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Overujem pristup...</div>
  }

  if (isAuthenticated) {
    return (
      <div>
        <div className="fixed right-4 bottom-4 z-50">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={logout}
            className="rounded-full bg-white/95 shadow-lg border-border text-xs"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Odhlásiť
          </Button>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-float-up">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-dragon-red" />
            <div>
              <h1 className="font-bold text-dragon-dark">{title}</h1>
              <p className="text-xs text-muted-foreground">Zadajte heslo pre pristup do panelu.</p>
            </div>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {role === 'courier' && (
              <div className="space-y-2">
                <Label htmlFor={`${role}-email`}>Email kuriéra</Label>
                <Input
                  id={`${role}-email`}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="napr. kurier@dragonstreetfood.sk"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor={`${role}-password`}>Heslo</Label>
              <Input
                id={`${role}-password`}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <Button type="submit" className="w-full bg-dragon-red hover:bg-dragon-red-dark text-white">
              Vstupit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
