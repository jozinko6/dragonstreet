import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireStaffAuth } from '@/lib/staff-auth'

function normalizeMenuItem(body: Record<string, unknown>) {
  return {
    categoryId: String(body.categoryId || ''),
    name: String(body.name || body.nameSk || ''),
    nameSk: String(body.nameSk || body.name || ''),
    description: String(body.description || body.descriptionSk || ''),
    descriptionSk: String(body.descriptionSk || body.description || ''),
    price: Number(body.price || 0),
    image: String(body.image || ''),
    isPopular: Boolean(body.isPopular),
    isSpicy: Boolean(body.isSpicy),
    isNew: Boolean(body.isNew),
    isVegetarian: Boolean(body.isVegetarian),
    isAvailable: body.isAvailable === undefined ? true : Boolean(body.isAvailable),
    allergens: Array.isArray(body.allergens)
      ? body.allergens.join(',')
      : String(body.allergens || ''),
    weight: body.weight ? String(body.weight) : null,
    isAlcohol: Boolean(body.isAlcohol),
    isDailyMenu: Boolean(body.isDailyMenu),
    isWeeklySpecial: Boolean(body.isWeeklySpecial),
    isDailyDeal: Boolean(body.isDailyDeal),
  }
}

export async function GET(request: NextRequest) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin'])
    if (unauthorized) return unauthorized

    const categories = await db.menuCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
          include: {
            addons: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    })

    const normalizedCategories = categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({
        ...item,
        allergens: item.allergens
          ? item.allergens.split(',').map((allergen) => allergen.trim()).filter(Boolean)
          : [],
      })),
    }))

    return NextResponse.json({
      success: true,
      data: {
        categories: normalizedCategories,
        items: normalizedCategories.flatMap((category) => category.items),
      },
    })
  } catch (error) {
    console.error('Error fetching admin menu:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin menu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin'])
    if (unauthorized) return unauthorized

    const body = await request.json()
    const data = normalizeMenuItem(body)

    if (!data.categoryId || !data.nameSk || data.price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Category, name and valid price are required' },
        { status: 400 }
      )
    }

    const lastItem = await db.menuItem.findFirst({
      where: { categoryId: data.categoryId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })

    const item = await db.menuItem.create({
      data: {
        ...data,
        sortOrder: (lastItem?.sortOrder ?? 0) + 1,
      },
      include: { addons: true, category: true },
    })

    return NextResponse.json({ success: true, data: item }, { status: 201 })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}
