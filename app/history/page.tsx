"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Transaction {
  created_at: string
  amount: number
  status: string
}

export default function HistoryPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [,setUserInfo] = useState({
    username: '',
    real_name: ''
  })

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userData = localStorage.getItem('user')
      if (!userData) {
        router.push('/login')
        return
      }

      const user = JSON.parse(userData)
      setUserInfo(user)

      // 獲取用戶的提現記錄
      const { data, error } = await supabase
        .from('withdraw_requests')
        .select('created_at, amount, status')
        .eq('username', user.username)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error)
        return
      }

      if (data) {
        setTransactions(data)
      }
    }

    fetchUserInfo()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
                className="text-orange-400 px-3 py-2 text-sm font-medium"
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
              className="text-orange-400 block px-3 py-2 text-base font-medium"
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
        <div className="max-w-6xl mx-auto py-6 px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6 text-gray-900 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-2 inline-block"></span>
              交易紀錄
            </h2>

            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>訂單日期</TableHead>
                    <TableHead>明細</TableHead>
                    <TableHead>金額</TableHead>
                    <TableHead>狀態</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                        <TableCell>{formatDate(transaction.created_at)}</TableCell>
                        <TableCell>提領</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>
                        <span
                            className={`px-2 py-1 rounded-full text-sm ${
                            transaction.status === 'pending' 
                                ? 'bg-blue-100 text-blue-800' 
                                : transaction.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {transaction.status === 'pending' 
                            ? '待處理' 
                            : transaction.status === 'approved'
                            ? '已通過'
                            : '已拒絕'}
                        </span>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
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