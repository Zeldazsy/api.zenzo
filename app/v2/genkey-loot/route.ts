import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import getMongoClient from "../../lib/mongo";

const KEY_DURATION_MS = 8 * 60 * 60 * 1000; // 8 ชั่วโมง

const devBypassTokens = ["testtoken123"];


async function validateToken(token: string) {
  if (devBypassTokens.includes(token)) return true;

  const client = await getMongoClient();
  const tokenDb = client.db("antibypass");
  const tokenCollection = tokenDb.collection("token");

  const foundToken = await tokenCollection.findOne({ token });
  if (!foundToken || foundToken.used) return false;

  await tokenCollection.updateOne({ token }, { $set: { used: true } });
  return true;
}

async function generateKey(discord_id: string) {
  const client = await getMongoClient();
  const db = client.db("lootlabs");
  const keys = db.collection("keys");

  const key = nanoid(16);
  const now = new Date();
  const expiredAt = new Date(now.getTime() + KEY_DURATION_MS);

  await keys.insertOne({
    discord_id,
    key,
    createdAt: now,
    expiredAt,
    used: false,
    hwid: "Null",
  });

  return key;
}

export async function GET(req: Request) {
  const url = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL);
  const token = url.searchParams.get("token");
  const discord_id = url.searchParams.get("discord_id");

  if (!discord_id || typeof discord_id !== "string") {
    return NextResponse.json(
      { success: false, error: "Missing or invalid discord_id" },
      { status: 400 }
    );
  }

  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { success: false, error: "Missing or invalid token" },
      { status: 400 }
    );
  }

  const isTokenValid = await validateToken(token);
  if (!isTokenValid) {
    return NextResponse.json(
      { success: false, error: "Invalid or already used token" },
      { status: 401 }
    );
  }

  const client = await getMongoClient();
  const db = client.db("lootlabs");
  const keys = db.collection("keys");
  const now = new Date();

  const existingKey = await keys.findOne({ discord_id });

  if (existingKey) {
    const keyExpiry = new Date(existingKey.expiredAt);
    const newExpiry =
      keyExpiry > now
        ? new Date(keyExpiry.getTime() + KEY_DURATION_MS)
        : new Date(now.getTime() + KEY_DURATION_MS);

    await keys.updateOne(
      { discord_id },
      { $set: { expiredAt: newExpiry } }
    );

    return NextResponse.redirect(new URL(`https://zenzohub.pro/getkey?type=success&meg=Key extended 8 hours`, req.url));
  }
await generateKey(discord_id);
return NextResponse.redirect(new URL(`https://zenzohub.pro/getkey?type=success&meg=Key generated`, req.url));
}
