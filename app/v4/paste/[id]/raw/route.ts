// File: app/v4/paste/[id]/raw/route.ts

import { connectDB } from "@/app/lib/mnog"
import Paste from "@/app/models/Paste"

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  await connectDB()
  const paste = await Paste.findById(id).lean<{ code: string } | null>()

  if (!paste) {
    return new Response("Not Found", { status: 404 })
  }

  return new Response(paste.code, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  })
}
