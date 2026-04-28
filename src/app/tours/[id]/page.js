"use client";

import React, { useState } from "react";
import { ChevronLeft, Share, Heart, Star, Calendar, Clock, Plane, Building, Utensils, User, Bus, ArrowRight, MoreVertical, CheckCircle2, Languages, Car, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ListingCard from "@/components/listing/ListingCard";
import BookingModal from "@/components/booking/BookingModal";



export default function TourDetail({ params }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const [activeTab, setActiveTab] = useState("About this activity");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [desktopPax, setDesktopPax] = useState(1);
  const [desktopDate, setDesktopDate] = useState("");
  const [modalStartStep, setModalStartStep] = useState(1);
  const [tourData, setTourData] = useState(null);
  const [spaDuration, setSpaDuration] = useState('min60');
  const [scooterDuration, setScooterDuration] = useState('daily');
  const [selectedPackage, setSelectedPackage] = useState('Standard');

  const getMultiplierPrice = (rawPrice) => {
    const p = Number(rawPrice);
    if (!p) return 0;
    return Math.floor(p > 1000 ? p : p * 1000);
  };

  const getUnitDynamicPrice = () => {
    if (!tourData) return 0;
    if (tourData.service === "Spa") {
        return getMultiplierPrice(tourData[spaDuration] || tourData.price);
    }
    if (tourData.service === "Scooter") {
        const keyMap = { daily: 'dailyPrice', weekly: 'weeklyPrice', monthly: 'monthlyPrice' };
        return getMultiplierPrice(tourData[keyMap[scooterDuration]] || tourData.price);
    }
    
    let basePrice = getMultiplierPrice(tourData.price);
    if (tourData.pricingType === "Per Person" && tourData.tourTiers) {
       const sortedTiers = [...tourData.tourTiers].sort((a, b) => Number(b.pax) - Number(a.pax));
       const tier = sortedTiers.find(t => desktopPax >= Number(t.pax));
       if (tier) basePrice = getMultiplierPrice(tier.price);
    }
    return basePrice;
  };

  const getAllInclusivePriceForPax = (pax) => {
      if (!tourData) return 0;
      let aiPrice = getMultiplierPrice(tourData.allInclusiveSurcharge);
      if (tourData.allInclusiveTiers && tourData.allInclusiveTiers.length > 0) {
          const sortedTiers = [...tourData.allInclusiveTiers].sort((a, b) => Number(b.pax) - Number(a.pax));
          const aiTier = sortedTiers.find(t => pax >= Number(t.pax));
          if (aiTier) aiPrice = getMultiplierPrice(aiTier.price);
      }
      return aiPrice;
  };

  const getTotalPrice = () => {
     if (!tourData) return 0;
     let total = 0;
     if (tourData.service === "Spa" || tourData.service === "Scooter") {
        total = getUnitDynamicPrice() * desktopPax;
     } else {
        let baseUnit = getUnitDynamicPrice();
        if (selectedPackage === "All Inclusive" && (tourData.hasAllInclusive || tourData.allInclusiveSurcharge)) {
           baseUnit = getAllInclusivePriceForPax(desktopPax);
           if (tourData.allInclusiveTiers && tourData.allInclusiveTiers.length > 0) {
              total = baseUnit; // Tiers are total prices
           } else {
              total = baseUnit * desktopPax; // Fallback to multiplying surcharge
           }
        } else {
           if (tourData.pricingType === "Per Group") {
              total = baseUnit;
           } else if (tourData.tourTiers && tourData.tourTiers.length > 0) {
              total = baseUnit; // Tiers are total prices
           } else {
              total = baseUnit * desktopPax;
           }
        }
     }
     return total;
  };

  React.useEffect(() => {
    const fetchDetail = async () => {
       const { supabase } = await import('@/lib/supabase');
       const { data, error } = await supabase.from('listings').select('*').eq('id', resolvedParams.id).single();
       if (data) {
          const frontendObj = {
             id: data.id,
             service: data.type,
             title: data.title,
             location: data.location,
             price: data.price,
             duration: data.duration,
             category: data.category,
             rating: data.rating,
             reviews: data.reviews,
             status: data.status,
             image: data.image,
             company: data.company_name,
             ...(data.data || {})
          };

          const defaultImg = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80";
          const coverImg = frontendObj.image || defaultImg;
          const validGallery = (frontendObj.gallery || []).filter(img => img && img.trim() !== "");
          
          const fallbackGallery = [
             "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=800&q=80", // Ubud Monkey Forest
             "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80", // Mount Batur
             "https://images.unsplash.com/photo-1554481923-a6918bd997bc?auto=format&fit=crop&w=800&q=80", // Nusa Penida
             "https://images.unsplash.com/photo-1610486829777-66a96e949cb3?auto=format&fit=crop&w=800&q=80"  // Gates of Heaven
          ];

          let allImages = [coverImg, ...validGallery];
          if (allImages.length < 5) {
             const needed = 5 - allImages.length;
             allImages = [...allImages, ...fallbackGallery.slice(0, needed)];
          }
          frontendObj.images = allImages;
          
          let calculatedMinPax = 1;
          if (frontendObj.pricingType === "Per Person" && frontendObj.tourTiers && frontendObj.tourTiers.length > 0) {
             const validTiers = frontendObj.tourTiers.filter(t => t.price && Number(t.price) > 0);
             if (validTiers.length > 0) {
                calculatedMinPax = Math.min(...validTiers.map(t => Number(t.pax)));
             }
          }
          frontendObj.minPax = calculatedMinPax;
          
          setTourData(frontendObj);
          setDesktopPax(calculatedMinPax);
       }
    };
    fetchDetail();
  }, [resolvedParams.id]);

  const tabs = ["About this activity", "Experience", "Itinerary", "Important information"];

  if (!tourData) {
     return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-background">
         <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
         <p className="font-bold text-gray-500">Loading Details...</p>
       </div>
     );
  }

  return (
    <div className="-mt-20 md:-mt-24 w-full bg-background min-h-[100dvh] relative pb-[120px] md:pb-0">
      
      {/* Mobile View: Edge-to-Edge Image Gallery with Floating Controls */}
      <div className="relative w-full overflow-hidden h-[55vh] md:hidden z-20 bg-background">
        <div className="flex overflow-x-auto snap-x snap-mandatory h-full no-scrollbar">
          {tourData.images.map((img, idx) => (
             <div key={idx} className="min-w-full h-full snap-center relative">
               <img src={img} alt={`${tourData.title} Image ${idx + 1}`} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
               <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>
             </div>
          ))}
        </div>
        
        <div className="absolute top-0 left-0 right-0 w-full p-6 pt-[calc(env(safe-area-inset-top)+20px)] flex justify-between items-center z-30 pointer-events-none">
          <button onClick={() => router.back()} className="pointer-events-auto w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <ChevronLeft size={24} className="text-primary pr-0.5" strokeWidth={2.5} />
          </button>
          <div className="flex gap-3 pointer-events-auto">
            <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
              <Share size={20} className="text-primary" strokeWidth={2.5} />
            </button>
            <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
              <Heart size={20} className="text-primary" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop View: Apple-Style Rounded Card Gallery */}
      <div className="hidden md:flex flex-col w-full max-w-[1240px] mx-auto px-6 pt-[90px] mb-4">
        
        {/* Clean Header Row for Back/Share/Save */}
        <div className="flex justify-between items-center mb-5 pb-1">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[15px] font-bold text-primary hover:text-accent transition-colors group">
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
            Back
          </button>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-[14px] font-bold text-primary hover:text-text-secondary transition-colors">
              <Share size={18} strokeWidth={2.5} /> Share
            </button>
            <button className="flex items-center gap-2 text-[14px] font-bold text-primary hover:text-text-secondary transition-colors">
              <Heart size={18} strokeWidth={2.5} /> Save
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="h-[55vh] min-h-[450px] max-h-[550px] w-full rounded-[32px] overflow-hidden relative">
          <div 
             className="grid grid-rows-2 gap-2 h-full w-full overflow-x-auto no-scrollbar"
             style={{ 
               gridAutoFlow: 'column', 
               gridAutoColumns: tourData.images.length > 5 ? 'calc(23% - 6px)' : 'calc(25% - 6px)' 
             }}
          >
            <div className="col-span-2 row-span-2 relative group overflow-hidden cursor-pointer">
              <img src={tourData.images[0]} alt="Hero Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
            </div>
            {tourData.images.slice(1).map((img, idx) => (
              <div key={idx} className="relative group overflow-hidden cursor-pointer">
                 <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95 group-hover:opacity-100" />
                 <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area - Get Your Guide Dual Column Layout */}
      <div className={`relative z-30 rounded-t-[32px] md:rounded-none -mt-6 md:mt-0 pt-8 md:pt-6 pb-12 w-full mx-auto ${tourData.service === "Spa" ? "bg-[#fdfbf7]" : "bg-white"}`}>
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Details */}
          <div className="w-full md:w-[65%] lg:w-[68%]">
            
            {/* Title Section */}
            <div className="mb-8 flex flex-col">
              <h1 className={`leading-[1.2] mb-3 text-balance ${tourData.service === "Spa" ? "text-[32px] md:text-[42px] font-serif tracking-tight text-[#3d3730]" : "text-[28px] md:text-[36px] font-extrabold text-primary"}`}>{selectedPackage === "All Inclusive" && tourData.inclusiveTitle ? tourData.inclusiveTitle : tourData.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <Star size={16} className={tourData.service === "Spa" ? "fill-[#C1A88A] text-[#C1A88A]" : "fill-accent text-accent"} />
                  <span className={`font-bold text-[15px] ${tourData.service === "Spa" ? "text-[#3d3730]" : "text-primary"}`}>{Number(tourData.rating).toFixed(1)}</span>
                  <span className="text-text-secondary text-[13px] underline cursor-pointer hover:text-text-primary">({tourData.reviews || 0} reviews)</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className={`font-medium text-[14px] hover:underline cursor-pointer ${tourData.service === "Spa" ? "text-[#C1A88A]" : "text-text-secondary"}`}>{tourData.location}</span>
              </div>
            </div>
            
            {/* Scrollable Tabs */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 -mx-6 px-6 md:mx-0 md:px-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2.5 px-5 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${
                      isActive 
                        ? (tourData.service === "Spa" ? "bg-[#A48F7A] text-white shadow-sm" : "bg-accent text-primary shadow-sm")
                        : (tourData.service === "Spa" ? "bg-[#f0ede6] hover:bg-[#e6e2d8] text-[#8F8F99]" : "bg-surface hover:bg-surface-hover text-text-secondary")
                    }`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>

            {/* Content Section (About this activity Active) */}
            {activeTab === "About this activity" && (
              <div className="animate-in fade-in duration-300">
                <h3 className={`font-bold text-[22px] md:text-[24px] mb-6 ${tourData.service === "Spa" ? "text-[#3d3730] font-serif" : "text-primary"}`}>About this activity</h3>
                
                <div className="flex flex-col gap-6 mb-8">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 size={24} className={`${tourData.service === "Spa" ? "text-[#A48F7A]" : "text-green-500"} shrink-0 mt-0.5`} strokeWidth={2} />
                    <div className="flex flex-col">
                      <span className={`font-bold text-[16px] ${tourData.service === "Spa" ? "text-[#3d3730]" : "text-primary"}`}>Free cancellation</span>
                      <span className="text-sm font-medium text-text-secondary mt-1">Cancel up to 24 hours in advance for a full refund</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Calendar size={24} className={`${tourData.service === "Spa" ? "text-[#A48F7A]" : "text-primary"} shrink-0 mt-0.5`} strokeWidth={2} />
                    <div className="flex flex-col">
                      <span className={`font-bold text-[16px] ${tourData.service === "Spa" ? "text-[#3d3730]" : "text-primary"}`}>Reserve now & pay later</span>
                      <span className="text-sm font-medium text-text-secondary mt-1">Keep your travel plans flexible — book your spot and pay nothing today.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock size={24} className={`${tourData.service === "Spa" ? "text-[#A48F7A]" : "text-primary"} shrink-0 mt-0.5`} strokeWidth={2} />
                    <div className="flex flex-col">
                      <span className={`font-bold text-[16px] ${tourData.service === "Spa" ? "text-[#3d3730]" : "text-primary"}`}>{tourData.service === "Spa" ? "Treatment Duration" : "Duration " + tourData.duration}</span>
                      <span className="text-sm font-medium text-text-secondary mt-1">{tourData.service === "Spa" ? "Customizable treatment lengths" : "Check availability to see starting times."}</span>
                    </div>
                  </div>

                  {tourData.service === "Tour" && (
                    <>
                      <div className="flex items-start gap-4">
                        <Languages size={24} className="text-primary shrink-0 mt-0.5" strokeWidth={2} />
                        <div className="flex flex-col">
                          <span className="font-bold text-[16px] text-primary">Live tour guide</span>
                          <span className="text-sm font-medium text-text-secondary mt-1">English, Indonesian</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Car size={24} className="text-primary shrink-0 mt-0.5" strokeWidth={2} />
                        <div className="flex flex-col">
                          <span className="font-bold text-[16px] text-primary">Pickup included</span>
                          <span className="text-sm font-medium text-text-secondary mt-1">Wait in the hotel lobby 10 minutes before your scheduled pickup time.</span>
                        </div>
                      </div>
                    </>
                  )}

                  {tourData.service === "Scooter" && (
                     <div className="flex items-start gap-4">
                        <CheckCircle2 size={24} className="text-primary shrink-0 mt-0.5" strokeWidth={2} />
                        <div className="flex flex-col">
                           <span className="font-bold text-[16px] text-primary">Rental Inclusions</span>
                           <span className="text-sm font-medium text-text-secondary mt-1">Includes 2 helmets, raincoat, and reliable customer support.</span>
                        </div>
                     </div>
                  )}

                  {tourData.service === "Spa" && (
                     <div className="flex items-start gap-4">
                        <CheckCircle2 size={24} className="text-[#A48F7A] shrink-0 mt-0.5" strokeWidth={2} />
                        <div className="flex flex-col">
                           <span className="font-bold text-[16px] text-[#3d3730]">Luxury Experience</span>
                           <span className="text-sm font-medium text-text-secondary mt-1">Professional therapists using premium essential oils.</span>
                        </div>
                     </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Section (Experience Active) */}
            {activeTab === "Experience" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="font-bold text-[22px] md:text-[24px] text-primary mb-6">Experience</h3>
                <h4 className="font-bold text-[16px] text-primary mb-3">Highlights</h4>
                <ul className="list-disc pl-5 text-sm text-text-secondary font-medium mb-8 space-y-2">
                   {tourData.highlights ? tourData.highlights.split('\n').map((h, i) => <li key={i}>{h}</li>) : <li>No highlights defined yet.</li>}
                </ul>
                <h4 className="font-bold text-[16px] text-primary mb-3">Full description</h4>
                <p className="text-sm text-text-secondary leading-relaxed font-medium mb-8 whitespace-pre-wrap">
                  {tourData.description || "The administrator has not provided a description for this tour yet."}
                </p>
              </div>
            )}

            {/* Content Section (Itinerary Active) */}
            {activeTab === "Itinerary" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="font-bold text-[22px] md:text-[24px] text-primary mb-6">Itinerary</h3>
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 mb-8">
                  {tourData.itinerary && tourData.itinerary.length > 0 ? tourData.itinerary.map((itin, index) => (
                    <div key={index} className="relative pl-6">
                       <div className="absolute w-[11px] h-[11px] bg-white border-2 border-primary rounded-full -left-[6.5px] top-1.5"></div>
                       <h4 className="font-bold text-[16px] text-primary">{itin.title || `Stop ${index + 1}`}</h4>
                       <p className="text-sm font-medium text-text-secondary mt-1.5">{itin.description}</p>
                    </div>
                  )) : (
                    <div className="relative pl-6">
                       <div className="absolute w-[11px] h-[11px] bg-white border-2 border-primary rounded-full -left-[6.5px] top-1.5"></div>
                       <h4 className="font-bold text-[16px] text-primary">Flexible Itinerary</h4>
                       <p className="text-sm font-medium text-text-secondary mt-1.5">The exact itinerary is flexible and determined on the day of the tour.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Content Section (Important information Active) */}
            {activeTab === "Important information" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="font-bold text-[22px] md:text-[24px] text-primary mb-6">Important information</h3>
                
                <div className="mb-8">
                   <h4 className="font-bold text-[16px] text-primary mb-3">What's Included</h4>
                   <ul className="list-disc pl-5 text-sm text-text-secondary font-medium space-y-2">
                      {selectedPackage === "All Inclusive" && tourData.inclusiveIncluded 
                         ? tourData.inclusiveIncluded.split('\n').map((inc, i) => <li key={i}>{inc}</li>) 
                         : tourData.included ? tourData.included.split('\n').map((inc, i) => <li key={i}>{inc}</li>) : <li>Standard amenities.</li>}
                   </ul>
                </div>

                {(selectedPackage === "All Inclusive" && tourData.inclusiveExcluded) ? (
                  <div className="mb-8">
                     <h4 className="font-bold text-[16px] text-primary mb-3">What's Excluded</h4>
                     <ul className="list-disc pl-5 text-sm text-text-secondary font-medium space-y-2">
                        {tourData.inclusiveExcluded.split('\n').map((exc, i) => <li key={i}>{exc}</li>)}
                     </ul>
                  </div>
                ) : tourData.excluded ? (
                  <div className="mb-8">
                     <h4 className="font-bold text-[16px] text-primary mb-3">What's Excluded</h4>
                     <ul className="list-disc pl-5 text-sm text-text-secondary font-medium space-y-2">
                        {tourData.excluded.split('\n').map((exc, i) => <li key={i}>{exc}</li>)}
                     </ul>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking Widget (Desktop) */}
          <div className="hidden md:block md:w-[35%] lg:w-[32%]">
            <div className={`sticky top-[120px] rounded-2xl p-6 shadow-lg z-10 w-full ${tourData.service === "Spa" ? "bg-white border border-[#f0ede6]" : "bg-white border border-gray-200"}`}>
               <div className="mb-4 flex items-end gap-1">
                  <span className={`text-[34px] font-extrabold leading-none ${tourData.service === "Spa" ? "text-[#3d3730] font-serif tracking-tight" : "text-primary"}`}>IDR {getUnitDynamicPrice().toLocaleString('id-ID')}</span>
                  <span className="text-text-secondary text-[15px] font-medium pb-1">/ {tourData.service === "Spa" ? "treatment" : tourData.service === "Scooter" ? scooterDuration.replace('daily', 'day').replace('weekly', 'week').replace('monthly', 'month') : tourData.pricingType === "Per Group" ? "group" : (tourData.tourTiers && tourData.tourTiers.length > 0 ? "total" : "person")}</span>
               </div>
               
               <p className="text-sm text-text-secondary font-medium mb-6">Reserve now and pay later to book your spot and pay nothing today.</p>

               {tourData.service === "Spa" && (
                 <div className="mb-4">
                   <span className="font-bold text-text-secondary text-[14px] mb-2 block ml-1">Treatment Duration</span>
                   <div className="flex bg-[#F4F4F6] p-1 rounded-2xl w-full">
                     {[
                       { id: 'min60', label: '60 Min', price: tourData.min60 },
                       { id: 'min90', label: '90 Min', price: tourData.min90 },
                       { id: 'min120', label: '120 Min', price: tourData.min120 }
                     ].filter(opt => opt.price).map(opt => (
                       <button
                         key={opt.id}
                         onClick={() => setSpaDuration(opt.id)}
                         className={`flex-1 py-1.5 text-[13px] font-bold rounded-xl transition-all ${spaDuration === opt.id ? 'bg-[#A48F7A] text-white shadow-sm' : 'text-text-secondary hover:text-[#A48F7A]'}`}
                       >
                         {opt.label}
                       </button>
                     ))}
                   </div>
                 </div>
               )}

               {tourData.service === "Scooter" && (
                 <div className="mb-4">
                   <span className="font-bold text-text-secondary text-[14px] mb-2 block ml-1">Rental Duration</span>
                   <div className="flex bg-[#F4F4F6] p-1 rounded-2xl w-full">
                     {[
                       { id: 'daily', label: 'Daily', price: tourData.dailyPrice },
                       { id: 'weekly', label: 'Weekly', price: tourData.weeklyPrice },
                       { id: 'monthly', label: 'Monthly', price: tourData.monthlyPrice }
                     ].filter(opt => opt.price).map(opt => (
                       <button
                         key={opt.id}
                         onClick={() => setScooterDuration(opt.id)}
                         className={`flex-1 py-1.5 text-[13px] font-bold rounded-xl transition-all ${scooterDuration === opt.id ? 'bg-white text-primary shadow-sm' : 'text-text-secondary hover:text-primary'}`}
                       >
                         {opt.label}
                       </button>
                     ))}
                   </div>
                 </div>
               )}

               {/* Package Selector */}
               {(tourData.service === "Tour" || tourData.service === "Activities") && tourData.allInclusiveSurcharge && (
                 <div className="mb-5">
                   <span className="font-bold text-text-secondary text-[14px] mb-2 block ml-1">Select your package</span>
                   <div className="flex flex-col gap-2">
                      <div 
                         onClick={() => setSelectedPackage('Standard')}
                         className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedPackage === 'Standard' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                         <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-primary text-[14px]">Standard Package</span>
                            {selectedPackage === 'Standard' && <CheckCircle2 size={16} className="text-primary" />}
                         </div>
                         <p className="text-[12px] text-text-secondary font-medium">Driver and guide only. Entrance fees not included.</p>
                      </div>
                      <div 
                         onClick={() => setSelectedPackage('All Inclusive')}
                         className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedPackage === 'All Inclusive' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                         <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-primary text-[14px]">All-Inclusive</span>
                            <span className="text-[12px] font-bold text-accent">Rp {getAllInclusivePriceForPax(desktopPax).toLocaleString('id-ID')}/pax</span>
                         </div>
                         <p className="text-[12px] text-text-secondary font-medium">All entrance fees covered. Hassle-free experience.</p>
                      </div>
                   </div>
                 </div>
               )}

               {/* Date Selector Desktop */}
               <div className="mb-4 bg-[#F4F4F6] p-3 rounded-2xl flex items-center justify-between relative overflow-hidden">
                 <span className="font-bold text-text-secondary text-[14px] ml-1">Select Date</span>
                 <div className="relative">
                   <input 
                     type="date" 
                     value={desktopDate}
                     onChange={(e) => setDesktopDate(e.target.value)}
                     className="bg-transparent font-extrabold text-[15px] text-primary outline-none cursor-pointer appearance-none text-right pr-1 relative z-10 w-[135px]"
                     style={{ colorScheme: 'light' }}
                   />
                 </div>
               </div>

               {/* Add Pax Calculator Desktop */}
               <div className="flex items-center justify-between mb-6 bg-[#F4F4F6] p-3 rounded-2xl">
                 <span className="font-bold text-text-secondary text-[14px] ml-1">{tourData.service === "Scooter" ? "Quantity" : "Number of persons"}</span>
                 <div className="flex items-center gap-3">
                   <button onClick={() => setDesktopPax(Math.max(tourData.minPax || 1, desktopPax - 1))} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-gray-50 active:scale-95 transition-all"><Minus size={16} strokeWidth={3} /></button>
                   <span className="font-extrabold text-primary text-[15px] w-4 text-center">{desktopPax}</span>
                   <button onClick={() => setDesktopPax(desktopPax + 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-gray-50 active:scale-95 transition-all"><Plus size={16} strokeWidth={3} /></button>
                 </div>
               </div>

               <div className="flex items-center justify-between mb-6 px-1">
                 <span className="font-bold text-primary text-[16px]">Total</span>
                 <span className="font-extrabold text-primary text-[24px]">IDR {getTotalPrice().toLocaleString('id-ID')}</span>
               </div>

               <button 
                 onClick={() => {
                   setModalStartStep(2);
                   setIsBookingModalOpen(true);
                 }} 
                 className={`w-full py-4 rounded-[20px] flex items-center justify-center gap-2 font-bold transition-all active:-translate-y-1 text-[17px] mb-6 shadow-sm ${tourData.service === "Spa" ? 'bg-[#A48F7A] hover:bg-[#8e7a67] text-white' : 'bg-accent hover:bg-accent-hover text-primary'}`}
               >
                 Check availability
               </button>

               <div className="flex flex-col gap-4 border-t border-border pt-6">
                 <div className="flex gap-3 text-[15px] text-text-secondary font-medium">
                   <Calendar size={20} className="text-primary shrink-0 mt-0.5" strokeWidth={2} />
                   <div className="flex flex-col">
                     <span className="font-bold text-primary">Free Cancellation</span>
                     <span className="text-[13px] mt-0.5">Cancel up to 24h before completely free.</span>
                   </div>
                 </div>
                 <div className="flex gap-3 text-[15px] text-text-secondary font-medium">
                   <Clock size={20} className="text-primary shrink-0 mt-0.5" strokeWidth={2} />
                   <div className="flex flex-col">
                     <span className="font-bold text-primary">Duration</span>
                     <span className="text-[13px] mt-0.5">{tourData.duration}</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Floating Bottom Booking Bar (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white z-40 px-5 pt-3.5 pb-[calc(env(safe-area-inset-bottom)+16px)] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-border">
        <div className="flex flex-col gap-2">
           {/* Package Selector for Mobile (Hidden per user request, moved to Modal) */}
           <div className="hidden">
           {(tourData.service === "Tour" || tourData.service === "Activities") && (tourData.hasAllInclusive || tourData.allInclusiveSurcharge) && (
             <div className="flex gap-2 w-full mb-1">
                <button 
                   onClick={() => setSelectedPackage('Standard')} 
                   className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border flex-1 whitespace-nowrap transition-all ${selectedPackage === 'Standard' ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-gray-200'}`}
                >
                   Standard
                </button>
                <button 
                   onClick={() => setSelectedPackage('All Inclusive')} 
                   className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border flex-1 whitespace-nowrap transition-all flex justify-center items-center gap-1 ${selectedPackage === 'All Inclusive' ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-gray-200'}`}
                >
                   All-Inclusive <span className={selectedPackage === 'All Inclusive' ? 'text-white/80' : 'text-accent'}>Rp {getAllInclusivePriceForPax(desktopPax).toLocaleString('id-ID')}</span>
                </button>
             </div>
           )}
           </div>
           <div className="flex items-center justify-between gap-3">
             <div className="flex flex-col flex-1 overflow-hidden">
               {tourData.service !== "Tour" && (
                 <div className="flex gap-2 w-full mb-2">
                   {tourData.service === "Spa" ? (
                      [
                        { id: 'min60', label: '60 Min', price: tourData.min60 },
                        { id: 'min90', label: '90 Min', price: tourData.min90 },
                        { id: 'min120', label: '120 Min', price: tourData.min120 }
                      ].filter(opt => opt.price).map(opt => (
                        <button key={opt.id} onClick={() => setSpaDuration(opt.id)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border flex-1 whitespace-nowrap ${spaDuration === opt.id ? 'bg-[#A48F7A] text-white border-[#A48F7A]' : 'bg-white text-[#A48F7A] border-gray-200'}`}>
                          {opt.label}
                        </button>
                      ))
                   ) : tourData.service === "Scooter" ? (
                      [
                        { id: 'daily', label: 'Daily', price: tourData.dailyPrice },
                        { id: 'weekly', label: 'Weekly', price: tourData.weeklyPrice },
                        { id: 'monthly', label: 'Monthly', price: tourData.monthlyPrice }
                      ].filter(opt => opt.price).map(opt => (
                        <button key={opt.id} onClick={() => setScooterDuration(opt.id)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border flex-1 whitespace-nowrap ${scooterDuration === opt.id ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-gray-200'}`}>
                          {opt.label}
                        </button>
                      ))
                   ) : null}
                 </div>
               )}
               <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-0.5">
                  {(tourData.service === "Tour" || tourData.service === "Activities") && tourData.allInclusiveSurcharge ? "Select your package" : "Price starting from"}
               </span>
               <div className="flex items-baseline gap-1.5 truncate">
               <span className={`text-[20px] font-black leading-none tracking-tight truncate ${tourData.service === "Spa" ? "text-[#3d3730] font-serif" : "text-primary"}`}>
                  {selectedPackage === 'All Inclusive' && (tourData.hasAllInclusive || tourData.allInclusiveSurcharge) ? getAllInclusivePriceForPax(desktopPax).toLocaleString('id-ID') : getUnitDynamicPrice().toLocaleString('id-ID')}
               </span>
            </div>
          </div>
          <button 
            onClick={() => {
              setModalStartStep(1);
              setIsBookingModalOpen(true);
            }} 
            className={`px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-transform active:scale-95 shrink-0 whitespace-nowrap ${tourData.service === "Spa" ? 'bg-[#A48F7A] hover:bg-[#8e7a67] text-white' : 'bg-accent hover:bg-accent-hover text-primary'}`}
          >
            {(tourData.hasAllInclusive || tourData.allInclusiveSurcharge) ? 'Select Options' : 'Book Now'} <ArrowRight size={16} strokeWidth={3} className="-mr-1" />
          </button>
        </div>
      </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        serviceData={{ 
            type: tourData.service?.toLowerCase() || 'tour', 
            id: tourData.id, 
            title: tourData.title, // Base title, modal handles inclusive title
            baseTitle: tourData.title,
            inclusiveTitle: tourData.inclusiveTitle,
            price: tourData.price, 
            pricingType: tourData.pricingType, // Original pricing type, modal overrides for inclusive
            tourTiers: tourData.tourTiers,
            selectedPackage: (tourData.hasAllInclusive || tourData.allInclusiveSurcharge) ? selectedPackage : null,
            allInclusiveSurcharge: tourData.allInclusiveSurcharge,
            hasAllInclusive: tourData.hasAllInclusive,
            allInclusiveTiers: tourData.allInclusiveTiers,
            minPax: tourData.minPax || 1
         }} 
        initialPax={desktopPax}
        initialDate={desktopDate}
        startStep={modalStartStep}
        onPackageChange={setSelectedPackage}
        onPaxChange={setDesktopPax}
        onDateChange={setDesktopDate}
      />

    </div>
  );
}

