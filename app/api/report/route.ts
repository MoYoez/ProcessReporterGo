import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { timestamp, process, title, key } = body

    if (!key || !process) {
      return NextResponse.json(
        { error: "Missing required fields: key and process" },
        { status: 400 }
      )
    }

    // Find device by API key
    const devices = await sql`
      SELECT id FROM devices WHERE api_key = ${key} AND is_active = true
    `

    if (devices.length === 0) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      )
    }

    const deviceId = devices[0].id

    // Insert report
    await sql`
      INSERT INTO reports (device_id, process, title, timestamp)
      VALUES (${deviceId}, ${process}, ${title || null}, ${timestamp || Math.floor(Date.now() / 1000)})
    `

    // Update device last_seen_at
    await sql`
      UPDATE devices SET last_seen_at = NOW() WHERE id = ${deviceId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Report error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
