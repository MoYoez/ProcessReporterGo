'use client'

import { useState } from 'react'
import { Copy, Check, Server, Terminal, FileCode } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ConfigInfo() {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  
  // 获取当前域名作为服务器地址
  const serverHost = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/report`
    : 'https://your-domain.vercel.app/api/report'

  async function copyToClipboard(text: string, field: string) {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* 服务器端点 */}
      <ConfigCard
        icon={<Server className="w-5 h-5" />}
        title="服务器端点"
        description="在 config.json 或环境变量中配置此地址"
        gradient="from-rainbow-sky/20 to-rainbow-indigo/10"
      >
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl",
          "bg-white/50 backdrop-blur-sm",
          "border border-white/60"
        )}>
          <code className="flex-1 font-mono text-sm text-foreground break-all">
            {serverHost}
          </code>
          <CopyButton
            onClick={() => copyToClipboard(serverHost, 'host')}
            copied={copiedField === 'host'}
          />
        </div>
      </ConfigCard>

      {/* 环境变量配置 */}
      <ConfigCard
        icon={<Terminal className="w-5 h-5" />}
        title="环境变量"
        description="在运行客户端时设置以下环境变量"
        gradient="from-rainbow-lime/20 to-rainbow-teal/10"
      >
        <div className="space-y-3">
          <EnvVarItem 
            name="SERVER_HOST" 
            value={serverHost}
            onCopy={() => copyToClipboard(`SERVER_HOST="${serverHost}"`, 'env-host')}
            copied={copiedField === 'env-host'}
          />
          <EnvVarItem 
            name="SERVER_KEY" 
            value="your-api-key-here"
            description="从设备管理页面获取"
            onCopy={() => copyToClipboard('SERVER_KEY="your-api-key-here"', 'env-key')}
            copied={copiedField === 'env-key'}
          />
          <EnvVarItem 
            name="SEND_REPORT_TIME" 
            value="30"
            description="上报间隔（秒），可选"
            onCopy={() => copyToClipboard('SEND_REPORT_TIME="30"', 'env-time')}
            copied={copiedField === 'env-time'}
          />
        </div>
      </ConfigCard>

      {/* 配置文件示例 */}
      <ConfigCard
        icon={<FileCode className="w-5 h-5" />}
        title="config.json 示例"
        description="或者使用配置文件运行客户端"
        gradient="from-rainbow-coral/20 to-rainbow-amber/10"
      >
        <div className="relative">
          <pre className={cn(
            "p-4 rounded-xl overflow-x-auto",
            "bg-foreground/5",
            "border border-white/60",
            "font-mono text-sm text-foreground/90"
          )}>
{`{
  "server_host": "${serverHost}",
  "server_key": "your-api-key-here",
  "send_report_time": 30,
  "debug": false
}`}
          </pre>
          <button
            onClick={() => copyToClipboard(JSON.stringify({
              server_host: serverHost,
              server_key: "your-api-key-here",
              send_report_time: 30,
              debug: false
            }, null, 2), 'config')}
            className={cn(
              "absolute top-3 right-3",
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
              "text-xs font-medium",
              copiedField === 'config'
                ? "bg-online/15 text-online"
                : "bg-white/60 text-muted-foreground hover:text-foreground hover:bg-white/80",
              "transition-all duration-200"
            )}
          >
            {copiedField === 'config' ? (
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
      </ConfigCard>

      {/* 运行命令 */}
      <ConfigCard
        icon={<Terminal className="w-5 h-5" />}
        title="运行客户端"
        description="下载编译好的客户端或自行编译后运行"
        gradient="from-rainbow-violet/20 to-rainbow-rose/10"
      >
        <div className={cn(
          "p-4 rounded-xl",
          "bg-foreground/5",
          "border border-white/60"
        )}>
          <code className="font-mono text-sm text-foreground/90">
            ./ProcessReporterGo -c config.json
          </code>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          客户端会每 30 秒（可配置）自动上报当前前台窗口的进程信息
        </p>
      </ConfigCard>
    </div>
  )
}

function ConfigCard({
  icon,
  title,
  description,
  gradient,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  children: React.ReactNode
}) {
  return (
    <div className={cn(
      "rounded-2xl overflow-hidden",
      "bg-gradient-to-br",
      gradient,
      "border border-white/50",
      "natural-shadow"
    )}>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm natural-shadow">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

function EnvVarItem({
  name,
  value,
  description,
  onCopy,
  copied,
}: {
  name: string
  value: string
  description?: string
  onCopy: () => void
  copied: boolean
}) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl",
      "bg-white/50 backdrop-blur-sm",
      "border border-white/60"
    )}>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <code className="font-mono text-sm font-medium text-primary">
            {name}
          </code>
          <span className="text-muted-foreground">=</span>
          <code className="font-mono text-sm text-foreground/80 truncate">
            "{value}"
          </code>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <CopyButton onClick={onCopy} copied={copied} />
    </div>
  )
}

function CopyButton({ onClick, copied }: { onClick: () => void; copied: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
        copied
          ? "bg-online/15 text-online"
          : "bg-white/60 text-muted-foreground hover:text-foreground hover:bg-white/80",
        "transition-all duration-200"
      )}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}
