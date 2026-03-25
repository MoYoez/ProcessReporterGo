import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Get all devices with their latest report
    const devicesWithStatus = await sql`
      SELECT 
        d.id,
        d.name,
        d.last_seen_at,
        d.is_active,
        r.process as current_process,
        r.title as current_title,
        r.timestamp as last_report_timestamp
      FROM devices d
      LEFT JOIN LATERAL (
        SELECT process, title, timestamp
        FROM reports
        WHERE device_id = d.id
        ORDER BY timestamp DESC
        LIMIT 1
      ) r ON true
      WHERE d.is_active = true
      ORDER BY d.last_seen_at DESC NULLS LAST
    `

    // Calculate online status (online if last seen within 2 minutes)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    
    const result = devicesWithStatus.map((device) => ({
      ...device,
      is_online: device.last_seen_at && new Date(device.last_seen_at) > twoMinutesAgo,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Get status error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
