import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// ProcessReporter Go 客户端上报的数据格式
interface ReportData {
  timestamp: number
  process: string
  title?: string
  key: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ReportData = await request.json()
    
    // 验证必要字段
    if (!data.key || !data.process || !data.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 通过 API Key 查找设备
    const devices = await sql`
      SELECT id FROM devices 
      WHERE api_key = ${data.key} AND is_active = true
    `

    if (devices.length === 0) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    const deviceId = devices[0].id

    // 插入上报记录
    await sql`
      INSERT INTO reports (device_id, process, title, timestamp)
      VALUES (${deviceId}, ${data.process}, ${data.title || null}, ${data.timestamp})
    `

    // 更新设备最后活跃时间
    await sql`
      UPDATE devices SET last_seen_at = NOW() WHERE id = ${deviceId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
