import { NextResponse } from "next/server";
import getMongoClient from "../../lib/mongo";


const linkvertiseToken = "cf6fbcc7ab8eaba78fadd4f02e2b758d4c1fe949324bac54d015fa47ab91f832";
const devBypassHashes = ["testhash123"];
const devBypassTokens = ["testtoken123"];

async function validateHash(hash: string) {
  if (devBypassHashes.includes(hash)) return true;

  try {
    const res = await fetch(
      `https://publisher.linkvertise.com/api/v1/anti_bypassing?token=${linkvertiseToken}&hash=${hash}`,
      { method: "POST" }
    );
    const result = await res.json();
    return result.status === true;
  } catch (err) {
    console.error("Error validating hash:", err);
    return false;
  }
}

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

async function Reset(discord_id: string) {
  const client = await getMongoClient();
  const db = client.db("lootlabs");
  const keys = db.collection("keys");
  await keys.updateOne(
    { discord_id },
    {
      $set: {
        hwid: 'Null',
      },
    }
  );
  return true;
}

export async function GET(req: Request) {
  const url = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL);
  const token = url.searchParams.get("token");
  const hash = url.searchParams.get("hash");
  const discord_id = url.searchParams.get("discord_id");

  if (!discord_id || typeof discord_id !== "string") {
    return NextResponse.json(
      { success: false, error: "Missing or invalid discord_id" },
      { status: 400 }
    );
  }

  if (!hash || typeof hash !== "string") {
    return NextResponse.json(
      { success: false, error: "Missing or invalid hash" },
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

  const isHashValid = await validateHash(hash);
  if (!isHashValid) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired hash" },
      { status: 403 }
    );
  }

await Reset(discord_id);
return NextResponse.redirect(new URL(`/getkey?type=success&meg=Reset HWID Successfuly`, req.url));
}
