import { NextRequest, NextResponse } from 'next/server'

export type StaffRole = 'admin' | 'kitchen' | 'courier'

export function getStaffPassword(role: StaffRole) {
  if (role === 'admin') {
    return process.env.ADMIN_PANEL_PASSWORD || process.env.STAFF_PANEL_PASSWORD || ''
  }
  if (role === 'kitchen') {
    return process.env.KITCHEN_PANEL_PASSWORD || process.env.STAFF_PANEL_PASSWORD || ''
  }
  return process.env.COURIER_PANEL_PASSWORD || process.env.STAFF_PANEL_PASSWORD || ''
}

export function staffCookieName(role: StaffRole) {
  return `dragon_${role}_auth`
}

export function isStaffAuthenticated(request: NextRequest, roles: StaffRole[]) {
  return roles.some((role) => {
    const password = getStaffPassword(role)
    if (!password) return true
    return request.cookies.get(staffCookieName(role))?.value === '1'
  })
}

export function requireStaffAuth(request: NextRequest, roles: StaffRole[]) {
  if (isStaffAuthenticated(request, roles)) {
    return null
  }

  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  )
}
