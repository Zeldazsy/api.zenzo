import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    statusCode: 200,
    result: {
      version: "1.0.0",
    },
    message: "Welcome to the Zenzo API!",
  });
}