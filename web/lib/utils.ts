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

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getTimeAgo(timestamp: number | Date): string {
  const now = Date.now()
  const time = typeof timestamp === 'number' ? timestamp * 1000 : timestamp.getTime()
  const diff = now - time
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`
  
  return formatTimestamp(Math.floor(time / 1000))
}

// 根据进程名称获取彩虹色
export function getProcessColor(process: string): string {
  const colors = [
    'bg-rainbow-rose',
    'bg-rainbow-coral', 
    'bg-rainbow-amber',
    'bg-rainbow-lime',
    'bg-rainbow-teal',
    'bg-rainbow-sky',
    'bg-rainbow-indigo',
    'bg-rainbow-violet',
  ]
  
  let hash = 0
  for (let i = 0; i < process.length; i++) {
    hash = process.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}
