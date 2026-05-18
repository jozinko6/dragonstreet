import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/promo/validate - Validate a promo code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, orderAmount } = body

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Promo code is required' },
        { status: 400 }
      )
    }

    const promo = await db.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!promo) {
      return NextResponse.json(
        { success: false, error: 'Invalid promo code' },
        { status: 404 }
      )
    }

    if (!promo.isActive) {
      return NextResponse.json(
        { success: false, error: 'This promo code is no longer active' },
        { status: 400 }
      )
    }

    const now = new Date()

    if (promo.validFrom > now) {
      return NextResponse.json(
        { success: false, error: 'This promo code is not yet active' },
        { status: 400 }
      )
    }

    if (promo.validTo && promo.validTo < now) {
      return NextResponse.json(
        { success: false, error: 'This promo code has expired' },
        { status: 400 }
      )
    }

    if (promo.maxUses > 0 && promo.currentUses >= promo.maxUses) {
      return NextResponse.json(
        { success: false, error: 'This promo code has reached its usage limit' },
        { status: 400 }
      )
    }

    // Check minimum order amount
    if (orderAmount !== undefined && orderAmount < promo.minOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order amount for this code is €${promo.minOrderAmount.toFixed(2)}`,
        },
        { status: 400 }
      )
    }

    // Calculate discount
    let discountAmount = 0
    if (orderAmount !== undefined) {
      if (promo.discountType === 'PERCENTAGE') {
        discountAmount = orderAmount * (promo.discountValue / 100)
      } else {
        discountAmount = promo.discountValue
      }
      discountAmount = Math.min(discountAmount, orderAmount)
    }

    return NextResponse.json({
      success: true,
      data: {
        code: promo.code,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        minOrderAmount: promo.minOrderAmount,
        discountAmount: orderAmount !== undefined ? discountAmount : undefined,
      },
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to validate promo code' },
      { status: 500 }
    )
  }
}
