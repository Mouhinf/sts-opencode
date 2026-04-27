"use client";

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "STS SOFITRANS SERVICE",
    description: "Votre partenaire multisectoriel à Dakar. Immobilier, transport, agrobusiness et formations professionnelles.",
    url: "https://sts-sofitrans.com",
    logo: "https://sts-sofitrans.com/og-image.jpg",
    image: "https://sts-sofitrans.com/og-image.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Zac Mbao, Rond Point Sipres",
      addressLocality: "Dakar",
      addressRegion: "Dakar",
      addressCountry: "SN",
      postalCode: "",
    },
   Geo: {
      "@type": "GeoCoordinates",
      latitude: "14.7167",
      longitude: "-17.4677",
    },
    telephone: "+221771234567",
    email: "contact@sts-sofitrans.com",
    priceRange: "$$",
    openingHours: "Mo-Fr 08:00-18:00",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://facebook.com/stssofitrans",
      "https://linkedin.com/company/stssofitrans",
    ],
    areaServed: {
      "@type": "Country",
      name: "Sénégal",
    },
    serviceType: [
      "Immobilier",
      "Transport",
      "Agrobusiness",
      "Formation professionnelle",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}