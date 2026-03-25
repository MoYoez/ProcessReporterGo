import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: "ProcessReporter - 进程监控面板",
  description: "实时监控设备进程状态，自然美感设计",
}

export const viewport: Viewport = {
  themeColor: "#f0f9ff",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} ${jetbrainsMono.variable}`}>
        <div className="min-h-screen rainbow-gradient">
          <div className="min-h-screen bg-background/80 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
