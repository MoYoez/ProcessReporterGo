'use client'

import { Monitor, Clock, Wifi, WifiOff } from 'lucide-react'
import { cn, getTimeAgo, getProcessColor } from '@/lib/utils'
import type { DeviceWithStatus } from '@/lib/db'

interface DeviceCardProps {
  device: DeviceWithStatus
  colorIndex: number
}

const gradientColors = [
  'from-rainbow-rose/20 to-rainbow-coral/10',
  'from-rainbow-coral/20 to-rainbow-amber/10',
  'from-rainbow-amber/20 to-rainbow-lime/10',
  'from-rainbow-lime/20 to-rainbow-teal/10',
  'from-rainbow-teal/20 to-rainbow-sky/10',
  'from-rainbow-sky/20 to-rainbow-indigo/10',
  'from-rainbow-indigo/20 to-rainbow-violet/10',
  'from-rainbow-violet/20 to-rainbow-rose/10',
]

const accentColors = [
  'bg-rainbow-rose',
  'bg-rainbow-coral',
  'bg-rainbow-amber',
  'bg-rainbow-lime',
  'bg-rainbow-teal',
  'bg-rainbow-sky',
  'bg-rainbow-indigo',
  'bg-rainbow-violet',
]

export function DeviceCard({ device, colorIndex }: DeviceCardProps) {
  const gradient = gradientColors[colorIndex % gradientColors.length]
  const accent = accentColors[colorIndex % accentColors.length]
  
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br",
        gradient,
        "border border-white/50",
        "natural-shadow hover:natural-shadow-lg",
        "transition-all duration-500 ease-out",
        "hover:scale-[1.02] hover:-translate-y-1"
      )}
    >
      {/* 顶部彩色条纹 */}
      <div className={cn("h-1 w-full", accent)} />
      
      <div className="p-5">
        {/* 头部：设备名称和状态 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl",
              "bg-white/60 backdrop-blur-sm",
              "natural-shadow"
            )}>
              <Monitor className="w-5 h-5 text-foreground/70" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg leading-tight">
                {device.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {device.last_seen_at ? getTimeAgo(new Date(device.last_seen_at)) : '从未上报'}
              </p>
            </div>
          </div>
          
          {/* 在线状态指示器 */}
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            device.is_online 
              ? "bg-online/15 text-online" 
              : "bg-muted text-muted-foreground"
          )}>
            {device.is_online ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-online opacity-75 pulse-online" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-online" />
                </span>
                在线
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                离线
              </>
            )}
          </div>
        </div>
        
        {/* 当前活动进程 */}
        {device.is_online && device.current_process ? (
          <div className={cn(
            "mt-3 p-3 rounded-xl",
            "bg-white/50 backdrop-blur-sm",
            "border border-white/60"
          )}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className={cn(
                "w-2 h-2 rounded-full",
                getProcessColor(device.current_process)
              )} />
              <span className="font-mono text-sm font-medium text-foreground">
                {device.current_process}
              </span>
            </div>
            {device.current_title && (
              <p className="text-xs text-muted-foreground truncate pl-4">
                {device.current_title}
              </p>
            )}
          </div>
        ) : (
          <div className={cn(
            "mt-3 p-3 rounded-xl",
            "bg-white/30",
            "border border-white/40 border-dashed"
          )}>
            <p className="text-sm text-muted-foreground text-center">
              {device.is_online ? '等待数据...' : '设备离线'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
