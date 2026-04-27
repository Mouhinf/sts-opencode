export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  location?: string;
  city?: string;
  type: string;
  surface?: number;
  bedrooms?: number;
  rooms?: number;
  bathrooms?: number;
  images?: string[];
  imageUrl?: string;
  status: "available" | "reserved" | "a_vendre" | "a_louer" | "vendu";
  featured?: boolean;
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Vehicle {
  id: string;
  name?: string;
  brand?: string;
  model?: string;
  year?: number;
  type: string;
  capacity: number;
  pricePerDay: number;
  images?: string[];
  imageUrl?: string;
  available?: boolean;
  features?: string[];
  description?: string;
  createdAt?: Date;
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startDate: string | Date;
  endDate: string | Date;
  totalPrice: number;
  pickupLocation?: string;
  destination?: string;
  notes?: string;
  status?: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
}

export interface Quote {
  id: string;
  service?: string;
  quoteType?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  company?: string;
  message?: string;
  type?: string;
  budget?: string;
  status?: "new" | "in-progress" | "done" | "pending";
  createdAt?: Date;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  type?: string;
  message: string;
  read?: boolean;
  createdAt?: Date;
}

export interface Training {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  price: number;
  schedule?: string;
  seats?: number;
  enrolled?: number;
  nextSession?: string;
  image?: string;
  category?: string;
  createdAt?: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  published: boolean;
  author: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  role: "super-admin" | "admin";
  createdAt: Date;
}