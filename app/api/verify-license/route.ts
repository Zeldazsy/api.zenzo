import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { key } = await req.json()

  // ตรวจสอบกับ license key ที่คุณเก็บไว้ใน .env หรือ DB
  const validKey = process.env.NEXT_PUBLIC_LICENSE_KEY

  if (key === validKey) {
    return NextResponse.json({ valid: true })
  }

  return NextResponse.json({ valid: false })
}
