import React from "react";
import ListingCard from "@/components/listing/ListingCard";
import { ShieldCheck, Truck, Clock } from "lucide-react";

export const metadata = {
  title: "Premium Scooter Rentals | Discovering Bali",
};

const mockScooters = [
  { id: 1, title: 'Honda Scoopy (Latest Model)', location: 'Ubud Delivery', rating: 4.8, reviews: 156, price: 5, duration: 'Per Day', category: 'Standard', image: 'https://images.unsplash.com/photo-1627063544321-dfb8df2a2cc6?auto=format&fit=crop&w=800&q=80', badge: 'Popular' },
  { id: 2, title: 'Yamaha NMAX 155cc', location: 'Airport Pickup', rating: 4.9, reviews: 312, price: 10, duration: 'Per Day', category: 'Premium', image: 'https://images.unsplash.com/photo-1599827568589-32219e2fb0e8?auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Honda Vario 125cc', location: 'Canggu Delivery', rating: 4.6, reviews: 89, price: 6, duration: 'Per Day', category: 'Standard', image: 'https://images.unsplash.com/photo-1616422285623-1d0fb7e9ddb1?auto=format&fit=crop&w=800&q=80' },
];

export default function Scooter() {
  return (
    <div className="w-full pt-20 pb-20">
      
      {/* Hero */}
      <section className="bg-primary text-white py-16 md:py-24 mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-4 lg:max-w-7xl relative z-10 text-center flex flex-col gap-4">
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Premium Scooter Rentals
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Explore Bali freely with our well-maintained, fully insured scooters delivered directly to your hotel or airport.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="container mx-auto px-4 lg:max-w-7xl mb-16 mt-[-4rem] relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface rounded-2xl shadow-soft border border-border p-6 md:p-8 flex flex-col items-center text-center gap-3 hover:-translate-y-1 hover:shadow-medium transition-all duration-300">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2">
              <ShieldCheck size={28} />
            </div>
            <h3 className="font-bold text-lg text-text-primary">Fully Insured</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Ride with peace of mind. All our scooters come with comprehensive insurance.</p>
          </div>
          <div className="bg-surface rounded-2xl shadow-soft border border-border p-6 md:p-8 flex flex-col items-center text-center gap-3 hover:-translate-y-1 hover:shadow-medium transition-all duration-300">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
              <Truck size={28} />
            </div>
            <h3 className="font-bold text-lg text-text-primary">Free Delivery</h3>
            <p className="text-sm text-text-secondary leading-relaxed">We deliver and pick up from your hotel in Ubud, Canggu, or the Airport.</p>
          </div>
          <div className="bg-surface rounded-2xl shadow-soft border border-border p-6 md:p-8 flex flex-col items-center text-center gap-3 hover:-translate-y-1 hover:shadow-medium transition-all duration-300">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-2">
              <Clock size={28} />
            </div>
            <h3 className="font-bold text-lg text-text-primary">24/7 Support</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Flat tire? Lost key? Our dedicated support team is available around the clock.</p>
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="container mx-auto px-4 lg:max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Our Fleet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockScooters.map(scooter => (
            <ListingCard key={scooter.id} item={scooter} linkTo={`/scooter/${scooter.id}`} />
          ))}
        </div>
      </section>

    </div>
  );
}
