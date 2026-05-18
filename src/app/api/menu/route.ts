import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categories = await db.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            addons: {
              where: { isAvailable: true },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    })

    const categoriesWithParsedItems = categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({
        ...item,
        allergens: item.allergens
          ? item.allergens.split(',').map((allergen) => allergen.trim()).filter(Boolean)
          : [],
      })),
    }))

    // Also return a flat items list for convenience.
    const items = categoriesWithParsedItems.flatMap((cat) => cat.items)

    return NextResponse.json({
      success: true,
      data: {
        categories: categoriesWithParsedItems,
        items,
      },
    })
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}
