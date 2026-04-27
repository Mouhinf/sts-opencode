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
  PenLine,
  Calendar,
} from "lucide-react";

interface BlogPost {
  id: string;
  titre: string;
  slug: string;
  contenu: string;
  excerpt: string;
  categorie: string;
  image: string;
  publie: boolean;
  createdAt?: any;
}

const CATEGORIES = [
  { value: "actualites", label: "Actualités" },
  { value: "conseils", label: "Conseils" },
  { value: "evenements", label: "Événements" },
  { value: "transport", label: "Transport" },
  { value: "formations", label: "Formations" },
];

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

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function BlogFormModal({ isOpen, onClose, post, onSave }: { isOpen: boolean; onClose: () => void; post?: BlogPost | null; onSave: (form: Omit<BlogPost, "id" | "createdAt">) => Promise<void> }) {
  const [form, setForm] = useState<Omit<BlogPost, "id" | "createdAt">>({
    titre: "",
    slug: "",
    contenu: "",
    excerpt: "",
    categorie: "actualites",
    image: "",
    publie: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setForm({
        titre: post.titre || "",
        slug: post.slug || "",
        contenu: post.contenu || "",
        excerpt: post.excerpt || "",
        categorie: post.categorie || "actualites",
        image: post.image || "",
        publie: post.publie ?? false,
      });
    } else {
      setForm({ titre: "", slug: "", contenu: "", excerpt: "", categorie: "actualites", image: "", publie: false });
    }
  }, [post, isOpen]);

  const handleTitreChange = (value: string) => {
    setForm({ ...form, titre: value, slug: post ? form.slug : slugify(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titre || !form.contenu) { toast.error("Veuillez remplir les champs requis"); return; }
    setLoading(true);
    try { await onSave(form); toast.success(post ? "Article mis à jour" : "Article créé"); onClose(); }
    catch { toast.error("Erreur lors de l'enregistrement"); }
    finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={post ? "Modifier l'article" : "Nouvel article"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Titre *</label><input value={form.titre} onChange={(e) => handleTitreChange(e.target.value)} className="w-full p-2 border rounded" required /></div>
        <div><label className="block text-sm font-medium mb-1">Slug</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full p-2 border rounded" /></div>
        <div><label className="block text-sm font-medium mb-1">Excerpt</label><textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full p-2 border rounded" /></div>
        <div><label className="block text-sm font-medium mb-1">Contenu *</label><textarea value={form.contenu} onChange={(e) => setForm({ ...form, contenu: e.target.value })} rows={8} className="w-full p-2 border rounded" required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Catégorie</label><select value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })} className="w-full p-2 border rounded">{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1">Image URL</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full p-2 border rounded" placeholder="https://..." /></div>
        </div>
        <div><label className="flex items-center gap-2"><input type="checkbox" checked={form.publie} onChange={(e) => setForm({ ...form, publie: e.target.checked })} /><span className="text-sm">Publier</span></label></div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Annuler</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">{loading ? "Enregistrement..." : "Enregistrer"}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "blog"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const pts: BlogPost[] = [];
      snapshot.forEach((doc) => pts.push({ id: doc.id, ...doc.data() } as BlogPost));
      setPosts(pts);
    } catch { setPosts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSave = async (form: Omit<BlogPost, "id" | "createdAt">) => {
    if (editingPost) {
      await updateDoc(doc(db, "blog", editingPost.id), { ...form, updatedAt: serverTimestamp() });
    } else {
      const newSlug = form.slug || slugify(form.titre);
      await addDoc(collection(db, "blog"), { ...form, slug: newSlug, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
    await fetchPosts();
  };

  const handleDelete = async (id: string) => {
    try { 
      await deleteDoc(doc(db, "blog", id)); 
      toast.success("Article supprimé"); 
      setDeleteConfirm(null); 
      await fetchPosts(); 
    } catch { 
      toast.error("Erreur lors de la suppression"); 
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchSearch = !search || p.titre.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.categorie === filterCat;
    return matchSearch && matchCat;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Blog</h1><p className="text-gray-500">Gérez vos articles ({posts.length})</p></div>
        <button onClick={() => { setEditingPost(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Plus className="w-5 h-5" /> Nouveau</button>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div></div>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="px-4 py-2 border rounded-lg"><option value="">Toutes les catégories</option>{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="text-left p-4">Article</th><th className="text-left p-4">Catégorie</th><th className="text-left p-4">Date</th><th className="text-left p-4">Statut</th><th className="text-right p-4">Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">Chargement...</td></tr> : filteredPosts.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">Aucun article</td></tr> : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="border-t hover:bg-gray-50">
                  <td className="p-4"><div className="font-medium">{post.titre}</div><div className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</div></td>
                  <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{CATEGORIES.find((c) => c.value === post.categorie)?.label}</span></td>
                  <td className="p-4 flex items-center gap-1 text-sm text-gray-500"><Calendar className="w-4 h-4" />{formatDate(post.createdAt)}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded text-sm ${post.publie ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{post.publie ? "Publié" : "Brouillon"}</span></td>
                  <td className="p-4 text-right">
                    <button onClick={() => setViewingPost(post)} className="p-2 hover:bg-gray-100 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => { setEditingPost(post); setModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteConfirm(post.id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <BlogFormModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingPost(null); }} post={editingPost} onSave={handleSave} />

      <Modal isOpen={!!viewingPost} onClose={() => setViewingPost(null)} title={viewingPost?.titre || ""}>
        {viewingPost && (
          <div className="space-y-4">
            {viewingPost.image && <img src={viewingPost.image} alt={viewingPost.titre} className="w-full h-48 object-cover rounded-lg" />}
            <p className="text-gray-600">{viewingPost.contenu}</p>
            <div className="text-sm text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded">{CATEGORIES.find((c) => c.value === viewingPost.categorie)?.label}</span> · {formatDate(viewingPost.createdAt)}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmer la suppression">
        <div className="space-y-4">
          <p>Êtes-vous sûr de vouloir supprimer cet article ?</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Annuler</button>
            <button onClick={() => handleDelete(deleteConfirm!)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Supprimer</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}