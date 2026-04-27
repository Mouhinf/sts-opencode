"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Mail, Eye, X, Trash2, MapPin } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  type?: string;
  propertyId?: string;
  propertyTitle?: string;
  read?: boolean;
  createdAt?: string;
}

const STORAGE_KEY = "sts_messages";

function getStoredMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveMessage(msg: Omit<Message, "id" | "createdAt" | "read">): void {
  if (typeof window === "undefined") return;
  const messages = getStoredMessages();
  const newMsg: Message = {
    ...msg,
    id: Date.now().toString(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  messages.unshift(newMsg);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  window.dispatchEvent(new Event("storage"));
}

function deleteStoredMessage(id: string): void {
  if (typeof window === "undefined") return;
  const messages = getStoredMessages().filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  window.dispatchEvent(new Event("storage"));
}

// Export for use in API
export { getStoredMessages, saveMessage, deleteStoredMessage };

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);

  const loadMessages = useCallback(() => {
    setLoading(true);
    const stored = getStoredMessages();
    setMessages(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMessages();
    const handleStorage = () => loadMessages();
    window.addEventListener("storage", handleStorage);
    const interval = setInterval(loadMessages, 3000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [loadMessages]);

  const deleteMessage = (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    deleteStoredMessage(id);
    setMessages(getStoredMessages());
  };

  const filtered = messages.filter(m => {
    if (search && !m.name?.toLowerCase().includes(search.toLowerCase()) && !m.email?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && m.type !== filterType) return false;
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500">{unreadCount > 0 ? `${unreadCount} non lu(s)` : "Tous lus"}</p>
        </div>
        <button onClick={loadMessages} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
          Actualiser
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
            </div>
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="">Tous types</option>
            <option value="visite">Demande de visite</option>
            <option value="contact">Contact</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">De</th>
              <th className="text-left p-4 hidden md:table-cell">Type</th>
              <th className="text-left p-4 hidden lg:table-cell">Bien</th>
              <th className="text-left p-4 hidden sm:table-cell">Date</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Chargement...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Aucun message</td></tr>
            ) : (
              filtered.map((msg) => (
                <tr key={msg.id} className={`border-t hover:bg-gray-50 ${!msg.read ? "bg-blue-50/50" : ""}`}>
                  <td className="p-4">
                    <div className="font-medium">{msg.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{msg.email}</div>
                    {msg.phone && <div className="text-xs text-gray-400">{msg.phone}</div>}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`px-2 py-1 rounded text-sm ${msg.type === "visite" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>
                      {msg.type === "visite" ? "Visite" : "Contact"}
                    </span>
                    {!msg.read && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />}
                  </td>
                  <td className="p-4 hidden lg:table-cell text-sm">
                    {msg.propertyTitle && <div className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 text-gray-400 shrink-0" /><span className="truncate">{msg.propertyTitle}</span></div>}
                  </td>
                  <td className="p-4 hidden sm:table-cell text-sm text-gray-500">{formatDate(msg.createdAt)}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSelected(msg)} className="p-2 hover:bg-gray-100 rounded" title="Voir"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => deleteMessage(msg.id)} className="p-2 hover:bg-red-50 text-red-500 rounded" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Message de {selected.name}</h2>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="flex items-center gap-1"><Mail className="w-4 h-4" />{selected.email}</div>
                </div>
                {selected.phone && <div><div className="text-xs text-gray-500">Téléphone</div><div>{selected.phone}</div></div>}
              </div>
              <div className="text-sm">
                <div className="text-xs text-gray-500">Type</div>
                <span className={`px-2 py-1 rounded text-sm ${selected.type === "visite" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>
                  {selected.type === "visite" ? "Demande de visite" : "Contact"}
                </span>
              </div>
              {selected.propertyTitle && (
                <div className="text-sm">
                  <div className="text-xs text-gray-500">Bien concerné</div>
                  <div className="flex items-center gap-1 font-medium"><MapPin className="w-4 h-4 text-sts-green" />{selected.propertyTitle}</div>
                </div>
              )}
              <div className="text-xs text-gray-500">Reçu le {formatDate(selected.createdAt)}</div>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">{selected.message || "Pas de message"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}