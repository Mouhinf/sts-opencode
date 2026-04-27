import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle, ArrowRight } from "lucide-react";

const services = [
  { name: "Immobilier", href: "/services/immobilier" },
  { name: "Transport", href: "/services/transport" },
  { name: "Agrobusiness", href: "/services/agrobusiness" },
  { name: "Formation", href: "/services/formation" },
];

const company = [
  { name: "À propos", href: "/a-propos" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const legal = [
  { name: "Mentions légales", href: "/mentions-legales" },
  { name: "Politique de confidentialité", href: "/confidentialite" },
  { name: "CGV", href: "/cgv" },
];

function LogoSTS() {
  return (
    <div className="w-14 h-14 relative rounded-lg overflow-hidden">
      <img src="/og-image.jpg" alt="STS Logo" className="w-full h-full object-contain" />
    </div>
  );
}

function FbIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5L14.17.5C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5,2h-17A1.5,1.5,0,0,0,2,3.5v17A1.5,1.5,0,0,0,3.5,22H20.5a1.5,1.5,0,0,0,1.5-1.5v-17A1.5,1.5,0,0,0,20.5,2ZM8,19H5v-9h3ZM6.5,8.25A1.75,1.75,0,1,1,8.25,6.5,1.75,1.75,0,0,1,6.5,8.25ZM19,19h-3v-4.74c0-1.42-.6-2-1.76-2A1.74,1.74,0,0,0,13.5,13.5V19h-3V9h3V10.5c.62-1.13,2.26-1.84,3.12-1.84A2.5,2.5,0,0,1,15.5,11V19Z"/>
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sts-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-sts-green rounded-lg flex items-center justify-center">
                <LogoSTS />
              </div>
              <div>
                <span className="font-bold text-xl block">SOFITRANS</span>
                <span className="text-xs text-sts-gray uppercase tracking-wider">SERVICE</span>
              </div>
            </Link>
            <p className="text-sts-gray mb-6">
              Votre partenaire de confiance pour tous vos projets au Sénégal.
              Pour <span className="text-sts-green font-semibold">Mieux Vous Servir !</span>
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sts-green transition-colors">
                <FbIcon />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sts-green transition-colors">
                <LinkedInIcon />
              </a>
              <a href="https://wa.me/221771234567" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sts-green transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sts-gray hover:text-sts-green transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Entreprise</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sts-gray hover:text-sts-green transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sts-green flex-shrink-0 mt-0.5" />
                <span className="text-sts-gray">Zac Mbao, Rond Point Sipres<br />Dakar, Sénégal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sts-green flex-shrink-0" />
                <a href="tel:+221771234567" className="text-sts-gray hover:text-sts-green transition-colors">+221 77 123 45 67</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sts-green flex-shrink-0" />
                <a href="mailto:contact@sts-sofitrans.com" className="text-sts-gray hover:text-sts-green transition-colors">contact@sts-sofitrans.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sts-gray text-sm">© {currentYear} STS SOFITRANS SERVICE. Tous droits réservés.</p>
            <div className="flex gap-6">
              {legal.map((item) => (
                <Link key={item.href} href={item.href} className="text-sts-gray hover:text-sts-green text-sm transition-colors">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}