import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    // 获取所有设备
    const devices = await sql`
      SELECT id, name, api_key, created_at, last_seen_at, is_active
      FROM devices
      ORDER BY last_seen_at DESC NULLS LAST
    `

    // 获取每个设备的最新上报记录
    const devicesWithStatus = await Promise.all(
      devices.map(async (device) => {
        // 检查是否在线（最后活跃时间在 2 分钟内）
        const isOnline = device.last_seen_at 
          ? (Date.now() - new Date(device.last_seen_at).getTime()) < 2 * 60 * 1000
          : false

        // 获取最新的上报记录
        const latestReport = await sql`
          SELECT process, title, timestamp
          FROM reports
          WHERE device_id = ${device.id}
          ORDER BY timestamp DESC
          LIMIT 1
        `

        return {
          ...device,
          is_online: isOnline,
          current_process: latestReport[0]?.process || null,
          current_title: latestReport[0]?.title || null,
        }
      })
    )

    return NextResponse.json({ devices: devicesWithStatus })
  } catch (error) {
    console.error('Get status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
