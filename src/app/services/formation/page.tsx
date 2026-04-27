"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Clock, Users, Calendar, CheckCircle, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockTrainings, createMessage } from "@/lib/firebase/collections";
import type { Training } from "@/types";

const categories = ["Tous", "Management", "Technique", "Langues", "Informatique", "Soft Skills"];

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50 ${
        type === "success" ? "bg-sts-blue text-white" : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2"><BookOpen className="w-4 h-4" /></button>
    </motion.div>
  );
}

export default function FormationPage() {
  const [loading, setLoading] = useState(true);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTrainings(mockTrainings);
    setLoading(false);
  }, []);

  const filteredTrainings = selectedCategory === "Tous" 
    ? trainings 
    : trainings.filter(t => t.category === selectedCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Inscription formation: ${selectedTraining?.title}. ${formData.notes}`,
        type: "formation",
      });
      setToast({ message: "Inscription envoyée ! Nous vous confirmerons sous 24h.", type: "success" });
      setShowForm(false);
      setFormData({ name: "", email: "", phone: "", notes: "" });
    } catch {
      setToast({ message: "Erreur. Veuillez réessayer.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-sts-surface">
      <section className="relative py-16 bg-gradient-to-br from-[#1A5FA8] to-[#0E3D70]">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Formation Professionnelle
          </motion.h1>
          <p className="text-xl text-white/80">Des programmes certifiants pour votre développement</p>
        </div>
      </section>

      <section className="py-6 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <span className="text-sts-gray">Catégories:</span>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === cat ? "bg-sts-blue text-white" : "bg-sts-surface text-sts-gray hover:bg-sts-blue/10"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sts-blue" /></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrainings.map((training, i) => (
                <motion.div key={training.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="h-full flex flex-col group hover:-translate-y-2 transition-all">
                    <div className={`h-2 ${(training.enrolled || 0) >= (training.seats || 20) ? "bg-red-500" : "bg-sts-blue"}`} />
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <span className="px-2 py-1 bg-sts-surface rounded text-xs text-sts-gray">{training.category}</span>
                        {(training.enrolled || 0) >= (training.seats || 20) && <span className="px-2 py-1 bg-red-100 rounded text-xs text-red-600">Complet</span>}
                      </div>
                      <h3 className="text-lg font-bold text-sts-black mb-2">{training.title}</h3>
                      <p className="text-sts-gray text-sm mb-4 flex-1">{training.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-sts-gray"><Clock className="w-4 h-4" />{training.duration}</div>
                        <div className="flex items-center gap-2 text-sm text-sts-gray"><Users className="w-4 h-4" />{training.enrolled || 0}/{training.seats || 20} places</div>
                        <div className="flex items-center gap-2 text-sm text-sts-gray"><Calendar className="w-4 h-4" />{training.nextSession || "À définir"}</div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-lg font-bold text-sts-blue">{new Intl.NumberFormat("fr-FR").format(training.price)} XOF</span>
                        <Button size="sm" onClick={() => { setSelectedTraining(training); setShowForm(true); setFormData({ ...formData, notes: `Formation: ${training.title}` }); }} disabled={(training.enrolled || 0) >= (training.seats || 20)}>
                          {(training.enrolled || 0) >= (training.seats || 20) ? "Complet" : "S'inscrire"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showForm && selectedTraining && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-sts-black mb-2">{selectedTraining.title}</h3>
              <p className="text-sts-gray mb-4">{selectedTraining.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-sts-surface rounded-lg text-center">
                  <Clock className="w-5 h-5 text-sts-blue mx-auto mb-1" />
                  <div className="text-sm text-sts-gray">Durée</div>
                  <div className="font-bold text-sts-black">{selectedTraining.duration}</div>
                </div>
                <div className="p-3 bg-sts-surface rounded-lg text-center">
                  <Users className="w-5 h-5 text-sts-blue mx-auto mb-1" />
                  <div className="text-sm text-sts-gray">Places</div>
                  <div className="font-bold text-sts-black">{selectedTraining.enrolled || 0}/{selectedTraining.seats || 20}</div>
                </div>
              </div>

              <div className="text-xl font-bold text-sts-blue mb-4">{new Intl.NumberFormat("fr-FR").format(selectedTraining.price)} XOF</div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Nom complet *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
                <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
                <input type="tel" placeholder="Téléphone *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
                <textarea placeholder="Questions / Comments" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-3 border rounded-lg" rows={3} />
                <Button type="submit" disabled={submitting} className="w-full bg-sts-blue">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "S'inscrire"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="w-16 h-16 text-sts-blue mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-sts-black mb-4">Certifications Reconnues</h2>
          <p className="text-sts-gray mb-8 max-w-xl mx-auto">Nos formations sont reconnues par les institutions officielles et délivrent des certificats validés.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact"><Button className="bg-sts-blue">Demander un devis</Button></Link>
            <Link href="/blog"><Button variant="outline">Voir le blog</Button></Link>
          </div>
        </div>
      </section>
    </main>
  );
}