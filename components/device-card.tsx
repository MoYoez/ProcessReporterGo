"use client"

import { cn, isOnline, formatRelativeTime, type DeviceStatus } from "@/lib/utils"
import { 
  Monitor, 
  Globe, 
  FileCode, 
  Terminal, 
  Music, 
  MessageSquare,
  AppWindow,
  Folder
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  FileCode,
  Terminal,
  Music,
  MessageSquare,
  AppWindow,
  Folder,
  Monitor,
}

function getProcessIcon(process: string | null) {
  if (!process) return AppWindow
  const lower = process.toLowerCase()
  
  if (lower.includes('code') || lower.includes('vim') || lower.includes('nvim')) return FileCode
  if (lower.includes('chrome') || lower.includes('firefox') || lower.includes('safari') || lower.includes('edge')) return Globe
  if (lower.includes('terminal') || lower.includes('iterm') || lower.includes('warp')) return Terminal
  if (lower.includes('spotify') || lower.includes('music')) return Music
  if (lower.includes('slack') || lower.includes('discord') || lower.includes('telegram')) return MessageSquare
  if (lower.includes('finder') || lower.includes('explorer')) return Folder
  
  return AppWindow
}

interface DeviceCardProps {
  device: DeviceStatus
}

export function DeviceCard({ device }: DeviceCardProps) {
  const online = isOnline(device.last_seen_at)
  const ProcessIcon = getProcessIcon(device.current_process)
  
  return (
    <div className={cn(
      "relative p-6 rounded-2xl glass border card-hover",
      online ? "border-success/30" : "border-border"
    )}>
      {/* Rainbow accent line */}
      <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full rainbow-gradient opacity-60" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            online ? "bg-success/10" : "bg-muted"
          )}>
            <Monitor className={cn(
              "w-6 h-6",
              online ? "text-success" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{device.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "w-2 h-2 rounded-full",
                online ? "status-online animate-pulse-soft" : "status-offline"
              )} />
              <span className="text-sm text-muted-foreground">
                {online ? "在线" : "离线"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {online && device.current_process ? (
        <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ProcessIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {device.current_process}
              </p>
              {device.current_title && (
                <p className="text-sm text-muted-foreground truncate">
                  {device.current_title}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-dashed border-border">
          <p className="text-sm text-muted-foreground text-center">
            暂无活动数据
          </p>
        </div>
      )}
      
      {device.last_seen_at && (
        <p className="mt-4 text-xs text-muted-foreground text-right">
          最后活动: {formatRelativeTime(new Date(device.last_seen_at).getTime() / 1000)}
        </p>
      )}
    </div>
  )
}
