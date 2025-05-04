import { NextResponse } from "next/server";
import getMongoClient from "../../lib/mongo";

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

await Reset(discord_id);
return NextResponse.redirect(new URL(`https://www.zenzohub.pro/getkey?type=success&meg=Reset HWID Successfuly`, req.url));
}
