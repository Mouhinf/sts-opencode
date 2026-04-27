"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  Car,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";

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

const MARQUES = ["Toyota", "Honda", "Mercedes", "Ford", "Peugeot", "Renault", "BMW", "Audi", "Kia", "Hyundai", "Nissan", "Autre"];
const TYPES = [
  { value: "berline", label: "Berline" },
  { value: "suv", label: "SUV" },
  { value: "minibus", label: "Minibus" },
  { value: "bus", label: "Bus" },
  { value: "camionnette", label: "Camionnette" },
  { value: "camion", label: "Camion" },
];
const EQUIPEMENTS = ["Climatisation", "GPS", "Camera", "Bluetooth", "ABS", "Airbags", "Cruise Control", "Sieges cuir", "Toit ouvrant", "4x4"];

function ImageUploader({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    if (!files.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "sts_properties");
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
        const data = await res.json();
        urls.push(data.secure_url);
      } catch (err) {
        console.error(err);
      }
    }
    if (urls.length) onChange([...images, ...urls]);
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { setDragActive(false); if (e.dataTransfer.files?.length) handleUpload(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-gray-500"><div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" /><span>Upload...</span></div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-500"><Upload className="w-8 h-8" /><span className="text-sm">{images.length}/10 images</span></div>
        )}
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group bg-gray-100">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button onClick={() => onChange(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
              {idx === 0 && <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">Principale</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VehicleFormSheet({ show, onClose, vehicle, onSave }: { show: boolean; onClose: () => void; vehicle?: Vehicle | null; onSave: (form: Omit<Vehicle, "id" | "createdAt">) => Promise<void> }) {
  type FormState = {
    name: string; marque: string; modele: string; type: string; capacite: number; disponible: boolean;
    forSale: boolean; forRent: boolean; prixVente: number; prixLocation: number;
    images: string[]; description: string; equipements: string[];
  };
  const defaultForm: FormState = {
    name: "", marque: "", modele: "", type: "berline", capacite: 5, disponible: true,
    forSale: true, forRent: true, prixVente: 0, prixLocation: 0,
    images: [], description: "", equipements: [],
  };
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setForm({
        name: vehicle.name || "",
        marque: vehicle.marque || "",
        modele: vehicle.modele || "",
        type: vehicle.type || "berline",
        capacite: vehicle.capacite || 5,
        disponible: vehicle.disponible ?? true,
        forSale: vehicle.forSale ?? true,
        forRent: vehicle.forRent ?? true,
        prixVente: vehicle.prixVente || 0,
        prixLocation: vehicle.prixLocation || 0,
        images: vehicle.images || [],
        description: vehicle.description || "",
        equipements: vehicle.equipements || [],
      });
    } else {
      setForm(defaultForm);
    }
  }, [vehicle, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.marque) {
      toast.error("Marque requise");
      return;
    }
    setLoading(true);
    try {
      await onSave({
        ...form,
        name: form.name || `${form.marque} ${form.modele}`,
      });
      toast.success(vehicle ? "Modifié" : "Créé");
      onClose();
    } catch {
      toast.error("Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <Overlay show={show}>
      <div className="flex flex-col h-full">
        <div className="flex-none flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-500"><X className="w-5 h-5" /><span className="hidden sm:inline">Annuler</span></button>
          <h2 className="text-lg font-bold">{vehicle ? "Modifier" : "Nouveau véhicule"}</h2>
          <button type="submit" form="veh-form" disabled={loading} className="text-green-600 font-medium disabled:opacity-50">{loading ? "..." : "OK"}</button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-touch">
          <form id="veh-form" onSubmit={handleSubmit} className="p-4 space-y-4 pb-20">
            <ImageUploader images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} />

            <div>
              <label className="block text-sm font-medium mb-1">Nom (optionnel)</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="Nom affiché" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Marque *</label>
                <select value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })} className="w-full p-3 border rounded-lg" required>
                  <option value="">---</option>
                  {MARQUES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Modèle</label>
                <input value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="ex: Corolla" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full p-3 border rounded-lg">
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Capacité</label>
                <input type="number" value={form.capacite} onChange={(e) => setForm({ ...form, capacite: +e.target.value })} className="w-full p-3 border rounded-lg" />
              </div>
            </div>

            {/* Vente / Location */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.forSale} onChange={(e) => setForm({ ...form, forSale: e.target.checked })} />
                  <span className="font-medium">À vendre</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.forRent} onChange={(e) => setForm({ ...form, forRent: e.target.checked })} />
                  <span className="font-medium">À louer</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {form.forSale && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Prix vente (XOF)</label>
                    <input type="number" value={form.prixVente} onChange={(e) => setForm({ ...form, prixVente: +e.target.value })} className="w-full p-3 border rounded-lg" placeholder="0" />
                  </div>
                )}
                {form.forRent && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Prix/jour (XOF)</label>
                    <input type="number" value={form.prixLocation} onChange={(e) => setForm({ ...form, prixLocation: +e.target.value })} className="w-full p-3 border rounded-lg" placeholder="0" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full p-3 border rounded-lg resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Équipements</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {EQUIPEMENTS.map((e) => (
                  <button key={e} type="button" onClick={() => setForm((p) => ({ ...p, equipements: p.equipements.includes(e) ? p.equipements.filter(x => x !== e) : [...p.equipements, e] }))} className={`p-2 rounded-lg text-sm ${form.equipements.includes(e) ? "bg-green-600 text-white" : "bg-gray-100"}`}>{e}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.disponible} onChange={(e) => setForm({ ...form, disponible: e.target.checked })} />
                <span className="text-sm">Disponible</span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </Overlay>
  );
}

export default function VehiculesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [selectedImg, setSelectedImg] = useState(0);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "vehicles"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const vehs: Vehicle[] = [];
      snap.forEach((d) => vehs.push({ id: d.id, ...d.data() } as Vehicle));
      setVehicles(vehs);
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const handleSave = async (form: Omit<Vehicle, "id" | "createdAt">) => {
    if (editingVehicle) {
      await updateDoc(doc(db, "vehicles", editingVehicle.id), { ...form, updatedAt: serverTimestamp() });
    } else {
      await addDoc(collection(db, "vehicles"), { ...form, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
    await fetchVehicles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    try {
      await deleteDoc(doc(db, "vehicles", id));
      toast.success("Supprimé");
      await fetchVehicles();
    } catch {
      toast.error("Erreur");
    }
  };

  const filtered = vehicles.filter((v) => {
    if (search && !v.name?.toLowerCase().includes(search.toLowerCase()) && !v.marque?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && v.type !== filterType) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Véhicules</h1>
          <p className="text-gray-500">{vehicles.length} véhicules</p>
        </div>
        <button onClick={() => { setEditingVehicle(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Plus className="w-5 h-5" /> Nouveau
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
            </div>
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="">Tous types</option>
            {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Véhicule</th>
              <th className="text-left p-4 hidden md:table-cell">Type</th>
              <th className="text-left p-4 hidden lg:table-cell">Vente</th>
              <th className="text-left p-4 hidden lg:table-cell">Location</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center">Chargement...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center">Aucun véhicule</td></tr>
            ) : (
              filtered.map((v) => (
                <tr key={v.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        {v.images?.[0] ? <img src={v.images[0]} alt="" className="w-full h-full object-cover" /> : <Car className="w-6 h-6 text-gray-400 m-auto" />}
                      </div>
                      <div>
                        <div className="font-medium">{v.name || `${v.marque} ${v.modele}`}</div>
                        <div className="text-sm text-gray-500">{v.capacite} places</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell capitalize">{TYPES.find(t => t.value === v.type)?.label || v.type}</td>
                  <td className="p-4 hidden lg:table-cell">
                    {v.forSale && v.prixVente ? <span className="text-green-600 font-medium">{new Intl.NumberFormat("fr-FR").format(v.prixVente)}</span> : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    {v.forRent && v.prixLocation ? <span className="text-blue-600 font-medium">{new Intl.NumberFormat("fr-FR").format(v.prixLocation)}/j</span> : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setViewingVehicle(v); setSelectedImg(0); }} className="p-2 hover:bg-gray-100 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => { setEditingVehicle(v); setFormOpen(true); }} className="p-2 hover:bg-gray-100 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(v.id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <VehicleFormSheet show={formOpen} onClose={() => { setFormOpen(false); setEditingVehicle(null); }} vehicle={editingVehicle} onSave={handleSave} />

      {viewingVehicle && (
        <Overlay show={true}>
          <div className="flex flex-col h-full">
            <div className="flex-none flex items-center justify-between px-4 py-3 border-b bg-white">
              <h2 className="text-lg font-bold truncate max-w-[60%]">{viewingVehicle.name || `${viewingVehicle.marque} ${viewingVehicle.modele}`}</h2>
              <button onClick={() => setViewingVehicle(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 pb-20">
              <div className="relative h-48 bg-gray-100 rounded-lg mb-4">
                {viewingVehicle.images?.length ? (
                  <>
                    <img src={viewingVehicle.images[selectedImg]} alt="" className="w-full h-full object-contain" />
                    {viewingVehicle.images.length > 1 && (
                      <>
                        <button onClick={() => setSelectedImg(i => Math.max(0, i - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={() => setSelectedImg(i => Math.min(viewingVehicle.images.length - 1, i + 1))} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"><ChevronRight className="w-5 h-5" /></button>
                      </>
                    )}
                  </>
                ) : <Car className="w-16 h-16 text-gray-400 m-auto" />}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {viewingVehicle.forSale && viewingVehicle.prixVente && <div className="bg-green-50 rounded-lg p-3 text-center"><div className="text-xl font-bold text-green-600">{new Intl.NumberFormat("fr-FR").format(viewingVehicle.prixVente)}</div><div className="text-xs text-green-700">À vendre</div></div>}
                {viewingVehicle.forRent && viewingVehicle.prixLocation && <div className="bg-blue-50 rounded-lg p-3 text-center"><div className="text-xl font-bold text-blue-600">{new Intl.NumberFormat("fr-FR").format(viewingVehicle.prixLocation)}</div><div className="text-xs text-blue-700">/jour</div></div>}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3"><div className="font-bold">{viewingVehicle.capacite}</div><div className="text-xs text-gray-500">Places</div></div>
                <div className="bg-gray-50 rounded-lg p-3"><div className="font-bold capitalize">{TYPES.find(t => t.value === viewingVehicle.type)?.label}</div><div className="text-xs text-gray-500">Type</div></div>
                <div className="bg-gray-50 rounded-lg p-3"><div className="font-bold">{viewingVehicle.disponible ? "Oui" : "Non"}</div><div className="text-xs text-gray-500">Dispo</div></div>
              </div>
              {viewingVehicle.description && <p className="text-gray-600 mb-4">{viewingVehicle.description}</p>}
              {viewingVehicle.equipements && viewingVehicle.equipements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {viewingVehicle.equipements && viewingVehicle.equipements.map(e => <span key={e} className="px-2 py-1 bg-gray-100 rounded text-sm">{e}</span>)}
                </div>
              )}
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}