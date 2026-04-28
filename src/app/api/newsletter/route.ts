import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, email: body.email || "" });
}