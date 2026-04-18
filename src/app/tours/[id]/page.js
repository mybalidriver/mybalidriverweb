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

  React.useEffect(() => {
    const saved = localStorage.getItem("bali_admin_listings");
    if (saved) {
       const parsed = JSON.parse(saved);
       const combined = [...(parsed.Tour||[]), ...(parsed.Spa||[]), ...(parsed.Scooter||[]), ...(parsed.Transport||[])];
       const found = combined.find(t => String(t.id) === String(resolvedParams.id));
       if (found) {
          found.images = found.image 
             ? [found.image, found.image, found.image, found.image, found.image] 
             : ["https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=800&q=80"];
          setTourData(found);
       }
    }
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
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[55vh] min-h-[450px] max-h-[550px] w-full rounded-[32px] overflow-hidden relative">
          <div className="col-span-2 row-span-2 relative group overflow-hidden cursor-pointer">
            <img src={tourData.images[0]} alt="Hero Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
          </div>
          {tourData.images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="relative group overflow-hidden cursor-pointer">
               <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95 group-hover:opacity-100" />
               <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area - Get Your Guide Dual Column Layout */}
      <div className="relative z-30 bg-white rounded-t-[32px] md:rounded-none -mt-6 md:mt-0 pt-8 md:pt-6 pb-12 w-full mx-auto">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Details */}
          <div className="w-full md:w-[65%] lg:w-[68%]">
            
            {/* Title Section */}
            <div className="mb-8 flex flex-col">
              <h1 className="text-[28px] md:text-[36px] leading-[1.2] font-extrabold text-primary mb-3 text-balance">{tourData.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-accent text-accent" />
                  <span className="font-bold text-primary text-[15px]">{tourData.rating}</span>
                  <span className="text-text-secondary text-[13px] underline cursor-pointer hover:text-text-primary">({tourData.reviews} reviews)</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="text-text-secondary font-medium text-[14px] hover:underline cursor-pointer">{tourData.location}</span>
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
                      isActive ? "bg-accent text-primary shadow-sm" : "bg-surface hover:bg-surface-hover text-text-secondary"
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
                <h3 className="font-bold text-[22px] md:text-[24px] text-primary mb-6">About this activity</h3>
                
                <div className="flex flex-col gap-6 mb-8">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 size={24} className="text-green-500 shrink-0 mt-0.5" strokeWidth={2} />
                    <div className="flex flex-col">
                      <span className="font-bold text-[16px] text-primary">Free cancellation</span>
                      <span className="text-sm font-medium text-text-secondary mt-1">Cancel up to 24 hours in advance for a full refund</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Calendar size={24} className="text-primary shrink-0 mt-0.5" strokeWidth={2} />
                    <div className="flex flex-col">
                      <span className="font-bold text-[16px] text-primary">Reserve now & pay later</span>
                      <span className="text-sm font-medium text-text-secondary mt-1">Keep your travel plans flexible — book your spot and pay nothing today.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock size={24} className="text-primary shrink-0 mt-0.5" strokeWidth={2} />
                    <div className="flex flex-col">
                      <span className="font-bold text-[16px] text-primary">Duration {tourData.duration}</span>
                      <span className="text-sm font-medium text-text-secondary mt-1">Check availability to see starting times.</span>
                    </div>
                  </div>

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
                      {tourData.included ? tourData.included.split('\n').map((inc, i) => <li key={i}>{inc}</li>) : <li>Standard amenities.</li>}
                   </ul>
                </div>

                {tourData.excluded && (
                  <div className="mb-8">
                     <h4 className="font-bold text-[16px] text-primary mb-3">What's Excluded</h4>
                     <ul className="list-disc pl-5 text-sm text-text-secondary font-medium space-y-2">
                        {tourData.excluded.split('\n').map((exc, i) => <li key={i}>{exc}</li>)}
                     </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking Widget (Desktop) */}
          <div className="hidden md:block md:w-[35%] lg:w-[32%]">
            <div className="sticky top-[120px] bg-white rounded-2xl border border-gray-200 p-6 shadow-lg z-10 w-full">
               <div className="mb-4 flex items-end gap-1">
                  <span className="text-[34px] font-extrabold text-primary leading-none">${tourData.price}</span>
                  <span className="text-text-secondary text-[15px] font-medium pb-1">/ person</span>
               </div>
               
               <p className="text-sm text-text-secondary font-medium mb-6">Reserve now and pay later to book your spot and pay nothing today.</p>

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
                 <span className="font-bold text-text-secondary text-[14px] ml-1">Number of persons</span>
                 <div className="flex items-center gap-3">
                   <button onClick={() => setDesktopPax(Math.max(1, desktopPax - 1))} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-gray-50 active:scale-95 transition-all"><Minus size={16} strokeWidth={3} /></button>
                   <span className="font-extrabold text-primary text-[15px] w-4 text-center">{desktopPax}</span>
                   <button onClick={() => setDesktopPax(desktopPax + 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-gray-50 active:scale-95 transition-all"><Plus size={16} strokeWidth={3} /></button>
                 </div>
               </div>

               <div className="flex items-center justify-between mb-6 px-1">
                 <span className="font-bold text-primary text-[16px]">Total</span>
                 <span className="font-extrabold text-primary text-[24px]">${tourData.price * desktopPax}</span>
               </div>

               <button 
                 onClick={() => {
                   setModalStartStep(2);
                   setIsBookingModalOpen(true);
                 }} 
                 className="w-full bg-accent hover:bg-accent-hover py-4 rounded-[20px] flex items-center justify-center gap-2 font-bold text-primary transition-all active:-translate-y-1 text-[17px] mb-6 shadow-sm"
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
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white z-40 px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-1">
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-0.5">Price</span>
              <div className="flex items-end leading-none gap-0.5">
                <span className="text-[26px] font-extrabold text-primary leading-none">${tourData.price}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => {
              setModalStartStep(1);
              setIsBookingModalOpen(true);
            }} 
            className="bg-accent hover:bg-accent-hover px-10 py-4 rounded-full flex items-center gap-2 font-bold text-primary transition-all active:-translate-y-1"
          >
            Book Now <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        serviceData={{ type: 'tour', id: tourData.id, title: tourData.title, price: tourData.price }} 
        initialPax={desktopPax}
        initialDate={desktopDate}
        startStep={modalStartStep}
      />

    </div>
  );
}

