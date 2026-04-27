"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Home, Car, Sprout, GraduationCap, Briefcase, Globe, CheckCircle, Star, MapPin, Phone, Send, Loader2, ChevronLeft, ChevronRight as ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CountUp } from "@/components/animations/CountUp";
import { ParticleField } from "@/components/animations/ParticleField";
import { FloatingElement } from "@/components/animations/FloatingElement";

const services = [
  { title: "Immobilier", desc: "Vente, location, gestion de biens", icon: Home, href: "/services/immobilier", color: "bg-sts-green" },
  { title: "Transport", desc: "Location de véhicules avec chauffeur", icon: Car, href: "/services/transport", color: "bg-sts-blue" },
  { title: "Agrobusiness", desc: "Solutions agricoles innovantes", icon: Sprout, href: "/services/agrobusiness", color: "bg-sts-green" },
  { title: "Formation", desc: "Programmes certifiants", icon: GraduationCap, href: "/services/formation", color: "bg-sts-blue" },
  { title: "Conseil", desc: "Accompagnement stratégique", icon: Briefcase, href: "/services/conseil", color: "bg-sts-green" },
  { title: "Import-Export", desc: "Commerce international", icon: Globe, href: "/services/import-export", color: "bg-sts-blue" },
];

const stats = [
  { value: 500, suffix: "+", label: "Clients satisfaits" },
  { value: 150, suffix: "+", label: "Biens immobiliers" },
  { value: 50, suffix: "+", label: "Véhicules disponibles" },
  { value: 20, suffix: "+", label: "Formations dispensées" },
];

const whyUs = [
  { title: "Expertise Locale", desc: "Ancrés au Sénégal depuis plus de 10 ans, nous connaisons le marché local.", icon: MapPin },
  { title: "Services Intégrés", desc: "Tout sous un même toit : immobilier, transport, formation.", icon: Briefcase },
  { title: "Confiance & Transparence", desc: "Contrats clairs, tarifications transparentes.", icon: CheckCircle },
  { title: "Support Dédié", desc: "Une équipe disponible 7j/7 pour vous accompagner.", icon: Phone },
];

const testimonials = [
  { name: "Mamadou D.", role: "Directeur des Opérations", text: "STS a transformé notre gestion logistique. Un partenaire de confiance.", initials: "MD", color: "bg-sts-green" },
  { name: "Fatou S.", role: "Chef d'entreprise", text: "Excellence professionnelle. Formation de nos équipes en un temps record.", initials: "FS", color: "bg-sts-blue" },
  { name: "Ali M.", role: "Investisseur", text: "Mon investissement immobilier géré avec professionnalisme. Je recommande.", initials: "AM", color: "bg-sts-green-dark" },
];

const typewriterTexts = ["Expert en Immobilier", "Solutions Transport", "Agrobusiness", "Formations Professionnelles"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <circle cx="24" cy="24" r="18" stroke="#1A5FA8" strokeWidth="2" fill="none" />
      <ellipse cx="24" cy="24" rx="8" ry="18" stroke="#1A5FA8" strokeWidth="2" fill="none" />
      <line x1="6" y1="24" x2="42" y2="24" stroke="#1A5FA8" strokeWidth="2" />
      <path d="M10 10c2 2 4 2 6 0M32 38c2-2 4-2 6 0" stroke="#1A5FA8" strokeWidth="2" />
    </svg>
  );
}

function Typewriter() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentText = typewriterTexts[index];
    let i = 0;
    const interval = setInterval(() => {
      setText(currentText.slice(0, i + 1));
      i++;
      if (i > currentText.length) {
        clearInterval(interval);
        setTimeout(() => { setIndex((prev) => (prev + 1) % typewriterTexts.length); setText(""); }, 2000);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [index]);

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return <span className="text-xl md:text-2xl font-medium text-sts-green-light">{text}<span className={showCursor ? "animate-pulse" : ""}>|</span></span>;
}

function ScrollIndicator() {
  return (
    <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
      <ChevronDown className="w-8 h-8 text-white/50" />
    </motion.div>
  );
}

function StatCard({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
  return (
    <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
      <Card variant="elevated" className="text-center p-6">
        <div className="text-4xl font-bold text-sts-green mb-2"><CountUp end={value} suffix={suffix} /></div>
        <div className="text-sts-gray">{label}</div>
      </Card>
    </motion.div>
  );
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const Icon = service.icon;
  return (
    <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ scale: 1.03, rotateY: 5, rotateX: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Link href={service.href}>
        <Card variant="elevated" className="h-full p-6 group hover:-translate-y-2 transition-all perspective-1000">
          <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-4`}><Icon className="w-7 h-7 text-white" /></div>
          <CardHeader className="p-0 mb-2"><CardTitle className="text-xl group-hover:text-sts-green transition-colors">{service.title}</CardTitle></CardHeader>
          <CardContent className="p-0 text-sts-gray">{service.desc}</CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function WhyUsCard({ item, index }: { item: typeof whyUs[0]; index: number }) {
  const Icon = item.icon;
  return (
    <motion.div className="flex gap-4" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <div className="w-12 h-12 bg-sts-green/10 rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="w-6 h-6 text-sts-green" /></div>
      <div><h4 className="font-bold text-sts-black mb-1">{item.title}</h4><p className="text-sts-gray text-sm">{item.desc}</p></div>
    </motion.div>
  );
}

function TestimonialCard({ item, index }: { item: typeof testimonials[0]; index: number }) {
  return (
    <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Card variant="glass" className="p-6">
        <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
        <p className="text-sts-gray mb-4">"{item.text}"</p>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center text-white font-bold`}>{item.initials}</div>
          <div><div className="font-bold text-sts-black">{item.name}</div><div className="text-xs text-sts-gray">{item.role}</div></div>
        </div>
      </Card>
    </motion.div>
  );
}

function PropertyCarousel() {
  const [current, setCurrent] = useState(0);
  const properties = [
    { id: "1", title: "Villa F4 Point E", price: 45000000, location: "Point E, Dakar", surface: 250, bedrooms: 4, image: "/og-image.jpg", status: "available" },
    { id: "2", title: "Appartement F2 Almadies", price: 28000000, location: "Les Almadies, Dakar", surface: 80, bedrooms: 2, image: "/og-image.jpg", status: "available" },
    { id: "3", title: "Terrain Sicap", price: 35000000, location: "Sicap, Dakar", surface: 500, bedrooms: 0, image: "/og-image.jpg", status: "available" },
    { id: "4", title: "Maison F3 Mermoz", price: 32000000, location: "Mermoz, Dakar", surface: 150, bedrooms: 3, image: "/og-image.jpg", status: "reserved" },
  ];
  const next = () => setCurrent((c) => (c + 1) % properties.length);
  const prev = () => setCurrent((c) => (c - 1 + properties.length) % properties.length);

  return (
    <div className="relative overflow-hidden">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${current * 33.333}%)` }}>
        {properties.map((p) => (
          <div key={p.id} className="w-1/3 flex-shrink-0 px-2">
            <Card variant="elevated" className="overflow-hidden">
              <div className="h-40 bg-sts-surface relative"><img src={p.image} alt={p.title} className="w-full h-full object-cover" /></div>
              <div className="p-4">
                <h4 className="font-bold text-sts-black">{p.title}</h4>
                <p className="text-sm text-sts-gray">{p.location}</p>
                <div className="flex justify-between mt-2 text-sm"><span>{p.surface} m²</span><span>{p.bedrooms} ch.</span></div>
                <div className="text-sts-green font-bold mt-2">{new Intl.NumberFormat("fr-FR").format(p.price)} XOF</div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-sts-surface"><ChevronLeft className="w-5 h-5" /></button>
      <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-sts-surface"><ArrowRightIcon className="w-5 h-5" /></button>
      <div className="flex justify-center gap-2 mt-4">{properties.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i === current ? "bg-sts-green" : "bg-sts-gray/30"}`} />)}</div>
    </div>
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
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (res.ok) setSuccess(true);
    } finally { setLoading(false); }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-sts-green to-sts-green-dark text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
        <p className="mb-8 text-white/80">Inscrivez-vous à notre newsletter</p>
        {success ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white">✓ Merci ! Votre inscription est confirmée.</motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" required className="flex-1 px-4 py-3 rounded-lg text-sts-black" />
            <Button type="submit" variant="secondary" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

function BlogCard({ title, excerpt, date, index }: { title: string; excerpt: string; date: string; index: number }) {
  return (
    <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Card variant="elevated" className="overflow-hidden group">
        <div className="h-40 bg-sts-surface relative overflow-hidden">
          <div className="absolute inset-0 bg-sts-green/10 group-hover:bg-sts-green/20 transition-colors" />
        </div>
        <div className="p-4">
          <div className="text-xs text-sts-gray mb-2">{date}</div>
          <h3 className="font-bold text-sts-black mb-2 group-hover:text-sts-green transition-colors">{title}</h3>
          <p className="text-sm text-sts-gray line-clamp-2">{excerpt}</p>
        </div>
      </Card>
    </motion.div>
  );
}

export default function HomePage() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => { setHeroVisible(true); }, []);

  return (
    <main className="min-h-screen bg-sts-surface">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] via-[#0F3D1F] to-[#0A0A0A] overflow-hidden">
        <ParticleField particleCount={30} className="absolute inset-0" />
        
        {/* Floating Elements using FloatingElement component */}
        <FloatingElement delay={0} amplitude={20} duration={6} className="absolute top-20 right-20 hidden md:block">
          <div className="w-32 h-32 rounded-full border-2 border-sts-green/30" />
        </FloatingElement>
        <FloatingElement delay={2} amplitude={15} duration={8} className="absolute bottom-32 left-20 hidden md:block">
          <div className="w-20 h-20 rounded-full bg-sts-green/20" />
        </FloatingElement>
        <FloatingElement delay={1} amplitude={25} duration={5} className="absolute top-32 left-1/4 hidden lg:block">
          <GlobeIcon className="w-24 h-24" />
        </FloatingElement>

        {/* Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8">
            <span>🇸🇳</span>
            <span className="text-white/90 text-sm">Entreprise Sénégalaise de Confiance</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={heroVisible ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.3 }} className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-sts-green to-sts-blue bg-clip-text text-transparent">
            STS SOFITRANS<br />SERVICE
          </motion.h1>

          <div className="mb-4"><Typewriter /></div>

          <motion.p initial={{ opacity: 0 }} animate={heroVisible ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} className="text-2xl text-sts-green-light mb-8">
            Pour <span className="font-bold">Mieux Vous Servir !</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }} className="flex gap-4 justify-center flex-wrap mb-12">
            <Link href="/services"><Button size="lg" className="bg-sts-green hover:bg-sts-green-dark">Découvrir nos services</Button></Link>
            <Link href="/contact"><Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-sts-black">Demander un devis</Button></Link>
          </motion.div>

          <ScrollIndicator />
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => <StatCard key={stat.label} {...stat} index={i} />)}
          </div>
        </div>
      </motion.section>

      {/* ==================== SERVICES SECTION ==================== */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-20 bg-sts-surface">
        <div className="container mx-auto px-4">
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-center text-sts-black mb-4">Nos Domaines d'Expertise</motion.h2>
          <p className="text-center text-sts-gray mb-12 max-w-2xl mx-auto">Des solutions complètes pour accompagner votre développement au Sénégal</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
            {services.map((service, i) => <ServiceCard key={service.title} service={service} index={i} />)}
          </div>
        </div>
      </motion.section>

      {/* ==================== PROPERTIES CAROUSEL ==================== */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-sts-black mb-4">Biens en Vedette</h2>
          <p className="text-center text-sts-gray mb-12">Découvrez notre sélection de biens immobiliers</p>
          <PropertyCarousel />
        </div>
      </motion.section>

      {/* ==================== WHY US SECTION ==================== */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="py-20 bg-[#F8F8F5]">
        <div className="container mx-auto px-4">
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-center text-sts-black mb-12">Pourquoi nous choisir ?</motion.h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {whyUs.map((item, i) => <WhyUsCard key={item.title} item={item} index={i} />)}
          </div>
        </div>
      </motion.section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-sts-black mb-12">Témoignages clients</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => <TestimonialCard key={item.name} item={item} index={i} />)}
          </div>
        </div>
      </motion.section>

      {/* ==================== NEWSLETTER SECTION ==================== */}
      <Newsletter />

      {/* ==================== BLOG SECTION ==================== */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-20 bg-sts-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-sts-black mb-4">Actualités</h2>
          <p className="text-center text-sts-gray mb-12">Restez informé de nos dernières nouvelles</p>
          <div className="grid md:grid-cols-3 gap-6">
            <BlogCard index={0} title="Lancement de nos nouvelles formations certifiantes" excerpt="Découvrez notre nouvelle offre de formation professionnelle..." date="15 Avril 2026" />
            <BlogCard index={1} title="Expansion de notre département Immobilier" excerpt="Nous accompagnons désormais plus de clients..." date="10 Avril 2026" />
            <BlogCard index={2} title="10 ans au service du Sénégal" excerpt="STS Sofitrans Service célèbre une décennie..." date="5 Avril 2026" />
          </div>
        </div>
      </motion.section>
    </main>
  );
}