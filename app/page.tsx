import { Navigation } from "@/components/navigation"
import { StatusDashboard } from "@/components/status-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
            实时状态
          </h1>
          <p className="text-muted-foreground mt-2">
            查看所有设备的当前活动状态
          </p>
        </div>
        <StatusDashboard />
      </div>
    </main>
  )
}
