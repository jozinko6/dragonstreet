import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireStaffAuth } from '@/lib/staff-auth'

function normalizePatch(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {}
  const stringFields = ['categoryId', 'name', 'nameSk', 'description', 'descriptionSk', 'image', 'weight']
  const booleanFields = [
    'isPopular',
    'isSpicy',
    'isNew',
    'isVegetarian',
    'isAvailable',
    'isAlcohol',
    'isDailyMenu',
    'isWeeklySpecial',
    'isDailyDeal',
  ]

  for (const field of stringFields) {
    if (body[field] !== undefined) {
      data[field] = body[field] === null ? null : String(body[field])
    }
  }

  for (const field of booleanFields) {
    if (body[field] !== undefined) {
      data[field] = Boolean(body[field])
    }
  }

  if (body.price !== undefined) {
    data.price = Number(body.price)
  }

  if (body.allergens !== undefined) {
    data.allergens = Array.isArray(body.allergens)
      ? body.allergens.join(',')
      : String(body.allergens || '')
  }

  return data
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin'])
    if (unauthorized) return unauthorized

    const { id } = await params
    const body = await request.json()
    const data = normalizePatch(body)

    if (data.price !== undefined && Number(data.price) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be greater than 0' },
        { status: 400 }
      )
    }

    const item = await db.menuItem.update({
      where: { id },
      data,
      include: { addons: true, category: true },
    })

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin'])
    if (unauthorized) return unauthorized

    const { id } = await params
    await db.menuItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}
