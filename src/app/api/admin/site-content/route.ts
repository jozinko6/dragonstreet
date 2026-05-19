import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireStaffAuth } from '@/lib/staff-auth'
import { defaultCookieContent, defaultHomeContent } from '@/lib/site-content'

export async function GET(request: NextRequest) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin'])
    if (unauthorized) return unauthorized

    const rows = await db.siteContent.findMany()
    const byKey = new Map(rows.map((row) => [row.key, row.value]))

    return NextResponse.json({
      success: true,
      data: {
        home: byKey.get('home') || defaultHomeContent,
        cookies: byKey.get('cookies') || defaultCookieContent,
      },
    })
  } catch (error) {
    console.error('Error fetching admin site content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin'])
    if (unauthorized) return unauthorized

    const body = await request.json()
    const home = body.home || defaultHomeContent
    const cookies = body.cookies || defaultCookieContent

    await db.$transaction([
      db.siteContent.upsert({
        where: { key: 'home' },
        update: { value: home },
        create: { key: 'home', value: home },
      }),
      db.siteContent.upsert({
        where: { key: 'cookies' },
        update: { value: cookies },
        create: { key: 'cookies', value: cookies },
      }),
    ])

    return NextResponse.json({ success: true, data: { home, cookies } })
  } catch (error) {
    console.error('Error updating admin site content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update site content' },
      { status: 500 }
    )
  }
}
