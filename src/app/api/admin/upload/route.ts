import { NextRequest, NextResponse } from 'next/server'
import { requireStaffAuth } from '@/lib/staff-auth'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function getExtension(file: File) {
  if (file.type === 'image/jpeg') return 'jpg'
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  return 'bin'
}

export async function POST(request: NextRequest) {
  try {
    const unauthorized = requireStaffAuth(request, ['admin'])
    if (unauthorized) return unauthorized

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'menu-images'

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { success: false, error: 'Supabase Storage is not configured' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'Image file is required' },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPG, PNG and WebP images are allowed' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Image must be 5 MB or smaller' },
        { status: 400 }
      )
    }

    const extension = getExtension(file)
    const safeName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60)
    const path = `${Date.now()}-${safeName || 'menu-image'}.${extension}`

    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        'content-type': file.type,
        'x-upsert': 'false',
      },
      body: await file.arrayBuffer(),
    })

    if (!uploadResponse.ok) {
      const details = await uploadResponse.text()
      console.error('Supabase upload failed:', details)
      return NextResponse.json(
        { success: false, error: 'Image upload failed' },
        { status: 502 }
      )
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`

    return NextResponse.json({
      success: true,
      data: {
        path,
        url: publicUrl,
      },
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
