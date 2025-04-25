// app/api/create-token/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { randomUUID } from "crypto";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = "antibypass"; // เปลี่ยนชื่อนี้เป็นชื่อ database ของคุณ

export async function POST() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("token");

    const generatedToken = randomUUID(); // สร้าง token แบบสุ่ม

    const result = await collection.insertOne({
      token: generatedToken,
     used: false,
    });

    return NextResponse.json({
      success: true,
      token: generatedToken,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating token:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  } finally {
    await client.close();
  }
}
