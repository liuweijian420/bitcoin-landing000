"use client"

import { useEffect, useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// 更新 User interface 包含新欄位
interface User {
  id: number
  admin: string
  username: string
  real_name: string
  phone: string
  line_id: string
  balance: number
  bank_info: string
  withdrawal_password: string
  created_at: string
}

export default function Dashboard() {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [adminName, setAdminName] = useState("")
  const [isAdjustingPoints, setIsAdjustingPoints] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [pointsToAdjust, setPointsToAdjust] = useState("")
  const [isChangingWithdrawalPassword, setIsChangingWithdrawalPassword] = useState(false)
  const [newWithdrawalPassword, setNewWithdrawalPassword] = useState("")
  const itemsPerPage = 10
  const [isEditing, setIsEditing] = useState(false)
  const [editingUser, setEditingUser] = useState({
    id: 0,
    password: "",
    real_name: "",
    phone: "",
    line_id: "",
  })
  // 更新新會員預設值包含新欄位
  const [newMember, setNewMember] = useState({
    username: "",
    password: "",
    real_name: "",
    phone: "",
    line_id: "",
    bank_info: "",
    withdrawal_password: "",
  })
  // Add this new handler function with other handlers
  const handleEdit = async () => {
    try {
      // 確保 selectedUser 存在
      if (!selectedUser?.username) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "未選擇用戶",
        })
        return
      }
      const updateData: any = {}
  
      // 只加入有值的欄位到 updateData
      if (editingUser.real_name?.trim()) {
        updateData.real_name = editingUser.real_name
      }
      if (editingUser.phone?.trim()) {
        updateData.phone = editingUser.phone
      }
      if (editingUser.line_id?.trim()) {
        updateData.line_id = editingUser.line_id
      }
      if (editingUser.password?.trim()) {
        updateData.password = editingUser.password
      }
  
      const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("username", selectedUser.username)  // 使用 selectedUser.username
  
      if (error) throw error
  
      toast({
        title: "成功",
        description: "會員資料已更新",
        className: "bg-green-500 text-white",
      })
  
      setIsEditing(false)
      fetchUsers()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message,
      })
    }
  }
  const fetchUsers = useCallback(async () => {
    const { data, error, count } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .ilike("real_name", `%${searchTerm}%`)
      .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return
    }

    if (data && count) {
      setUsers(data)
      setTotalPages(Math.ceil(count / itemsPerPage))
    }
  }, [supabase, searchTerm, currentPage])

  useEffect(() => {
    const adminData = localStorage.getItem("adminData")
    if (adminData) {
      const { username } = JSON.parse(adminData)
      setAdminName(username)
    }

    fetchUsers()
  }, [fetchUsers])

  const handleAddMember = async () => {
    try {
      if (!newMember.username || !newMember.password || !newMember.real_name || !newMember.phone) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "請填寫所有必填欄位",
        })
        return
      }

      const { error } = await supabase
        .from("users")
        .insert([
          {
            ...newMember,
            admin: adminName,
            balance: 0,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "新增成功",
        description: "會員已成功新增",
        className: "bg-green-500 text-white",
      })

      setNewMember({
        username: "",
        password: "",
        real_name: "",
        phone: "",
        line_id: "",
        bank_info: "",
        withdrawal_password: "",
      })
      setIsAddingMember(false)
      fetchUsers()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "新增失敗",
        description: error.message,
      })
    }
  }

  const handlePointsAdjustment = async () => {
    if (!selectedUser || !pointsToAdjust) return

    const points = Number.parseFloat(pointsToAdjust)
    if (isNaN(points)) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "請輸入有效的點數",
      })
      return
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({
          balance: selectedUser.balance + points,
        })
        .eq("id", selectedUser.id)
        .select()

      if (error) throw error

      toast({
        title: "成功",
        description: `已${points >= 0 ? "增加" : "減少"} ${Math.abs(points)} 點數`,
        className: "bg-green-500 text-white",
      })

      setIsAdjustingPoints(false)
      setPointsToAdjust("")
      fetchUsers()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message,
      })
    }
  }

  const handleWithdrawalPasswordChange = async () => {
    if (!selectedUser || !newWithdrawalPassword) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "請輸入新的提款密碼",
      })
      return
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({ withdrawal_password: newWithdrawalPassword })
        .eq("id", selectedUser.id)

      if (error) throw error

      toast({
        title: "成功",
        description: "提款密碼已更新",
        className: "bg-green-500 text-white",
      })

      setIsChangingWithdrawalPassword(false)
      setNewWithdrawalPassword("")
      fetchUsers()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="搜尋會員..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="outline" onClick={() => setSearchTerm("")}>
            重置
          </Button>
        </div>

        <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">添加會員</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>添加新會員</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="username" className="text-sm font-medium">
                  用戶名 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="username"
                  value={newMember.username}
                  onChange={(e) => setNewMember({ ...newMember, username: e.target.value })}
                  placeholder="請輸入用戶名"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  密碼 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="password"
                  type="password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  placeholder="請輸入密碼"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="real_name" className="text-sm font-medium">
                  真實姓名 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="real_name"
                  value={newMember.real_name}
                  onChange={(e) => setNewMember({ ...newMember, real_name: e.target.value })}
                  placeholder="請輸入真實姓名"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  手機號碼 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  placeholder="請輸入手機號碼"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="line_id" className="text-sm font-medium">
                  LINE ID
                </label>
                <Input
                  id="line_id"
                  value={newMember.line_id}
                  onChange={(e) => setNewMember({ ...newMember, line_id: e.target.value })}
                  placeholder="請輸入 LINE ID（選填）"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddingMember(false)}>
                取消
              </Button>
              <Button onClick={handleAddMember}>確認新增</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>歸屬</TableHead>
              <TableHead>用戶名</TableHead>
              <TableHead>真實姓名</TableHead>
              <TableHead>手機</TableHead>
              <TableHead>LINE</TableHead>
              <TableHead>銀行資訊</TableHead>
              <TableHead>提款密碼</TableHead>
              <TableHead>點數</TableHead>
              <TableHead>創建時間</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.admin}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.real_name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.line_id || "-"}</TableCell>
                <TableCell>{user.bank_info || "-"}</TableCell>
                <TableCell>{user.withdrawal_password || "-"}</TableCell>
                <TableCell>{user.balance}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleString("zh-TW")}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user)
                      setIsEditing(true)
                    }}
                  >
                    編輯
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user)
                      setIsAdjustingPoints(true)
                    }}
                  >
                    點數操作
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user)
                      setIsChangingWithdrawalPassword(true)
                    }}
                  >
                    修改提款密碼
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 點數調整對話框 */}
      <Dialog open={isAdjustingPoints} onOpenChange={setIsAdjustingPoints}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>點數操作</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-2">會員：{selectedUser?.real_name}</p>
              <p className="text-sm text-gray-500 mb-4">目前點數：{selectedUser?.balance}</p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="points" className="text-sm font-medium">
                調整點數（正數增加，負數減少）
              </label>
              <Input
                id="points"
                type="number"
                value={pointsToAdjust}
                onChange={(e) => setPointsToAdjust(e.target.value)}
                placeholder="請輸入要調整的點數"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAdjustingPoints(false)}>
              取消
            </Button>
            <Button onClick={handlePointsAdjustment}>確認</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 修改提款密碼對話框 */}
      <Dialog open={isChangingWithdrawalPassword} onOpenChange={setIsChangingWithdrawalPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改提款密碼</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-2">會員：{selectedUser?.real_name}</p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="new_withdrawal_password" className="text-sm font-medium">
                新提款密碼
              </label>
              <Input
                id="new_withdrawal_password"
                type="password"
                value={newWithdrawalPassword}
                onChange={(e) => setNewWithdrawalPassword(e.target.value)}
                placeholder="請輸入新的提款密碼"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsChangingWithdrawalPassword(false)}>
              取消
            </Button>
            <Button onClick={handleWithdrawalPasswordChange}>確認</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯會員資料</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit_username" className="text-sm font-medium">
                用戶名
              </label>
              <Input id="edit_username" value={users[0]?.username || ""} disabled className="bg-gray-100" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit_password" className="text-sm font-medium">
                密碼（不修改請留空）
              </label>
              <Input
                id="edit_password"
                type="password"
                value={editingUser.password}
                onChange={(e) => setEditingUser((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="請輸入新密碼"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit_real_name" className="text-sm font-medium">
                真實姓名
              </label>
              <Input
                id="edit_real_name"
                value={editingUser.real_name}
                onChange={(e) => setEditingUser((prev) => ({ ...prev, real_name: e.target.value }))}
                placeholder="請輸入真實姓名"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit_phone" className="text-sm font-medium">
                手機號碼
              </label>
              <Input
                id="edit_phone"
                value={editingUser.phone}
                onChange={(e) => setEditingUser((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="請輸入手機號碼"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit_line_id" className="text-sm font-medium">
                LINE ID
              </label>
              <Input
                id="edit_line_id"
                value={editingUser.line_id}
                onChange={(e) => setEditingUser((prev) => ({ ...prev, line_id: e.target.value }))}
                placeholder="請輸入 LINE ID"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              取消
            </Button>
            <Button onClick={handleEdit}>確認</Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div>
          顯示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, users.length)} 筆，共{" "}
          {users.length} 筆
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            上一頁
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            下一頁
          </Button>
        </div>
      </div>
    </div>
  )
}

