import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request: Request) {
  return NextResponse.json({ success: true, message: "Réservation envoyée !" });
}