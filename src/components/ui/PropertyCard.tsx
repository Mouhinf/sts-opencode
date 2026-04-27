"use client";

import Image from "next/image";
import { MapPin, Bed, Maximize, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface PropertyCardProps {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  location: string;
  status?: "available" | "reserved" | "sold";
  surface: number;
  bedrooms: number;
  onViewDetails?: (id: string) => void;
}

export function PropertyCard({
  id,
  imageUrl,
  title,
  price,
  location,
  status = "available",
  surface,
  bedrooms,
  onViewDetails,
}: PropertyCardProps) {
  const statusConfig = {
    available: { label: "Disponible", class: "bg-sts-green" },
    reserved: { label: "Réservé", class: "bg-yellow-500" },
    sold: { label: "Vendu", class: "bg-red-500" },
  };
  const statusStyle = statusConfig[status];

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card className="overflow-hidden group hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`${statusStyle.class} text-white text-xs font-medium px-3 py-1 rounded-full`}>
            {statusStyle.label}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sts-black mb-2 line-clamp-1">{title}</h3>

        <div className="flex items-center gap-1 text-sts-gray text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center justify-between text-sts-gray text-sm mb-4">
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{surface} m²</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{bedrooms} ch.</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sts-green font-bold text-lg">{formatPrice(price)}</span>
          <Button size="sm" onClick={() => onViewDetails?.(id)}>
            <Eye className="w-4 h-4 mr-2" />
            Détails
          </Button>
        </div>
      </div>
    </Card>
  );
}