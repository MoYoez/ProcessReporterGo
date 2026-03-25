import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL!)

export interface Device {
  id: number
  name: string
  api_key: string
  created_at: string
  last_seen_at: string | null
  is_active: boolean
}

export interface Report {
  id: number
  device_id: number
  process: string
  title: string | null
  timestamp: number
  created_at: string
}

export interface DeviceWithStatus extends Device {
  current_process?: string
  current_title?: string
  is_online: boolean
}
