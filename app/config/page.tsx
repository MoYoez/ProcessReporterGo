import { Navigation } from "@/components/navigation"
import { ConfigInfo } from "@/components/config-info"

export default function ConfigPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            配置信息
          </h1>
          <p className="text-muted-foreground mt-2">
            获取客户端配置和 API 端点
          </p>
        </div>
        <ConfigInfo />
      </div>
    </main>
  )
}
