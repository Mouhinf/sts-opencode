import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-static";

const devisSchema = z.object({
  service: z.string().min(1),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  budget: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    devisSchema.parse(body);
    return NextResponse.json({ success: true, message: "Devis enregistré !" });
  } catch {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }
}