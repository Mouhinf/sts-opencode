import "./client";
import { db } from "./client";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import type { Property, Vehicle, Booking, Quote, Message, Training, BlogPost } from "@/types";

export const COLLECTIONS = {
  PROPERTIES: "properties",
  VEHICLES: "vehicles",
  BOOKINGS: "bookings",
  QUOTES: "quotes",
  MESSAGES: "messages",
  TRAININGS: "trainings",
  BLOG_POSTS: "blog_posts",
  NEWSLETTER: "newsletter",
} as const;

export const mockProperties: Property[] = [
  { id: "1", title: "Villa F4 Point E", type: "villa", city: "Dakar", price: 45000000, location: "Point E, Dakar", surface: 250, bedrooms: 4, status: "available" },
  { id: "2", title: "Appartement F2 Almadies", type: "appartement", city: "Dakar", price: 28000000, location: "Les Almadies, Dakar", surface: 80, bedrooms: 2, status: "available" },
  { id: "3", title: "Terrain Sicap", type: "terrain", city: "Dakar", price: 35000000, location: "Sicap, Dakar", surface: 500, bedrooms: 0, status: "available" },
];

export const mockVehicles: Vehicle[] = [
  { id: "1", name: "Toyota Camry", type: "berline", capacity: 5, pricePerDay: 35000, features: ["Climatisation", "Bluetooth", "Essence"] },
  { id: "2", name: "Toyota Prado", type: "suv", capacity: 7, pricePerDay: 55000, features: ["4x4", "Climatisation", "GPS"] },
  { id: "3", name: "Hiace", type: "minibus", capacity: 14, pricePerDay: 75000, features: ["Climatisation", "TV", "USB"] },
];

export const mockTrainings: Training[] = [
  { id: "1", title: "Management des Equipes", category: "Management", duration: "3 jours", price: 150000, seats: 20, enrolled: 15, nextSession: "15 Mai 2026" },
  { id: "2", title: "Excel Avancé", category: "Informatique", duration: "2 jours", price: 100000, seats: 15, enrolled: 15, nextSession: "20 Mai 2026" },
];

export const getAllProperties = async (limitCount = 50) => {
  try {
    const colRef = collection(db, "properties");
    const snap = await getDocs(colRef);
    if (snap.empty || snap.size === 0) {
      console.log("No properties found in Firestore");
      return [];
    }
    const props = snap.docs.map(d => ({ id: d.id, ...d.data() } as Property));
    console.log("Properties loaded:", props.length);
    return props.slice(0, limitCount);
  } catch (e) {
    console.error("Error loading properties:", e);
    return [];
  }
};

export const createProperty = async (data: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
  const colRef = collection(db, COLLECTIONS.PROPERTIES);
  const docRef = await addDoc(colRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return docRef.id;
};

export const getAllVehicles = async () => {
  try {
    const colRef = collection(db, "vehicles");
    const snap = await getDocs(colRef);
    if (snap.empty || snap.size === 0) {
      console.log("No vehicles found in Firestore");
      return [];
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle));
  } catch (e) {
    console.error("Error loading vehicles:", e);
    return [];
  }
};

export const getAllTrainings = async () => {
  try {
    const colRef = collection(db, "trainings");
    const snap = await getDocs(colRef);
    if (snap.empty || snap.size === 0) {
      console.log("No trainings found in Firestore");
      return [];
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Training));
  } catch (e) {
    console.error("Error loading trainings:", e);
    return [];
  }
};

export const createVehicle = async (data: Omit<Vehicle, "id" | "createdAt">) => {
  const colRef = collection(db, COLLECTIONS.VEHICLES);
  const docRef = await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
};

export const getAllBookings = async () => {
  try {
    const colRef = collection(db, COLLECTIONS.BOOKINGS);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
  } catch {
    return [];
  }
};

export const createBooking = async (data: Omit<Booking, "id" | "createdAt">) => {
  const colRef = collection(db, COLLECTIONS.BOOKINGS);
  const docRef = await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
};

export const getAllQuotes = async () => {
  try {
    const colRef = collection(db, COLLECTIONS.QUOTES);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Quote));
  } catch {
    return [];
  }
};

export const createQuote = async (data: Omit<Quote, "id" | "createdAt">) => {
  const colRef = collection(db, COLLECTIONS.QUOTES);
  const docRef = await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
};

export const getAllMessages = async () => {
  try {
    const colRef = collection(db, COLLECTIONS.MESSAGES);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Message));
  } catch {
    return [];
  }
};

export const createMessage = async (data: Omit<Message, "id" | "createdAt">) => {
  const colRef = collection(db, COLLECTIONS.MESSAGES);
  const docRef = await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
};

export const getAllTrainings = async () => {
  try {
    const colRef = collection(db, COLLECTIONS.TRAININGS);
    const q = query(colRef, limit(50));
    const snap = await getDocs(q);
    if (snap.empty || snap.size === 0) {
      console.log("No trainings found in Firestore");
      return [];
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Training));
  } catch (e) {
    console.error("Error loading trainings:", e);
    return [];
  }
};
    console.error("Error loading trainings:", e);
    return [];
  }
};

export const createTraining = async (data: Omit<Training, "id" | "createdAt">) => {
  const colRef = collection(db, COLLECTIONS.TRAININGS);
  const docRef = await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
};

export const getPublishedBlogPosts = async () => {
  try {
    const colRef = collection(db, COLLECTIONS.BLOG_POSTS);
    const q = query(colRef, where("published", "==", true), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
  } catch {
    return [];
  }
};

export const createBlogPost = async (data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
  const colRef = collection(db, COLLECTIONS.BLOG_POSTS);
  const docRef = await addDoc(colRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return docRef.id;
};

export const subscribeToNewsletter = async (email: string) => {
  try {
    const colRef = collection(db, COLLECTIONS.NEWSLETTER);
    const q = query(colRef, where("email", "==", email));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { success: false, message: "Déjà abonné !" };
    }
    await addDoc(colRef, { email, active: true, subscribedAt: serverTimestamp() });
    return { success: true, message: "Abonné !" };
  } catch {
    return { success: false, message: "Erreur" };
  }
};