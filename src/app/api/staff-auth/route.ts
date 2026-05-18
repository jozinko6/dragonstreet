import { NextRequest, NextResponse } from 'next/server'
import { getStaffPassword, staffCookieName, type StaffRole } from '@/lib/staff-auth'

function isStaffRole(role: string): role is StaffRole {
  return role === 'admin' || role === 'kitchen' || role === 'courier'
}

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get('role') || ''
  if (!isStaffRole(role)) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 400 })
  }

  const password = getStaffPassword(role)

  if (!password) {
    return NextResponse.json({ success: true, authenticated: true })
  }

  const authenticated = request.cookies.get(staffCookieName(role))?.value === '1'
  return NextResponse.json({ success: true, authenticated })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const role = typeof body.role === 'string' ? body.role : ''
  const password = typeof body.password === 'string' ? body.password : ''
  if (!isStaffRole(role)) {
    return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 })
  }

  const expectedPassword = getStaffPassword(role)

  if (!expectedPassword) {
    return NextResponse.json({ success: true })
  }

  if (password !== expectedPassword) {
    return NextResponse.json(
      { success: false, error: 'Nespravne heslo' },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(staffCookieName(role), '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 12,
    path: '/',
  })
  return response
}
