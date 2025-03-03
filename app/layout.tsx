import "./globals.css"
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Bitcoin Cash - 創新安全 卓越",
  description: "提供頂尖專業的利益保障",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}