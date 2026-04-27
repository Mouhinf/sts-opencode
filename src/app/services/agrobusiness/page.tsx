"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle, Leaf, Globe, Users, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createQuote } from "@/lib/firebase/collections";

const domains = [
  { title: "Production", desc: "Cultures vivrières et maraîchères", icon: Leaf },
  { title: "Distribution", desc: "Mise en marché locale", icon: Truck },
  { title: "Export", desc: "Commerce international", icon: Globe },
];

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50 ${
        type === "success" ? "bg-sts-green text-white" : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2"><Leaf className="w-4 h-4" /></button>
    </motion.div>
  );
}

export default function AgrobusinessPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createQuote({
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        company: formData.company,
        quoteType: formData.type,
        message: formData.message,
        status: "pending",
      });
      setToast({ message: "Demande envoyée ! Nous vous recontacterons sous 48h.", type: "success" });
      setShowForm(false);
      setFormData({ name: "", email: "", phone: "", company: "", type: "", message: "" });
    } catch {
      setToast({ message: "Erreur. Veuillez réessayer.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-sts-surface">
      <section className="relative py-16 bg-gradient-to-br from-[#0F5C28] to-[#1A8C3E]">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Solutions Agricoles
          </motion.h1>
          <p className="text-xl text-white/80">Innovantes et durables pour le Sénégal</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-sts-black text-center mb-8">Nos Domaines d'Intervention</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {domains.map((domain, i) => {
              const Icon = domain.icon;
              return (
                <motion.div key={domain.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="text-center p-8 hover:-translate-y-2 transition-all">
                    <div className="w-16 h-16 bg-sts-green rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-sts-black mb-2">{domain.title}</h3>
                    <p className="text-sts-gray">{domain.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6">
              <Leaf className="w-12 h-12 text-sts-green mb-4" />
              <h3 className="text-xl font-bold text-sts-black mb-2">Élevage de volailles</h3>
              <p className="text-sts-gray">Poulets, pintades et canards pour la sécurité alimentaire</p>
            </Card>
            <Card className="p-6">
              <Users className="w-12 h-12 text-sts-green mb-4" />
              <h3 className="text-xl font-bold text-sts-black mb-2">Transformation</h3>
              <p className="text-sts-gray">Transformation de produits agricoles locaux</p>
            </Card>
            <Card className="p-6">
              <Globe className="w-12 h-12 text-sts-green mb-4" />
              <h3 className="text-xl font-bold text-sts-black mb-2">Culture</h3>
              <p className="text-sts-gray">Céréales, légumes et cultures vivrières</p>
            </Card>
            <Card className="p-6">
              <Truck className="w-12 h-12 text-sts-green mb-4" />
              <h3 className="text-xl font-bold text-sts-black mb-2">Production locale</h3>
              <p className="text-sts-gray">Soutien à la souveraineté alimentaire</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-sts-black text-center mb-4">Devenir Partenaire</h2>
          <p className="text-sts-gray text-center mb-8">Rejoignez notre réseau d'agriculteurs et de partenaires</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Nom / Raison sociale *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
            <input type="text" placeholder="Entreprise (optionnel)" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-3 border rounded-lg" />
            <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
            <input type="tel" placeholder="Téléphone *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-3 border rounded-lg">
              <option value="">Sélectionner un domaine</option>
              {domains.map(d => <option key={d.title} value={d.title}>{d.title}</option>)}
            </select>
            <textarea placeholder="Votre demande..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" rows={4} />
            <Button type="submit" disabled={submitting} className="w-full bg-sts-green">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer ma demande"}
            </Button>
          </form>
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <section className="py-16 bg-sts-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-sts-black mb-4">Une question sur l'agrobusiness ?</h2>
          <p className="text-sts-gray mb-6">Notre équipe est disponible pour vous aider</p>
          <Link href="/contact"><Button className="bg-sts-green">Nous contacter</Button></Link>
        </div>
      </section>
    </main>
  );
}