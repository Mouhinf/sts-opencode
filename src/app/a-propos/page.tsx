"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Award, Users, Leaf, Handshake, TrendingUp, Globe, LinkIcon, Mail, Phone, Clock, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const timeline = [
  { year: "2015", title: "Création", desc: "Fondation de STS SOFITRANS SERVICE à Dakar" },
  { year: "2017", title: "Immobilier", desc: "Lancement du pôle transaction immobilière" },
  { year: "2019", title: "Transport", desc: "Expansion transport et logistique" },
  { year: "2021", title: "Agrobusiness", desc: "Lancement division agricole" },
  { year: "2023", title: "Formation", desc: "Plateforme formations certifiantes" },
  { year: "2024", title: "Souveraineté", desc: "Engagement pour l'indépendance économique africaine" },
];

const valeurs = [
  { icon: Handshake, title: "Intégrité", desc: "Transparence et honnêteté dans toutes nos relations commerciales", color: "text-sts-green" },
  { icon: TrendingUp, title: "Excellence", desc: "Commitment to quality and continuous improvement", color: "text-sts-blue" },
  { icon: Users, title: "Innovation", desc: "Creative solutions adapted to African realities", color: "text-sts-black" },
];

const equipe = [
  { name: "Aïda Faye", role: "Directrice Immobilier", linkedin: "#" },
  { name: "Mamadou Samb", role: "Responsable Transport", linkedin: "#" },
  { name: "Fatou Sow", role: "Responsable Formation", linkedin: "#" },
  { name: "Omar Khaly", role: "Responsable Agrobusiness", linkedin: "#" },
  { name: "Coumba Diallo", role: "Directrice Marketing", linkedin: "#" },
];

const partenaires = ["Sicap", "Apix", "Chambre Commerce", "UCAD", "ANPTIC", "ADER"];

const rse = [
  { title: "Emploi", desc: "50+ emplois directs créés", icon: Users },
  { title: "Formation", desc: "200+ formés annuellement", icon: Award },
  { title: "Environnement", desc: "Initiatives reboisement", icon: Leaf },
];

const dg = {
  name: "Badara Niang",
  role: "Directeur Général",
  birthdate: "3 février 1988",
  birthplace: "Dakar, Sénégal",
  linkedin: "https://sn.linkedin.com/in/badara-niang-836732316",
  quote: "Nous n'attendrons plus le changement. Nous le créons. Ensemble. Pour le Sénégal. Pour l'Afrique.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="relative py-24 bg-gradient-to-br from-[#1A8C3E] via-[#0F3D1F] to-[#1A5FA8] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/og-image.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A8C3E]/90 via-transparent to-[#1A5FA8]/90" />
        <div className="container relative mx-auto px-4 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-sm mb-4">
            Depuis 2015 · Dakar, Sénégal
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            À Propos de STS SOFITRANS SERVICE
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/80 max-w-2xl mx-auto">
            Votre partenaire multisectoriel de confiance au Sénégal
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-sts-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-sts-black mb-16">Notre Histoire</h2>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-sts-green/30 rounded-full hidden md:block" />
            {timeline.map((item, i) => (
              <motion.div key={item.year} initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`flex items-center gap-8 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "md:text-left"}`}>
                  <div className="inline-block px-4 py-2 bg-sts-green text-white rounded-lg font-bold">{item.year}</div>
                  <h3 className="font-bold text-lg text-sts-black mt-2">{item.title}</h3>
                  <p className="text-sts-gray text-sm">{item.desc}</p>
                </div>
                <div className="w-4 h-4 bg-sts-green rounded-full flex-shrink-0 hidden md:block" />
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-sts-black mb-4">Notre Directeur Général</h2>
          <p className="text-center text-sts-gray mb-12">L'homme derrière la vision</p>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-center lg:text-right">
              <div className="inline-block w-64 h-64 mx-auto lg:mr-0 rounded-full overflow-hidden border-4 border-sts-green shadow-xl">
                <img src="/badara-niang.png" alt={dg.name} className="w-full h-full object-cover" />
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-sts-black">{dg.name}</h3>
                <p className="text-sts-green font-medium">{dg.role}</p>
                <p className="text-sts-gray text-sm mt-1">Né le {dg.birthdate} à {dg.birthplace}</p>
                <a href={dg.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-sts-blue hover:underline">
                  <LinkIcon className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4 text-sts-gray-dark">
              <p className="text-lg">
                <span className="font-bold text-sts-black">Visionnaire, bâtisseur, patriote engagé</span>, {dg.name} représente cette génération d'Africains déterminés à changer le destin de leur pays par le travail, la discipline et l'innovation.
              </p>
              <p>
                Titulaire d'une formation en <span className="font-medium text-sts-black">comptabilité</span>, il a forgé son expérience dans plusieurs entreprises, commerciales, de transport et d'enseignement, où il a exercé en tant que comptable. C'est cette immersion sur le terrain qui lui a permis de cerner les réalités économiques du Sénégal et d'identifier les leviers concrets du changement.
              </p>
              <p>
                En 2018, il fonde <span className="font-bold text-sts-black">STS SOFITRANS SERVICE</span>, une entreprise ambitieuse qui s'impose aujourd'hui comme un <span className="font-bold text-sts-black">acteur multisectoriel</span> intervenant dans :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Immobilier & gestion locative</li>
                <li>Transport & logistique</li>
                <li>Formation professionnelle (comptabilité, logiciels Saari, gestion, bureautique)</li>
                <li>Services & conseils</li>
                <li>Agrobusiness intégré</li>
                <li>Marketing et commercialisation de produits locaux</li>
              </ul>
              <p>
                En 2024, convaincu que l'Afrique ne se développera que par ses propres fils, il decide de <span className="font-bold text-sts-black">se consacrer pleinement à STS</span>, avec pour mission de bâtir un <span className="font-bold text-sts-black">écosystème économique local solide, inclusif et durable</span>.
              </p>
              <p>
                Il defend un modèle d'entreprise à <span className="font-bold text-sts-black">valeur humaine</span>, qui forme les jeunes, soutient les femmes, inspire les universitaires et rassure les partenaires techniques et financiers.
              </p>
              <p>
                Il rêve d'une <span className="font-bold text-sts-black">Afrique indépendante économiquement</span>, <span className="font-bold text-sts-black">forte dans ses productions</span>, et respectée à l'échelle mondiale. Son engagement repose sur <span className="font-bold text-sts-black">trois piliers</span> :
              </p>
              <ul className="space-y-1 ml-4">
                <li>→ L'action sur le terrain</li>
                <li>→ Le leadership par l'exemple</li>
                <li>→ La souveraineté par la production locale</li>
              </ul>
              
              <div className="mt-8 p-6 bg-sts-green/5 border-l-4 border-sts-green rounded-r-lg">
                <Quote className="w-8 h-8 text-sts-green mb-2" />
                <p className="text-lg font-medium text-sts-black italic">"{dg.quote}"</p>
                <p className="text-right mt-2">— {dg.name}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-sts-black mb-16">Mission · Vision · Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {valeurs.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="p-8 text-center hover:-translate-y-2 transition-transform">
                  <item.icon className={`w-12 h-12 mx-auto mb-4 ${item.color}`} />
                  <h3 className="font-bold text-xl text-sts-black mb-2">{item.title}</h3>
                  <p className="text-sts-gray">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-sts-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-sts-black mb-16">Notre Équipe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {equipe.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="p-4 text-center hover:-translate-y-2 transition-transform">
                  <div className="w-20 h-20 mx-auto mb-4 bg-sts-green/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-sts-green">{member.name[0]}</span>
                  </div>
                  <h3 className="font-bold text-sts-black">{member.name}</h3>
                  <p className="text-sm text-sts-gray">{member.role}</p>
                  {member.linkedin !== "#" && (
                    <a href={member.linkedin} className="text-sts-blue hover:underline text-sm flex items-center justify-center gap-1 mt-2">
                      <LinkIcon className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-sts-black mb-16">Nos Partenaires</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {partenaires.map((partenaire) => (
              <div key={partenaire} className="px-8 py-4 bg-sts-surface rounded-lg flex items-center justify-center">
                <span className="font-bold text-sts-gray">{partenaire}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-sts-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Engagement RSE</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {rse.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-sts-green" />
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}