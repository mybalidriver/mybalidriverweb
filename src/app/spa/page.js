import React from "react";
import ListingCard from "@/components/listing/ListingCard";

export const metadata = {
  title: "Spa & Wellness | My Bali Driver",
};

import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';


export default async function Spa() {
  const { data: spas } = await supabase
    .from('listings')
    .select('*')
    .eq('type', 'Spa')
    .eq('status', 'Active')
    .order('created_at', { ascending: false });

  const displaySpas = spas || [];

  return (
    <div className="w-full pt-32 pb-20 bg-background">
      <section className="container mx-auto px-4 lg:max-w-7xl mb-16 flex flex-col items-center text-center">
        <div className="mb-6 inline-block px-4 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-bold tracking-wider uppercase shadow-sm">
          Relax & Rejuvenate
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-text-primary">
          Discover Inner Peace
        </h1>
        <p className="text-text-secondary text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Book the finest spa treatments and wellness retreats Bali has to offer. Rest your body and soothe your soul.
        </p>
      </section>

      <section className="container mx-auto px-4 lg:max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySpas.map(spa => (
            <ListingCard key={spa.id} item={spa} linkTo={`/spa/${spa.id}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
