"use client";

import React, { useState } from "react";
import ListingCard from "@/components/listing/ListingCard";
import { Search, SlidersHorizontal, ChevronDown, MapPin } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ToursClient({ initialTours }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState([0, 5000000]);
  
  const categories = ["All", "Adventure", "Water", "Nature", "Culture"];

  const displayTours = activeCategory === "All" 
    ? initialTours 
    : initialTours.filter(t => {
        const cat = t.category || t.data?.category || "";
        return cat.toLowerCase() === activeCategory.toLowerCase();
      });

  return (
    <div className="w-full bg-background min-h-[100dvh] pt-0 pb-20 -mt-20 md:-mt-24">
      <div className="container mx-auto px-4 lg:max-w-5xl">
        
        {/* Sticky Header Wrapper */}
        <div className="sticky top-0 z-40 bg-background pt-4 pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Search Bar & Filter Button */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center px-5 py-3 h-[60px] cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
              <Search size={22} className="text-text-primary mr-4 stroke-[2.5]" />
              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold text-text-primary leading-tight">Where to? Search tours...</span>
                <span className="text-[13px] font-medium text-text-secondary leading-tight mt-0.5">Anywhere • Any week • Add guests</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="w-[60px] h-[60px] shrink-0 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={20} className="text-text-primary stroke-[2.5]" />
            </button>
          </div>

          {/* Categories Row */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
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
          {displayTours.map((tour, idx) => (
            <ListingCard key={tour.id} item={tour} linkTo={`/tours/${generateSlug(tour.title)}`} isGrid={true} priority={idx < 6} />
          ))}
        </div>
        
        {displayTours.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button className="rounded-full bg-white text-text-primary px-8 py-3 border border-gray-200 hover:bg-gray-50 font-extrabold transition-colors shadow-sm text-[15px]">
              Load More Experiences
            </button>
          </div>
        )}

        {/* Apple-style Filter Bottom Sheet */}
        <AnimatePresence>
          {isFilterModalOpen && (
            <div className="fixed inset-0 z-[100] flex flex-col justify-end">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsFilterModalOpen(false)}
              />

              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
                className="bg-white w-full rounded-t-[32px] p-6 relative flex flex-col pointer-events-auto h-fit pb-12"
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[22px] font-extrabold text-primary tracking-tight">Filters</h3>
                  <button onClick={() => setPriceFilter([0, 5000000])} className="text-secondary font-bold text-[15px] active:scale-95 transition-transform">Reset</button>
                </div>

                {/* Price Filter Options */}
                <div className="mb-8">
                  <h4 className="text-[17px] font-extrabold text-primary mb-4">Price Range</h4>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Any price", min: 0, max: 5000000 },
                      { label: "Under Rp 500k", min: 0, max: 500000 },
                      { label: "Rp 500k - Rp 1M", min: 500000, max: 1000000 },
                      { label: "Over Rp 1M+", min: 1000000, max: 5000000 },
                    ].map((opt, i) => {
                      const isSelected = priceFilter[0] === opt.min && priceFilter[1] === opt.max;
                      return (
                        <label key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all w-full cursor-pointer touch-manipulation active:scale-[0.98] ${isSelected ? 'border-primary bg-primary text-white shadow-md' : 'border-border bg-white text-primary hover:border-gray-300'}`}>
                          <span className="font-bold text-[15px]">{opt.label}</span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'border-none bg-accent' : 'border border-gray-300'}`}>
                            {isSelected && <MapPin size={12} className="text-primary" strokeWidth={3} />}
                          </div>
                          <input type="radio" className="hidden" name="price" checked={isSelected} onChange={() => setPriceFilter([opt.min, opt.max])} />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-full bg-accent text-primary font-extrabold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex justify-center items-center gap-2 mb-2"
                >
                  Show {displayTours.length} Results
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
