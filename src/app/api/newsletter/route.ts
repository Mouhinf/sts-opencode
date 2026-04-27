import { NextResponse } from "next/server";
import { z } from "zod";
import { db, adminInitialized } from "@/lib/firebase/admin";

const newsletterSchema = z.object({
  email: z.string().email("Email invalide"),
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
    const validated = newsletterSchema.parse(body);

    if (!adminInitialized || !db) {
      return NextResponse.json(
        { success: false, error: "Service temporairement indisponible" },
        { status: 503 }
      );
    }

    // Check if already subscribed
    const existing = await db!.collection("newsletter")
      .where("email", "==", validated.email)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { success: false, error: "Déjà abonné !" },
        { status: 400 }
      );
    }

    await db!.collection("newsletter").add({
      email: validated.email,
      active: true,
      subscribedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Abonné !" },
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