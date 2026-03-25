'use client'

import useSWR from 'swr'
import { RefreshCw, Activity, Laptop, Wifi } from 'lucide-react'
import { DeviceCard } from './device-card'
import { cn } from '@/lib/utils'
import type { DeviceWithStatus } from '@/lib/db'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function StatusDashboard() {
  const { data, error, isLoading, mutate } = useSWR<{ devices: DeviceWithStatus[] }>(
    '/api/devices/status',
    fetcher,
    { refreshInterval: 10000 }
  )

  const devices = data?.devices || []
  const onlineCount = devices.filter(d => d.is_online).length
  const totalCount = devices.length

  return (
    <div className="space-y-8">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Laptop className="w-5 h-5" />}
          label="设备总数"
          value={totalCount}
          gradient="from-rainbow-sky/20 to-rainbow-indigo/10"
        />
        <StatCard
          icon={<Wifi className="w-5 h-5" />}
          label="在线设备"
          value={onlineCount}
          gradient="from-rainbow-lime/20 to-rainbow-teal/10"
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="活跃进程"
          value={devices.filter(d => d.current_process).length}
          gradient="from-rainbow-coral/20 to-rainbow-amber/10"
        />
      </div>

      {/* 刷新按钮 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          设备状态
        </h2>
        <button
          onClick={() => mutate()}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl",
            "bg-white/60 backdrop-blur-sm border border-white/60",
            "text-sm font-medium text-foreground/80",
            "hover:bg-white/80 transition-all duration-300",
            "natural-shadow hover:natural-shadow-lg",
            "disabled:opacity-50"
          )}
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          刷新
        </button>
      </div>

      {/* 设备列表 */}
      {error ? (
        <div className="text-center py-12 text-destructive">
          加载失败，请稍后重试
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className="h-40 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse" 
            />
          ))}
        </div>
      ) : devices.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {devices.map((device, index) => (
            <DeviceCard 
              key={device.id} 
              device={device} 
              colorIndex={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ 
  icon, 
  label, 
  value, 
  gradient 
}: { 
  icon: React.ReactNode
  label: string
  value: number
  gradient: string
}) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-5",
      "bg-gradient-to-br",
      gradient,
      "border border-white/50",
      "natural-shadow"
    )}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className={cn(
      "text-center py-16 rounded-2xl",
      "bg-gradient-to-br from-muted/30 to-transparent",
      "border border-dashed border-border"
    )}>
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-2xl bg-white/60 natural-shadow">
          <Laptop className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        还没有设备
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        前往设备管理页面添加你的第一个设备，然后在客户端配置 API Key 开始上报
      </p>
    </div>
  )
}
