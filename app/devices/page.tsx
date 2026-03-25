import { Navigation } from "@/components/navigation"
import { DeviceManager } from "@/components/device-manager"

export default function DevicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
            设备管理
          </h1>
          <p className="text-muted-foreground mt-2">
            添加、编辑和管理你的设备
          </p>
        </div>
        <DeviceManager />
      </div>
    </main>
  )
}
