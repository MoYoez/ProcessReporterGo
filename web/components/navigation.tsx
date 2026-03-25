'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Settings, Laptop } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: '状态面板', icon: Activity },
  { href: '/devices', label: '设备管理', icon: Laptop },
  { href: '/config', label: '配置信息', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rainbow-gradient rounded-xl opacity-80 blur-sm group-hover:blur-md transition-all duration-300" />
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm natural-shadow">
                <Activity className="w-5 h-5 text-primary" />
              </div>
            </div>
            <span className="font-semibold text-lg text-foreground hidden sm:block">
              ProcessReporter
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
                    "transition-all duration-300",
                    isActive
                      ? "bg-white/70 text-foreground natural-shadow"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/40"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
