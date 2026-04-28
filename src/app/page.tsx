"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Phone, Mail, Clock, CheckCircle, Star, Send, Loader2, Building2, Car, Sprout, GraduationCap, Briefcase, Globe, Users, Shield, Zap, Calendar, Wrench, Leaf, Truck, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ParticleField } from "@/components/animations/ParticleField";
import { FloatingElement } from "@/components/animations/FloatingElement";

const featuredProperties = [
  { id: "1", title: "Villa F4 Point E", type: "Villa", price: 45000000, location: "Point E, Dakar", surface: 250, bedrooms: 4, bathrooms: 3, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", status: "available" },
  { id: "2", title: "Appartement F3 Almadies", type: "Appartement", price: 35000000, location: "Les Almadies, Dakar", surface: 120, bedrooms: 3, bathrooms: 2, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", status: "available" },
  { id: "3", title: "Terrain viabilisé Sicap", type: "Terrain", price: 28000000, location: "Sicap Liberté, Dakar", surface: 300, bedrooms: 0, bathrooms: 0, image: "https://images.unsplash.com/photo-1599581080498-5de6ebda0377?w=800", status: "available" },
  { id: "4", title: "Maison F3 Mermoz", type: "Maison", price: 38000000, location: "Mermoz, Dakar", surface: 180, bedrooms: 3, bathrooms: 2, image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800", status: "available" },
  { id: "5", "title": "Duplex F5 Ouakam", type: "Duplex", price: 55000000, location: "Ouakam, Dakar", surface: 320, bedrooms: 5, bathrooms: 4, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", status: "available" },
  { id: "6", title: "Studio Hann", type: "Studio", price: 15000000, location: "Hann, Dakar", surface: 45, bedrooms: 1, bathrooms: 1, image: "https://images.unsplash.com/photo-1600573472592-401b489d3cdc?w=800", status: "available" },
];

const transportFleet = [
  { id: "1", title: "Toyota Prado LX", category: "SUV", price: 28000000, image: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=800", status: "available" },
  { id: "2", title: "Mercedes Sprinter", category: "Van", price: 35000000, image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800", status: "available" },
  { id: "3", title: "Toyota Hiace", category: "Minibus", price: 22000000, image: "https://images.unsplash.com/photo-1536402545507-0e91c9df8f83?w=800", status: "available" },
];

const agribusinessProducts = [
  { id: "1", title: "Poules pondeuses", category: "Élevage", price: 15000, unit: "/poule", description: "Poules pondeuses de race", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5dded2?w=800" },
  { id: "2", title: "Poules de chair", category: "Élevage", price: 12000, unit: "/poule", description: "Poules prête à abattre", image: "https://images.unsplash.com/photo-1569288063644-5c6a5c11771f?w=800" },
  { id: "3", title: "Aliment poultry", category: "Intrants", price: 14500, unit: "/sac 25kg", description: "Aliment complet croissance", image: "https://images.unsplash.com/photo-1625246333195-78d9c38adc23?w=800" },
];

const formations = [
  { title: "Gestion Immobilière", desc: "Masterclass en gestion locative et transaction", duration: "2 jours", icon: Building2 },
  { title: "Transport & Logistique", desc: "Formation chauffeurs professionnels", duration: "1 mois", icon: Truck },
  { title: "Comptabilité Sage", desc: "Logiciel Sage comptabilité & paie", duration: "2 semaines", icon: Calculator },
  { title: "Technique d'Élevage", desc: "Élevage moderne de volailles", duration: "1 semaine", icon: Leaf },
];

const stats = [
  { value: 500, suffix: "+", label: "Clients satisfaits", icon: Users },
  { value: 150, suffix: "+", label: "Biens gérés", icon: Building2 },
  { value: 50, suffix: "+", label: "Véhicules", icon: Car },
  { value: 20, suffix: "+", label: "Formations", icon: GraduationCap },
];

const values = [
  { title: "Expertise Locale", desc: "Plus de 10 ans au Sénégal, connaissance approfondie du marché local", icon: MapPin },
  { title: "Services Intégrés", desc: "Tout sous un même toit : immobilier, transport, formation, agrobusiness", icon: Briefcase },
  { title: "Confiance & Transparence", desc: "Contrats clairs, tarifications transparentes, éthique professionnelle", icon: Shield },
  { title: "Support Dédié", desc: "Équipe disponible 7j/7 pour vous accompagner", icon: Zap },
];

const testimonials = [
  { name: "Amadou Diop", role: "Investisseur", text: "STS a transformé ma vision de l'investissement immobilier au Sénégal. Un service d'une qualité rare.", initials: "AD", color: "bg-sts-green" },
  { name: "Fatou Sow", role: "Directrice Logistique", text: "La réactivité et le professionnalisme de l'équipe transport sont exceptionnels.", initials: "FS", color: "bg-sts-blue" },
  { name: "Moussa Ndiaye", role: "Entrepreneur", text: "L'accompagnement en agrobusiness nous a permis de structurer notre exploitation avec succès.", initials: "MN", color: "bg-sts-black" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function StatCard({ value, suffix, label, icon: Icon, index }: { value: number; suffix: string; label: string; icon: any; index: number }) {
  return (
    <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
      <div className="w-16 h-16 bg-sts-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-sts-green" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-sts-black mb-2">{value}{suffix}</div>
      <div className="text-sts-gray">{label}</div>
    </motion.div>
  );
}

function PropertyCard({ property, index }: { property: typeof featuredProperties[0]; index: number }) {
  return (
    <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Link href="/services/immobilier">
        <Card variant="elevated" className="overflow-hidden group h-full">
          <div className="relative h-56 overflow-hidden">
            <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-sts-black/60 to-transparent" />
            <div className="absolute top-4 left-4 bg-sts-green text-white text-xs font-bold px-3 py-1 rounded-full">{property.type}</div>
            <div className="absolute bottom-4 left-4 text-white">
              <div className="text-sm opacity-80">{property.location}</div>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg text-sts-black mb-2 group-hover:text-sts-green transition-colors">{property.title}</h3>
            <div className="flex gap-4 text-sm text-sts-gray mb-3">
              <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {property.surface} m²</span>
              {property.bedrooms > 0 && <span className="flex items-center gap-1"><Car className="w-4 h-4" /> {property.chambres} ch.</span>}
            </div>
            <div className="text-xl font-bold text-sts-green">{new Intl.NumberFormat("fr-FR").format(property.price)} XOF</div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function VehicleCard({ vehicle, index }: { vehicle: typeof transportFleet[0]; index: number }) {
  return (
    <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Link href="/services/transport">
        <Card variant="elevated" className="overflow-hidden group h-full">
          <div className="relative h-40 overflow-hidden">
            <img src={vehicle.image} alt={vehicle.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-sts-black/60 to-transparent" />
            <div className="absolute top-4 left-4 bg-sts-blue text-white text-xs font-bold px-3 py-1 rounded-full">{vehicle.category}</div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-sts-black group-hover:text-sts-blue transition-colors">{vehicle.title}</h3>
            <div className="text-sts-green font-bold mt-2">{new Intl.NumberFormat("fr-FR").format(vehicle.price)} XOF</div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function FormationCard({ formation, index }: { formation: typeof formations[0]; index: number }) {
  const Icon = formation.icon;
  return (
    <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Link href="/services/formation">
        <Card variant="elevated" className="p-6 group h-full">
          <div className="w-14 h-14 bg-sts-green/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sts-green group-hover:text-white transition-colors">
            <Icon className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-sts-black mb-2">{formation.title}</h3>
          <p className="text-sts-gray text-sm mb-3">{formation.desc}</p>
          <div className="flex items-center gap-2 text-xs text-sts-blue font-medium">
            <Calendar className="w-4 h-4" /> {formation.duration}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setSuccess(true);
    } finally { setLoading(false); }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-sts-green to-[#0A4D21] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Rejoignez l'élite STS</h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">Recevez en priorité nos nouvelles opportunités immobilières et nos offres exclusives.</p>
        {success ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white font-bold">✓ Merci ! Votre inscription est confirmée.</motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre adresse email" required className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all" />
            <Button type="submit" size="lg" variant="secondary" disabled={loading} className="rounded-full px-6">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <main className="min-h-screen bg-white">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] via-[#0F3D1F] to-[#0A0A0A] overflow-hidden">
        <ParticleField particleCount={25} className="absolute inset-0" />
        <FloatingElement delay={0} amplitude={20} duration={6} className="absolute top-20 right-20 hidden md:block">
          <div className="w-32 h-32 rounded-full border-2 border-sts-green/30" />
        </FloatingElement>
        <FloatingElement delay={2} amplitude={15} duration={8} className="absolute bottom-32 left-20 hidden md:block">
          <div className="w-20 h-20 rounded-full bg-sts-green/20" />
        </FloatingElement>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8">
            <span>🇸🇳</span>
            <span className="text-white/90 text-sm">Entreprise Sénégalaise de Confiance</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-sts-green to-sts-blue bg-clip-text text-transparent font-playfair">
            STS SOFITRANS<br />SERVICE
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-2xl text-sts-green-light mb-8">
            Pour <span className="font-bold">Mieux Vous Servir !</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex gap-4 justify-center flex-wrap mb-12">
            <Link href="/services"><Button size="lg" className="bg-sts-green hover:bg-sts-green-dark">Découvrir nos services</Button></Link>
            <Link href="/contact"><Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-sts-black">Demander un devis</Button></Link>
          </motion.div>

          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowRight className="w-8 h-8 text-white/50 rotate-90" />
          </motion.div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-20 bg-sts-surface">
        <div className="container mx-auto px-4">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => <StatCard key={stat.label} {...stat} icon={stat.icon} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ==================== PROPERTIES SECTION ==================== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-sts-blue uppercase mb-2">Opportunités</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-sts-black font-playfair">Biens Immobiliers en Vedette</h3>
              </div>
              <Link href="/services/immobilier" className="flex items-center gap-2 text-sts-green font-medium hover:underline">
                Voir tout le catalogue <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.slice(0, 6).map((property, i) => <PropertyCard key={property.id} property={property} index={i} />)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== TRANSPORT SECTION ==================== */}
      <section className="py-24 bg-sts-black text-white">
        <div className="container mx-auto px-4">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-sts-blue uppercase mb-2">Flotte</h2>
                <h3 className="text-4xl md:text-5xl font-bold font-playfair">Transport & Logistique</h3>
              </div>
              <Link href="/services/transport" className="flex items-center gap-2 text-sts-blue font-medium hover:underline">
                Voir les véhicules <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {transportFleet.map((vehicle, i) => <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FORMATIONS SECTION ==================== */}
      <section className="py-24 bg-sts-surface">
        <div className="container mx-auto px-4">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold tracking-widest text-sts-green uppercase mb-2">Expertise</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-sts-black font-playfair">Nos Formations</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {formations.map((formation, i) => <FormationCard key={formation.title} formation={formation} index={i} />)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== WHY US SECTION ==================== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest text-sts-blue uppercase mb-2">Engagements</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-sts-black font-playfair">Pourquoi Nous Choisir</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <motion.div key={value.title} variants={itemVariants} className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 rounded-3xl bg-sts-surface flex items-center justify-center mb-6 group-hover:bg-sts-green group-hover:text-white transition-colors duration-300">
                      <Icon className="w-10 h-10 text-sts-green group-hover:text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-sts-black mb-3">{value.title}</h4>
                    <p className="text-sts-gray leading-relaxed">{value.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="py-24 bg-sts-surface">
        <div className="container mx-auto px-4">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest text-sts-green uppercase mb-2">Avis Clients</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-sts-black font-playfair">Ce Que l'On Dit de Nous</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((item, i) => (
                <motion.div key={item.name} variants={itemVariants}>
                  <Card variant="elevated" className="p-8 relative">
                    <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                    <p className="text-sts-gray italic mb-6 leading-relaxed">"{item.text}"</p>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white font-bold`}>{item.initials}</div>
                      <div>
                        <div className="font-bold text-sts-black">{item.name}</div>
                        <div className="text-xs text-sts-gray">{item.role}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== NEWSLETTER SECTION ==================== */}
      <Newsletter />

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-sts-black mb-4 font-playfair">Prêt à Construit Votre Avenir ?</h2>
          <p className="text-sts-gray mb-8 max-w-xl mx-auto">Contactez-nous dès aujourd'hui pour une consultation gratuite.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact">
              <Button size="lg" className="bg-sts-green">Nous contacter</Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline">Voir nos services</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}