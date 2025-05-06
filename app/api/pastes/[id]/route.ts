// File: app/api/paste/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/mnog'
import Paste from '@/app/models/Paste'

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  await connectDB()
  const paste = await Paste.findById(id)
  if (!paste) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(paste)
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  await connectDB()
  const data = await req.json()
  const updated = await Paste.findByIdAndUpdate(id, data, { new: true })
  return updated
    ? NextResponse.json(updated)
    : NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  await connectDB()
  const deleted = await Paste.findByIdAndDelete(id)
  return deleted
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: 'Not found' }, { status: 404 })
}
