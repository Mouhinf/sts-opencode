"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader2, MapPin, Users, Car, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, X, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Overlay } from "@/components/ui/Overlay";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Vehicle {
  id: string;
  name: string;
  marque: string;
  modele: string;
  type: string;
  capacite: number;
  disponible: boolean;
  forSale: boolean;
  forRent: boolean;
  prixVente?: number;
  prixLocation?: number;
  images: string[];
  description?: string;
  equipements?: string[];
  statut?: string;
  createdAt?: any;
}

const TYPES_VEHICULES = ["Tous", "Berline", "SUV", "Minibus", "Bus", "Camionnette"];
const STORAGE_KEY = "sts_vehicles";

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-[10000] ${
        type === "success" ? "bg-sts-blue text-white" : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose}><X className="w-4 h-4" /></button>
    </motion.div>
  );
}

function VehicleDetailsSheet({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", dates: "", message: "" });
  const [toastMsg, setToastMsg] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const images = vehicle.images?.length ? vehicle.images : [];
  const hasMultiple = images.length > 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: vehicle.forRent ? "location" : "achat",
          propertyTitle: `${vehicle.marque} ${vehicle.modele}`,
        }),
      });
      const data = await res.json();
      if (data.messageData) {
        const stored = localStorage.getItem(STORAGE_KEY);
        const msgs = stored ? JSON.parse(stored) : [];
        msgs.unshift({ ...data.messageData, id: Date.now().toString() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
      }
      setToastMsg({ message: "Demande envoyée !", type: "success" });
      setFormData({ name: "", email: "", phone: "", dates: "", message: "" });
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
          <button onClick={onClose} className="flex items-center gap-2 text-sts-gray">
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Fermer</span>
          </button>
          <h2 className="text-lg font-bold text-sts-black truncate max-w-[50%]">{vehicle.name || `${vehicle.marque} ${vehicle.modele}`}</h2>
          <div className="w-16" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-touch">
          {/* Images */}
          <div className="relative h-[30vh] sm:h-[40vh] bg-black">
            {images.length > 0 ? (
              <img src={images[imgIndex]} alt={vehicle.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-sts-blue/10 flex items-center justify-center">
                <Car className="w-16 h-16 text-sts-blue" />
              </div>
            )}
            {hasMultiple && (
              <>
                <button onClick={() => setImgIndex(i => Math.max(0, i - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setImgIndex(i => Math.min(images.length - 1, i + 1))} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setImgIndex(i)} className={`w-2 h-2 rounded-full ${i === imgIndex ? "bg-white" : "bg-white/50"}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Details */}
          <div className="px-4 py-5 space-y-5 pb-20">
            {/* Prix */}
            <div className="grid grid-cols-2 gap-3">
              {vehicle.forSale && vehicle.prixVente ? (
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{new Intl.NumberFormat("fr-FR").format(vehicle.prixVente)} XOF</p>
                  <p className="text-sm text-green-700">À vendre</p>
                </div>
              ) : null}
              {vehicle.forRent && vehicle.prixLocation ? (
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{new Intl.NumberFormat("fr-FR").format(vehicle.prixLocation)} XOF</p>
                  <p className="text-sm text-blue-700">/jour</p>
                </div>
              ) : null}
            </div>

            {/* Infos */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-sts-surface rounded-xl p-3">
                <p className="text-lg font-bold">{vehicle.capacite}</p>
                <p className="text-xs text-sts-gray">Places</p>
              </div>
              <div className="bg-sts-surface rounded-xl p-3">
                <p className="text-lg font-bold capitalize">{vehicle.type}</p>
                <p className="text-xs text-sts-gray">Type</p>
              </div>
              <div className="bg-sts-surface rounded-xl p-3">
                <p className="text-lg font-bold">{vehicle.disponible ? "Oui" : "Non"}</p>
                <p className="text-xs text-sts-gray">Dispo</p>
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div>
                <h3 className="font-bold mb-2">Description</h3>
                <p className="text-sts-gray whitespace-pre-line">{vehicle.description}</p>
              </div>
            )}

            {/* Équipements */}
            {vehicle.equipements && vehicle.equipements.length > 0 && (
              <div>
                <h3 className="font-bold mb-2">Équipements</h3>
                <div className="flex flex-wrap gap-2">
                  {vehicle.equipements.map(e => (
                    <span key={e} className="px-3 py-1 bg-sts-surface rounded-full text-sm">{e}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Formulaire */}
            <div className="border-t pt-5">
              <h3 className="font-bold mb-4">Contacter nous</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" placeholder="Nom *" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full p-3 border rounded-lg" />
                <input type="email" placeholder="Email *" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required className="w-full p-3 border rounded-lg" />
                <input type="tel" placeholder="Téléphone *" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required className="w-full p-3 border rounded-lg" />
                {vehicle.forRent && <input type="text" placeholder="Dates souhaitées" value={formData.dates} onChange={e => setFormData({ ...formData, dates: e.target.value })} className="w-full p-3 border rounded-lg" />}
                <textarea placeholder="Message" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full p-3 border rounded-lg resize-none" rows={2} />
                <Button type="submit" disabled={formLoading} className="w-full bg-sts-blue">
                  {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {toastMsg && (
          <div className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-[10000] ${toastMsg.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {toastMsg.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{toastMsg.message}</span>
          </div>
        )}
      </div>
    </Overlay>
  );
}

export default function TransportPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("Tous");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [filterFor, setFilterFor] = useState<"all" | "sale" | "rent">("all");

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "vehicles"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const vehs: Vehicle[] = [];
      snap.forEach(d => vehs.push({ id: d.id, ...d.data() } as Vehicle));
      setVehicles(vehs);
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      if (selectedType !== "Tous" && v.type !== selectedType) return false;
      if (filterFor === "sale" && !v.forSale) return false;
      if (filterFor === "rent" && !v.forRent) return false;
      return true;
    });
  }, [vehicles, selectedType, filterFor]);

  return (
    <main className="min-h-screen bg-sts-surface">
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-br from-[#1A5FA8] to-[#0E3D70]">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Transport & Location
          </motion.h1>
          <p className="text-xl text-white/80">Véhicules pour particuliers et entreprises au Sénégal</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-sts-blue/5 rounded-xl p-4 text-center">
              <Car className="w-8 h-8 text-sts-blue mx-auto mb-2" />
              <h3 className="font-bold">Vente</h3>
              <p className="text-sm text-sts-gray">Véhicules d'occasion</p>
            </div>
            <div className="bg-sts-blue/5 rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-sts-blue mx-auto mb-2" />
              <h3 className="font-bold">Location</h3>
              <p className="text-sm text-sts-gray">Journalière ou mensuelle</p>
            </div>
            <div className="bg-sts-blue/5 rounded-xl p-4 text-center">
              <Users className="w-8 h-8 text-sts-blue mx-auto mb-2" />
              <h3 className="font-bold">Touristique</h3>
              <p className="text-sm text-sts-gray">Circuits et excursions</p>
            </div>
            <div className="bg-sts-blue/5 rounded-xl p-4 text-center">
              <MapPin className="w-8 h-8 text-sts-blue mx-auto mb-2" />
              <h3 className="font-bold">Sur mesure</h3>
              <p className="text-sm text-sts-gray">Solutions entreprises</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-4 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2">
              <button onClick={() => setFilterFor("all")} className={`px-3 py-1.5 rounded-lg text-sm ${filterFor === "all" ? "bg-sts-blue text-white" : "bg-sts-surface"}`}>Tous</button>
              <button onClick={() => setFilterFor("sale")} className={`px-3 py-1.5 rounded-lg text-sm ${filterFor === "sale" ? "bg-sts-blue text-white" : "bg-sts-surface"}`}>À vendre</button>
              <button onClick={() => setFilterFor("rent")} className={`px-3 py-1.5 rounded-lg text-sm ${filterFor === "rent" ? "bg-sts-blue text-white" : "bg-sts-surface"}`}>À louer</button>
            </div>
            <div className="flex gap-2 ml-auto">
              {TYPES_VEHICULES.map(t => (
                <button key={t} onClick={() => setSelectedType(t)} className={`px-3 py-1.5 rounded-lg text-sm ${selectedType === t ? "bg-sts-blue text-white" : "bg-sts-surface"}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Liste véhicules */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sts-blue" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-sts-gray">Aucun véhicule trouvé</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((v, i) => (
                  <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="overflow-hidden group hover:-translate-y-2 transition-all cursor-pointer" onClick={() => setSelectedVehicle(v)}>
                      <div className="relative h-48 bg-sts-surface overflow-hidden">
                        {v.images?.length > 0 ? (
                          <img src={v.images[0]} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-sts-blue/10 flex items-center justify-center">
                            <Car className="w-12 h-12 text-sts-blue" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                          {v.forSale && v.prixVente && <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded">Vente</span>}
                          {v.forRent && v.prixLocation && <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded">Location</span>}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{v.name || `${v.marque} ${v.modele}`}</h3>
                        <div className="flex items-center gap-2 text-sm text-sts-gray mb-3">
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" />{v.capacite} places</span>
                          <span className="capitalize">{v.type}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            {v.forSale && v.prixVente && <p className="text-lg font-bold text-green-600">{new Intl.NumberFormat("fr-FR").format(v.prixVente)}</p>}
                            {v.forRent && v.prixLocation && <p className="text-sm text-sts-gray">À partir de {new Intl.NumberFormat("fr-FR").format(v.prixLocation)}/jour</p>}
                          </div>
                          <Button size="sm">Détails</Button>
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

      {/* Contact */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Besoin d'une solution personnalisée ?</h2>
          <p className="text-sts-gray mb-6">Nous proposons des services sur mesure pour entreprises et groupes</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button className="bg-sts-blue"><Mail className="w-5 h-5 mr-2" />Nous contacter</Button>
            </Link>
            <a href="tel:+221XXXXXXXX">
              <Button variant="outline"><Phone className="w-5 h-5 mr-2" />Appeler</Button>
            </a>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedVehicle && <VehicleDetailsSheet vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />}
      </AnimatePresence>
    </main>
  );
}