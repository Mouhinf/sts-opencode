import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ success: true, messages: [] });
}

export async function PUT(request: Request) {
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  return NextResponse.json({ success: true });
}