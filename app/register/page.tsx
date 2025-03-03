"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const [agreed, setAgreed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "操作頻繁",
      description: "請聯繫客服",
      variant: "destructive",
    })
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden relative z-10">
        {/* 左側 Logo 區域 */}
        <div className="relative p-6 hidden md:block bg-gray-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-48 h-48">
              <Image
                src="/logo.png"
                alt="Register Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 0vw, 192px"
                priority
              />
            </div>
          </div>
        </div>

        {/* 右側表單區域 */}
        <div className="p-8 md:p-12">
          {/* Logo - 只在手機版顯示 */}
          <div className="relative w-24 h-24 mx-auto mb-8 md:hidden">
            <Image
              src="/logo.png"
              alt="Register Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 96px, 0vw"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold mb-8">註冊帳號</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input type="text" placeholder="真實姓名" className="w-full px-4 py-2 bg-gray-100 border-0" />
            </div>

            <div className="space-y-2">
              <Input type="tel" placeholder="手機號碼" className="w-full px-4 py-2 bg-gray-100 border-0" />
              <p className="text-red-500 text-xs">
                為了確認您的權利，註冊帳號/身分證/帳戶
                僅為同一人，請使用本人手機號碼且可接收驗證，禁止利用多重身分申請大量帳號，造成資料重複致影響深入，後果自負。
              </p>
            </div>

            <div className="space-y-2">
              <Input type="text" placeholder="帳號名稱" className="w-full px-4 py-2 bg-gray-100 border-0" />
              <p className="text-gray-500 text-xs">帳號需為3-20英數組合</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input type="password" placeholder="輸入密碼" className="w-full px-4 py-2 bg-gray-100 border-0" />
              <Input type="password" placeholder="再次輸入密碼" className="w-full px-4 py-2 bg-gray-100 border-0" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                確認本人已滿18歲且在此網站的所有活動，並沒有拒絕本人所身在的國家所管轄的法律，本人也接受在此填寫資料下有關的所有規則與條例及及隱私權聲明。
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition-colors"
              disabled={!agreed}
            >
              註冊
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/login" className="text-blue-600 hover:underline">
              已有帳號
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/" className="text-gray-500 hover:underline">
              回到首頁
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

