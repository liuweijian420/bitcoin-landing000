"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import Link from "next/link"

const BANK_LIST = [
  "(004)臺灣銀行",
  "(005)土地銀行",
  "(006)合作金庫",
  "(007)第一商業銀行",
  "(008)華南商業銀行",
  "(009)彰化商業銀行",
  "(011)上海商業儲蓄銀行",
  "(012)台北富邦銀行",
  "(013)國泰世華商業銀行",
  "(016)高雄銀行",
  "(017)兆豐國際商業銀行",
  "(018)農業金庫",
  "(021)花旗",
  "(025)首都銀行",
  "(039)澳商澳盛銀行",
  "(040)中華開發工業銀行",
  "(048)王道銀行",
  "(050)臺灣中小企業銀行",
  "(052)渣打國際商業銀行",
  "(053)台中商業銀行",
  "(054)京城商業銀行",
  "(072)德意志銀行",
  "(075)東亞銀行",
  "(081)匯豐",
  "(085)新加坡商新加坡華僑銀行",
  "(101)瑞興商業銀行",
  "(102)華泰銀行",
  "(103)臺灣新光商銀",
  "(104)台北五信",
  "(106)台北九信",
  "(108)陽信商業銀行",
  "(114)基隆一信",
  "(115)基隆二信",
  "(118)板信商業銀行",
  "(119)淡水一信",
  "(120)淡水信合社",
  "(124)宜蘭信合社",
  "(127)桃園信合社",
  "(130)新竹一信",
  "(132)新竹三信",
  "(146)台中二信",
  "(147)三信商業銀 行",
  "(158)彰化一信",
  "(161)彰化五信",
  "(162)彰化六信4",
  "(162)彰化六信",
  "(163)彰化十信",
  "(165)鹿港信合社",
  "(178)嘉義三信",
  "(179)嘉義四信",
  "(188)台南三信",
  "(204)高雄三信",
  "(215)花蓮一信",
  "(216)花蓮二信",
  "(222)澎湖一信",
  "(223)澎湖二信",
  "(224)金門信合社",
  "(506)桃園區漁會",
  "(512)雲林區漁會",
  "(515)嘉義區漁會",
  "(517)南市區漁會",
  "(518)南縣區漁會",
  "(520)小港區漁會",
  "(521)彌陀區漁會",
  "(523)東港漁會",
  "(524)新港區漁會",
  "(525)澎湖區漁會",
  "(557)新市區農會",
  "(605)高雄市農會",
  "(612)豐原市農會",
  "(613)名間農會",
  "(614)彰化地區農會",
  "(616)雲林地區農會",
  "(617)嘉義地區農會",
  "(618)台南地區農會",
  "(619)高雄地區農會",
  "(620)屏東地區農會",
  "(621)花蓮地區農會",
  "(622)台東地區農會",
  "(624)澎湖農會",
  "(625)台中市農會",
  "(627)連江縣農會",
  "(635)線西鄉農會",
  "(646)大城鄉農會",
  "(685)土庫鎮農會",
  "(700)中華郵政",
  "(781)三峽農會",
  "(803)聯邦商業銀行",
  "(804)中華銀行",
  "(805)遠東銀行",
  "(806)元大銀行",
  "(807)永豐銀行",
  "(808)玉山銀行",
  "(809)凱基銀行",
  "(810)星展銀行",
  "(812)台新銀行",
  "(814)大眾銀行",
  "(815)日盛銀行",
  "(816)安泰銀行",
  "(822)中國信託",
  "(823)將來銀行",
  "(824)連線商業銀行",
  "(826)樂天國際商業銀行",
  "(866)阿里山鄉農會",
  "(874)霧峰區農會",
  "(880)石岡區農會",
  "(901)大里市農會",
  "(903)汐止農會",
  "(904)新莊農會",
  "(910)財團法人農漁會聯合資訊中心",
  "(912)冬山農會",
  "(916)草屯農會",
  "(922)台南市農會",
  "(928)板橋農會",
  "(951)新北地區農會",
  "(954)中南部地區農漁會",
] as const

export default function WithdrawPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasBankInfo, setHasBankInfo] = useState(false)
  const [withdrawalPassword, setWithdrawalPassword] = useState("")
  const [confirmWithdrawalPassword, setConfirmWithdrawalPassword] = useState("")

  const [formData, setFormData] = useState({
    bank: "",
    accountNumber: "",
    amount: "",
    withdrawalPassword: "",
  })

  const [userInfo, setUserInfo] = useState({
    username: "",
    real_name: "",
    balance: 0,
    bank_info: "",
    withdrawal_password: "",
  })

  // 檢查用戶是否已設置銀行資訊和提款密碼
  useEffect(() => {
    const checkUserInfo = async () => {
      // 從 localStorage 獲取用戶資訊
      const userData = localStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }

      const user = JSON.parse(userData)

      // 從資料庫獲取最新的用戶資訊
      const { data, error } = await supabase
        .from("users")
        .select("username, real_name, balance, bank_info, withdrawal_password")
        .eq("username", user.username)
        .single()

      if (error) {
        console.error("Error fetching user info:", error)
        return
      }

      setUserInfo(data)
      setHasBankInfo(!!data.bank_info && !!data.withdrawal_password)
    }

    checkUserInfo()
  }, [router, supabase])

  // 處理設置銀行資訊和提款密碼
  const handleSetupBankInfo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.bank || !formData.accountNumber || !withdrawalPassword || !confirmWithdrawalPassword) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "請填寫所有必填欄位",
      })
      return
    }

    if (withdrawalPassword !== confirmWithdrawalPassword) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "提款密碼不一致",
      })
      return
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({
          bank_info: `${formData.bank} / ${formData.accountNumber}`,
          withdrawal_password: withdrawalPassword,
        })
        .eq("username", userInfo.username)

      if (error) throw error

      toast({
        title: "成功",
        description: "銀行資訊和提款密碼已設置",
        className: "bg-green-500 text-white",
      })

      setHasBankInfo(true)
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
    }
  }

  // 處理提款申請
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.withdrawalPassword) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "請填寫所有必填欄位",
      })
      return
    }

    try {
      // 驗證提款密碼
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("withdrawal_password, admin")
        .eq("username", userInfo.username)
        .single()

      if (userError) throw userError

      if (userData.withdrawal_password !== formData.withdrawalPassword) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "提款密碼錯誤",
        })
        return
      }

      // 提交提款申請，包含 admin 欄位
      const { error } = await supabase.from("withdraw_requests").insert({
        username: userInfo.username,
        real_name: userInfo.real_name,
        amount: Number.parseFloat(formData.amount),
        bank_info: userInfo.bank_info,
        status: "pending",
        admin: userData.admin  // 添加 admin 欄位
      })

      if (error) throw error

      toast({
        title: "成功",
        description: "提款申請已提交",
        className: "bg-green-500 text-white",
      })

      setFormData((prev) => ({
        ...prev,
        amount: "",
        withdrawalPassword: "",
      }))
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
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("user")
    router.push("/login")
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
                <Image src="/logo.png" alt="Logo" width={120} height={120} />
              </div>
              {/* 漢堡選單按鈕 */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden absolute right-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <Link href="/member-center" className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium">
                會員中心
              </Link>
              <Link href="/settings" className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium">
                修改資料
              </Link>
              <Link href="/withdraw" className="text-orange-400 px-3 py-2 text-sm font-medium">
                賣出資產
              </Link>
              <Link href="/history" className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium">
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
        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden absolute w-full bg-[#1A202C] z-50`}>
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
            <Link href="/withdraw" className="text-orange-400 block px-3 py-2 text-base font-medium">
              賣出資產
            </Link>
            <Link href="/history" className="text-gray-300 hover:text-orange-400 block px-3 py-2 text-base font-medium">
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

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-6 px-4">
          <div className="bg-white rounded-lg shadow p-6">
            {!hasBankInfo ? (
              // 設置銀行資訊和提款密碼的表單
              <>
                <h2 className="text-lg font-medium mb-6 text-gray-900 flex items-center">
                  <span className="w-1 h-6 bg-orange-500 mr-2 inline-block"></span>
                  設置銀行帳戶和提款密碼
                </h2>

                <form onSubmit={handleSetupBankInfo} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">銀行名稱</label>
                      <Select
                        value={formData.bank}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, bank: value }))}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="選擇銀行" />
                        </SelectTrigger>
                        <SelectContent>
                          {BANK_LIST.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">帳號</label>
                      <Input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData((prev) => ({ ...prev, accountNumber: e.target.value }))}
                        placeholder="請輸入銀行帳號"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">提款密碼</label>
                      <Input
                        type="password"
                        value={withdrawalPassword}
                        onChange={(e) => setWithdrawalPassword(e.target.value)}
                        placeholder="請設置提款密碼"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">確認提款密碼</label>
                      <Input
                        type="password"
                        value={confirmWithdrawalPassword}
                        onChange={(e) => setConfirmWithdrawalPassword(e.target.value)}
                        placeholder="請再次輸入提款密碼"
                        className="mt-1"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                        確認設置
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              // 提款操作表單
              <>
                <h2 className="text-lg font-medium mb-6 text-gray-900 flex items-center">
                  <span className="w-1 h-6 bg-orange-500 mr-2 inline-block"></span>
                  賣出資產
                </h2>

                <form onSubmit={handleWithdraw} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">登入帳號</label>
                      <Input type="text" value={userInfo.username} disabled className="mt-1 bg-gray-100" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">發售金額</label>
                      <Input type="text" value={userInfo.balance} disabled className="mt-1 bg-gray-100" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">結算目標</label>
                      <Input type="text" value="賣出資產" disabled className="mt-1 bg-gray-100" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">輸入金額</label>
                      <Input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                        placeholder="請輸入提款金額(不得小於2000)"
                        className="mt-1"
                        max={userInfo.balance}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">提款密碼</label>
                      <Input
                        type="password"
                        value={formData.withdrawalPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, withdrawalPassword: e.target.value }))}
                        placeholder="請輸入提款密碼"
                        className="mt-1"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                        確認提交
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            )}

            {/* Notice */}
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-medium text-orange-500 flex items-center">
                <span className="w-1 h-6 bg-orange-500 mr-2 inline-block"></span>
                注意事項：
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                <li>首次填寫完成後，即完成綁定，恕不任意更改。</li>
                <li>為防止有人人士利用本站作為詐騙集團工具，申請新增銀行帳戶已設定本身資料，才可提出申請。</li>
                <li>如有必要需向客服更改資料，請洽線上客服人員。</li>
                <li>如利用本平臺進行任何非法詐騙銀行行為，本公司有權利審核核準戶名或永久終止服務，不另行通知。</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-pink-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-white text-sm">© 2025 BitcoinCash All Rights Reserved</p>
        </div>
      </footer>
    </div>
  )
}

