// File: app/v4/paste/[id]/page.ts

import { connectDB } from "@/app/lib/mnog"
import Paste from "@/app/models/Paste"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function ViewPaste({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()
  const paste = await Paste.findById(id).lean<{ language: string; info: string }>()
  if (!paste) return notFound()

  async function handleDelete() {
    'use server'
    await Paste.findByIdAndDelete(id)
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex justify-end gap-2 mb-4">
        <Link href={`/pastes/${id}/edit`} className="bg-yellow-500 text-white px-4 py-1 rounded">Edit</Link>
        <Link href={`/v4/paste/${id}/raw`} className="bg-gray-600 text-white px-4 py-1 rounded">Raw</Link>
        <form action={handleDelete}>
          <button type="submit" className="bg-red-600 text-white px-4 py-1 rounded">Delete</button>
        </form>
      </div>
      {paste.info}
    </div>
  )
}
