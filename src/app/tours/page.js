import React from "react";
import ToursClient from "./ToursClient";
import { getActiveListings } from "@/lib/cache";

export const revalidate = 3600;

export default async function Tours() {
  const allListings = await getActiveListings();
  const tours = allListings
    .filter(t => t.type === 'Tour')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(d => ({
      id: d.id,
      title: d.title,
      location: d.location,
      price: d.price,
      image: d.image,
      badge: d.badge,
      service: d.originalService || d.type,
      tourTiers: d.tourTiers,
      allInclusiveTiers: d.allInclusiveTiers,
      allInclusiveSurcharge: d.allInclusiveSurcharge,
      pricingType: d.pricingType,
    }));

  return <ToursClient initialTours={tours} />;
}
