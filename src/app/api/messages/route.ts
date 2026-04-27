import { NextResponse } from "next/server";
import { db, adminInitialized } from "@/lib/firebase/admin";

export async function GET() {
  try {
    if (!adminInitialized || !db) {
      return NextResponse.json({ success: true, messages: [] });
    }

    const snapshot = await db.collection("messages").orderBy("createdAt", "desc").get();
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json({ success: true, messages: [] });
  }
}

export async function PUT(request: Request) {
  try {
    if (!adminInitialized || !db) {
      return NextResponse.json({ success: true });
    }

    const { id, read } = await request.json();
    if (id && db) {
      await db.collection("messages").doc(id).update({ read });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT messages error:", error);
    return NextResponse.json({ success: true });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!adminInitialized || !db) {
      return NextResponse.json({ success: true });
    }

    const { id } = await request.json();
    if (id && db) {
      await db.collection("messages").doc(id).delete();
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE messages error:", error);
    return NextResponse.json({ success: true });
  }
}