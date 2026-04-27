"use client";

import { useState, useEffect } from "react";
import { Search, Eye, MessageCircle } from "lucide-react";

const STATUSES = ["nouveau", "en_cours", "traite", "refuse"];
const STATUS_LABELS: Record<string, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  traite: "Traité",
  refuse: "Refusé",
};

export default function DevisPage() {
  const [devis, setDevis] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<any>(null);

useEffect(() => {
    if (selected) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
    return () => { document.body.style.overflowY = ''; };
  }, [selected]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Devis</h1>
        <span className="text-sm text-gray-500">{devis.length} demande(s)</span>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Client</th>
              <th className="text-left p-4">Service</th>
              <th className="text-left p-4">Budget</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Statut</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                {loading ? "Chargement..." : "Configurez Firebase pour gérer les devis"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Détails du devis</h2>
            <div className="space-y-3 text-sm">
              <div><strong>Client:</strong> {selected.clientName}</div>
              <div><strong>Service:</strong> {selected.service}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}