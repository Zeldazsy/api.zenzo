import { connectDB } from "@/app/lib/mnog"
import Paste from "@/app/models/IDK"
import { NextResponse } from "next/server"

export async function GET() {
  await connectDB()
  const pastes = await Paste.find().sort({ createdAt: -1 })
  return NextResponse.json(pastes)
}
