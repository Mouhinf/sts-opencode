"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Mail, Clock, MessageCircle, Send, Loader2, CheckCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  firstName: z.string().min(2, "Prénom (min 2 caractères)"),
  name: z.string().min(2, "Nom (min 2 caractères)"),
  email: z.string().email("Email invalide"),
  phone: z.string().regex(/^(\+221|221)?[7-9][0-9]{8}$/, "Téléphone sénégalais invalide"),
  subject: z.string().min(1, "Sujet requis"),
  message: z.string().min(20, "Message (min 20 caractères)"),
});

const devisSchema = z.object({
  firstName: z.string().min(2, "Prénom (min 2 caractères)"),
  name: z.string().min(2, "Nom (min 2 caractères)"),
  email: z.string().email("Email invalide"),
  phone: z.string().regex(/^(\+221|221)?[7-9][0-9]{8}$/, "Téléphone sénégalais invalide"),
  company: z.string().optional(),
  service: z.string().min(1, "Service requis"),
  budget: z.string().optional(),
  message: z.string().min(10, "Description (min 10 caractères)"),
  delay: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;
type DevisForm = z.infer<typeof devisSchema>;

const services = ["Immobilier", "Transport", "Agrobusiness", "Formation", "Hygiène", "Marketing"];
const budgets = ["< 100 000", "100 000 - 500 000", "500 000 - 1 000 000", "1 000 000 - 5 000 000", "> 5 000 000"];

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50 ${type === "success" ? "bg-sts-green text-white" : "bg-red-500 text-white"}`}>
      {type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2"><X className="w-4 h-4" /></button>
    </motion.div>
  );
}

function InputField({ label, name, type = "text", register, error, required = false, placeholder, options }: { label: string; name: string; type?: string; register: any; error?: string; required?: boolean; placeholder?: string; options?: { value: string; label: string }[] }) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-sts-black mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select id={id} {...register(name)} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sts-green ${error ? "border-red-500" : ""}`}>
          <option value="">Sélectionner</option>
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : (
        <input id={id} type={type} {...register(name)} placeholder={placeholder} aria-required={required} aria-invalid={!!error} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sts-green ${error ? "border-red-500" : ""}`} />
      )}
      {error && <p className="text-red-500 text-sm mt-1" role="alert">{error}</p>}
    </div>
  );
}

export default function ContactPage() {
  const [tab, setTab] = useState<"contact" | "devis">("contact");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const contactForm = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });
  const devisForm = useForm<DevisForm>({ resolver: zodResolver(devisSchema) });

  const onContactSubmit = async (data: ContactForm) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, clientName: `${data.firstName} ${data.name}` }),
      });
      const result = await res.json();
      setToast({ message: result.message || "Message envoyé !", type: result.success ? "success" : "error" });
      if (result.success) contactForm.reset();
    } catch {
      setToast({ message: "Erreur. Réessayez.", type: "error" });
    }
  };

  const onDevisSubmit = async (data: DevisForm) => {
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, clientName: `${data.firstName} ${data.name}` }),
      });
      const result = await res.json();
      setToast({ message: result.message || "Devis enregistré !", type: result.success ? "success" : "error" });
      if (result.success) devisForm.reset();
    } catch {
      setToast({ message: "Erreur. Réessayez.", type: "error" });
    }
  };

  return (
    <main>
      <section className="relative py-16 bg-gradient-to-br from-[#1A8C3E] to-[#1A5FA8]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contactez-Nous</h1>
          <p className="text-xl text-white/80">Nous répondons sous 24h</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-sts-black mb-6">Nos Coordonnées</h2>
              <div className="space-y-6">
                <a href="tel:+221771234567" className="flex items-start gap-4 p-4 bg-sts-surface rounded-lg hover:bg-sts-green/10 transition-colors">
                  <Phone className="w-6 h-6 text-sts-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-sts-black">Téléphone</h3>
                    <p className="text-sts-gray">+221 77 123 45 67</p>
                  </div>
                </a>
                <a href="https://wa.me/221771234567" target="_blank" rel="noopener" className="flex items-start gap-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <MessageCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-sts-black">WhatsApp</h3>
                    <p className="text-sts-gray">+221 77 123 45 67</p>
                  </div>
                </a>
                <a href="mailto:contact@sts-sofitrans.com" className="flex items-start gap-4 p-4 bg-sts-surface rounded-lg hover:bg-sts-green/10 transition-colors">
                  <Mail className="w-6 h-6 text-sts-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-sts-black">Email</h3>
                    <p className="text-sts-gray">contact@sts-sofitrans.com</p>
                  </div>
                </a>
                <div className="flex items-start gap-4 p-4 bg-sts-surface rounded-lg">
                  <MapPin className="w-6 h-6 text-sts-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-sts-black">Adresse</h3>
                    <p className="text-sts-gray">Zac Mbao, Rond Point Sipres<br/>Dakar, Sénégal</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-sts-surface rounded-lg">
                  <Clock className="w-6 h-6 text-sts-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-sts-black">Horaires</h3>
                    <p className="text-sts-gray">Lun - Ven : 08h - 18h<br/>Sam : 09h - 13h</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 h-64 bg-sts-surface rounded-lg overflow-hidden">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.857856230448!2d-17.4637!3d14.7167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sZac%20Mbao%2C%20Dakar!5e0!3m2!1sfr!2ssn!4v1234567890" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Carte Google Maps - Zac Mbao Dakar" />
              </div>
            </div>

            <div>
              <div className="flex gap-2 mb-6">
                <button onClick={() => setTab("contact")} className={`flex-1 py-3 rounded-lg font-bold ${tab === "contact" ? "bg-sts-green text-white" : "bg-sts-surface text-sts-gray"}`}>
                  Nous contacter
                </button>
                <button onClick={() => setTab("devis")} className={`flex-1 py-3 rounded-lg font-bold ${tab === "devis" ? "bg-sts-green text-white" : "bg-sts-surface text-sts-gray"}`}>
                  Demande de devis
                </button>
              </div>

              <AnimatePresence mode="wait">
                {tab === "contact" ? (
                  <motion.form key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Prénom" name="firstName" register={contactForm.register} error={contactForm.formState.errors.firstName?.message} required placeholder="Votre prénom" />
                      <InputField label="Nom" name="name" register={contactForm.register} error={contactForm.formState.errors.name?.message} required placeholder="Votre nom" />
                    </div>
                    <InputField label="Email" name="email" type="email" register={contactForm.register} error={contactForm.formState.errors.email?.message} required placeholder="votre@email.com" />
                    <InputField label="Téléphone" name="phone" type="tel" register={contactForm.register} error={contactForm.formState.errors.phone?.message} required placeholder="77 123 45 67" />
                    <InputField label="Sujet" name="subject" register={contactForm.register} error={contactForm.formState.errors.subject?.message} required options={[{ value: "information", label: "Demande d'information" }, { value: "devis", label: "Demande de devis" }, { value: "support", label: "Support technique" }, { value: "autre", label: "Autre" }]} />
                    <div>
                      <label htmlFor="message-contact" className="block text-sm font-medium text-sts-black mb-1">Message <span className="text-red-500">*</span></label>
                      <textarea id="message-contact" {...contactForm.register("message")} rows={5} aria-required="true" aria-invalid={!!contactForm.formState.errors.message} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sts-green ${contactForm.formState.errors.message ? "border-red-500" : ""}`} placeholder="Votre message..." />
                      {contactForm.formState.errors.message && <p className="text-red-500 text-sm mt-1" role="alert">{contactForm.formState.errors.message.message}</p>}
                    </div>
                    <Button type="submit" disabled={contactForm.formState.isSubmitting} className="w-full">
                      {contactForm.formState.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <><Send className="w-5 h-5 mr-2" /> Envoyer</>}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form key="devis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={devisForm.handleSubmit(onDevisSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Prénom" name="firstName" register={devisForm.register} error={devisForm.formState.errors.firstName?.message} required placeholder="Votre prénom" />
                      <InputField label="Nom" name="name" register={devisForm.register} error={devisForm.formState.errors.name?.message} required placeholder="Votre nom" />
                    </div>
                    <InputField label="Email" name="email" type="email" register={devisForm.register} error={devisForm.formState.errors.email?.message} required placeholder="votre@email.com" />
                    <InputField label="Téléphone" name="phone" type="tel" register={devisForm.register} error={devisForm.formState.errors.phone?.message} required placeholder="77 123 45 67" />
                    <InputField label="Entreprise" name="company" register={devisForm.register} placeholder="Nom de l'entreprise (optionnel)" />
                    <InputField label="Service souhaité" name="service" register={devisForm.register} error={devisForm.formState.errors.service?.message} required options={services.map(s => ({ value: s, label: s }))} />
                    <InputField label="Budget estimé" name="budget" register={devisForm.register} options={budgets.map(b => ({ value: b, label: b + " XOF" }))} />
                    <div>
                      <label htmlFor="message-devis" className="block text-sm font-medium text-sts-black mb-1">Description du besoin <span className="text-red-500">*</span></label>
                      <textarea id="message-devis" {...devisForm.register("message")} rows={4} aria-required="true" aria-invalid={!!devisForm.formState.errors.message} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sts-green ${devisForm.formState.errors.message ? "border-red-500" : ""}`} placeholder="Décrivez votre besoin..." />
                      {devisForm.formState.errors.message && <p className="text-red-500 text-sm mt-1" role="alert">{devisForm.formState.errors.message.message}</p>}
                    </div>
                    <InputField label="Délai souhaité" name="delay" register={devisForm.register} placeholder="ASAP, 1 mois, 3 mois..." />
                    <Button type="submit" disabled={devisForm.formState.isSubmitting} className="w-full">
                      {devisForm.formState.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <><Send className="w-5 h-5 mr-2" /> Demander un devis</>}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}