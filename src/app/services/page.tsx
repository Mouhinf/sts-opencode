"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Home, Car, Sprout, GraduationCap, ChevronRight, Loader2, MapPin, Bed, Maximize, Calendar, CheckCircle, Users, Clock, Star, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const services = [
  { 
    title: "Immobilier", 
    desc: "De la conception à la gestion locative, STS bâtit des logements modernes et accessibles.",
    href: "/services/immobilier",
    bg: "from-[#1A8C3E]/80 to-[#1A8C3E]/60",
    icon: Home
  },
  { 
    title: "Transport & Logistique", 
    desc: "Vente et location de véhicules, transport touristique et collectif, solutions sur mesure.",
    href: "/services/transport",
    bg: "from-[#1A5FA8]/80 to-[#1A5FA8]/60",
    icon: Car
  },
  { 
    title: "Hygiène & Services", 
    desc: "Nettoyage, sécurité, maintenance et assistance administrative.",
    href: "/services/hygiene",
    bg: "from-[#1A8C3E]/80 to-[#1A8C3E]/60",
    icon: Sprout
  },
  { 
    title: "Agrobusiness", 
    desc: "Élevage de volailles, transformation d'aliments, culture de céréales.",
    href: "/services/agrobusiness",
    bg: "from-[#1A5FA8]/80 to-[#1A5FA8]/60",
    icon: Sprout
  },
  { 
    title: "Formation & Comptabilité", 
    desc: "Gestion, fiscalité et logiciels comme Sage Saari adaptés au marché.",
    href: "/services/formation",
    bg: "from-[#1A8C3E]/80 to-[#1A8C3E]/60",
    icon: GraduationCap
  },
  { 
    title: "Marketing & Commerce", 
    desc: "Stratégie commerciale, création de marque et accompagnement.",
    href: "/services/marketing",
    bg: "from-[#1A5FA8]/80 to-[#1A5FA8]/60",
    icon: GraduationCap
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function ServicesPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  return (
    <main className="min-h-screen bg-sts-surface">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-sts-black via-[#0F3D1F] to-sts-black">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={visible ? { opacity: 1, y: 0 } : {}}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Nos Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-xl text-sts-gray mb-8"
          >
            Des solutions complètes pour vos projets au Sénégal
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.title} variants={itemVariants}>
                  <Link href={service.href}>
                    <Card variant="elevated" className="h-full overflow-hidden group">
                      <div className={`relative h-64 bg-gradient-to-br ${service.bg} flex items-center justify-center`}>
                        <div className="absolute inset-0 bg-black/30" />
                        <Icon className="w-20 h-20 text-white/50" />
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                      </div>
                      <CardContent className="p-6">
                        <CardTitle className="text-2xl mb-3 group-hover:text-sts-green transition-colors">
                          {service.title}
                        </CardTitle>
                        <p className="text-sts-gray mb-4">{service.desc}</p>
                        <div className="flex items-center text-sts-green font-medium">
                          <span>Découvrir</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { value: "500+", label: "Clients", color: "text-sts-green" },
              { value: "200+", label: "Biens", color: "text-sts-blue" },
              { value: "50+", label: "Véhicules", color: "text-sts-green" },
              { value: "1000+", label: "Stagiaires", color: "text-sts-blue" },
              { value: "100+", label: "Entreprises", color: "text-sts-green" },
              { value: "50+", label: "Projects", color: "text-sts-blue" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-sts-gray">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-sts-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-sts-black mb-4">Besoin d'un devis gratuit ?</h2>
          <p className="text-sts-gray mb-8 max-w-xl mx-auto">
            Notre équipe est disponible pour vous accompagner et vous proposer des solutions personnalisées.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-sts-green hover:bg-sts-green-dark">
              Demander un devis
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}