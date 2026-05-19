import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { autoAssignReadyOrders } from '@/lib/courier-assignment'
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
  return NextResponse.json({
    success: true,
    authenticated,
    courierId: role === 'courier' ? request.cookies.get('dragon_courier_id')?.value || '' : '',
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const role = typeof body.role === 'string' ? body.role : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
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

  let courierId = ''
  if (role === 'courier') {
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Zadajte email kuriera' },
        { status: 400 }
      )
    }

    const courier = await db.courier.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: { id: true, isAvailable: true },
    })

    if (!courier) {
      return NextResponse.json(
        { success: false, error: 'Kurier s tymto emailom neexistuje' },
        { status: 401 }
      )
    }

    courierId = courier.id
    await db.courier.update({
      where: { id: courier.id },
      data: { isOnline: true, isAvailable: courier.isAvailable },
    })
    if (courier.isAvailable) {
      await autoAssignReadyOrders()
    }
  }

  const response = NextResponse.json({ success: true, courierId })
  response.cookies.set(staffCookieName(role), '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 12,
    path: '/',
  })
  if (role === 'courier') {
    response.cookies.set('dragon_courier_id', courierId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 12,
      path: '/',
    })
  }
  return response
}

export async function DELETE(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const role = typeof body.role === 'string' ? body.role : request.nextUrl.searchParams.get('role') || ''
  if (!isStaffRole(role)) {
    return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 })
  }

  const courierId = request.cookies.get('dragon_courier_id')?.value || ''
  if (role === 'courier' && courierId) {
    await db.courier.updateMany({
      where: { id: courierId },
      data: { isOnline: false },
    })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(staffCookieName(role), '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  })
  if (role === 'courier') {
    response.cookies.set('dragon_courier_id', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
    })
  }
  return response
}
