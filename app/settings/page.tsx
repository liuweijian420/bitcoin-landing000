"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import Link from "next/link"
export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({
    username: "",
    real_name: "",
  })
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    // 從 localStorage 獲取用戶資料
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(storedUser)
    setUserInfo({
      username: userData.username,
      real_name: userData.real_name,
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
  
    try {
      // 驗證新密碼
      if (passwords.newPassword !== passwords.confirmPassword) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "新密碼與確認密碼不符",
        })
        setIsLoading(false)
        return
      }
  
      // 呼叫 API 更新密碼
      const response = await fetch('/api/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userInfo.username,
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error)
      }
  
      // 更新 localStorage 中的用戶資料
      localStorage.setItem('user', JSON.stringify(data.user))
  
      toast({
        title: "修改成功",
        description: "密碼已更新",
        className: "bg-green-500 text-white border-none",
      })
  
      // 清空密碼欄位
      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
  
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: error.message,
        })
      } else {
        console.error("發生未知錯誤", error);
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("user")
    router.push("/login")
  }
  const LogouttoIndex = () => {
    localStorage.removeItem('user')
    router.push('/')
  }
  return (
    <div className="min-h-screen flex flex-col bg-[#0F141A]">
      {/* Navigation bar */}
      <nav className="bg-[#1A202C] border-b border-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and mobile menu button */}
            {/* 移除 justify-between，因為這會強制將內容推到兩端 */}
            <div className="flex items-center w-full md:w-auto">
              {/* 添加 mx-auto 讓 logo 置中 */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={120}
                  height={120}
                  onClick={LogouttoIndex}
                />
              </div>
              {/* 漢堡選單按鈕 */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden absolute right-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-8">
              <Link
                href="/member-center"
                className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium"
              >
                會員中心
              </Link>
              <Link
                href="/settings"
                className="text-orange-400 px-3 py-2 text-sm font-medium"
              >
                修改資料
              </Link>
              <Link
                href="/withdraw"
                className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium"
              >
                賣出資產
              </Link>
              <Link
                href="/history"
                className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium"
              >
                交易紀錄
              </Link>
              <button 
                onClick={() => router.push('/login')}
                className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium"
              >
                登出
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden absolute w-full bg-[#1A202C] z-50`}>
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-700">
            <Link
              href="/member-center"
              className="text-gray-300 hover:text-orange-400 block px-3 py-2 text-base font-medium"
            >
              會員中心
            </Link>
            <Link
              href="/settings"
              className="text-orange-400 block px-3 py-2 text-base font-medium"
            >
              修改資料
            </Link>
            <Link
              href="/withdraw"
              className="text-gray-300 hover:text-orange-400 block px-3 py-2 text-base font-medium"
            >
              賣出資產
            </Link>
            <Link
              href="/history"
              className="text-gray-300 hover:text-orange-400 block px-3 py-2 text-base font-medium"
            >
              交易紀錄
            </Link>
            <button 
              onClick={handleLogout}
              className="text-gray-300 hover:text-orange-400 block w-full text-left px-3 py-2 text-base font-medium"
            >
              登出
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-6 px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6 text-gray-900 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-2 inline-block"></span>
              修改資料
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">登入帳號</label>
                  <Input type="text" value={userInfo.username} disabled className="mt-1 bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名</label>
                  <Input type="text" value={userInfo.real_name} disabled className="mt-1 bg-gray-100" />
                </div>
              </div>

              {/* Password Change */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium text-gray-900">登入密碼</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">舊密碼</label>
                  <Input
                    type="password"
                    placeholder="輸入舊密碼"
                    value={passwords.oldPassword}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        oldPassword: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">修改密碼</label>
                  <Input
                    type="password"
                    placeholder="輸入新密碼"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">確認密碼</label>
                  <Input
                    type="password"
                    placeholder="再次輸入新密碼"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isLoading}>
                    {isLoading ? "處理中..." : "儲存"}
                  </Button>
                </div>
              </div>
            </form>

            {/* Notice */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="text-orange-500 font-medium">注意事項：</span>
                如遇不可抗拒因素，需要更更資料，請洽詢客服人員！
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#121620] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-gray-400 text-sm">© 2025 BitcoinCash All Rights Reserved</p>
        </div>
      </footer>
    </div>
  )
}

