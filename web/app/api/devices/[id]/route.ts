import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name } = await request.json()
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    await sql`
      UPDATE devices SET name = ${name} WHERE id = ${parseInt(id)}
    `
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update device error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await sql`
      DELETE FROM devices WHERE id = ${parseInt(id)}
    `
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete device error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
