import { NextResponse } from "next/server";
import getMongoClient from "@/app/lib/mongo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const discord_id = searchParams.get("discord_id");

  if (!discord_id) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const client = await getMongoClient();
  const db = client.db("lootlabs");
  const keysCollection = db.collection("keys");

  const keyDoc = await keysCollection.findOne({ discord_id }); // หาคีย์ที่ตรงกัน

  if (!keyDoc) {
    return NextResponse.json({ valid: false, message: "Key not found" }, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    key: keyDoc.key,
  });
}
