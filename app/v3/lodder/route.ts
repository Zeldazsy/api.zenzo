import { NextResponse } from 'next/server';

export function GET() {
  const luaCode = `loadstring(game:HttpGet("https://raw.githubusercontent.com/Zeldazsy/Zenzo/loadder/.lua", true))()`;
  return new NextResponse(luaCode, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
