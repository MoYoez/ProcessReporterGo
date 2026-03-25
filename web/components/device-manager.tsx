'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Plus, Trash2, Copy, Check, Key, Pencil, X, Save } from 'lucide-react'
import { cn, generateApiKey } from '@/lib/utils'
import type { Device } from '@/lib/db'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function DeviceManager() {
  const { data, error, isLoading, mutate } = useSWR<{ devices: Device[] }>(
    '/api/devices',
    fetcher
  )

  const [showAddForm, setShowAddForm] = useState(false)
  const [newDeviceName, setNewDeviceName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  
  const devices = data?.devices || []

  async function handleAddDevice(e: React.FormEvent) {
    e.preventDefault()
    if (!newDeviceName.trim() || isAdding) return

    setIsAdding(true)
    try {
      const apiKey = generateApiKey()
      const res = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDeviceName.trim(), api_key: apiKey }),
      })
      
      if (res.ok) {
        setNewDeviceName('')
        setShowAddForm(false)
        mutate()
      }
    } finally {
      setIsAdding(false)
    }
  }

  async function handleDeleteDevice(id: number) {
    if (!confirm('确定要删除这个设备吗？相关的上报记录也会被删除。')) return
    
    await fetch(`/api/devices/${id}`, { method: 'DELETE' })
    mutate()
  }

  return (
    <div className="space-y-6">
      {/* 添加设备按钮/表单 */}
      {showAddForm ? (
        <form onSubmit={handleAddDevice} className={cn(
          "p-5 rounded-2xl",
          "bg-gradient-to-br from-rainbow-lime/20 to-rainbow-teal/10",
          "border border-white/50",
          "natural-shadow"
        )}>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={newDeviceName}
              onChange={e => setNewDeviceName(e.target.value)}
              placeholder="输入设备名称，如：MacBook Pro"
              autoFocus
              className={cn(
                "flex-1 px-4 py-2.5 rounded-xl",
                "bg-white/70 border border-white/60",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/30",
                "transition-all duration-200"
              )}
            />
            <button
              type="submit"
              disabled={!newDeviceName.trim() || isAdding}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl",
                "bg-primary text-primary-foreground",
                "font-medium text-sm",
                "hover:opacity-90 transition-opacity",
                "disabled:opacity-50"
              )}
            >
              <Save className="w-4 h-4" />
              保存
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl",
                "bg-white/60 text-muted-foreground",
                "hover:bg-white/80 hover:text-foreground",
                "transition-all duration-200"
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className={cn(
            "w-full flex items-center justify-center gap-2 p-4 rounded-2xl",
            "bg-gradient-to-br from-rainbow-lime/20 to-rainbow-teal/10",
            "border border-dashed border-rainbow-teal/30",
            "text-foreground/70 font-medium",
            "hover:border-rainbow-teal/50 hover:from-rainbow-lime/30 hover:to-rainbow-teal/20",
            "transition-all duration-300"
          )}
        >
          <Plus className="w-5 h-5" />
          添加新设备
        </button>
      )}

      {/* 设备列表 */}
      {error ? (
        <div className="text-center py-12 text-destructive">
          加载失败，请稍后重试
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div 
              key={i} 
              className="h-24 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse" 
            />
          ))}
        </div>
      ) : devices.length === 0 ? (
        <div className={cn(
          "text-center py-12 rounded-2xl",
          "bg-gradient-to-br from-muted/30 to-transparent",
          "border border-dashed border-border"
        )}>
          <p className="text-muted-foreground">
            还没有设备，点击上方按钮添加第一个设备
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {devices.map((device, index) => (
            <DeviceItem
              key={device.id}
              device={device}
              colorIndex={index}
              onDelete={() => handleDeleteDevice(device.id)}
              onUpdate={() => mutate()}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const gradientColors = [
  'from-rainbow-rose/15 to-rainbow-coral/5',
  'from-rainbow-coral/15 to-rainbow-amber/5',
  'from-rainbow-amber/15 to-rainbow-lime/5',
  'from-rainbow-lime/15 to-rainbow-teal/5',
  'from-rainbow-teal/15 to-rainbow-sky/5',
  'from-rainbow-sky/15 to-rainbow-indigo/5',
  'from-rainbow-indigo/15 to-rainbow-violet/5',
  'from-rainbow-violet/15 to-rainbow-rose/5',
]

function DeviceItem({ 
  device, 
  colorIndex,
  onDelete,
  onUpdate,
}: { 
  device: Device
  colorIndex: number
  onDelete: () => void
  onUpdate: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(device.name)
  const gradient = gradientColors[colorIndex % gradientColors.length]

  async function copyApiKey() {
    await navigator.clipboard.writeText(device.api_key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSave() {
    if (!editName.trim()) return
    
    await fetch(`/api/devices/${device.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim() }),
    })
    
    setIsEditing(false)
    onUpdate()
  }

  return (
    <div className={cn(
      "rounded-2xl overflow-hidden",
      "bg-gradient-to-br",
      gradient,
      "border border-white/50",
      "natural-shadow"
    )}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1 mr-4">
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                autoFocus
                className={cn(
                  "flex-1 px-3 py-1.5 rounded-lg",
                  "bg-white/70 border border-white/60",
                  "text-foreground font-medium",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30"
                )}
              />
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditName(device.name) }}
                className="p-1.5 rounded-lg bg-white/60 text-muted-foreground hover:bg-white/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg text-foreground">
                {device.name}
              </h3>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/50 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <button
            onClick={onDelete}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-xl",
              "text-destructive/70 hover:text-destructive",
              "hover:bg-destructive/10",
              "transition-all duration-200"
            )}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* API Key 展示 */}
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl",
          "bg-white/50 backdrop-blur-sm",
          "border border-white/60"
        )}>
          <Key className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <code className="flex-1 font-mono text-sm text-foreground/80 truncate">
            {device.api_key}
          </code>
          <button
            onClick={copyApiKey}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
              "text-xs font-medium",
              copied 
                ? "bg-online/15 text-online" 
                : "bg-white/60 text-muted-foreground hover:text-foreground hover:bg-white/80",
              "transition-all duration-200"
            )}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                复制
              </>
            )}
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          创建于 {new Date(device.created_at).toLocaleDateString('zh-CN')}
        </p>
      </div>
    </div>
  )
}
