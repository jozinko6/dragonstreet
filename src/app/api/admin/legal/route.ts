import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireStaffAuth } from '@/lib/staff-auth'
import { defaultLegalDocuments } from '@/lib/site-content'

export async function GET(request: NextRequest) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin'])
    if (unauthorized) return unauthorized

    const rows = await db.legalDocument.findMany({
      orderBy: { slug: 'asc' },
    })
    const bySlug = new Map(rows.map((row) => [row.slug, row]))

    return NextResponse.json({
      success: true,
      data: defaultLegalDocuments.map((item) => bySlug.get(item.slug) || item),
    })
  } catch (error) {
    console.error('Error fetching legal documents:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch legal documents' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin'])
    if (unauthorized) return unauthorized

    const body = await request.json()
    const documents = Array.isArray(body.documents) ? body.documents : []

    await db.$transaction(
      documents.map((document) =>
        db.legalDocument.upsert({
          where: { slug: String(document.slug) },
          update: {
            title: String(document.title || ''),
            content: String(document.content || ''),
            isActive: document.isActive === undefined ? true : Boolean(document.isActive),
          },
          create: {
            slug: String(document.slug),
            title: String(document.title || ''),
            content: String(document.content || ''),
            isActive: document.isActive === undefined ? true : Boolean(document.isActive),
          },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating legal documents:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update legal documents' },
      { status: 500 }
    )
  }
}
