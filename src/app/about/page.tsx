"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Phone, Mail, Clock, CheckCircle, Building2, Car, GraduationCap, Briefcase, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const team = [
  { name: "Badara Niang", role: "Directeur Général", image: "/badara-niang.png" },
  { name: "团队的成员", role: "Responsable Immobilier", image: "/team-2.jpg" },
  { name: "团队的成员", role: "Responsable Transport", image: "/team-3.jpg" },
];

const values = [
  { title: "Professionnalisme", desc: "Une équipe qualifiée à votre service", icon: CheckCircle },
  { title: "Réactivité", desc: "Réponses rapides à vos demandes", icon: Clock },
  { title: "Transparence", desc: "Communications claires et honnêtes", icon: Briefcase },
  { title: "Engagement", desc: "Votre succès est notre priorité", icon: Building2 },
];

const history = [
  { year: "2016", title: "Création de STS", desc: "Fondation de l'entreprise à Dakar" },
  { year: "2018", title: "Expansion Transport", desc: "Flotte de véhicules et services logistiques" },
  { year: "2020", title: "Diversification", desc: "Immobilier, Formation, Conseil" },
  { year: "2023", title: "Leader National", desc: "Plus de 500 clients satisfaits" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-sts-surface">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-sts-green to-sts-green-dark text-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">À Propos de Nous</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">Depuis plus de 10 ans au service des entreprises et particuliers au Sénégal</p>
          </motion.div>
        </div>
      </section>

      {/* DG Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
              <div className="w-full max-w-md mx-auto aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl">
                <img src="/badara-niang.png" alt="Badara Niang" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-sts-green text-white px-6 py-3 rounded-lg shadow-lg">
                <div className="font-bold text-lg">Badara Niang</div>
                <div className="text-sm opacity-90">Directeur Général</div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-bold text-sts-black mb-4">Le Mot du Directeur Général</h2>
              <p className="text-sts-gray mb-6 leading-relaxed">
                Fondateur et Directeur Général de STS Sofitrans Service, fort de plus de 15 ans d'expérience dans le Secteur Privé Sénégalais. Diplômé en Management des Entreprises, j'ai construit STS autour d'une vision : offrir des services intégrés de qualité aux entreprises et particuliers au Sénégal.
              </p>
              <p className="text-sts-gray mb-6 leading-relaxed">
                Notre mission est de faire de STS le partenaire de référence pour le développement des entreprises et particuliers au Sénégal, à travers des services de qualité, innovants et accessibles.
              </p>
              <div className="flex gap-4">
                <Link href="/contact">
                  <Button className="bg-sts-green">Nous contacter</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-sts-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-sts-black mb-12">Notre Histoire</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {history.map((item, i) => (
              <motion.div key={item.year} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card variant="elevated" className="text-center p-6">
                  <div className="text-4xl font-bold text-sts-green mb-2">{item.year}</div>
                  <h3 className="font-bold text-sts-black mb-2">{item.title}</h3>
                  <p className="text-sts-gray text-sm">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-sts-black mb-12">Nos Valeurs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div key={value.title} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card variant="elevated" className="p-6 text-center">
                    <div className="w-14 h-14 bg-sts-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-sts-green" />
                    </div>
                    <h3 className="font-bold text-sts-black mb-2">{value.title}</h3>
                    <p className="text-sts-gray text-sm">{value.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-sts-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-sts-black mb-4">Nos Services</h2>
          <p className="text-center text-sts-gray mb-12 max-w-2xl mx-auto">Des solutions complètes pour accompagner votre développement</p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="elevated" className="p-6">
              <Building2 className="w-10 h-10 text-sts-green mb-4" />
              <h3 className="font-bold text-sts-black mb-2">Immobilier</h3>
              <p className="text-sts-gray text-sm">Vente, location et gestion de biens immobiliers</p>
            </Card>
            <Card variant="elevated" className="p-6">
              <Car className="w-10 h-10 text-sts-blue mb-4" />
              <h3 className="font-bold text-sts-black mb-2">Transport</h3>
              <p className="text-sts-gray text-sm">Location de véhicules avec chauffeur</p>
            </Card>
            <Card variant="elevated" className="p-6">
              <GraduationCap className="w-10 h-10 text-sts-green mb-4" />
              <h3 className="font-bold text-sts-black mb-2">Formation</h3>
              <p className="text-sts-gray text-sm">Programmes certifiants et coaching</p>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Link href="/services">
              <Button variant="outline">Voir tous nos services <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-sts-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous avez des questions ?</h2>
          <p className="text-white/80 mb-8"> Notre équipe est disponible pour vous répondre</p>
          <Link href="/contact">
            <Button size="lg" variant="secondary">Nous contacter</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}