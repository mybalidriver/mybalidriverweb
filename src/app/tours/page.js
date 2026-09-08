import React from "react";
import ToursClient from "./ToursClient";
import { getActiveListings } from "@/lib/cache";

export const revalidate = 3600;

export default async function Tours() {
  const allListings = await getActiveListings();
  const tours = allListings
    .filter(t => t.type === 'Tour')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return <ToursClient initialTours={tours} />;
}
