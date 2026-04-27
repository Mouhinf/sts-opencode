import { NextResponse } from "next/server";
import { z } from "zod";
import { db, adminInitialized } from "@/lib/firebase/admin";

const devisSchema = z.object({
  service: z.string().min(1, "Service requis"),
  clientName: z.string().min(2, "Nom requis"),
  clientEmail: z.string().email("Email invalide"),
  clientPhone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  budget: z.string().optional(),
});

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return NextResponse.json(
      { success: false, error: "Method Not Allowed" },
      { status: 405 }
    );
  }

  try {
    const body = await request.json();
    const validated = devisSchema.parse(body);

    if (!adminInitialized || !db) {
      return NextResponse.json(
        { success: false, error: "Service temporairement indisponible" },
        { status: 503 }
      );
    }

    await db!.collection("quotes").add({
      ...validated,
      status: "new",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Devis enregistré !" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}