"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Calendar,
  FileText,
  Building2,
  TrendingUp,
} from "lucide-react";

interface KPIData {
  label: string;
  value: number;
  icon: any;
  color: string;
}

interface RecentItem {
  id: string;
  [key: string]: any;
}

function KPICard({ kpi, index }: { kpi: KPIData; index: number }) {
  const Icon = kpi.icon;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.1 }} 
      className={`${kpi.color} text-white p-6 rounded-xl`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">{kpi.value}</div>
          <div className="text-white/80">{kpi.label}</div>
        </div>
        <Icon className="w-8 h-8 opacity-80" />
      </div>
    </motion.div>
  );
}

function LoadingCard({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
      <div className="h-48 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Chargement...</p>
        </div>
      </div>
    </div>
  );
}

function RecentTable({ title, items, type }: { title: string; items: RecentItem[]; type: string }) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun élément</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex-1 min-w-0">
                {type === "messages" && <p className="font-medium truncate">{item.clientName || item.name}</p>}
                {type === "messages" && <p className="text-sm text-gray-500 truncate">{item.message}</p>}
                {type === "reservations" && <p className="font-medium truncate">{item.clientName}</p>}
                {type === "reservations" && <p className="text-sm text-gray-500">{item.service} - {item.date}</p>}
              </div>
              <div className="text-sm text-gray-500 ml-4">
                {formatDate(item.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPIData[]>([
    { label: "Messages non lus", value: 0, icon: MessageCircle, color: "bg-green-600" },
    { label: "Réservations en attente", value: 0, icon: Calendar, color: "bg-blue-600" },
    { label: "Devis nouveaux", value: 0, icon: FileText, color: "bg-purple-600" },
    { label: "Biens publiés", value: 0, icon: Building2, color: "bg-orange-500" },
  ]);
  const [recentMessages, setRecentMessages] = useState<RecentItem[]>([]);
  const [recentReservations, setRecentReservations] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messagesSnap, reservationsSnap, devisSnap, propertiesSnap] = await Promise.all([
          getDocs(query(collection(db, "messages"), where("read", "==", false), limit(10))),
          getDocs(query(collection(db, "reservations"), where("status", "==", "en_attente"), limit(10))),
          getDocs(query(collection(db, "devis"), where("status", "==", "nouveau"), limit(10))),
          getDocs(query(collection(db, "properties"), where("published", "==", true), limit(10))),
        ]);

        setKpis((prev) => [
          { ...prev[0], value: messagesSnap.size },
          { ...prev[1], value: reservationsSnap.size },
          { ...prev[2], value: devisSnap.size },
          { ...prev[3], value: propertiesSnap.size },
        ]);

        const msgs: RecentItem[] = [];
        messagesSnap.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() }));
        setRecentMessages(msgs.slice(0, 5));

        const res: RecentItem[] = [];
        reservationsSnap.forEach((doc) => res.push({ id: doc.id, ...doc.data() }));
        setRecentReservations(res.slice(0, 5));
      } catch (error) {
        console.log("Firebase not configured or error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Vue d'ensemble de votre activité</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.label} kpi={kpi} index={index} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {loading ? (
          <>
            <LoadingCard title="Demandes des 30 derniers jours" />
            <LoadingCard title="Services les plus demandés" />
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Demandes des 30 derniers jours</h3>
              <div className="h-48 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune donnée</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Services les plus demandés</h3>
              <div className="space-y-3">
                {[
                  { name: "Immobilier", count: kpis[3].value },
                  { name: "Transport", count: kpis[1].value },
                  { name: "Formation", count: 0 },
                  { name: "Agrobusiness", count: 0 },
                  { name: "Hygiène", count: 0 },
                ]
                  .sort((a, b) => b.count - a.count)
                  .map((service) => (
                    <div key={service.name} className="flex items-center gap-3">
                      <div className="w-24 text-sm text-gray-500">{service.name}</div>
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600 rounded-full" 
                          style={{ width: `${Math.max((service.count / 10) * 100, service.count > 0 ? 5 : 0)}%` }} 
                        />
                      </div>
                      <div className="w-8 text-sm text-right">{service.count}</div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentTable title="Messages récents" items={recentMessages} type="messages" />
        <RecentTable title="Réservations récentes" items={recentReservations} type="reservations" />
      </div>
    </div>
  );
}