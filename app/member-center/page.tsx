"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface UserProfile {
  username: string
  real_name: string
  balance?: number
}

export default function MemberCenterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  useEffect(() => {
    async function getProfile() {
      try {
        const supabase = createClientComponentClient()
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
          throw new Error('No user data found')
        }

        const { username } = JSON.parse(storedUser)
        const { data, error } = await supabase
          .from('users')
          .select('username, real_name, balance')
          .eq('username', username)
          .single()

        if (error) throw error
        setProfile(data)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "錯誤",
          description: "無法載入用戶資料",
          variant: "destructive",
        })
        router.push('/login')
      }
    }

    getProfile()
  }, [toast, router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
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
                className="text-orange-400 px-3 py-2 text-sm font-medium"
              >
                會員中心
              </Link>
              <Link
                href="/settings"
                className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium"
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
                onClick={handleLogout}
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
              className="text-orange-400 block px-3 py-2 text-base font-medium"
            >
              會員中心
            </Link>
            <Link
              href="/settings"
              className="text-gray-300 hover:text-orange-400 block px-3 py-2 text-base font-medium"
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
      <div className="flex-grow bg-[#0F141A]">
        <main className="max-w-7xl mx-auto py-6 px-4">
          {/* User info card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-500">登入帳號</div>
                <div className="font-medium text-gray-900">{profile?.username || '載入中...'}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">姓名</div>
                <div className="font-medium text-gray-900">{profile?.real_name || '載入中...'}</div>
              </div>
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <div className="text-sm text-gray-500">記帳錢包內餘額</div>
                <div className="text-xl font-bold text-black-500">
                  ${profile?.balance?.toLocaleString() || '0'}
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Section */}
          <div className="mt-8 bg-white rounded-lg p-4 sm:p-6">
            <h2 className="text-lg font-medium mb-4 sm:mb-6 text-gray-900 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-2 inline-block"></span>
              銷貨中心・通路・贊助商
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/help-and-hope.jpg"
                    alt="捐贊助團"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="p-2 sm:p-4 text-center">
                  <h3 className="text-gray-900 font-medium">捐贊助團</h3>
                </div>
              </div>
              <div>
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/animal-rescue.jpg"
                    alt="浪浪救援"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="p-2 sm:p-4 text-center">
                  <h3 className="text-gray-900 font-medium">浪浪救援</h3>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-pink-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-white text-sm">
            © 2025 BitcoinCash All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  )
}