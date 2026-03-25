"use client"

import { useState, useEffect } from "react"
import useSWR, { mutate } from "swr"
import { Plus, Pencil, Trash2, Copy, Check, Key } from "lucide-react"
import { generateApiKey, cn } from "@/lib/utils"

interface Device {
  id: number
  name: string
  api_key: string
  created_at: string
  is_active: boolean
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function DeviceManager() {
  const { data: devices, error, isLoading } = useSWR<Device[]>("/api/devices", fetcher)
  const [showForm, setShowForm] = useState(false)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [name, setName] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (showForm && !editingDevice) {
      setApiKey(generateApiKey())
    }
  }, [showForm, editingDevice])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingDevice) {
        await fetch(`/api/devices/${editingDevice.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        })
      } else {
        await fetch("/api/devices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, api_key: apiKey }),
        })
      }
      mutate("/api/devices")
      resetForm()
    } catch (err) {
      console.error("Error saving device:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个设备吗？")) return
    
    try {
      await fetch(`/api/devices/${id}`, { method: "DELETE" })
      mutate("/api/devices")
    } catch (err) {
      console.error("Error deleting device:", err)
    }
  }

  const handleEdit = (device: Device) => {
    setEditingDevice(device)
    setName(device.name)
    setApiKey(device.api_key)
    setShowForm(true)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingDevice(null)
    setName("")
    setApiKey("")
  }

  const copyToClipboard = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 text-destructive">
        加载失败，请刷新页面重试
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add Device Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          添加设备
        </button>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
          <form onSubmit={handleSubmit} className="relative space-y-4">
            <h3 className="text-xl font-semibold">
              {editingDevice ? "编辑设备" : "添加新设备"}
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">设备名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：MacBook Pro"
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Key className="w-4 h-4" />
                API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiKey}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border font-mono text-sm"
                />
                {!editingDevice && (
                  <button
                    type="button"
                    onClick={() => setApiKey(generateApiKey())}
                    className="px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 border border-border transition-colors"
                  >
                    刷新
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? "保存中..." : editingDevice ? "保存修改" : "创建设备"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Device List */}
      <div className="grid gap-4">
        {devices && devices.length > 0 ? (
          devices.map((device, index) => (
            <div
              key={device.id}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-5 hover:shadow-lg transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${['rgba(236,72,153,0.05)', 'rgba(251,146,60,0.05)', 'rgba(34,197,94,0.05)', 'rgba(6,182,212,0.05)', 'rgba(139,92,246,0.05)'][index % 5]} 0%, transparent 100%)`,
                }}
              />
              
              <div className="relative flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{device.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                    <Key className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px] sm:max-w-none">{device.api_key}</span>
                    <button
                      onClick={() => copyToClipboard(device.api_key, device.id)}
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      {copiedId === device.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(device)}
                    className="p-2.5 rounded-xl hover:bg-muted transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(device.id)}
                    className="p-2.5 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Plus className="w-8 h-8" />
            </div>
            <p>还没有设备，点击上方按钮添加</p>
          </div>
        )}
      </div>
    </div>
  )
}
