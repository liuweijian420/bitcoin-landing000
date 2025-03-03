"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SupportPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleLogout = () => {
    // 清除本地存儲的用戶資料
    localStorage.removeItem('user')
    // 導向到登入頁面
    router.push('/login')
  }
  return (
    <div className="min-h-screen flex flex-col bg-[#1A202C]">
      {/* Navigation bar */}
      <nav className="bg-[#1A202C] border-b border-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20"> {/* 增加高度 */}
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
              <Link
                href="/support"
                className="text-orange-400 px-3 py-2 text-sm font-medium"
              >
                客服中心
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
              className="text-gray-300 hover:text-orange-400 block px-3 py-2 text-base font-medium"
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
            <Link
              href="/support"
              className="text-orange-400 block px-3 py-2 text-base font-medium"
            >
              客服中心
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
              客服中心
            </h2>

            <div className="space-y-4">
              <p className="text-gray-700">歡迎來到客服中心！</p>
              <p className="text-gray-700">官方線上客服：</p>
              <div className="pl-4 space-y-2">
                <p className="text-gray-600">Line ID：<span className="text-orange-500">@bitcoincash</span></p>
                <p className="text-gray-600">Telegram：<span className="text-orange-500">@bitcoincash_service</span></p>
              </div>
            </div>
          </div>
        </div>
      </main>

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