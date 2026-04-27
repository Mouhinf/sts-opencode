"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function LogoSTS() {
  return (
    <div className="w-12 h-12 relative rounded-lg overflow-hidden">
      <img src="/og-image.jpg" alt="STS Logo" className="w-full h-full object-contain" />
    </div>
  );
}

const services = [
  { name: "Immobilier", href: "/services/immobilier", desc: "Achat, vente & location" },
  { name: "Transport", href: "/services/transport", desc: "Location avec chauffeur" },
  { name: "Agrobusiness", href: "/services/agrobusiness", desc: "Solutions agricoles" },
  { name: "Formation", href: "/services/formation", desc: "Programmes certifiants" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <LogoSTS />
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-sts-black leading-tight">
                SOFITRANS
              </span>
              <span className="text-xs text-sts-gray uppercase tracking-wider ml-1">
                SERVICE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sts-black hover:text-sts-green font-medium transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/a-propos"
              className="text-sts-black hover:text-sts-green font-medium transition-colors"
            >
              À propos
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-sts-black hover:text-sts-green font-medium transition-colors"
                onMouseEnter={() => setServicesOpen(true)}
              >
                Services
                <ChevronDown className="w-4 h-4" />
              </button>

              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pt-4 pb-4"
                onMouseLeave={() => setServicesOpen(false)}
              >
                <div className="grid grid-cols-2 gap-4 px-6">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-sts-surface transition-colors"
                    >
                      <div className="w-10 h-10 bg-sts-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sts-green font-bold">{service.name[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sts-black">{service.name}</h4>
                        <p className="text-sm text-sts-gray">{service.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t px-6">
                  <Link
                    href="/services"
                    className="text-sts-green font-medium text-sm hover:underline"
                  >
                    Voir tous les services →
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/blog"
              className="text-sts-black hover:text-sts-green font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-sts-black hover:text-sts-green font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/contact">
              <Button className="bg-sts-green hover:bg-sts-green-dark text-white px-6">
                Demande de devis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl py-6 px-4">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="font-medium py-3 text-base" onClick={() => setIsOpen(false)}>
                Accueil
              </Link>
              <Link href="/a-propos" className="font-medium py-3 text-base" onClick={() => setIsOpen(false)}>
                À propos
              </Link>
              <div className="py-2">
                <span className="font-medium text-sts-gray">Services</span>
                <div className="mt-2 ml-4 flex flex-col gap-2">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="text-sts-gray py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/blog" className="font-medium py-3 text-base" onClick={() => setIsOpen(false)}>
                Blog
              </Link>
              <Link href="/contact" className="font-medium py-3 text-base" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-12 bg-sts-green hover:bg-sts-green-dark text-base">
                  Demande de devis
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}