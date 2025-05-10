import { NextResponse } from 'next/server';


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const discordId = searchParams.get("id");

  if (!discordId) return new NextResponse("Missing ID", { status: 400 });

  const res = await fetch(`https://discord.com/api/v10/users/${discordId}`, {
    headers: {
      Authorization: `Bot ${process.env.NEXT_PUBLIC_BOT_TOKEN}`, // ✅ ต้องใส่ "Bot " ข้างหน้า
    },
  });

  if (!res.ok) {
    return new NextResponse("Failed to fetch user", { status: res.status });
  }

  const data = await res.json();

  return NextResponse.json({
    data
  });
}
