"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  Home,
  MapPin,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  type: string;
  status: string;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  featured: boolean;
  published: boolean;
  images: string[];
  address?: string;
  parking?: number;
  floor?: number;
  amenities?: string[];
  createdAt?: any;
}

const CITIES = ["Dakar", "Thies", "Saint-Louis", "Mbour", "Louga", "Kaolack", "Kolda", "Ziguinchor", "Other"];
const TYPES = [
  { value: "appartment", label: "Appartement" },
  { value: "house", label: "Maison" },
  { value: "villa", label: "Villa" },
  { value: "land", label: "Terrain" },
  { value: "studio", label: "Studio" },
  { value: "duplex", label: "Duplex" },
];
const STATUSES = [
  { value: "a_vendre", label: "À vendre" },
  { value: "a_louer", label: "À louer" },
  { value: "vendu", label: "Vendu" },
];
const AMENITIES = ["parking", "garden", "pool", "terrace", "elevator", "furnished", "ac", "security"];

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
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${dragActive ? "border-green-500 bg-green-50" : "border-gray-300"}`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { setDragActive(false); if (e.dataTransfer.files?.length) handleUpload(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-gray-500"><div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" /><span>Upload...</span></div>
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
              {idx === 0 && <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-1 rounded">1ère</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyFormSheet({ show, onClose, property, onSave }: { show: boolean; onClose: () => void; property?: Property | null; onSave: (form: Omit<Property, "id" | "createdAt">) => Promise<void> }) {
  type FormState = {
    title: string; description: string; price: number; city: string; type: string; status: string;
    surface: number; bedrooms: number; bathrooms: number; featured: boolean; published: boolean; images: string[];
    address: string; parking: number; floor: number; amenities: string[];
  };
  const defaultForm: FormState = { title: "", description: "", price: 0, city: "", type: "appartment", status: "a_vendre", surface: 0, bedrooms: 0, bathrooms: 0, featured: false, published: false, images: [], address: "", parking: 0, floor: 0, amenities: [] };
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title || "", description: property.description || "", price: property.price || 0, city: property.city || "",
        type: property.type || "appartment", status: property.status || "a_vendre",
        surface: property.surface || 0, bedrooms: property.bedrooms || 0, bathrooms: property.bathrooms || 0,
        featured: property.featured || false, published: property.published || false, images: property.images || [],
        address: property.address || "", parking: property.parking || 0, floor: property.floor || 0, amenities: property.amenities || [],
      });
    } else {
      setForm({ title: "", description: "", price: 0, city: "", type: "appartment", status: "a_vendre", surface: 0, bedrooms: 0, bathrooms: 0, featured: false, published: false, images: [], address: "", parking: 0, floor: 0, amenities: [] });
    }
  }, [property, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.city || !form.price) {
      toast.error("Titre, ville et prix requis");
      return;
    }
    setLoading(true);
    try {
      await onSave(form);
      toast.success(property ? "Modifié" : "Créé");
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
          <h2 className="text-lg font-bold">{property ? "Modifier" : "Nouveau bien"}</h2>
          <button type="submit" form="prop-form" disabled={loading} className="text-green-600 font-medium disabled:opacity-50">{loading ? "..." : "OK"}</button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-touch">
          <form id="prop-form" onSubmit={handleSubmit} className="p-4 space-y-4 pb-20">
            <ImageUploader images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} />
            <div>
              <label className="block text-sm font-medium mb-1">Titre *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="Villa moderne..." required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full p-3 border rounded-lg resize-none" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium mb-1">Prix *</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="w-full p-3 border rounded-lg" required /></div>
              <div><label className="block text-sm font-medium mb-1">Ville *</label><select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full p-3 border rounded-lg" required><option value="">---</option>{CITIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium mb-1">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full p-3 border rounded-lg">{TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">Statut</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full p-3 border rounded-lg">{STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adresse</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full p-3 border rounded-lg" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="block text-sm font-medium mb-1">Surface</label><input type="number" value={form.surface} onChange={(e) => setForm({ ...form, surface: +e.target.value })} className="w-full p-3 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Chambres</label><input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: +e.target.value })} className="w-full p-3 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">SdB</label><input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: +e.target.value })} className="w-full p-3 border rounded-lg" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium mb-1">Étage</label><input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: +e.target.value })} className="w-full p-3 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Parking</label><input type="number" value={form.parking} onChange={(e) => setForm({ ...form, parking: +e.target.value })} className="w-full p-3 border rounded-lg" /></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Équipements</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {AMENITIES.map((a) => (
                  <button key={a} type="button" onClick={() => setForm({ ...form, amenities: form.amenities.includes(a) ? form.amenities.filter((x: string) => x !== a) : [...form.amenities, a] })} className={`p-2 rounded-lg text-sm ${form.amenities.includes(a) ? "bg-green-600 text-white" : "bg-gray-100"}`}>{a}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /><span className="text-sm">Vedette</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /><span className="text-sm">Publié</span></label>
            </div>
          </form>
        </div>
      </div>
    </Overlay>
  );
}

export default function ImmobilierPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const PAGE_SIZE = 10;

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const props: Property[] = [];
      snap.forEach((d) => props.push({ id: d.id, ...d.data() } as Property));
      setProperties(props);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleSave = async (form: Omit<Property, "id" | "createdAt">) => {
    if (editingProperty) {
      await updateDoc(doc(db, "properties", editingProperty.id), { ...form, updatedAt: serverTimestamp() });
    } else {
      await addDoc(collection(db, "properties"), { ...form, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
    await fetchProperties();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "properties", id));
      toast.success("Supprimé");
      await fetchProperties();
    } catch {
      toast.error("Erreur");
    }
  };

  const filtered = properties.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.city.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && p.type !== filterType) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  });
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Immobilier</h1>
          <p className="text-gray-500">{properties.length} biens</p>
        </div>
        <button onClick={() => { setEditingProperty(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
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
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="">Tous statuts</option>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Bien</th>
              <th className="text-left p-4 hidden md:table-cell">Type</th>
              <th className="text-left p-4 hidden md:table-cell">Ville</th>
              <th className="text-left p-4 hidden sm:table-cell">Prix</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="p-8 text-center">Chargement...</td></tr> :
            paginated.length === 0 ? <tr><td colSpan={6} className="p-8 text-center">{search || filterType ? "Aucun résultat" : "Aucune propriété"}</td></tr> :
            paginated.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Home className="w-6 h-6 text-gray-400" /></div>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-gray-500">{p.surface}m² • {p.bedrooms}ch</div>
                </td>
                <td className="p-4 hidden md:table-cell"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{TYPES.find((t) => t.value === p.type)?.label}</span></td>
                <td className="p-4 hidden md:table-cell text-sm"><MapPin className="w-4 h-4 inline mr-1 text-gray-400" />{p.city}</td>
                <td className="p-4 hidden sm:table-cell font-medium">{new Intl.NumberFormat("fr-FR").format(p.price)}</td>
                <td className="p-4 text-right">
                  <button onClick={() => setViewingProperty(p)} className="p-2 hover:bg-gray-100 rounded"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => { setEditingProperty(p); setFormOpen(true); }} className="p-2 hover:bg-gray-100 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => { if(confirm("Supprimer ?")) handleDelete(p.id); }} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 border rounded disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
          <span className="px-3">{page + 1}/{totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-3 py-1 border rounded disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
        </div>
      )}

      <PropertyFormSheet show={formOpen} onClose={() => { setFormOpen(false); setEditingProperty(null); }} property={editingProperty} onSave={handleSave} />

      {viewingProperty && (
        <Overlay show={true}>
          <div className="flex flex-col h-full">
            <div className="flex-none flex items-center justify-between px-4 py-3 border-b bg-white">
              <h2 className="text-lg font-bold truncate max-w-[60%]">{viewingProperty.title}</h2>
              <button onClick={() => setViewingProperty(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-touch p-4 pb-20">
              <div className="relative h-48 sm:h-64 bg-gray-100 rounded-lg mb-4">
                {viewingProperty.images?.length ? (
                  <>
                    <img src={viewingProperty.images[selectedImage]} alt="" className="w-full h-full object-contain" />
                    {viewingProperty.images.length > 1 && (
                      <>
                        <button onClick={() => setSelectedImage((s) => Math.max(0, s - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={() => setSelectedImage((s) => Math.min(viewingProperty.images.length - 1, s + 1))} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"><ChevronRight className="w-5 h-5" /></button>
                      </>
                    )}
                  </>
                ) : <div className="w-full h-full flex items-center justify-center"><Home className="w-16 h-16 text-gray-400" /></div>}
              </div>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-green-600">{new Intl.NumberFormat("fr-FR").format(viewingProperty.price)} XOF</div>
                <div className="flex items-center gap-2"><MapPin className="w-5 h-5" />{viewingProperty.city}</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center"><div className="font-bold">{viewingProperty.surface}</div><div className="text-xs text-gray-500">m²</div></div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center"><div className="font-bold">{viewingProperty.bedrooms}</div><div className="text-xs text-gray-500">Chambres</div></div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center"><div className="font-bold capitalize">{viewingProperty.type}</div><div className="text-xs text-gray-500">Type</div></div>
                </div>
                {viewingProperty.description && <p className="text-gray-600">{viewingProperty.description}</p>}
                {viewingProperty.amenities && viewingProperty.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {viewingProperty.amenities.map((a) => <span key={a} className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">{a}</span>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}