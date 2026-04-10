"use client";

import React, { useState } from "react";
import { 
  X, Save, Image as ImageIcon, MapPin, DollarSign, Clock, Tag, Plus, Target, Star, Trash2,
  Compass, Map, Camera, Footprints, Droplet, Sparkles, Heart, Activity,
  Bike, Zap, Shield, Car, Navigation, Users, SunMedium, CheckCircle2, Calendar, ChevronDown
} from "lucide-react";

export default function EditListingModal({ item, activeTab, onClose, onSave }) {
  // Core Info
  const [formData, setFormData] = useState({
    title: item.title || "",
    location: item.location || "",
    duration: item.duration || "",
    category: item.category || "",
    status: item.status || "Active",
    image: item.image || "",
    company: item.company || "",
    spaSetting: item.spaSetting || "Real Spa"
  });

  const [pins, setPins] = useState({
    isCampaignPinned: item.isCampaignPinned || false,
    campaignTitle: item.campaignTitle || "",
    campaignDescription: item.campaignDescription || "",
    isBestTripPinned: item.isBestTripPinned || false
  });

  const [itinerary, setItinerary] = useState(item.itinerary || [{ title: '', description: '' }]);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Rich Text Fields
  const [details, setDetails] = useState({
    description: item.description || "",
    highlights: item.highlights || "",
    included: item.included || ""
  });

  const categoryOptions = {
    Tour: [
      { name: "Island Tour", icon: Compass },
      { name: "Trekking", icon: Footprints },
      { name: "Show & Culture", icon: Map },
      { name: "Nature", icon: SunMedium },
      { name: "Sightseeing", icon: Camera },
      { name: "Adventure", icon: Target }
    ],
    Spa: [
      { name: "Massage", icon: Heart },
      { name: "Package", icon: Sparkles },
      { name: "Facial", icon: Droplet },
      { name: "Therapy", icon: Activity }
    ],
    Scooter: [
      { name: "Standard", icon: Bike },
      { name: "Premium", icon: Shield },
      { name: "Sport", icon: Zap }
    ],
    Transport: [
      { name: "Transfer", icon: Navigation },
      { name: "Private Booking", icon: Car },
      { name: "Hourly Rental", icon: Clock },
      { name: "Group Van", icon: Users }
    ]
  };

  /* -- Pricing Logic States -- */
  // Tour Pricing
  const [tourPricingType, setTourPricingType] = useState(item.pricingType || "Per Person"); // 'Per Person' or 'Per Group'
  const [groupPrice, setGroupPrice] = useState(item.price || "");
  const [tourTiers, setTourTiers] = useState(item.tourTiers || [{ pax: 1, price: item.price || "" }]);

  // Scooter Pricing
  const [scooterPrices, setScooterPrices] = useState({
    daily: item.dailyPrice || item.price || "",
    weekly: item.weeklyPrice || "",
    monthly: item.monthlyPrice || ""
  });

  // Spa Pricing
  const [spaPrices, setSpaPrices] = useState({
    min60: item.min60 || "",
    min90: item.min90 || "",
    min120: item.min120 || ""
  });

  // Transport Pricing
  const [transportPrice, setTransportPrice] = useState(item.price || "");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDetailChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const finalItem = {
      ...item,
      ...formData,
      ...details,
      ...pins,
    };
    if (activeTab === "Scooter") {
       finalItem.dailyPrice = scooterPrices.daily;
       finalItem.weeklyPrice = scooterPrices.weekly;
       finalItem.monthlyPrice = scooterPrices.monthly;
       finalItem.price = scooterPrices.daily; // Fallback for list UI
    } else if (activeTab === "Spa") {
       finalItem.min60 = spaPrices.min60;
       finalItem.min90 = spaPrices.min90;
       finalItem.min120 = spaPrices.min120;
       finalItem.price = spaPrices.min60 || spaPrices.min90; // Fallback
    } else if (activeTab === "Transport") {
       finalItem.price = transportPrice;
    } else {
       finalItem.pricingType = tourPricingType;
       if (tourPricingType === "Per Group") finalItem.price = groupPrice;
       if (tourPricingType === "Per Person") {
          finalItem.tourTiers = tourTiers;
          finalItem.price = tourTiers[0]?.price || ""; // Fallback
       }
    }
    onSave(finalItem);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center font-sans">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-gray-50 rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col h-[95vh] sm:h-[85vh] overflow-hidden transform transition-transform animate-slideUp sm:animate-scaleIn z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100 shrink-0">
           <div>
             <h2 className="text-xl font-extrabold text-primary tracking-tight">Edit {activeTab} Listing</h2>
             <p className="text-xs font-semibold text-gray-400 mt-0.5 tracking-wide">ID: #{item.id}</p>
           </div>
           
           <div className="flex items-center gap-2">
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <X size={16} strokeWidth={3} />
              </button>
           </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
          <div className="space-y-6 max-w-2xl mx-auto">
            
             {/* PINNING CONTROLS */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
               <div className="flex-1 flex flex-col justify-center">
                 <div className="flex items-center justify-between">
                   <div>
                     <div className="flex items-center gap-2 text-sm font-extrabold text-primary"><Target size={16} className="text-[#cce823]"/> Pin to Campaign</div>
                     <p className="text-[11px] font-semibold text-gray-500">Feature this in massive homepage hero slider</p>
                   </div>
                   {/* Apple Toggle */}
                   <div 
                     onClick={() => setPins({...pins, isCampaignPinned: !pins.isCampaignPinned})}
                     className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${pins.isCampaignPinned ? 'bg-[#cce823]' : 'bg-gray-200'}`}>
                     <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${pins.isCampaignPinned ? 'translate-x-6' : ''}`} />
                   </div>
                 </div>
                 {pins.isCampaignPinned && (
                   <div className="mt-3 space-y-2">
                     <input 
                       type="text" 
                       placeholder="Campaign Title (e.g. Best Deals this Summer!)" 
                       value={pins.campaignTitle} 
                       onChange={(e) => setPins({...pins, campaignTitle: e.target.value})} 
                       className="w-full bg-gray-50 text-xs font-bold text-primary rounded-xl px-3 py-2 border border-gray-200 focus:border-[#cce823] focus:ring-1 focus:ring-[#cce823] outline-none transition-colors" 
                     />
                     <textarea
                       placeholder="Campaign Description..."
                       value={pins.campaignDescription}
                       onChange={(e) => setPins({...pins, campaignDescription: e.target.value})}
                       className="w-full bg-gray-50 text-xs font-medium text-primary rounded-xl px-3 py-2 border border-gray-200 focus:border-[#cce823] focus:ring-1 focus:ring-[#cce823] outline-none transition-colors h-16"
                     ></textarea>
                   </div>
                 )}
               </div>
               
               <div className="hidden sm:block w-px bg-gray-100"></div>

               <div className="flex-1 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-extrabold text-primary"><Star size={16} className="text-yellow-500"/> Best Trips Label</div>
                    <p className="text-[11px] font-semibold text-gray-500">Show inside the Best Recommended section</p>
                  </div>
                  {/* Apple Toggle */}
                  <div 
                    onClick={() => setPins({...pins, isBestTripPinned: !pins.isBestTripPinned})}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${pins.isBestTripPinned ? 'bg-yellow-500' : 'bg-gray-200'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${pins.isBestTripPinned ? 'translate-x-6' : ''}`} />
                  </div>
               </div>
            </div>

            {/* Core Details */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-gray-100 flex gap-4 sm:flex-row flex-col">
                  <div className="flex-[2]">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Service Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-50 text-sm font-bold text-primary rounded-xl px-4 py-2.5 border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                  </div>
                  {activeTab !== "Tour" && (
                    <div className="flex-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Provider Company</label>
                      <input type="text" name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} className="w-full bg-gray-50 text-sm font-bold text-primary rounded-xl px-4 py-2.5 border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                    </div>
                  )}
               </div>
               <div className="p-4 flex gap-4 sm:flex-row flex-col">
                 <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-gray-50 text-sm font-semibold text-primary rounded-xl pl-9 pr-4 py-2 border border-gray-200 focus:border-accent outline-none" />
                    </div>
                 </div>
                 <div className={activeTab === "Spa" ? "flex-1" : "flex-[3]"}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Category / Type</label>
                    <div className="relative">
                       <button
                         type="button"
                         onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                         className="w-full bg-white text-sm font-semibold text-primary rounded-xl px-4 py-2 border border-[#cce823] hover:bg-gray-50 transition-colors focus:ring-1 focus:ring-[#cce823] outline-none flex items-center justify-between"
                       >
                         <div className="flex items-center gap-2">
                            {formData.category ? (
                              <>
                                {(()=>{
                                  const catOpt = categoryOptions[activeTab]?.find(c => c.name === formData.category);
                                  const IconComp = catOpt ? catOpt.icon : Tag;
                                  return <IconComp size={16} className="text-gray-500" />;
                                })()}
                                <span>{formData.category}</span>
                              </>
                            ) : (
                              <span className="text-gray-400">Select Category...</span>
                            )}
                         </div>
                         <ChevronDown size={16} className={`text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                       </button>

                       {isCategoryDropdownOpen && (
                         <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl p-2 z-10 grid grid-cols-1 gap-1">
                            {categoryOptions[activeTab]?.map((cat) => {
                               const IconComp = cat.icon;
                               const isSelected = formData.category === cat.name;
                               return (
                                 <button
                                    key={cat.name}
                                    onClick={() => {
                                       setFormData({...formData, category: cat.name});
                                       setIsCategoryDropdownOpen(false);
                                    }}
                                    type="button"
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all w-full text-left ${isSelected ? 'bg-primary/5 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
                                 >
                                    <IconComp size={16} className={isSelected ? 'text-primary' : 'text-gray-400'} /> {cat.name}
                                 </button>
                               );
                            })}
                         </div>
                       )}
                    </div>
                 </div>
                 {activeTab === "Spa" && (
                   <div className="flex-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Spa Setting</label>
                      <select name="spaSetting" value={formData.spaSetting} onChange={handleChange} className="w-full bg-white text-sm font-semibold text-primary rounded-xl px-4 py-2 border border-gray-200 focus:border-accent hover:bg-gray-50 transition-colors outline-none h-[38px]">
                         <option value="Real Spa">Real Spa Center</option>
                         <option value="In-Villa Spa">In-Villa Spa</option>
                      </select>
                   </div>
                 )}
               </div>
            </div>

            {/* About this Activity (Defaults) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-primary text-sm uppercase tracking-widest block">About this activity</h3>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-widest">Only Duration Editable</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                  <div>
                     <p className="text-xs font-bold text-primary">Free cancellation</p>
                     <p className="text-[11px] font-semibold text-gray-500 mt-0.5">Cancel up to 24 hours in advance for a full refund</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Calendar size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                     <p className="text-xs font-bold text-primary">Reserve now & pay later</p>
                     <p className="text-[11px] font-semibold text-gray-500 mt-0.5">Keep your travel plans flexible — book your spot and pay nothing today.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200 overflow-hidden">
                  <Clock size={18} className="text-accent shrink-0" />
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                     <p className="text-xs font-bold text-primary w-32 shrink-0">Duration Setup</p>
                     {activeTab === "Spa" ? (
                       <select name="duration" value={formData.duration} onChange={handleChange} className="flex-1 bg-white text-sm font-bold text-primary rounded-lg px-3 py-1.5 border border-gray-200 focus:border-accent outline-none w-full">
                         <option value="">Select Duration</option>
                         <option value="60 Mins">60 Mins</option>
                         <option value="90 Mins">90 Mins</option>
                         <option value="120 Mins">120 Mins</option>
                       </select>
                     ) : activeTab === "Scooter" ? (
                       <select name="duration" value={formData.duration} onChange={handleChange} className="flex-1 bg-white text-sm font-bold text-primary rounded-lg px-3 py-1.5 border border-gray-200 focus:border-accent outline-none w-full">
                         <option value="">Select Duration</option>
                         <option value="Daily">Daily</option>
                         <option value="Weekly">Weekly</option>
                         <option value="Monthly">Monthly</option>
                         <option value="Daily / Weekly / Monthly">Daily / Weekly / Monthly</option>
                       </select>
                     ) : (
                       <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="flex-1 bg-white text-sm font-bold text-primary rounded-lg px-3 py-1.5 border border-gray-200 focus:border-accent outline-none w-full" placeholder={activeTab === "Transport" ? "e.g. 10 Hours" : "e.g. Full Day"} />
                     )}
                  </div>
                </div>
                
                {activeTab === "Tour" && (
                  <>
                    <div className="flex items-start gap-4">
                      <Users size={18} className="text-primary mt-0.5 shrink-0" />
                      <div>
                         <p className="text-xs font-bold text-primary">Live tour guide</p>
                         <p className="text-[11px] font-semibold text-gray-500 mt-0.5">English, Indonesian</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <Car size={18} className="text-primary mt-0.5 shrink-0" />
                      <div>
                         <p className="text-xs font-bold text-primary">Pickup included</p>
                         <p className="text-[11px] font-semibold text-gray-500 mt-0.5">Wait in the hotel lobby 10 minutes before your scheduled pickup time.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Dynamic Pricing Engine */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
               <div className="flex items-center gap-2 mb-4">
                  <DollarSign size={20} className="text-green-500" />
                  <h3 className="font-extrabold text-primary text-sm uppercase tracking-widest">Pricing Configuration</h3>
               </div>

               {activeTab === "Tour" ? (
                 <div>
                    <div className="flex bg-gray-100 p-1 rounded-xl w-fit mb-5">
                      <button onClick={() => setTourPricingType("Per Person")} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${tourPricingType === "Per Person" ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>Per Person</button>
                      <button onClick={() => setTourPricingType("Per Group")} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${tourPricingType === "Per Group" ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>Per Group</button>
                    </div>

                    {tourPricingType === "Per Group" ? (
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Flat Group Price (IDR)</label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                           <input type="number" value={groupPrice} onChange={(e) => setGroupPrice(e.target.value)} className="w-full sm:w-1/2 bg-gray-50 text-sm font-semibold text-primary rounded-xl pl-9 pr-4 py-2 border border-gray-200 focus:border-accent outline-none" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                         {tourTiers.map((tier, index) => (
                           <div key={index} className="flex items-center gap-3">
                             <div className="flex-1 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600">Person {tier.pax}</div>
                             <div className="relative flex-[2]">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                               <input type="number" placeholder="Price" value={tier.price} 
                                      onChange={(e) => {
                                         const newTiers = [...tourTiers];
                                         newTiers[index].price = e.target.value;
                                         setTourTiers(newTiers);
                                      }}
                                      className="w-full bg-white text-sm font-extrabold text-primary rounded-xl pl-10 pr-4 py-2 border border-gray-200 focus:border-accent outline-none" 
                               />
                             </div>
                             <button onClick={() => setTourTiers(tourTiers.filter((_, i) => i !== index))} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100">
                                <Trash2 size={14} />
                             </button>
                           </div>
                         ))}
                         <button onClick={() => setTourTiers([...tourTiers, { pax: tourTiers.length + 1, price: "" }])} className="text-xs font-bold text-accent bg-accent/10 px-4 py-2 rounded-lg hover:bg-accent/20 transition-all flex items-center gap-1">
                           <Plus size={14} /> Add Person Tier
                         </button>
                      </div>
                    )}
                 </div>
               ) : activeTab === "Scooter" ? (
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Daily Price (IDR)</label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                          <input type="number" value={scooterPrices.daily} onChange={(e) => setScooterPrices({...scooterPrices, daily: e.target.value})} className="w-full bg-gray-50 text-sm font-bold text-primary rounded-xl pl-10 pr-4 py-2 border border-gray-200 outline-none focus:border-accent" />
                       </div>
                    </div>
                    <div className="flex-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Weekly Price (IDR)</label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                          <input type="number" value={scooterPrices.weekly} onChange={(e) => setScooterPrices({...scooterPrices, weekly: e.target.value})} className="w-full bg-gray-50 text-sm font-bold text-primary rounded-xl pl-10 pr-4 py-2 border border-gray-200 outline-none focus:border-accent" />
                       </div>
                    </div>
                    <div className="flex-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Monthly Price (IDR)</label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                          <input type="number" value={scooterPrices.monthly} onChange={(e) => setScooterPrices({...scooterPrices, monthly: e.target.value})} className="w-full bg-gray-50 text-sm font-bold text-primary rounded-xl pl-10 pr-4 py-2 border border-gray-200 outline-none focus:border-accent" />
                       </div>
                    </div>
                 </div>
               ) : activeTab === "Spa" ? (
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">60 Mins Price (IDR)</label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                          <input type="number" value={spaPrices.min60} onChange={(e) => setSpaPrices({...spaPrices, min60: e.target.value})} className="w-full bg-gray-50 text-sm font-bold text-primary rounded-xl pl-10 pr-4 py-2 border border-gray-200 outline-none focus:border-accent" placeholder="e.g. 250000" />
                       </div>
                    </div>
                    <div className="flex-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">90 Mins Price (IDR)</label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                          <input type="number" value={spaPrices.min90} onChange={(e) => setSpaPrices({...spaPrices, min90: e.target.value})} className="w-full bg-gray-50 text-sm font-bold text-primary rounded-xl pl-10 pr-4 py-2 border border-gray-200 outline-none focus:border-accent" placeholder="e.g. 350000" />
                       </div>
                    </div>
                    <div className="flex-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">120 Mins Price (IDR)</label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                          <input type="number" value={spaPrices.min120} onChange={(e) => setSpaPrices({...spaPrices, min120: e.target.value})} className="w-full bg-gray-50 text-sm font-bold text-primary rounded-xl pl-10 pr-4 py-2 border border-gray-200 outline-none focus:border-accent" placeholder="e.g. 450000" />
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="w-full sm:w-1/2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Base / Flat Price (IDR)</label>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                       <input type="number" value={transportPrice} onChange={(e) => setTransportPrice(e.target.value)} className="w-full bg-gray-50 text-sm font-bold text-primary rounded-xl pl-10 pr-4 py-2 border border-gray-200 outline-none focus:border-accent" placeholder="Transport rate..." />
                    </div>
                 </div>
               )}
            </div>

            {/* Rich Details & dynamic sections based on category */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Full Description</label>
                <textarea rows="4" name="description" value={details.description} onChange={handleDetailChange} className="w-full bg-gray-50 text-sm font-medium text-gray-600 rounded-xl p-4 border border-gray-200 outline-none focus:border-accent" placeholder="Write the main description..."></textarea>
              </div>

              {activeTab === "Tour" && (
                <>
                  <div className="flex gap-4 sm:flex-row flex-col">
                     <div className="flex-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">What's Included</label>
                       <textarea rows="3" name="included" value={details.included} onChange={handleDetailChange} className="w-full bg-gray-50 text-sm font-medium text-gray-600 rounded-xl p-4 border border-gray-200 outline-none focus:border-accent" placeholder="Hotel pickup, guide, water..."></textarea>
                     </div>
                     <div className="flex-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Highlights</label>
                       <textarea rows="3" name="highlights" value={details.highlights} onChange={handleDetailChange} className="w-full bg-gray-50 text-sm font-medium text-gray-600 rounded-xl p-4 border border-gray-200 outline-none focus:border-accent" placeholder="Swim with mantas, sunrise view..."></textarea>
                     </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Tour Itinerary</label>
                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                      {itinerary.map((item, index) => (
                        <div key={index} className="relative flex items-start gap-4">
                          <div className="w-6 h-6 rounded-full bg-[#cce823] flex items-center justify-center font-bold text-[10px] text-primary shrink-0 z-10 mt-1">{index + 1}</div>
                          <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-200">
                             <input type="text" placeholder="Title (e.g. 08:00 AM - Hotel Pickup)" value={item.title} onChange={(e) => {
                               const newItin = [...itinerary]; newItin[index].title = e.target.value; setItinerary(newItin);
                             }} className="w-full bg-white text-sm font-bold text-primary rounded-lg px-3 py-1.5 border border-gray-200 mb-2 outline-none focus:border-accent" />
                             <textarea rows="2" placeholder="Description..." value={item.description} onChange={(e) => {
                               const newItin = [...itinerary]; newItin[index].description = e.target.value; setItinerary(newItin);
                             }} className="w-full bg-white text-sm font-medium text-gray-600 rounded-lg px-3 py-1.5 border border-gray-200 outline-none focus:border-accent"></textarea>
                          </div>
                          <button onClick={() => setItinerary(itinerary.filter((_, i) => i !== index))} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 mt-1 shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setItinerary([...itinerary, { title: '', description: '' }])} className="mt-4 text-xs font-bold text-primary bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-1 mx-auto">
                      <Plus size={14} /> Add Itinerary Stop
                    </button>
                  </div>
                </>
              )}

              {activeTab === "Spa" && (
                <div className="flex gap-4 sm:flex-row flex-col">
                   <div className="flex-1">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Facilities & Amenities</label>
                     <textarea rows="3" name="included" value={details.included} onChange={handleDetailChange} className="w-full bg-gray-50 text-sm font-medium text-gray-600 rounded-xl p-4 border border-gray-200 outline-none focus:border-accent" placeholder="Private shower, welcoming tea..."></textarea>
                   </div>
                   <div className="flex-1">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Therapeutic Benefits</label>
                     <textarea rows="3" name="highlights" value={details.highlights} onChange={handleDetailChange} className="w-full bg-gray-50 text-sm font-medium text-gray-600 rounded-xl p-4 border border-gray-200 outline-none focus:border-accent" placeholder="Muscle relaxation, skin deep cleanse..."></textarea>
                   </div>
                </div>
              )}

              {activeTab === "Scooter" && (
                <div className="flex gap-4 sm:flex-row flex-col">
                   <div className="flex-1">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">What's Included</label>
                     <textarea rows="3" name="included" value={details.included} onChange={handleDetailChange} className="w-full bg-gray-50 text-sm font-medium text-gray-600 rounded-xl p-4 border border-gray-200 outline-none focus:border-accent" placeholder="2 Helmets, Raincoat, First Aid..."></textarea>
                   </div>
                   <div className="flex-1">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Rental Requirements</label>
                     <textarea rows="3" name="highlights" value={details.highlights} onChange={handleDetailChange} className="w-full bg-gray-50 text-sm font-medium text-gray-600 rounded-xl p-4 border border-gray-200 outline-none focus:border-accent" placeholder="International drove permit, Passport copy..."></textarea>
                   </div>
                </div>
              )}

              {activeTab === "Transport" && (
                <div className="flex gap-4 sm:flex-row flex-col">
                   <div className="flex-1">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Vehicle Specifications</label>
                     <textarea rows="3" name="included" value={details.included} onChange={handleDetailChange} className="w-full bg-gray-50 text-sm font-medium text-gray-600 rounded-xl p-4 border border-gray-200 outline-none focus:border-accent" placeholder="Capacity: 4 Pax, Air Conditioned, Free WiFi..."></textarea>
                   </div>
                   <div className="flex-1">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Luggage & Rules</label>
                     <textarea rows="3" name="highlights" value={details.highlights} onChange={handleDetailChange} className="w-full bg-gray-50 text-sm font-medium text-gray-600 rounded-xl p-4 border border-gray-200 outline-none focus:border-accent" placeholder="Max 2 large suitcases. No smoking..."></textarea>
                   </div>
                </div>
              )}
            </div>

            {/* Final State & Image */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
               <div className="p-4 flex-1 border-b sm:border-b-0 sm:border-r border-gray-100 flex flex-col justify-center">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Cover Image Upload</label>
                 <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                     {formData.image ? (
                       <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                         <Camera size={18} />
                       </div>
                     )}
                   </div>
                   <div className="flex-1">
                     <p className="text-xs font-semibold text-gray-500 mb-2">Select a photo from your device. Supabase is bypassing this for now using base64 preview.</p>
                     <div className="relative overflow-hidden w-fit">
                       <button type="button" className="bg-gray-100 hover:bg-gray-200 text-primary text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2">
                         <ImageIcon size={14} /> Upload Device File
                       </button>
                       <input 
                         type="file" 
                         accept="image/*"
                         onChange={handleImageUpload} 
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                       />
                     </div>
                   </div>
                 </div>
               </div>
               <div className="p-4 w-full sm:w-48 bg-gray-50 shrink-0">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white text-sm font-bold text-primary rounded-lg px-3 py-1.5 border border-gray-200 outline-none focus:border-accent appearance-none">
                     <option value="Active">Active / Public</option>
                     <option value="Draft">Draft / Hidden</option>
                  </select>
               </div>
            </div>

          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 sm:p-6 bg-white border-t border-gray-100 shrink-0 flex items-center justify-end gap-3 pb-safe">
           <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
           <button onClick={handleSave} className="px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/95 transition-colors flex items-center gap-2 shadow-md">
             <Save size={18} /> Publish Configuration
           </button>
        </div>

      </div>
    </div>
  );
}
