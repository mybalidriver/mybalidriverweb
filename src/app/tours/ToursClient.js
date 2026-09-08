"use client";

import React, { useState } from "react";
import ListingCard from "@/components/listing/ListingCard";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { generateSlug } from "@/lib/utils";

export default function ToursClient({ initialTours }) {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const categories = ["All", "Adventure", "Water", "Nature", "Culture"];

  const displayTours = activeCategory === "All" 
    ? initialTours 
    : initialTours.filter(t => {
        const cat = t.category || t.data?.category || "";
        return cat.toLowerCase() === activeCategory.toLowerCase();
      });

  return (
    <div className="w-full bg-background min-h-[100dvh] pt-24 pb-20">
      <div className="container mx-auto px-4 lg:max-w-5xl">
        
        {/* Search Bar & Filter Button */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center px-5 py-3 h-[60px] cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
            <Search size={22} className="text-text-primary mr-4 stroke-[2.5]" />
            <div className="flex flex-col">
              <span className="text-[15px] font-extrabold text-text-primary leading-tight">Where to? Search tours...</span>
              <span className="text-[13px] font-medium text-text-secondary leading-tight mt-0.5">Anywhere • Any week • Add guests</span>
            </div>
          </div>
          
          <button className="w-[60px] h-[60px] shrink-0 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <SlidersHorizontal size={20} className="text-text-primary stroke-[2.5]" />
          </button>
        </div>

        {/* Categories Row */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-extrabold text-[15px] transition-all active:scale-95 ${
                activeCategory === cat 
                  ? "bg-[#2A2A2A] text-white shadow-md" 
                  : "bg-white text-text-secondary hover:bg-gray-50 border border-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Info Row */}
        <div className="flex justify-between items-center mb-6">
          <span className="font-medium text-text-secondary text-[15px]">Showing {displayTours.length} Tours</span>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-[15px] font-semibold bg-white px-4 py-2 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm">
              Recommended <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* 2-Column Grid (Mobile & Desktop identical to layout request) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayTours.map(tour => (
            <ListingCard key={tour.id} item={tour} linkTo={`/tours/${generateSlug(tour.title)}`} />
          ))}
        </div>
        
        {displayTours.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button className="rounded-full bg-white text-text-primary px-8 py-3 border border-gray-200 hover:bg-gray-50 font-extrabold transition-colors shadow-sm text-[15px]">
              Load More Experiences
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
