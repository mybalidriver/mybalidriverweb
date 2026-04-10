"use client";

import React, { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, MapPin, 
  Clock, Star, PackageOpen, MessageSquare, 
  ExternalLink, EyeOff, Link2, MessageCircle,
  ChevronDown, ChevronUp
} from "lucide-react";
import Image from "next/image";
import EditListingModal from "../../../components/admin/EditListingModal";
import ReviewModal from "../../../components/admin/ReviewModal";

export default function AdminListings() {
  const [activeTab, setActiveTab] = useState("Tour");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [expandedCompanyIds, setExpandedCompanyIds] = useState([]);

  const scooterCompanies = [
    { id: 'c1', name: 'THE BIKE RENTAL BALI', rating: 4.8, reviews: 1045, location: 'Ubud, Bali', fleetSize: 1, phone: "+6285174119423", joined: "2026", verified: true, image: 'https://images.unsplash.com/photo-1558981420-80aa89ac1250?auto=format&fit=crop&w=400&q=80' },
    { id: 'c2', name: 'B&G UBUD RENT MOTOR BIKE', rating: 4.9, reviews: 832, location: 'Ubud, Bali', fleetSize: 1, phone: "+6281246889611", joined: "2026", verified: true, image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=400&q=80' },
    { id: 'c3', name: 'BALI DIARY RENTAL', rating: 4.8, reviews: 200, location: 'Amed, Bali', fleetSize: 1, phone: "+6281995373455", joined: "2026", verified: true, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80' }
  ];

  // Example robust mock data for layout purposes
  const allListings = {
    Tour: [
      { id: 1, title: 'Nusa Penida West Island Tour', location: 'Nusa Penida', price: 45, duration: 'Full Day', category: 'Island Tour', rating: 4.9, reviews: 342, status: 'Active', image: 'https://images.unsplash.com/photo-1554481923-a6918bd997bc?auto=format&fit=crop&w=400&q=80' },
      { id: 2, title: 'Mount Batur Sunrise Trekking', location: 'Kintamani', price: 35, duration: '12 Hours', category: 'Trekking', rating: 4.8, reviews: 215, status: 'Active', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=400&q=80' },
      { id: 3, title: 'Uluwatu Sunset Temple', location: 'Uluwatu', price: 30, duration: '6 Hours', category: 'Show & Culture', rating: 4.9, reviews: 521, status: 'Draft', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80' },
      { id: 4, title: 'Waterfalls: Tegenungan & Tibumana', location: 'Gianyar', price: 28, duration: '8 Hours', category: 'Nature', rating: 4.6, reviews: 112, status: 'Active', image: 'https://images.unsplash.com/photo-1590504104977-802758117769?auto=format&fit=crop&w=400&q=80' },
    ],
    Spa: [
      { id: 5, title: 'Balinese Traditional Massage', location: 'Ubud', price: 25, duration: '90 Mins', category: 'Massage', rating: 4.9, reviews: 142, status: 'Active', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80' },
      { id: 6, title: 'Couples Romance Spa Package', location: 'Seminyak', price: 120, duration: '3 Hours', category: 'Package', rating: 4.7, reviews: 89, status: 'Active', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80' },
    ],
    Scooter: [
      { id: 7, title: 'Honda Scoopy 2023', company: 'THE BIKE RENTAL BALI', location: 'Kuta', price: 8, duration: 'Per Day', category: 'Standard', rating: 4.5, reviews: 304, status: 'Active', image: 'https://images.unsplash.com/photo-1627885474811-37f2a1eb4010?auto=format&fit=crop&w=400&q=80' },
      { id: 8, title: 'Yamaha NMAX 155cc', company: 'B&G UBUD RENT MOTOR BIKE', location: 'Canggu', price: 15, duration: 'Per Day', category: 'Premium', rating: 4.8, reviews: 211, status: 'Active', image: 'https://images.unsplash.com/photo-1591637508605-7289ee0f5509?auto=format&fit=crop&w=400&q=80' },
      { id: 11, title: 'Vespa Sprint 150', company: 'BALI DIARY RENTAL', location: 'Amed', price: 20, duration: 'Per Day', category: 'Premium', rating: 4.9, reviews: 142, status: 'Active', image: 'https://images.unsplash.com/photo-1563216832-6efaba98539e?auto=format&fit=crop&w=400&q=80' },
    ],
    Transport: [
      { id: 9, title: 'Airport Transfer (DPS)', location: 'Bali', price: 20, duration: 'One Way', category: 'Transfer', rating: 4.9, reviews: 832, status: 'Active', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=400&q=80' },
      { id: 10, title: 'Full Day Private Van & Driver', location: 'Anywhere', price: 55, duration: '10 Hours', category: 'Private Booking', rating: 4.8, reviews: 150, status: 'Active', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80' },
    ]
  };

  const tabs = ["Tour", "Spa", "Scooter", "Transport"];
  const [listingsData, setListingsData] = useState(allListings);
  let currentListings = listingsData[activeTab].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleDelete = (item) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
       setListingsData(prev => ({
         ...prev,
         [activeTab]: prev[activeTab].filter(i => i.id !== item.id)
       }));
    }
  };

  const handleToggleStatus = (item) => {
    setListingsData(prev => ({
       ...prev,
       [activeTab]: prev[activeTab].map(i => i.id === item.id ? { ...i, status: i.status === 'Active' ? 'Draft' : 'Active' } : i)
    }));
  };

  const handlePreview = (item) => {
    window.open(`/tours/${item.id}`, '_blank');
  };

  const handleSaveItem = (updatedItem) => {
    setListingsData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(i => i.id === updatedItem.id ? updatedItem : i)
    }));
    setEditingItem(null);
  };

  const toggleCompany = (companyId) => {
    if (expandedCompanyIds.includes(companyId)) {
      setExpandedCompanyIds(expandedCompanyIds.filter(id => id !== companyId));
    } else {
      setExpandedCompanyIds([...expandedCompanyIds, companyId]);
    }
  };

  const handleCreateNew = () => {
    if (activeTab === "Scooter") {
      alert("Redirecting to Partners Dashboard to create new Scooter Company...");
      window.location.href = "/admin/partners";
      return;
    }
    const newItem = {
      id: `NEW-${Math.floor(Math.random() * 10000)}`,
      title: "",
      location: "Bali, Indonesia",
      duration: "1 Day",
      price: "0",
      rating: "5.0",
      reviews: "0",
      category: activeTab,
      status: "Draft",
      image: ""
    };
    setEditingItem(newItem);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
               {activeTab === "Scooter" ? "Scooter Inventory" : "Product Inventory"}
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
               {activeTab === "Scooter" 
                 ? `${scooterCompanies.length} partner companies • ${allListings.Scooter.length} total listings` 
                 : "Add, edit, or remove your products."}
            </p>
          </div>
          <button onClick={handleCreateNew} className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm shadow-sm transition-all text-white ${activeTab === "Scooter" ? 'bg-gray-800 hover:bg-gray-900' : 'bg-[#FF5533] hover:bg-[#E64A2E]'}`}>
            <Plus size={18} strokeWidth={2.5} />
            {activeTab === "Scooter" ? "Add Company" : "Create Product"}
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-2">
          
          {/* Segmented Control */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setExpandedCompanyIds([]);
                }}
                className={`flex-1 min-w-[80px] px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-primary'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="hidden md:block w-px bg-gray-200 mx-2"></div>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={activeTab === "Scooter" ? "Search companies or scooter models..." : `Search ${activeTab.toLowerCase()}s...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-transparent border-none focus:ring-0 text-sm font-medium text-primary pl-11 pr-4 py-3 md:py-2 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {activeTab === "Scooter" ? (
          <div className="space-y-4">
            {scooterCompanies.map(company => {
              const isExpanded = expandedCompanyIds.includes(company.id);
              const companyScooters = allListings.Scooter.filter(s => s.company === company.name);
              return (
                <div key={company.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-2">
                         <h3 className="font-extrabold text-[16px] text-primary uppercase tracking-tight">{company.name}</h3>
                         {company.verified && (
                           <span className="bg-gray-100 text-[10px] font-bold text-gray-600 px-2.5 py-1 rounded-full uppercase tracking-widest">VERIFIED</span>
                         )}
                       </div>
                       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold text-gray-500">
                         <div className="flex items-center gap-1.5"><MapPin size={14} /> {company.location}</div>
                         <div className="flex items-center gap-1.5"><Link2 size={14} /> Joined {company.joined}</div>
                         <div className="font-bold text-primary">{companyScooters.length} Scooter</div>
                         <div className="flex items-center gap-1.5 bg-[#E8F8EE] text-[#1EB652] px-3 py-1.5 rounded-full font-bold">
                           <MessageCircle size={14} className="fill-[#1EB652] text-white" /> {company.phone}
                         </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 border-t md:border-0 border-gray-100 pt-4 md:pt-0 mt-2 md:mt-0">
                       <button className="bg-black text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-2.5 rounded-full flex items-center gap-1.5 hover:bg-black/90 transition-colors">
                          <Plus size={14} strokeWidth={3} /> Add Scooter
                       </button>
                       <button onClick={() => alert("Edit company details mode")} className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-primary transition-colors">
                          <Edit2 size={14} />
                       </button>
                       <button onClick={() => {if(confirm("Are you sure you want to remove this partner company?")) alert("Company Removed!")}} className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                          <Trash2 size={14} />
                       </button>
                       <button onClick={() => toggleCompany(company.id)} className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-primary transition-colors ml-1">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                       </button>
                    </div>
                  </div>
                  
                  {/* Expanded Sub-List */}
                  {isExpanded && (
                    <div className="border-t border-gray-50 bg-gray-50/50 p-5 pl-8 space-y-3">
                       {companyScooters.length > 0 ? companyScooters.map(scooter => (
                          <div key={scooter.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <img src={scooter.image} alt={scooter.title} className="w-12 h-12 rounded-lg object-cover" />
                                <div>
                                   <div className="flex items-center gap-2 mb-1">
                                     <h4 className="font-bold text-[14px] text-primary">{scooter.title}</h4>
                                     <span className="bg-primary/5 text-[10px] font-extrabold text-primary px-2 py-0.5 rounded-md uppercase tracking-wider">{scooter.category}</span>
                                   </div>
                                   <div className="text-[12px] font-semibold text-gray-500">Rp {scooter.price} / {scooter.duration}</div>
                                </div>
                             </div>
                             <div className="flex items-center gap-3">
                                <div className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${scooter.status==='Active'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>{scooter.status}</div>
                                 <button onClick={() => setReviewingItem(scooter)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100">
                                    <MessageSquare size={12} />
                                 </button>
                                 <button onClick={() => handlePreview(scooter)} className="w-8 h-8 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-200">
                                    <ExternalLink size={12} />
                                 </button>
                                 <button onClick={() => handleToggleStatus(scooter)} className="w-8 h-8 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-200">
                                    <EyeOff size={12} />
                                 </button>
                                 <button onClick={() => handleDelete(scooter)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100">
                                    <Trash2 size={12} />
                                 </button>
                              </div>
                          </div>
                       )) : (
                          <p className="text-sm font-medium text-gray-400">No scooters listed yet.</p>
                       )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Regular Grid for All Other Tabs */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentListings.map(item => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all flex flex-col">
              {/* Image Section */}
              <div className="relative h-48 w-full overflow-hidden shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                <div className={`absolute top-3 left-3 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm ${item.status === 'Active' ? 'bg-[#1DBB67] text-white' : 'bg-gray-500 text-white'}`}>
                  {item.status === 'Active' ? 'PUBLISHED' : 'DRAFT'}
                </div>
                
                <div className="absolute top-3 right-3 shadow-sm rounded-full overflow-hidden">
                   <select className="appearance-none bg-white font-extrabold text-[#F9703E] text-[10px] pl-3 pr-7 py-1.5 uppercase tracking-wider outline-none cursor-pointer focus:ring-0">
                      <option value={item.category}>{item.category}</option>
                      <option value="Adventure">ADVENTURE</option>
                      <option value="Water">WATER</option>
                      <option value="Nature">NATURE</option>
                      <option value="Culture">CULTURE</option>
                   </select>
                   <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#F9703E]">
                     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                   </div>
                </div>
                
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                  + {Math.floor(Math.random() * 4) + 2} MORE
                </div>
              </div>

              {/* Data Section */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-extrabold text-[15px] text-primary leading-tight mb-2 line-clamp-3 md:line-clamp-2">{item.title}</h3>
                
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs font-bold text-gray-400 mb-4">
                  <span>{item.duration || 'Full Day'}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-yellow-400"><Star size={12} className="fill-yellow-400 text-yellow-400" /> {item.rating}</span>
                  <span>·</span>
                  <span>{item.reviews} reviews</span>
                </div>
                
                {item.company && (
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 border border-gray-100 bg-gray-50 inline-block px-2 py-0.5 rounded-md self-start">
                    Provider: <span className="text-primary">{item.company}</span>
                  </div>
                )}
                
                <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4">
                  <div>
                    <div className="font-black text-[18px] text-primary mb-0.5 tracking-tight">
                       {item.price > 1000 ? `IDR ${Number(item.price).toLocaleString('id-ID')}` : `IDR ${(item.price * 15000).toLocaleString('id-ID')}`}
                    </div>
                    <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                       / {item.pricingType === "Per Group" ? 'GROUP' : 'PERSON'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setReviewingItem(item)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 hover:shadow-sm transition-all focus:outline-none" title="Messages">
                      <MessageSquare size={14} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => handlePreview(item)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all focus:outline-none" title="Preview Listing">
                      <ExternalLink size={14} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(item)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'Draft' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'} hover:shadow-sm transition-all focus:outline-none`} title="Toggle Visibility">
                      <EyeOff size={14} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => handleEdit(item)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 hover:shadow-sm transition-all focus:outline-none" title="Edit Listing">
                      <Edit2 size={14} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 hover:shadow-sm transition-all focus:outline-none" title="Delete Listing">
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {currentListings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
             <PackageOpen size={48} className="mx-auto text-gray-300 mb-4" />
             <h3 className="text-lg font-bold text-primary mb-1">No listings found</h3>
             <p className="text-sm font-medium text-gray-500">Try adjusting your search query or create a new listing.</p>
          </div>
        )}

      </div>

      {/* Edit Component Render */}
      {editingItem && (
        <EditListingModal 
           item={editingItem} 
           activeTab={activeTab}
           onClose={() => setEditingItem(null)} 
           onSave={handleSaveItem}
        />
      )}
      {/* Review Modal Render */}
      {reviewingItem && (
        <ReviewModal 
           item={reviewingItem} 
           onClose={() => setReviewingItem(null)} 
        />
      )}
    </div>
  );
}
