"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles, Shield, Wrench, Phone, Mail, CheckCircle, SprayCan, Video, Hammer, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  { title: "Nettoyage", desc: "Bureaux, villas, espaces commerciaux", icon: SprayCan },
  { title: "Sécurité", desc: "Agents, surveillance, alarmes", icon: Video },
  { title: "Maintenance", desc: "Électricité, plomberie, climatisation", icon: Hammer },
  { title: "Jardinage", desc: "Espaces verts, entretien", icon: Leaf },
];

export default function HygienePage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "hygiene" }),
      });
      if (res.ok) setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-sts-surface">
      <section className="relative py-16 bg-gradient-to-br from-[#0F5C28] to-[#1A8C3E]">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hygiène & Services
          </motion.h1>
          <p className="text-xl text-white/80">Pour un cadre de vie sain et professionnel</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="text-center p-6 hover:-translate-y-2 transition-all">
                    <div className="w-16 h-16 bg-sts-green rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-sts-black mb-2">{service.title}</h3>
                    <p className="text-sts-gray">{service.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-xl">
          <h2 className="text-2xl font-bold text-sts-black text-center mb-8">Demander un devis</h2>
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-sts-green mx-auto mb-4" />
              <h4 className="text-xl font-bold">Demande envoyée !</h4>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Nom *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
              <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
              <input type="tel" placeholder="Téléphone *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
              <select value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className="w-full px-4 py-3 border rounded-lg">
                <option value="">Sélectionner un service</option>
                {services.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
              </select>
              <textarea placeholder="Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 border rounded-lg" rows={4} />
              <Button type="submit" disabled={submitting} className="w-full bg-sts-green">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer"}
              </Button>
            </form>
          )}
        </div>
      </section>

      <section className="py-16 bg-sts-surface">
        <div className="container mx-auto px-4 text-center">
          <Link href="/contact"><Button className="bg-sts-green">Nous contacter</Button></Link>
        </div>
      </section>
    </main>
  );
}