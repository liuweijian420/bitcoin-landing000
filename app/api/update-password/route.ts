import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { username, oldPassword, newPassword } = await request.json()
    /// 創建一個不依賴 cookies 的 Supabase 客戶端
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // 獲取用戶完整資料
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')  // 選擇所有欄位
      .eq('username', username)
      .single()

    if (userError) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 })
    }

    // 驗證舊密碼
    const isValidPassword = await bcrypt.compare(oldPassword, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: '舊密碼不正確' }, { status: 400 })
    }

    // 加密新密碼
    //const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 更新密碼
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: newPassword})
      .eq('username', username)

    if (updateError) {
      return NextResponse.json({ error: '密碼更新失敗' }, { status: 500 })
    }

    // 返回更新後的用戶資料（不包含密碼）
    const userData = {
      username: user.username,
      real_name: user.real_name,
      phone: user.phone,
      lind_id:user.line_id,
      created_at:user.created_at,
      balance:user.balance,
      admin:user.admin,
      bank_info:user.bank_info,
      withdrawal_password:user.withdrawal_password
    }

    return NextResponse.json({ 
      message: '密碼更新成功',
      user: userData
    })
  } catch (error) {
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}