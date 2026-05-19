import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { defaultCookieContent, defaultHomeContent } from '@/lib/site-content'

export async function GET() {
  try {
    const rows = await db.siteContent.findMany({
      where: { key: { in: ['home', 'cookies'] } },
    })

    const byKey = new Map(rows.map((row) => [row.key, row.value]))

    return NextResponse.json({
      success: true,
      data: {
        home: byKey.get('home') || defaultHomeContent,
        cookies: byKey.get('cookies') || defaultCookieContent,
      },
    })
  } catch (error) {
    console.error('Error fetching site content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site content' },
      { status: 500 }
    )
  }
}
