"use client";

import React from "react";
import { Heart, Search } from "lucide-react";
import WishlistCard from "@/components/listing/WishlistCard";

export default function FavoritesPage() {
  // Clear persistent cache on mount so new payload data works in admin (Dev hack only)
  React.useEffect(() => {
    localStorage.removeItem("bali_bookings");
    localStorage.removeItem("bali_dashboard");
  }, []);

  const favorites = [
    { id: '1', service: 'Tour', title: 'Mount Batur Sunrise Trekking & Hot Springs', location: 'Kintamani', rating: 4.8, reviews: 215, price: 35, date: 'Starts 2:00 AM', category: 'Adventure', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80' },
    { id: 'm4', service: 'Massage', title: 'Couples Luxury Spa Experience', location: 'Nusa Dua', rating: 5.0, reviews: 42, price: 150, date: 'Booking required', category: 'Real Spa', image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=800&q=80', badge: 'Luxury' },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F8FAFC] pb-32 font-sans">
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-black text-[#1C1C1E] mb-6 tracking-tight">Saved Trips</h1>
        
        <div className="bg-white rounded-2xl flex gap-3 items-center px-5 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E8EAEF] mb-8">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search your favorites..." 
            className="flex-1 outline-none font-bold text-[14px] bg-transparent text-[#1C1C1E] placeholder:text-gray-400 placeholder:font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((tour) => (
            <WishlistCard key={tour.id} item={tour} linkTo={`/tours/${tour.id}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
