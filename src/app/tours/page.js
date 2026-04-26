import React from "react";
import ListingCard from "@/components/listing/ListingCard";
import UniversalSearchBar from "@/components/search/UniversalSearchBar";
import { Filter, ChevronDown, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';


const SidebarFilter = ({ title, options }) => (
  <div className="mb-6 border-b border-border pb-6 last:border-0 last:pb-0">
    <h3 className="font-bold mb-4">{title}</h3>
    <div className="flex flex-col gap-3">
      {options.map((opt, i) => (
        <label key={i} className="flex items-center gap-3 cursor-pointer group">
          <div className="w-5 h-5 rounded border border-border flex items-center justify-center group-hover:border-accent transition-colors text-white bg-transparent">
            {/* Checked icon placeholder */}
          </div>
          <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">{opt.label}</span>
          {opt.count && <span className="ml-auto text-xs text-text-secondary bg-background px-2 py-0.5 rounded-full">{opt.count}</span>}
        </label>
      ))}
    </div>
  </div>
);

export default async function Tours() {
  const { data: tours } = await supabase
    .from('listings')
    .select('*')
    .eq('type', 'Tour')
    .eq('status', 'Active')
    .order('created_at', { ascending: false });

  const displayTours = tours || [];

  return (
    <div className="w-full bg-background min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 lg:max-w-7xl">
        
        {/* Header & Search */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Bali Tours</h1>
          <p className="text-text-secondary mb-8">Discover and book the most epic adventures on the island.</p>
          <div className="bg-surface p-2 rounded-3xl shadow-sm mb-8 inline-block max-w-full lg:min-w-[800px]">
            <UniversalSearchBar />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-surface rounded-2xl border border-border shadow-soft p-5 sticky top-24">
              <div className="flex items-center gap-2 font-bold text-lg border-b border-border pb-4 mb-4">
                <Filter size={20} />
                <span>Filters</span>
              </div>
              
              <SidebarFilter 
                title="Category" 
                options={[
                  { label: "Nature & Adventure", count: 42 },
                  { label: "Culture & Temples", count: 28 },
                  { label: "Island Hopping", count: 15 },
                  { label: "Water Sports", count: 34 },
                ]} 
              />
              
              <SidebarFilter 
                title="Location" 
                options={[
                  { label: "Ubud", count: 56 },
                  { label: "Nusa Penida", count: 23 },
                  { label: "Uluwatu", count: 19 },
                  { label: "Kintamani / Mount Batur", count: 12 },
                ]} 
              />

              <button className="w-full rounded-full bg-primary text-white font-medium py-3 hover:bg-black/80 transition-colors shadow-md mt-2">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Main Listings */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-text-secondary text-sm">Showing {displayTours.length} Tours</span>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Sort by:</span>
                <button className="flex items-center gap-1 text-sm font-semibold bg-surface px-4 py-2 rounded-xl border border-border hover:bg-surface-hover transition-colors">
                  Recommended <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTours.map(tour => (
                <ListingCard key={tour.id} item={tour} linkTo={`/tours/${tour.id}`} />
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <button className="rounded-full bg-surface text-text-primary px-8 py-3 border border-border hover:bg-surface-hover font-semibold transition-colors shadow-sm">
                Load More Experiences
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
