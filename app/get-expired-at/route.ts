// app/api/expiredAt/route.ts
import { NextResponse } from "next/server";
import getMongoClient from "@/app/lib/mongo";

export async function POST(req: Request) {
  const body = await req.json();
  const key = body.key;

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const client = await getMongoClient();
  const db = client.db("lootlabs");
  const collection = db.collection("keys");

  const keyData = await collection.findOne({ key });

  return NextResponse.json({
    expiredAt: keyData?.expiredAt ?? "not found"
  });
}
