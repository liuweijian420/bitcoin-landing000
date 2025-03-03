"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [adminName, setAdminName] = useState("")

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('adminData')
    if (!adminData) {
      router.push('/admin-login')
      return
    }
    
    const { real_name } = JSON.parse(adminData)
    setAdminName(real_name)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-pink-400">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Menu */}
            <div className="flex items-center">
              <div className="flex space-x-4">
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-2 text-white ${
                    pathname === '/admin/dashboard' ? 'bg-pink-500' : 'hover:bg-pink-500'
                  }`}
                >
                  會員管理
                </Link>
                <Link
                  href="/admin/points"
                  className={`px-3 py-2 text-white ${
                    pathname === '/admin/points' ? 'bg-pink-500' : 'hover:bg-pink-500'
                  }`}
                >
                  點數操作
                </Link>
              </div>
            </div>

            {/* Right side - Admin name */}
            <div className="flex items-center">
              <span className="text-white mr-4">HELLO, {adminName}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('adminData')
                  router.push('/admin-login')
                }}
                className="text-white hover:bg-pink-500 px-3 py-2"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  )
}