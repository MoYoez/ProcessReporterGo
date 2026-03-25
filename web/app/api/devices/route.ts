import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const devices = await sql`
      SELECT id, name, api_key, created_at, last_seen_at, is_active
      FROM devices
      ORDER BY created_at DESC
    `
    
    return NextResponse.json({ devices })
  } catch (error) {
    console.error('Get devices error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, api_key } = await request.json()
    
    if (!name || !api_key) {
      return NextResponse.json(
        { error: 'Name and API key are required' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO devices (name, api_key)
      VALUES (${name}, ${api_key})
      RETURNING id, name, api_key, created_at, last_seen_at, is_active
    `
    
    return NextResponse.json({ device: result[0] })
  } catch (error) {
    console.error('Create device error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
