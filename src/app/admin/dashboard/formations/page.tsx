"use client";

import { useState, useEffect, useCallback } from "react";
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
  GraduationCap,
  Clock,
  Users,
} from "lucide-react";

interface Formation {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  duree: number;
  prix: number;
  niveau: string;
  places: number;
  inscrite: boolean;
  createdAt?: any;
}

const CATEGORIES = [
  { value: "transport", label: "Transport" },
  { value: "logistique", label: "Logistique" },
  { value: "securite", label: "Sécurité" },
  { value: "hygiene", label: "Hygiène" },
  { value: "management", label: "Management" },
];
const NIVEAUX = ["Débutant", "Intermédiaire", "Avancé"];

function Modal({ isOpen, onClose, children, title }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
    return () => { document.body.style.overflowY = ''; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

function FormationFormModal({ isOpen, onClose, formation, onSave }: { isOpen: boolean; onClose: () => void; formation?: Formation | null; onSave: (form: Omit<Formation, "id" | "createdAt">) => Promise<void> }) {
  const [form, setForm] = useState<Omit<Formation, "id" | "createdAt">>({
    titre: "",
    description: "",
    categorie: "transport",
    duree: 1,
    prix: 0,
    niveau: "Débutant",
    places: 20,
    inscrite: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formation) {
      setForm({
        titre: formation.titre || "",
        description: formation.description || "",
        categorie: formation.categorie || "transport",
        duree: formation.duree || 1,
        prix: formation.prix || 0,
        niveau: formation.niveau || "Débutant",
        places: formation.places || 20,
        inscrite: formation.inscrite ?? false,
      });
    } else {
      setForm({ titre: "", description: "", categorie: "transport", duree: 1, prix: 0, niveau: "Débutant", places: 20, inscrite: false });
    }
  }, [formation, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titre) { toast.error("Veuillez remplir les champs requis"); return; }
    setLoading(true);
    try { await onSave(form); toast.success(formation ? "Formation mise à jour" : "Formation créée"); onClose(); }
    catch { toast.error("Erreur lors de l'enregistrement"); }
    finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={formation ? "Modifier la formation" : "Nouvelle formation"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Titre *</label><input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} className="w-full p-2 border rounded" required /></div>
        <div><label className="block text-sm font-medium mb-1">Description *</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full p-2 border rounded" required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Catégorie</label><select value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })} className="w-full p-2 border rounded">{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1">Niveau</label><select value={form.niveau} onChange={(e) => setForm({ ...form, niveau: e.target.value })} className="w-full p-2 border rounded">{NIVEAUX.map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1">Durée (jours)</label><input type="number" value={form.duree} onChange={(e) => setForm({ ...form, duree: Number(e.target.value) })} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm font-medium mb-1">Prix (XOF)</label><input type="number" value={form.prix} onChange={(e) => setForm({ ...form, prix: Number(e.target.value) })} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm font-medium mb-1">Places</label><input type="number" value={form.places} onChange={(e) => setForm({ ...form, places: Number(e.target.value) })} className="w-full p-2 border rounded" /></div>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Annuler</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">{loading ? "Enregistrement..." : "Enregistrer"}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function FormationsPage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [viewingFormation, setViewingFormation] = useState<Formation | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchFormations = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "formations"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const frms: Formation[] = [];
      snapshot.forEach((doc) => frms.push({ id: doc.id, ...doc.data() } as Formation));
      setFormations(frms);
    } catch { setFormations([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchFormations(); }, [fetchFormations]);

  const handleSave = async (form: Omit<Formation, "id" | "createdAt">) => {
    if (editingFormation) {
      await updateDoc(doc(db, "formations", editingFormation.id), { ...form, updatedAt: serverTimestamp() });
    } else {
      await addDoc(collection(db, "formations"), { ...form, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
    await fetchFormations();
  };

  const handleDelete = async (id: string) => {
    try { await deleteDoc(doc(db, "formations", id)); toast.success("Formation supprimée"); setDeleteConfirm(null); await fetchFormations(); }
    catch { toast.error("Erreur lors de la suppression"); }
  };

  const filteredFormations = formations.filter((f) => {
    const matchSearch = !search || f.titre.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || f.categorie === filterCat;
    return matchSearch && matchCat;
  });

  const formatPrice = (price: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumSignificantDigits: 3 }).format(price);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Formations</h1><p className="text-gray-500">Gérez vos formations ({formations.length})</p></div>
        <button onClick={() => { setEditingFormation(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Plus className="w-5 h-5" /> Nouveau</button>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div></div>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="px-4 py-2 border rounded-lg"><option value="">Toutes les catégories</option>{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="text-left p-4">Formation</th><th className="text-left p-4">Catégorie</th><th className="text-left p-4">Durée</th><th className="text-left p-4">Prix</th><th className="text-left p-4">Places</th><th className="text-right p-4">Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="p-8 text-center text-gray-500">Chargement...</td></tr> : filteredFormations.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-gray-500">Aucune formation</td></tr> : (
              filteredFormations.map((formation) => (
                <tr key={formation.id} className="border-t hover:bg-gray-50">
                  <td className="p-4"><div className="font-medium">{formation.titre}</div><div className="text-sm text-gray-500">{formation.niveau}</div></td>
                  <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{CATEGORIES.find((c) => c.value === formation.categorie)?.label}</span></td>
                  <td className="p-4 flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" />{formation.duree} jour(s)</td>
                  <td className="p-4 font-medium">{formatPrice(formation.prix)}</td>
                  <td className="p-4 flex items-center gap-1"><Users className="w-4 h-4 text-gray-400" />{formation.places}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setViewingFormation(formation)} className="p-2 hover:bg-gray-100 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => { setEditingFormation(formation); setModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteConfirm(formation.id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <FormationFormModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingFormation(null); }} formation={editingFormation} onSave={handleSave} />

      <Modal isOpen={!!viewingFormation} onClose={() => setViewingFormation(null)} title={viewingFormation?.titre || ""}>
        {viewingFormation && (
          <div className="space-y-4">
            <p className="text-gray-600">{viewingFormation.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Catégorie: {CATEGORIES.find((c) => c.value === viewingFormation.categorie)?.label}</div>
              <div>Niveau: {viewingFormation.niveau}</div>
              <div>Durée: {viewingFormation.duree} jour(s)</div>
              <div>Prix: {formatPrice(viewingFormation.prix)}</div>
              <div>Places: {viewingFormation.places}</div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmer la suppression">
        <div className="space-y-4">
          <p>Êtes-vous sûr de vouloir supprimer cette formation ?</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Annuler</button>
            <button onClick={() => handleDelete(deleteConfirm!)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Supprimer</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}