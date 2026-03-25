"use client"

import useSWR from "swr"
import { DeviceCard } from "./device-card"
import { type DeviceStatus } from "@/lib/utils"
import { RefreshCw, Wifi, WifiOff } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function StatusDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DeviceStatus[]>(
    "/api/devices/status",
    fetcher,
    { refreshInterval: 10000 }
  )
  
  const onlineCount = data?.filter(d => {
    if (!d.last_seen_at) return false
    const lastSeen = new Date(d.last_seen_at).getTime()
    return (Date.now() - lastSeen) < 120000
  }).length || 0
  
  const totalCount = data?.length || 0
  
  return (
    <div className="space-y-8">
      {/* Stats Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl glass border border-success/20 glow-soft">
            <Wifi className="w-5 h-5 text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">{onlineCount}</p>
              <p className="text-xs text-muted-foreground">在线设备</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl glass border border-border">
            <WifiOff className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalCount - onlineCount}</p>
              <p className="text-xs text-muted-foreground">离线设备</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => mutate()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          刷新
        </button>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-danger font-medium">加载失败</p>
            <p className="text-sm text-muted-foreground mt-1">请稍后重试</p>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!isLoading && !error && data?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl rainbow-gradient flex items-center justify-center mb-6 animate-float">
            <Wifi className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            暂无设备
          </h3>
          <p className="text-muted-foreground max-w-md">
            请先在设备管理页面添加设备，然后配置 ProcessReporter 客户端开始上报数据
          </p>
        </div>
      )}
      
      {/* Device Grid */}
      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}
    </div>
  )
}
