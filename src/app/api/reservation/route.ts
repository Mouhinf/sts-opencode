import { NextResponse } from "next/server";
import { z } from "zod";
import { db, adminInitialized } from "@/lib/firebase/admin";

const reservationSchema = z.object({
  vehicleId: z.string().optional(),
  vehicleName: z.string().min(1, "Véhicule requis"),
  clientName: z.string().min(2, "Nom requis"),
  clientEmail: z.string().email("Email invalide"),
  clientPhone: z.string().min(8, "Téléphone requis"),
  startDate: z.string().min(1, "Date de départ requise"),
  endDate: z.string().min(1, "Date de retour requise"),
  pickup: z.string().min(1, "Lieu de départ requis"),
  destination: z.string().min(1, "Destination requise"),
  notes: z.string().optional(),
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
    
    // Validate dates
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    if (endDate <= startDate) {
      return NextResponse.json(
        { success: false, error: "Date de retour ultérieure à la date de départ" },
        { status: 400 }
      );
    }

    const validated = reservationSchema.parse(body);

    if (!adminInitialized || !db) {
      return NextResponse.json(
        { success: false, error: "Service temporairement indisponible" },
        { status: 503 }
      );
    }

    const totalPrice = 0;
    await db!.collection("bookings").add({
      ...validated,
      totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Réservation enregistrée !" },
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