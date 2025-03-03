"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. 驗證用戶名和密碼
      const { data: isValid, error: verifyError } = await supabase
        .rpc('verify_password', {
          input_username: formData.username,
          input_password: formData.password
        })

      if (verifyError || !isValid) {
        throw new Error('帳號或密碼錯誤')
      }

      // 2. 獲取用戶資料
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', formData.username)
        .single()

      if (userError) {
        throw new Error('找不到用戶資料')
      }

      // 3. 存儲用戶資料到 localStorage
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        username: userData.username,
        real_name: userData.real_name,
        balance: userData.balance
      }))

      // 4. 顯示成功消息
      toast({
        title: "登入成功",
        description: "歡迎回來！",
        variant: "default",
        className: "bg-green-500 text-white border-none",
      })

      // 5. 導向到會員中心
      router.push('/member-center')

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Login error:', error)
        toast({
          title: "登入失敗",
          description: error.message || "帳號或密碼錯誤",
          variant: "destructive",
        })
      } else {
        console.error("發生未知錯誤", error);
      }
    } finally {
      setLoading(false)
    }
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
              <Link href="/">
              <Image
                src="/logo.png"
                alt="Login Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 0vw, 192px"
                priority
              />
              </Link>
            </div>
          </div>
        </div>

        {/* 右側表單區域 */}
        <div className="p-8 md:p-12">
          {/* Logo - 只在手機版顯示 */}
          <div className="relative w-24 h-24 mx-auto mb-8 md:hidden">
            <Image
              src="/logo.png"
              alt="Login Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 96px, 0vw"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold mb-8">登入帳號</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input 
                type="text" 
                name="username"
                placeholder="輸入帳號" 
                className="w-full px-4 py-2 bg-gray-100 border-0"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Input 
                type="password"
                name="password" 
                placeholder="輸入密碼" 
                className="w-full px-4 py-2 bg-gray-100 border-0"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition-colors"
              disabled={loading}
            >
              {loading ? "登入中..." : "登入"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/register" className="text-blue-600 hover:underline">
              立即註冊
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