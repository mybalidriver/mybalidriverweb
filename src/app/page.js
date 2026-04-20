"use client";

import React, { useState, useEffect } from "react";
import { TreePine, Umbrella, Mountain, Droplets, Search, Plane, Building, Building2, Train, Bus, BriefcaseBusiness, Heart, HeartOff, MapPin, Map, Car, Bike, Wifi, Navigation, Sparkles, Landmark, Camera, Waves, Compass, ChevronDown, ChevronLeft, ChevronRight, Settings2, Star, Zap } from "lucide-react";
import { TourIcon, SpaIcon, TransportIcon, ScooterIcon, ThinSparklesIcon, TowelsIcon, LotusIcon } from "@/components/icons/CategoryIcons";
import ListingCard from "@/components/listing/ListingCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  { id: "Tour", icon: TourIcon },
  { id: "Massage", icon: SpaIcon },
  { id: "Scooter", icon: ScooterIcon },
  { id: "Esim", icon: Wifi },
  { id: "Transport", icon: TransportIcon },
];

const getCategoriesForService = (service) => {
  if (service === "Tour") {
    return [
      { id: "All", icon: Compass },
      { id: "Adventure", icon: Mountain },
      { id: "Water", icon: Waves },
      { id: "Nature", icon: TreePine },
      { id: "Culture", icon: Landmark },
      { id: "Instagram", icon: Camera }
    ];
  } else if (service === "Massage") {
    return [
      { id: "All", icon: ThinSparklesIcon },
      { id: "In-Villa Spa", icon: TowelsIcon },
      { id: "Day Spa", icon: LotusIcon }
    ];
  } else if (service === "Transport") {
    return [
      { id: "All", icon: Compass },
      { id: "Airport", icon: Plane },
      { id: "Daily", icon: Car }
    ];
  } else if (service === "Scooter") {
    return [
       { id: "All", icon: Bike },
       { id: "Automatic", icon: Zap },
       { id: "Manual", icon: Settings2 }
    ];
  } else if (service === "Esim") {
    return [
      { id: "All", icon: Wifi },
      { id: "Daily", icon: MapPin },
      { id: "Monthly", icon: Map }
    ];
  }
  return [{ id: "All", icon: Compass }];
};

const campaigns = [
  {
    id: 1,
    title: "Ubud Heritage",
    subtitle: "Experience the lush green beauty of Tegalalang.",
    badge: "Exclusive",
    image: "https://images.unsplash.com/photo-1536152470836-b943b246224c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Ubud Wellness\nRetreat",
    subtitle: "Complimentary 60-min massage with any villa booking.",
    badge: "Best Deal",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Nusa Penida\nIsland Hopper",
    subtitle: "Fast boat & tour package starting at $49.",
    badge: "Limited Time",
    image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80",
  }
];

const popularTrips = [];



export default function Home() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState("All");
  const [activeService, setActiveService] = useState("Tour");
  const [currentCampIdx, setCurrentCampIdx] = useState(0);
  
  // Custom event listeners to sync with Desktop Navbar.js
  useEffect(() => {
    const handleService = (e) => {
      setActiveService(e.detail);
      setActiveCat("All");
      setSearchQuery("");
    };
    const handleSearch = (e) => {
      setSearchQuery(e.detail);
    };
    window.addEventListener('serviceChanged', handleService);
    window.addEventListener('searchQueryChanged', handleSearch);
    return () => {
      window.removeEventListener('serviceChanged', handleService);
      window.removeEventListener('searchQueryChanged', handleSearch);
    };
  }, []);
  
  // New States for Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState([0, 5000000]);
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);

  // Dynamic Data from Admin
  const [allListings, setAllListings] = useState([]);

  useEffect(() => {
    const fetchPublicListings = async () => {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.from('listings').select('*').eq('status', 'Active');
      if (data) {
         const publicItems = data.map(d => ({
           id: d.id,
           service: d.type,
           title: d.title,
           location: d.location,
           price: d.price,
           duration: d.duration,
           category: d.category,
           rating: d.rating,
           reviews: d.reviews,
           status: d.status,
           image: d.image,
           company: d.company_name,
           ...(d.data || {}) // Spread gallery, itinerary, pins, etc.
         }));
         setAllListings(publicItems);
      }
    };
    fetchPublicListings();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("bali_places_v3");
    if (saved) {
      setRecommendedPlaces(JSON.parse(saved).filter(p => p.status === 'Published'));
    } else {
      const initialPlaces = [];
      setRecommendedPlaces(initialPlaces);
      localStorage.setItem("bali_places_v3", JSON.stringify(initialPlaces));
    }
  }, []);

  const nextCamp = () => setCurrentCampIdx((prev) => (prev + 1) % campaigns.length);
  const prevCamp = () => setCurrentCampIdx((prev) => (prev - 1 + campaigns.length) % campaigns.length);

  const currentCategories = getCategoriesForService(activeService);

  let filteredTours = activeCat === "All" 
    ? allListings.filter(t => t.service === activeService) 
    : allListings.filter(t => t.service === activeService && t.category === activeCat);

  // Apply Text Search Filter
  if (searchQuery) {
    const lowerQ = searchQuery.toLowerCase();
    filteredTours = filteredTours.filter(t => 
      t.title.toLowerCase().includes(lowerQ) || t.location.toLowerCase().includes(lowerQ)
    );
  }

  // Apply Price Filter
  filteredTours = filteredTours.filter(t => t.price >= priceFilter[0] && t.price <= priceFilter[1]);

  const pinnedCampaigns = allListings.filter(t => t.isCampaignPinned).map((t, idx) => ({
    id: t.id || idx,
    title: t.campaignTitle || t.title,
    subtitle: t.campaignDescription || t.location,
    badge: "Featured Deal",
    image: t.image || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    targetId: t.id
  }));
  const displayCampaigns = pinnedCampaigns.length > 0 ? pinnedCampaigns : campaigns;

  const bestTrips = allListings.filter(t => t.isBestTripPinned && t.service === activeService);
  const displayPopularTrips = bestTrips.length > 0 ? bestTrips : popularTrips;

  // Suggestions for smart keyboard integration
  const availableSuggestions = Array.from(new Set(
     allListings.filter(t => t.service === activeService).flatMap(t => [t.title, t.location])
  ));
  
  const searchSuggestions = availableSuggestions
      .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);

  const getPopularTripsTitle = () => {
    if (activeService === "Tour") return "Unforgettable Journeys";
    if (activeService === "Massage") return "Curated Wellness";
    return `Top Picks for ${activeService}`;
  };

  return (
    <div className="w-full bg-background min-h-[100dvh] font-sans pb-32">

      {/* Mobile Top Header Search (Hidden on Desktop) */}
      <div className="md:hidden pt-4 pb-2 relative z-40 bg-background">
        
        {/* App-like Service Filter (Above Search Bar) */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 px-6 pb-5 hide-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {services.map((s) => {
            const Icon = s.icon;
            const isActive = activeService === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (s.id === "Transport") {
                    router.push("/map?service=Transport");
                    return;
                  }
                  setActiveService(s.id);
                  setActiveCat("All");
                  setSearchQuery("");
                  
                  if (s.id === "Scooter") {
                     setTimeout(() => {
                         const el = document.getElementById("categories-section");
                         if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                     }, 50);
                  }
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full shrink-0 transition-all active:scale-95 outline-none shadow-sm border ${isActive ? 'bg-accent border-accent text-primary' : 'bg-[#F8FAFC] border-[#F8FAFC] text-text-secondary hover:bg-gray-50'}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-primary' : 'text-text-secondary'}/>
                <span className={`text-[15px] font-bold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>{s.id}</span>
              </button>
            )
          })}
        </div>

        <div className="px-6 relative">
          <div className="flex items-center bg-white border border-border shadow-soft rounded-full pl-4 pr-2 py-2 relative">
            <Search size={18} className="text-text-secondary shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder={`Search ${activeService.toLowerCase()}s...`}
              className="flex-1 min-w-0 outline-none text-[15px] font-medium bg-transparent text-primary placeholder:text-text-secondary pr-2"
            />
            
            {/* Filter Modal Toggle */}
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className={`w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all active:scale-95 bg-accent text-primary hover:scale-105`}
            >
               <Settings2 size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Search Autocomplete Dropdown */}
          {isSearchFocused && searchQuery.length > 0 && (
            <div className="absolute top-[100%] mt-2 left-6 right-6 bg-white rounded-2xl p-2 shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200 z-[60]">
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((loc, idx) => (
                   <button 
                     key={idx}
                     onClick={() => { setSearchQuery(loc); setIsSearchFocused(false); }}
                     className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                   >
                     {allListings.some(t => t.location === loc) ? <MapPin size={16} className="text-secondary" /> : <Search size={16} className="text-secondary" />}
                     <span className="font-bold text-[14px] text-primary truncate block flex-1">{loc}</span>
                   </button>
                ))
              ) : (
                  <div className="px-4 py-3 text-[14px] text-text-secondary font-medium text-center">
                    No places found
                  </div>
              )}
            </div>
          )}
        </div>
      </div>
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
                 Show {filteredTours.length} Results
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile-only Campaign Swipe Carousel */}
      <section className="md:hidden pt-2 pb-6 relative">
        <div 
          className="flex overflow-x-auto no-scrollbar gap-4 px-6 snap-x snap-mandatory"
          onScroll={(e) => {
            const index = Math.round(e.target.scrollLeft / e.target.clientWidth);
            if (index !== currentCampIdx) setCurrentCampIdx(index);
          }}
        >
          {displayCampaigns.map((camp, idx) => (
            <div key={camp.id} className="relative w-full shrink-0 snap-center aspect-[4/3] rounded-[28px] overflow-hidden shadow-soft border border-border bg-black select-none">
              <img src={camp.image} alt={camp.badge} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-[#1C1C1E]/40 to-transparent z-0" />
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 via-transparent to-transparent opacity-60 mix-blend-color-dodge animate-pulse z-0" />
              
              {/* Badge positioned perfectly inside bounds */}
              <div className="absolute top-4 left-4 z-20">
                <span className="inline-block px-3 py-1.5 bg-accent text-primary text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest shadow-sm rounded-[8px]">{camp.badge}</span>
              </div>
              
              {/* Text and button positioned perfectly inside bounds */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-5 flex flex-col justify-end items-start pointer-events-none">
                <h3 className="text-[26px] sm:text-[32px] font-extrabold text-white leading-[1.05] mb-2 font-sans tracking-tight whitespace-pre-line drop-shadow-lg">{camp.title}</h3>
                <p className="text-white/90 text-[13px] sm:text-[15px] font-medium mb-4 leading-snug drop-shadow-md">{camp.subtitle}</p>
                
                <Link href={camp.targetId ? `/tours/${camp.targetId}` : "#"} className="bg-white text-primary px-6 py-3 rounded-full font-bold text-[14px] shadow-xl active:scale-95 transition-transform flex items-center justify-center pointer-events-auto">
                  View Detail
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center mt-5 gap-2 items-center">
          {campaigns.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => {
                setCurrentCampIdx(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 pointer-events-none ${idx === currentCampIdx ? 'w-5 bg-accent' : 'w-1.5 bg-border'}`}
            />
          ))}
        </div>
      </section>

      {/* Desktop/iPad Cinematic Campaign Slider (Card Style) */}
      <section className="hidden md:block px-6 pt-5 mb-12 max-w-[1240px] mx-auto relative">
        <div className="relative w-full aspect-[2.5/1] rounded-[32px] overflow-hidden bg-black group shadow-medium border border-border">
          {displayCampaigns.map((camp, idx) => (
            <div 
              key={camp.id} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentCampIdx ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}
            >
              <img src={camp.image} alt={camp.badge} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] ease-linear ${idx === currentCampIdx ? 'scale-110' : 'scale-100'}`} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1E]/90 via-[#1C1C1E]/50 to-transparent z-0" />
              <div className="absolute inset-0 bg-gradient-to-tl from-accent/30 via-transparent to-transparent opacity-50 mix-blend-color-dodge animate-pulse z-0" />
              
              <div className="absolute top-0 left-12">
                <span className="inline-block px-5 py-2.5 bg-accent text-primary text-[12px] font-extrabold uppercase tracking-widest shadow-sm rounded-b-[12px]">{camp.badge}</span>
              </div>
              
              <div className="relative z-10 p-12 pr-6 flex flex-col h-full justify-center w-[60%] items-start">
                <h3 className="text-[44px] lg:text-[54px] font-extrabold text-white leading-[1.05] mb-4 font-sans tracking-tight whitespace-pre-line drop-shadow-xl">{camp.title}</h3>
                <p className="text-white/90 text-[16px] lg:text-[18px] font-medium mb-8 leading-normal max-w-sm drop-shadow-md">{camp.subtitle}</p>
                
                <Link href={camp.targetId ? `/tours/${camp.targetId}` : "#"} className="bg-white text-primary px-10 py-4 rounded-full font-bold text-[15px] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center hover:bg-gray-50 hover:shadow-2xl">
                  View Detail
                </Link>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <div className="absolute bottom-10 right-10 z-20 flex gap-3">
            <button 
              onClick={prevCamp}
              className="w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all active:scale-95"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextCamp}
              className="w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all active:scale-95"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="absolute bottom-12 left-12 z-20 flex gap-2 items-center">
            {displayCampaigns.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentCampIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentCampIdx ? 'w-8 bg-accent' : 'w-2 bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto">

        {/* Popular Trips */}
        <section className="pt-2 mb-8 relative">
          <div className="px-6 flex justify-between items-end mb-4">
            <h2 className="text-[20px] font-bold text-primary flex items-center gap-2">
              {getPopularTripsTitle()}
            </h2>
            <Link 
              href={activeService === "Tour" ? "/tours" : activeService === "Massage" ? "/spa" : activeService === "Transport" ? "/map" : activeService === "Scooter" ? "/scooter" : "/esim"}
              className="text-sm font-semibold text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
            >
              See more
            </Link>
          </div>

          {/* Horizontal Scroll Area */}
          <div className="flex overflow-x-auto no-scrollbar gap-5 px-6 pb-6 snap-x snap-mandatory hide-scroll">
            {displayPopularTrips.length > 0 ? displayPopularTrips.map((trip) => (
              <Link href={`/tours/${trip.id}`} key={trip.id} className="block relative w-[240px] md:w-[280px] aspect-[4/5] rounded-[28px] overflow-hidden shadow-soft shrink-0 snap-start group border border-border bg-white">
                <img src={trip.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] ease-out group-hover:scale-110" alt={trip.title} />

                {/* Heart Button */}
                <button className="absolute top-4 right-4 w-[34px] h-[34px] bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 shadow-xl z-10 transition-transform active:scale-95 hover:text-red-500 hover:scale-110">
                  <Heart size={16} strokeWidth={2.5} />
                </button>

                {/* Bottom Overlay Card */}
                <div className="absolute left-3 right-3 bottom-3 bg-white/95 backdrop-blur-md px-4 py-3.5 rounded-2xl flex flex-col gap-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                  <h3 className="font-extrabold text-[15px] leading-snug text-primary line-clamp-2">{trip.title}</h3>
                  <div className="flex justify-between items-end mt-1">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Star size={12} strokeWidth={2.5} className="fill-[#F59E0B] text-[#F59E0B]" />
                      <span className="text-[12px] font-bold text-primary">5.0</span>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="font-extrabold text-[15px] text-primary tracking-tight pr-1">
                        IDR {Number(trip.price).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="w-full text-center py-6 text-gray-400 font-medium text-sm">
                 No items pinned as Best Trips for this category.
              </div>
            )}
          </div>
        </section>


        {/* Categories */}
        <section id="categories-section" className="px-6 mb-8 mt-2">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[20px] font-bold text-primary">Categories</h2>
            <span className="text-sm font-semibold text-text-secondary">See more</span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
            {currentCategories.map((c) => {
              const Icon = c.icon;
              const isActive = activeCat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full shrink-0 transition-all active:scale-95 touch-manipulation select-none cursor-pointer outline-none font-bold shadow-sm border ${isActive ? "bg-accent border-accent text-primary" : "bg-[#F1F5F9] border-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                    }`}
                >
                  <Icon size={20} className={isActive ? "text-primary" : "text-[#475569]"} strokeWidth={1.25} />
                  <span className="text-[14px] font-bold">{c.id}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Filtered Experiences */}
        <section className="mt-6 mb-12">
          <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-5 px-6 pb-8 md:grid md:grid-cols-3 md:px-6 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {filteredTours.length > 0 ? (
              filteredTours.map(tour => (
                <div key={tour.id} className="flex-none w-[85vw] sm:w-[300px] snap-center md:w-auto md:snap-align-none animate-in fade-in zoom-in duration-300">
                  <ListingCard item={tour} linkTo={`/tours/${tour.id}`} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-10 px-6 text-text-secondary font-medium">
                No tours found for this category currently.
              </div>
            )}
          </div>
        </section>

        {/* Recommended Places */}
        <section className="px-6 mb-20">
          <div className="flex justify-between items-end mb-4 md:mb-6">
            <h2 className="text-[20px] font-bold text-primary">Recommended Places</h2>
            <span className="text-sm font-semibold text-text-secondary hover:text-text-primary cursor-pointer transition-colors">See more</span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 snap-x snap-mandatory">
            {recommendedPlaces.map((place, index) => (
              <Link href={place.slug || "#"} key={place.id} className={`block relative rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] group cursor-pointer border border-border shrink-0 snap-center ${index === 0 ? 'w-[85vw] md:w-auto md:col-span-2 aspect-[4/3] md:aspect-[2/1]' : 'w-[200px] md:w-auto aspect-[3/4] md:aspect-square'}`}>
                <img src={place.image || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800'} alt={place.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-block px-3 py-1.5 bg-white/20 backdrop-blur-md text-white border border-white/20 text-[10px] font-extrabold uppercase tracking-widest shadow-sm rounded-xl">{place.category || 'Featured'}</span>
                </div>

                {/* Bottom Content Frosted Glass Pane */}
                <div className="absolute bottom-3 inset-x-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] p-4 flex flex-col z-20 transition-all duration-300 group-hover:bg-white/20">
                  <h3 className={`font-black text-white leading-tight ${index === 0 ? 'text-[18px] md:text-[22px]' : 'text-[14px] line-clamp-2'}`}>{place.title}</h3>
                  <div className="flex items-center gap-1.5 mt-2 opacity-90 text-white">
                    <MapPin size={12} className="shrink-0" />
                    <span className="text-[11px] font-bold tracking-wide uppercase truncate">{place.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
