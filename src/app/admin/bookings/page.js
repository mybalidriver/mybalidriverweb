"use client";

import React, { useState, useEffect } from "react";
import { Search, Calendar, PackageOpen, MoreVertical, CheckCircle, Clock, XCircle, Trash2, X, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BookingsManagement() {
  const [activeTab, setActiveTab] = useState("Tour");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState({ Tour: [], Activities: [], Transport: [] });
  const [isLoaded, setIsLoaded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
    
    // Fallback to polling instead of Realtime listener to safely bypass RLS
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
    
      if (data) {
        const grouped = { Tour: [], Activities: [], Transport: [] };
        data.forEach(b => {
           const mapped = {
              id: b.id,
              user: b.customer_name,
              contact: b.contact_info,
              tour: b.service_name,
              date: b.booking_date,
              amount: b.amount,
              status: b.status,
              details: b.details,
              category: b.category
           };
           if (grouped[b.category]) {
              grouped[b.category].push(mapped);
           } else {
              grouped[b.category] = [mapped];
           }
        });
        setBookings(grouped);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoaded(true);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    const updated = {
      ...bookings,
      [activeTab]: bookings[activeTab].map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    };
    setBookings(updated);
    setOpenDropdown(null);
    if(selectedBooking) {
        setSelectedBooking({...selectedBooking, status: newStatus});
    }
    
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: bookingId, status: newStatus })
    });
  };

  const handleDelete = async (bookingId) => {
    if (confirm("Permanently delete this booking?")) {
      const updated = {
        ...bookings,
        [activeTab]: bookings[activeTab].filter(b => b.id !== bookingId)
      };
      setBookings(updated);
      setSelectedBooking(null);
      setOpenDropdown(null);
      
      await fetch('/api/admin/bookings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId })
      });
    }
  };

  if (!isLoaded) return null;

  const tabs = ["Tour", "Activities", "Transport"];
  const currentItems = (bookings[activeTab] || []).filter(b => 
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.tour.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = (e, id) => {
    e.stopPropagation(); // prevent modal from opening when clicking dropdown
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto scroll-smooth">
      <div className="space-y-8 pb-24"> {/* Extra padding for mobile bottom nav */}
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1C1C1E] tracking-tight">Booking Management</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Review, manage, and execute customer booking actions.</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-2.5 rounded-3xl border border-[#E8EAEF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-2">
          <div className="flex bg-[#F8F9FA] p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setOpenDropdown(null); }}
                className={`flex-1 min-w-[80px] px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all ${activeTab === tab ? 'bg-[#1C1C1E] text-white shadow-sm' : 'text-gray-500 hover:text-[#1C1C1E]'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="hidden md:block w-px bg-[#E8EAEF] mx-2"></div>

          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Booking ID, name, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-transparent border-none focus:ring-0 text-sm font-bold text-[#1C1C1E] pl-11 pr-4 py-3 md:py-2 outline-none placeholder:text-gray-400 placeholder:font-medium"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white border border-[#E8EAEF] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden mt-4">
          <div className="overflow-x-hidden">
            <table className="w-full text-left border-collapse cursor-pointer">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[#E8EAEF]">
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4">Ref ID</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 hidden md:table-cell">Customer Info</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 w-full md:w-auto">Service Hook</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 hidden sm:table-cell">Transaction</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 hidden lg:table-cell">Status</th>
                  <th className="font-bold text-[10px] uppercase tracking-widest text-gray-400 px-6 py-4 text-right hidden lg:table-cell">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAEF]">
                {currentItems.length > 0 ? currentItems.map((booking, i) => (
                  <tr key={i} onClick={() => setSelectedBooking(booking)} className="hover:bg-[#F8F9FA] active:bg-gray-100 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-black text-[#1C1C1E]">{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                       <p className="text-sm font-extrabold text-[#1C1C1E]">{booking.user}</p>
                       <p className="text-[11px] text-gray-500 font-bold">{booking.contact}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap truncate max-w-[200px] md:max-w-none">
                       <p className="text-sm font-bold text-[#1C1C1E] truncate">{booking.tour}</p>
                       <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1 mt-0.5"><Calendar size={10} /> {booking.date}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-[#1C1C1E] hidden sm:table-cell">{booking.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest
                        ${booking.status === 'Confirmed' ? 'bg-[#D9FB41] text-[#1C1C1E]' : ''}
                        ${booking.status === 'Pending' ? 'bg-amber-100 text-amber-800' : ''}
                        ${booking.status === 'Completed' ? 'bg-[#F8F9FA] text-gray-600' : ''}
                        ${booking.status === 'Cancelled' ? 'bg-red-50 text-red-600' : ''}
                      `}>
                         {booking.status === 'Confirmed' && <CheckCircle size={12} />}
                         {booking.status === 'Pending' && <Clock size={12} />}
                         {booking.status === 'Completed' && <CheckCircle size={12} />}
                         {booking.status === 'Cancelled' && <XCircle size={12} />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right relative hidden lg:table-cell">
                       <button onClick={(e) => toggleDropdown(e, booking.id)} className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent text-gray-400 hover:bg-gray-100 hover:text-[#1C1C1E] ml-auto focus:outline-none transition-colors">
                         <MoreVertical size={16} />
                       </button>
                       {openDropdown === booking.id && (
                         <div className="absolute right-6 top-10 mt-1 w-48 bg-white shadow-2xl border border-[#E8EAEF] rounded-2xl overflow-hidden z-20">
                            {(booking.status === 'Pending') && <button onClick={(e) => { e.stopPropagation(); handleStatusChange(booking.id, 'Confirmed'); }} className="w-full text-left px-5 py-3 text-xs font-bold text-[#1C1C1E] hover:bg-[#F8F9FA] border-b border-gray-50 text-green-600">Mark Confirmed</button>}
                            {(booking.status === 'Confirmed') && <button onClick={(e) => { e.stopPropagation(); handleStatusChange(booking.id, 'Completed'); }} className="w-full text-left px-5 py-3 text-xs font-bold text-[#1C1C1E] hover:bg-[#F8F9FA] border-b border-gray-50">Mark Completed</button>}
                            {(booking.status !== 'Cancelled' && booking.status !== 'Completed') && <button onClick={(e) => { e.stopPropagation(); handleStatusChange(booking.id, 'Cancelled'); }} className="w-full text-left px-5 py-3 text-xs font-bold text-[#1C1C1E] hover:bg-[#F8F9FA] border-b border-gray-50 text-amber-600">Cancel Booking</button>}
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(booking.id); }} className="w-full text-left px-5 py-3 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14}/> Delete Record</button>
                         </div>
                       )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6">
                       <div className="text-center py-24 bg-white rounded-b-3xl">
                          <div className="w-16 h-16 bg-[#F8F9FA] rounded-2xl flex items-center justify-center mx-auto mb-4">
                             <PackageOpen size={24} className="text-gray-300" />
                          </div>
                          <h3 className="text-lg font-black text-[#1C1C1E] mb-1">No bookings found</h3>
                          <p className="text-sm font-medium text-gray-400">Try adjusting your active filters.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Tap-to-Expand Mobile Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center pt-20 px-4 pb-4">
          <div className="fixed inset-0 bg-[#1C1C1E]/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-6 z-10 animate-slideUp sm:animate-scaleIn overflow-y-auto max-h-[85vh]">
             <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#1C1C1E]">{selectedBooking.id}</h3>
                  <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mt-1">Booking Reference</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="w-10 h-10 bg-[#F8F9FA] rounded-full flex items-center justify-center text-[#1C1C1E] hover:bg-gray-200 transition-colors">
                  <X size={18} strokeWidth={2.5} />
                </button>
             </div>
             
             <div className="space-y-5 mb-8 border-y border-[#E8EAEF] py-6">
               <div>
                 <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Users size={12}/> Customer Profile</p>
                 <p className="text-[15px] font-bold text-[#1C1C1E]">{selectedBooking.user}</p>
                 <p className="text-sm font-bold text-blue-500 mt-0.5">{selectedBooking.contact}</p>
               </div>
               <div>
                 <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><PackageOpen size={12}/> Product Selected</p>
                 <p className="text-[15px] font-bold text-[#1C1C1E]">{selectedBooking.tour}</p>
                 <p className="text-sm font-bold text-gray-500 mt-0.5">Category: {activeTab}</p>
               </div>
               <div className="flex justify-between bg-[#F8F9FA] p-4 rounded-2xl">
                 <div>
                   <p className="text-[10px] font-extrabold text-[#1C1C1E] uppercase tracking-widest mb-1">Timestamp</p>
                   <p className="text-sm font-bold text-[#1C1C1E] flex items-center gap-1.5"><Calendar size={14} className="text-[#D9FB41]"/> {selectedBooking.date}</p>
                 </div>
                 <div className="text-right border-l border-[#E8EAEF] pl-4">
                   <p className="text-[10px] font-extrabold text-[#1C1C1E] uppercase tracking-widest mb-1">Transaction</p>
                   <p className="text-sm font-black text-[#1C1C1E]">{selectedBooking.amount}</p>
                 </div>
               </div>
               
               {selectedBooking.details && (
                 <div className="mt-4 p-4 bg-[#F8F9FA] rounded-2xl border border-[#E8EAEF]">
                   <p className="text-[10px] font-extrabold text-[#1C1C1E] uppercase tracking-widest mb-3">Customer Form Details</p>
                   <div className="space-y-3">
                     {Object.entries(selectedBooking.details).map(([key, value]) => (
                       <div key={key}>
                         <div className="text-[10px] font-bold text-gray-500 uppercase leading-tight mb-0.5">{key.replace(/_/g, ' ')}</div>
                         <div className="text-[14px] font-extrabold text-[#1C1C1E] leading-tight">{typeof value === 'object' ? JSON.stringify(value) : value}</div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

             </div>

             <div className="space-y-3">
               <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Management Actions</p>

               <div className="grid grid-cols-2 gap-3 mb-4">
                  <span className={`col-span-2 inline-flex items-center justify-center py-2.5 rounded-xl text-sm font-black uppercase tracking-widest border
                    ${selectedBooking.status === 'Confirmed' ? 'bg-[#D9FB41]/10 text-green-700 border-[#D9FB41]' : ''}
                    ${selectedBooking.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                    ${selectedBooking.status === 'Completed' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''}
                    ${selectedBooking.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                  `}>
                      Current Status: {selectedBooking.status}
                  </span>
               </div>

                {(selectedBooking.status === 'Pending') && <button onClick={() => handleStatusChange(selectedBooking.id, 'Confirmed')} className="w-full py-3.5 bg-[#D9FB41] text-[#1C1C1E] font-black rounded-xl hover:bg-[#C5E838] transition-colors shadow-sm">Mark as Confirmed</button>}
                {(selectedBooking.status === 'Confirmed') && <button onClick={() => handleStatusChange(selectedBooking.id, 'Completed')} className="w-full py-3.5 bg-[#1C1C1E] text-white font-black rounded-xl hover:bg-black transition-colors shadow-sm">Mark as Completed</button>}
                {(selectedBooking.status !== 'Cancelled' && selectedBooking.status !== 'Completed') && <button onClick={() => handleStatusChange(selectedBooking.id, 'Cancelled')} className="w-full py-3 bg-white border border-[#E8EAEF] text-[#1C1C1E] font-extrabold rounded-xl hover:bg-gray-50 transition-colors">Cancel Booking</button>}
                <button onClick={() => handleDelete(selectedBooking.id)} className="w-full py-3 bg-red-50 border border-red-100 text-red-500 font-extrabold rounded-xl hover:bg-red-100 transition-colors mt-4">Delete Record</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
