import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'pr_'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp * 1000
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  return `${Math.floor(diff / 86400000)} 天前`
}

export function isOnline(lastSeenAt: string | null): boolean {
  if (!lastSeenAt) return false
  const lastSeen = new Date(lastSeenAt).getTime()
  const now = Date.now()
  return (now - lastSeen) < 120000 // 2 minutes
}

export function getAppIcon(process: string): string {
  const icons: Record<string, string> = {
    'code': 'FileCode',
    'chrome': 'Globe',
    'firefox': 'Globe',
    'safari': 'Globe',
    'edge': 'Globe',
    'slack': 'MessageSquare',
    'discord': 'MessageCircle',
    'telegram': 'Send',
    'wechat': 'MessageCircle',
    'spotify': 'Music',
    'terminal': 'Terminal',
    'iterm': 'Terminal',
    'finder': 'Folder',
    'explorer': 'Folder',
  }
  
  const lowerProcess = process.toLowerCase()
  for (const [key, icon] of Object.entries(icons)) {
    if (lowerProcess.includes(key)) return icon
  }
  return 'AppWindow'
}

export type DeviceStatus = {
  id: number
  name: string
  api_key: string
  is_active: boolean
  last_seen_at: string | null
  current_process: string | null
  current_title: string | null
  last_timestamp: number | null
}
