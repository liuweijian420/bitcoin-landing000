"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface WithdrawRequest {
  id: number
  admin: string
  username: string
  real_name: string
  type: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  bank_info: string
  created_at: string
}

export default function PointsPage() {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [requests, setRequests] = useState<WithdrawRequest[]>([])
  const [filters, setFilters] = useState({
    dateRange: '',
    username: '',
    type: '',
    status: ''
  })

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('withdraw_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching requests:', error)
      return
    }

    if (data) {
      setRequests(data)
    }
  }

  const handleStatusUpdate = async (requestId: number, newStatus: 'approved' | 'rejected') => {
    try {
      // 先獲取提款請求的資訊和用戶當前餘額
      const { data: withdrawRequest, error: fetchError } = await supabase
        .from('withdraw_requests')
        .select('username, amount')
        .eq('id', requestId)
        .single()
  
      if (fetchError) throw fetchError
  
      if (newStatus === 'approved') {
        // 獲取用戶當前餘額
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('balance')
          .eq('username', withdrawRequest.username)
          .single()
  
        if (userError) throw userError
  
        // 檢查餘額是否足夠
        if (userData.balance < withdrawRequest.amount) {
          toast({
            variant: "destructive",
            title: "錯誤",
            description: "用戶餘額不足",
          })
          return
        }
  
        // 更新提款請求狀態
        const { error: updateStatusError } = await supabase
          .from('withdraw_requests')
          .update({ status: newStatus })
          .eq('id', requestId)
  
        if (updateStatusError) throw updateStatusError
  
        // 扣除用戶點數
        const { error: updateBalanceError } = await supabase
          .from('users')
          .update({ 
            balance: userData.balance - withdrawRequest.amount 
          })
          .eq('username', withdrawRequest.username)
  
        if (updateBalanceError) throw updateBalanceError
  
        toast({
          title: "成功",
          description: `申請已通過，已扣除 ${withdrawRequest.amount} 點數`,
          className: "bg-green-500 text-white",
        })
      } else {
        // 如果是拒絕，只需更新狀態
        const { error } = await supabase
          .from('withdraw_requests')
          .update({ status: newStatus })
          .eq('id', requestId)
  
        if (error) throw error
  
        toast({
          title: "成功",
          description: "申請已拒絕",
          className: "bg-green-500 text-white",
        })
      }
  
      fetchRequests()
  
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message,
      })
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-4 gap-4">
        <Input
          type="date"
          value={filters.dateRange}
          onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          placeholder="創建時間"
        />
        <Select
          value={filters.username}
          onValueChange={(value) => setFilters({ ...filters, username: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="所屬用戶" />
          </SelectTrigger>
          <SelectContent>
            {/* 用戶列表 */}
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="狀態" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">待處理</SelectItem>
            <SelectItem value="approved">已通過</SelectItem>
            <SelectItem value="rejected">已拒絕</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setFilters({
          dateRange: '',
          username: '',
          type: '',
          status: ''
        })}>
          重置
        </Button>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>歸屬</TableHead>
              <TableHead>會員帳號</TableHead>
              <TableHead>真實姓名</TableHead>
              <TableHead>類別</TableHead>
              <TableHead>積分</TableHead>
              <TableHead>銀行資訊</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.admin}</TableCell>
                <TableCell>{request.username}</TableCell>
                <TableCell>{request.real_name}</TableCell>
                <TableCell>盈餘結算</TableCell>
                <TableCell>{request.amount}</TableCell>
                <TableCell className="max-w-md truncate">
                  {request.bank_info}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    request.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status === 'pending' ? '待處理' :
                     request.status === 'approved' ? '已通過' :
                     '已拒絕'}
                  </span>
                </TableCell>
                <TableCell>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-50 hover:bg-green-100"
                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                      >
                        通過
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 hover:bg-red-100"
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                      >
                        拒絕
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}