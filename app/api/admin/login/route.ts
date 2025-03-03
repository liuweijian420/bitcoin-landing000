import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 創建一個不依賴 cookies 的 Supabase 客戶端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // 查詢管理員資料
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single()

    if (adminError) {
      return NextResponse.json(
        { error: '管理員帳號不存在' },
        { status: 401 }
      )
    }

    // 驗證密碼
    const { data: isValid, error: verifyError } = await supabase
      .rpc('verify_admin_password', {
        input_username: username,
        input_password: password
      })

    if (verifyError || !isValid) {
      return NextResponse.json(
        { error: '帳號或密碼錯誤' },
        { status: 401 }
      )
    }

    // 登入成功
    return NextResponse.json({
      success: true,
      admin: {
        username: adminData.username,
        real_name: adminData.real_name
      }
    })

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || '登入過程發生錯誤' },
      { status: 500 }
    )
  }
}