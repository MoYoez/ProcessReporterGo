import { Navigation } from '@/components/navigation'
import { ConfigInfo } from '@/components/config-info'

export default function ConfigPage() {
  return (
    <div className="min-h-screen">
      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rainbow-rose/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-rainbow-violet/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-rainbow-sky/10 rounded-full blur-3xl" />
      </div>

      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
            配置信息
          </h1>
          <p className="text-muted-foreground">
            在客户端配置以下信息以开始上报
          </p>
        </div>

        <ConfigInfo />
      </main>
    </div>
  )
}
