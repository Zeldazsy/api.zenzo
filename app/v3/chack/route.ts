import { NextResponse } from "next/server";
import getMongoClient from "@/app/lib/mongo";

export async function POST(req: Request) {
  const body = await req.json();
  const key = body.key;
  const hwid = body.hwid;

  if (!key || !hwid) {
    return NextResponse.json({ success: false, message: "Missing key or hwid" }, { status: 400 });
  }

  const client = await getMongoClient();
  const db = client.db("lootlabs");
  const collection = db.collection("keys");

  const data = await collection.findOne({ key });

  if (!data) {
    return NextResponse.json({ success: false, message: "Key not found" });
  }

  if (data.hwid === "Null") {
    await collection.updateOne(
      { key },
      {
        $set: {
          hwid,
          used: true,
        },
      }
    );
    return NextResponse.json({ success: true, message: "HWID set and key activated" });
  }

  if (data.hwid !== hwid) {
    return NextResponse.json({ success: false, message: "HWID mismatch" });
  }

  const now = new Date();
  const expiresAt = new Date(data.expiredAt);

  if (now > expiresAt) {
    return NextResponse.json({ success: false, message: "Key expired" });
  }

  return NextResponse.json({ success: true, key: key });
}
