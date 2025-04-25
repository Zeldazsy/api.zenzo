import { db } from "@/app/lib/mongay";
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  // Parse the request body
  const { key, hwid } = await req.json(); // Extract from JSON body
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  const license = await db.collection('keys').findOne({ key });

  if (!license || !license.valid) {
    return Response.json({ valid: false });
  }

  if (license.used) {
    if (license.hwid !== hwid || license.ip !== ip) {
      return Response.json({ valid: false, reason: 'Key already used on another device' });
    }
    return Response.json({ valid: true });
  }

  await db.collection('keys').updateOne(
    { key },
    { $set: { used: true, hwid, ip } }
  );

  return Response.json({ valid: true });
}
