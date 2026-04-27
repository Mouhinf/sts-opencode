"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Loader2, MapPin, Bed, Maximize, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Overlay } from "@/components/ui/Overlay";
import { getAllProperties } from "@/lib/firebase/collections";
import type { Property } from "@/types";

const types = ["Tous", "Appartement", "Maison", "Terrain", "Villa", "Duplex", "Penthouse", "Studio"];
const cities = ["Tous", "Dakar", "Thiès", "Saint-Louis", "Mbour", "Ziguinchor", "Kolda", "Kaolack", "Louga"];

function PropertySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-4">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

function PropertyDetailsSheet({ property, onClose }: { property: Property; onClose: () => void }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [toastMsg, setToastMsg] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const images = property.images?.length ? property.images : property.imageUrl ? [property.imageUrl] : [];

  const nextImage = () => {
    if (!images.length) return;
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!images.length) return;
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const STORAGE_KEY = "sts_messages";

function saveToLocalStorage(msgData: any) {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const messages = existing ? JSON.parse(existing) : [];
    messages.unshift({
      ...msgData,
      id: Date.now().toString(),
      read: false,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("localStorage error:", e);
  }
}

const handleVisitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: "visite",
          propertyId: property.id,
          propertyTitle: property.title,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToastMsg({ message: data.error || "Erreur. Veuillez réessayer.", type: "error" });
        setFormLoading(false);
        return;
      }
      // Save to localStorage for admin display
      if (data.messageData) {
        saveToLocalStorage(data.messageData);
      }
      setToastMsg({ message: "Demande envoyée ! Nous vous contacterons sous 24h.", type: "success" });
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(onClose, 1500);
    } catch {
      setToastMsg({ message: "Erreur. Veuillez réessayer.", type: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Overlay show={true}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-none flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={onClose} className="flex items-center gap-2 text-sts-gray hover:text-sts-black">
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Fermer</span>
          </button>
          <h2 className="text-lg font-bold text-sts-black truncate max-w-[50%] sm:max-w-[60%]">{property.title}</h2>
          <div className="w-12 sm:w-16" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-touch">
          {/* Gallery */}
          <div className="relative h-[35vh] sm:h-[50vh] bg-black">
            {images.length > 0 ? (
              <img
                src={images[selectedImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-sts-green/10 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-sts-green" />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === selectedImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {selectedImageIndex + 1}/{images.length}
            </div>
          </div>

          {/* Details */}
          <div className="px-4 py-5 space-y-5 pb-20">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sts-green shrink-0" />
              <span className="text-sts-black font-medium">{property.city || property.location || "Non précisé"}</span>
            </div>

            <div className="bg-sts-surface rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-sts-green">
                {new Intl.NumberFormat("fr-FR").format(property.price)} XOF
              </p>
              <p className="text-sm text-sts-gray mt-1">
                {property.status === "a_vendre" ? "À vendre" : property.status === "a_louer" ? "À louer" : "Réservé"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-sts-surface rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-sts-green">{property.surface || 0}</p>
                <p className="text-xs text-sts-gray">m²</p>
              </div>
              <div className="bg-sts-surface rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-sts-green">{property.bedrooms || 0}</p>
                <p className="text-xs text-sts-gray">Chambres</p>
              </div>
              <div className="bg-sts-surface rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-sts-green capitalize">{property.type || "N/A"}</p>
                <p className="text-xs text-sts-gray">Type</p>
              </div>
            </div>

            {property.description && (
              <div>
                <h3 className="font-bold text-sts-black mb-2">Description</h3>
                <p className="text-sts-gray whitespace-pre-line">{property.description}</p>
              </div>
            )}

            <div className="border-t pt-5">
              <h3 className="font-bold text-sts-black mb-4">Demander une visite</h3>
              <form onSubmit={handleVisitRequest} className="space-y-3">
                <input
                  type="text"
                  placeholder="Nom complet *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Téléphone *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
                <textarea
                  placeholder="Message (dates souhaitées...)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none"
                  rows={3}
                />
                <Button type="submit" disabled={formLoading} className="w-full bg-sts-green">
                  {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer la demande"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div
            className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
              toastMsg.type === "success" ? "bg-sts-green text-white" : "bg-red-500 text-white"
            }`}
          >
            {toastMsg.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{toastMsg.message}</span>
          </div>
        )}
      </div>
    </Overlay>
  );
}

export default function ImmobilierPage() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState({ type: "Tous", city: "Tous", minPrice: 0, maxPrice: 100000000, status: "all" as "all" | "available" | "reserved" });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProperties(50);
      setProperties(data);
    } catch (err) {
      setError("Erreur lors du chargement");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (filters.type !== "Tous" && (p.type || "").toLowerCase() !== filters.type.toLowerCase()) return false;
      if (filters.city !== "Tous" && (p.city || "").toLowerCase() !== filters.city.toLowerCase()) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      return true;
    });
  }, [properties, filters]);

  return (
    <main className="min-h-screen bg-sts-surface">
      <section className="relative py-16 bg-gradient-to-br from-sts-black via-[#0F3D1F] to-sts-black">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Notre Catalogue Immobilier
          </motion.h1>
          <p className="text-xl text-sts-gray">Découvrez nos biens disponibles au Sénégal</p>
        </div>
      </section>

      <section className="py-6 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-sts-gray" />
              <span className="font-medium text-sts-black">Filtres:</span>
            </div>
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="px-3 py-2 border rounded-lg">
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} className="px-3 py-2 border rounded-lg">
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as any })} className="px-3 py-2 border rounded-lg">
              <option value="all">Tous statuts</option>
              <option value="available">Disponible</option>
              <option value="reserved">Réservé</option>
            </select>
            <span className="text-sts-gray ml-auto">{filteredProperties.length} biens</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <PropertySkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-sts-gray mb-4">{error}</p>
              <Button onClick={loadProperties}>Réessayer</Button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sts-gray text-lg">Aucune propriété trouvée</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProperties.map((property, i) => (
                  <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="overflow-hidden group hover:-translate-y-2 transition-all">
                      <div className="relative h-48 bg-sts-surface overflow-hidden">
                        {property.images?.length ? (
                          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : property.imageUrl ? (
                          <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-sts-green/10 flex items-center justify-center">
                            <MapPin className="w-12 h-12 text-sts-green" />
                          </div>
                        )}
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${property.status === "a_vendre" ? "bg-sts-green text-white" : "bg-yellow-500 text-white"}`}>
                          {property.status === "a_vendre" ? "À vendre" : property.status === "a_louer" ? "À louer" : "Réservé"}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-sts-black mb-1">{property.title}</h3>
                        <div className="flex items-center gap-1 text-sts-gray text-sm mb-2">
                          <MapPin className="w-4 h-4" />{property.city || property.location}
                        </div>
                        <div className="flex gap-4 text-sm text-sts-gray mb-3">
                          {(property.surface || 0) > 0 && <span className="flex items-center gap-1"><Maximize className="w-4 h-4" />{property.surface} m²</span>}
                          {(property.bedrooms || 0) > 0 && <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms} ch.</span>}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-sts-green">{new Intl.NumberFormat("fr-FR").format(property.price)} XOF</span>
                          <Button size="sm" onClick={() => setSelectedProperty(property)}>Détails</Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProperty && <PropertyDetailsSheet property={selectedProperty} onClose={() => setSelectedProperty(null)} />}
      </AnimatePresence>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-sts-black mb-4">Vous ne trouvez pas ce que vous cherchez ?</h2>
          <p className="text-sts-gray mb-6">Nous avons mucho d'autres biens disponibles.</p>
          <Link href="/contact"><Button className="bg-sts-green">Nous contacter</Button></Link>
        </div>
      </section>
    </main>
  );
}