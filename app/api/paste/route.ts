import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/app/lib/mnog"
import Paste from "@/app/models/Paste"

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const paste = await Paste.create(body)
  return NextResponse.json(paste)
}
