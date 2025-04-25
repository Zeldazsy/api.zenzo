// app/api/post-update/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongox";
import { Webhook } from "@/app/lib/webhook";

export async function POST(req: Request) {
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const db = await connectDB();
  await db.collection("updates").insertOne({ title, content, createdAt: new Date() });

  // ส่งไป Discord
  await Webhook(title, content);

  return NextResponse.json({ success: true });
}
