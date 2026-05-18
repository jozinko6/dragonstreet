import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const item = await db.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        addons: {
          where: { isAvailable: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      )
    }

    // Parse allergens from comma-separated string to array
    const allergenCodes = item.allergens
      ? item.allergens.split(',').map((a) => a.trim()).filter(Boolean)
      : []

    return NextResponse.json({
      success: true,
      data: {
        ...item,
        allergens: allergenCodes,
      },
    })
  } catch (error) {
    console.error('Error fetching menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu item' },
      { status: 500 }
    )
  }
}
