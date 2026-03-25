"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Activity, Settings, Monitor } from "lucide-react"

const navItems = [
  { href: "/", label: "状态面板", icon: Activity },
  { href: "/devices", label: "设备管理", icon: Monitor },
  { href: "/config", label: "配置信息", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav className="glass border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl rainbow-gradient flex items-center justify-center glow-soft">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              ProcessReporter
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground glow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
