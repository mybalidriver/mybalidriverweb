import React from "react";
import ListingCard from "@/components/listing/ListingCard";

export const metadata = {
  title: "Spa & Wellness | Trove Experience",
};

const mockSpas = [
  { id: 1, title: 'Traditional Balinese Massage', location: 'Ubud', rating: 4.9, reviews: 215, price: 25, duration: '60 Min', category: 'Massage', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80', badge: 'Bestseller' },
  { id: 2, title: 'Volcanic Stone Therapy', location: 'Seminyak', rating: 4.8, reviews: 104, price: 40, duration: '90 Min', category: 'Therapy', image: 'https://images.unsplash.com/photo-1543330091-27228394c70f?auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Flower Bath & Scrub Experience', location: 'Ubud', rating: 4.7, reviews: 312, price: 35, duration: '120 Min', category: 'Package', image: 'https://images.unsplash.com/photo-1560944527-a4a429848866?auto=format&fit=crop&w=800&q=80' },
];

export default function Spa() {
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
          {mockSpas.map(spa => (
            <ListingCard key={spa.id} item={spa} linkTo={`/spa/${spa.id}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
