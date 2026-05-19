import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { defaultLegalDocuments } from '@/lib/site-content'

type Params = {
  params: Promise<{ slug: string }>
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params
    const document = await db.legalDocument.findUnique({ where: { slug } })
    const fallback = defaultLegalDocuments.find((item) => item.slug === slug)

    if (!document && !fallback) {
      return NextResponse.json(
        { success: false, error: 'Legal document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: document || fallback,
    })
  } catch (error) {
    console.error('Error fetching legal document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch legal document' },
      { status: 500 }
    )
  }
}
