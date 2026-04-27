"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, TrendingUp, Palette, Megaphone, Users, Phone, Mail, CheckCircle, Target, BarChart3, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  { title: "Stratégie Commerciale", desc: "Plans d'affaires et développement", icon: Target },
  { title: "Création de Marque", desc: "Logo, charte graphique, identité", icon: Palette },
  { title: "Marketing Digital", desc: "SEO, réseaux sociaux, advertising", icon: Globe },
  { title: "Formation Commerciale", desc: "Techniques de vente et négociation", icon: Users },
];

export default function MarketingPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", service: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "marketing" }),
      });
      if (res.ok) setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-sts-surface">
      <section className="relative py-16 bg-gradient-to-br from-[#1A5FA8] to-[#0E3D70]">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Marketing & Commerce
          </motion.h1>
          <p className="text-xl text-white/80">Stratégie commerciale et accompagnement des jeunes entrepreneurs</p>
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
                    <div className="w-16 h-16 bg-sts-blue rounded-full flex items-center justify-center mx-auto mb-4">
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
          <h2 className="text-2xl font-bold text-sts-black text-center mb-4">Demander un accompagnement</h2>
          <p className="text-sts-gray text-center mb-8">Notre équipe vous aide à développer votre activité</p>
          
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-sts-blue mx-auto mb-4" />
              <h4 className="text-xl font-bold">Demande envoyée !</h4>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Nom / Raison sociale *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
              <input type="text" placeholder="Entreprise" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-3 border rounded-lg" />
              <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
              <input type="tel" placeholder="Téléphone *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
              <select value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className="w-full px-4 py-3 border rounded-lg">
                <option value="">Sélectionner un service</option>
                {services.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
              </select>
              <textarea placeholder="Votre projet..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 border rounded-lg" rows={4} />
              <Button type="submit" disabled={submitting} className="w-full bg-sts-blue">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer ma demande"}
              </Button>
            </form>
          )}
        </div>
      </section>

      <section className="py-16 bg-sts-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-sts-black mb-4">Vous êtes entrepreneur ?</h2>
          <p className="text-sts-gray mb-6">Nous accompagnons les jeunes entrepreneurs sénégalais</p>
          <Link href="/contact"><Button className="bg-sts-blue">Démarrer un projet</Button></Link>
        </div>
      </section>
    </main>
  );
}