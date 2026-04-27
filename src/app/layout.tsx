import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { JsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sts-sofitrans.com"),
  title: {
    default: "STS SOFITRANS SERVICE | Immobilier, Transport & Formation au Sénégal",
    template: "%s | STS SOFITRANS SERVICE",
  },
  description: "Votre partenaire multisectoriel à Dakar. Immobilier, transport avec chauffeur, agrobusiness et formations professionnelles certifiantes. Pour Mieux Vous Servir !",
  keywords: [
    "immobilier Dakar",
    "immobilier Sénégal",
    "location villa Dakar",
    "achat appartement Dakar",
    "transport Dakar",
    "location véhicule Sénégal",
    "agrobusiness Dakar",
    "formation professionnelle Sénégal",
    "école formation Dakar",
    "STS SOFITRANS SERVICE",
  ],
  authors: [{ name: "STS SOFITRANS SERVICE" }],
  creator: "STS SOFITRANS SERVICE",
  publisher: "STS SOFITRANS SERVICE",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: "https://sts-sofitrans.com",
    siteName: "STS SOFITRANS SERVICE",
    title: "STS SOFITRANS SERVICE | Immobilier, Transport & Formation au Sénégal",
    description: "Votre partenaire multisectoriel à Dakar. Immobilier, transport, agrobusiness et formations professionnelles.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "STS SOFITRANS SERVICE - Votre partenaire au Sénégal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STS SOFITRANS SERVICE",
    description: "Votre partenaire multisectoriel à Dakar. Immobilier, Transport, Agrobusiness et Formation.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://sts-sofitrans.com",
    languages: {
      fr: "https://sts-sofitrans.com",
    },
  },
  category: "business",
  classification: "Multi-sector Services Company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.variable} ${playfair.variable} min-h-screen flex flex-col font-sans`}>
        <SmoothScroll />
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}