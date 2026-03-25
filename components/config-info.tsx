"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Terminal, Server, Clock, Key } from "lucide-react"

export function ConfigInfo() {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [serverUrl, setServerUrl] = useState("")

  useEffect(() => {
    setServerUrl(`${window.location.origin}/api/report`)
  }, [])

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const configItems = [
    {
      key: "SERVER_HOST",
      value: serverUrl,
      icon: Server,
      label: "服务器端点",
      description: "ProcessReporter 上报数据的目标地址",
      color: "from-rose-500 to-pink-500",
    },
    {
      key: "SERVER_KEY",
      value: "你的设备 API Key",
      icon: Key,
      label: "API 密钥",
      description: "在设备管理页面获取",
      color: "from-amber-500 to-orange-500",
    },
    {
      key: "SEND_REPORT_TIME",
      value: "30",
      icon: Clock,
      label: "上报间隔（秒）",
      description: "每隔多少秒上报一次状态",
      color: "from-emerald-500 to-teal-500",
    },
  ]

  const envExample = `# ProcessReporterGo 环境变量配置
SERVER_HOST=${serverUrl}
SERVER_KEY=your_api_key_here
SEND_REPORT_TIME=30
DEBUG=false`

  return (
    <div className="space-y-8">
      {/* Config Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {configItems.map((item, index) => (
          <div
            key={item.key}
            className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-5 hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`} />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-10`}>
                  <item.icon className="w-5 h-5 text-foreground" />
                </div>
                {item.key === "SERVER_HOST" && serverUrl && (
                  <button
                    onClick={() => copyToClipboard(item.value, item.key)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    {copiedField === item.key ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                )}
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-mono text-sm mt-1 truncate">{item.value}</p>
              </div>
              
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Environment Variables Example */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-zinc-500/5" />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">环境变量示例</h3>
                <p className="text-sm text-muted-foreground">复制到 .env 文件</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(envExample, "env")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            >
              {copiedField === "env" ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">复制</span>
                </>
              )}
            </button>
          </div>
          
          <pre className="p-4 rounded-xl bg-muted/50 overflow-x-auto">
            <code className="text-sm font-mono text-foreground whitespace-pre">{envExample}</code>
          </pre>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
        
        <div className="relative p-6 space-y-4">
          <h3 className="text-xl font-semibold">使用说明</h3>
          
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white text-sm flex items-center justify-center font-medium">1</span>
              <span>在「设备管理」页面添加一个新设备，获取 API Key</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm flex items-center justify-center font-medium">2</span>
              <span>将上方的环境变量配置复制到 ProcessReporterGo 的 .env 文件</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-sm flex items-center justify-center font-medium">3</span>
              <span>替换 SERVER_KEY 为你的设备 API Key</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-sm flex items-center justify-center font-medium">4</span>
              <span>运行 ProcessReporterGo，回到「实时状态」页面查看上报数据</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
