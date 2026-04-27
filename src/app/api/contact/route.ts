import { NextResponse } from "next/server";
import { z } from "zod";
import { db, adminInitialized } from "@/lib/firebase/admin";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional().default("Demande de visite"),
  type: z.string().optional(),
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  
  let validated;
  try {
    validated = contactSchema.parse(body);
  } catch {
    return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
  }

  const messageData = {
    name: validated.name,
    email: validated.email,
    phone: validated.phone || "",
    message: validated.message || "Demande de visite",
    type: validated.type || "contact",
    propertyId: validated.propertyId || "",
    propertyTitle: validated.propertyTitle || "",
    read: false,
    createdAt: new Date().toISOString(),
  };

  // Save to Firestore if available
  if (adminInitialized && db) {
    try {
      await db.collection("messages").add(messageData);
    } catch (e) {
      console.error("Firestore write error:", e);
    }
  }

  // Return the message data so client can store in localStorage
  return NextResponse.json({ 
    success: true, 
    message: "Message envoyé !",
    messageData: messageData,
  });
}