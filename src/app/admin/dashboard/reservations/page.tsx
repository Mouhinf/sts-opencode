"use client";

import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";

const STATUSES = ["en_attente", "confirme", "annule"];
const STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  confirme: "Confirmé",
  annule: "Annulé",
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
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
        <h1 className="text-2xl font-bold text-gray-900">Réservations</h1>
        <span className="text-sm text-gray-500">{reservations.length} réservation(s)</span>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
            </div>
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="">Tous les statuts</option>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Client</th>
              <th className="text-left p-4">Service</th>
              <th className="text-left p-4">Dates</th>
              <th className="text-left p-4">Prix</th>
              <th className="text-left p-4">Statut</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                {loading ? "Chargement..." : "Configurez Firebase pour gérer les réservations"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Détails de la réservation</h2>
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