"use client";

import React, { useState } from "react";
import { Users, DollarSign, Calendar, MapPin, TrendingUp, ChevronRight, Activity, Download } from "lucide-react";
import { TourIcon, SpaIcon, ScooterIcon, TransportIcon } from "../../components/icons/CategoryIcons";

export default function AdminDashboard() {
  const [activeCategory, setActiveCategory] = useState("Tour");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Mock Data organized by Category
  const dashboardData = {
    Tour: {
      stats: [
        { label: "Gross Revenue", value: "Rp 42.500.000", trend: "+12.5%", icon: DollarSign },
        { label: "Confirmed Bookings", value: "142", trend: "+5.2%", icon: Calendar },
        { label: "Total Participants", value: "3,842", trend: "+18.0%", icon: Users },
        { label: "Active Inventory", value: "54", trend: "0.0%", icon: MapPin },
      ],
      bookings: [
        { id: "BK-4291", ref: "GYGT-8841", user: "Emma Thompson", tour: "Mount Batur Sunrise Trek", amount: "Rp 650.000", status: "Confirmed", date: "Today, 09:24", details: { passengers: "2 Pax", booking_date: "2026-05-15", hotel_pickup: "W Bali Seminyak" } },
        { id: "BK-4290", ref: "GYGT-8840", user: "Michael Chen", tour: "Nusa Penida West Island Tour", amount: "Rp 850.000", status: "Pending", date: "Today, 08:15", details: { passengers: "4 Pax", booking_date: "2026-05-18", hotel_pickup: "Four Seasons Sayan" } },
        { id: "BK-4289", ref: "GYGT-8839", user: "Sarah Johnson", tour: "Uluwatu Sunset Temple & Fire Dance", amount: "Rp 400.000", status: "Completed", date: "Yesterday, 16:30", details: { passengers: "1 Pax", booking_date: "2026-05-12", hotel_pickup: "Self-arrival" } },
        { id: "BK-4288", ref: "GYGT-8838", user: "David Smith", tour: "Ubud Monkey Forest Guided Tour", amount: "Rp 350.000", status: "Confirmed", date: "Yesterday, 13:12", details: { passengers: "2 Pax", booking_date: "2026-05-10", hotel_pickup: "Alila Ubud" } },
      ]
    },
    Spa: {
      stats: [
        { label: "Gross Revenue", value: "Rp 18.200.000", trend: "+8.1%", icon: DollarSign },
        { label: "Confirmed Appointments", value: "89", trend: "+12.0%", icon: Calendar },
        { label: "Total Participants", value: "1,200", trend: "+5.4%", icon: Users },
        { label: "Active Inventory", value: "12", trend: "0.0%", icon: MapPin },
      ],
      bookings: [
        { id: "SP-1092", ref: "GYGS-1002", user: "Jessica Jung", tour: "Balinese Traditional Massage", amount: "Rp 250.000", status: "Confirmed", date: "Today, 10:00", details: { booking_date: "2026-05-16", preferred_time: "14:00", guests: "1 Pax", hotel_pickup: "Mandapa Ubud" } },
        { id: "SP-1091", ref: "GYGS-1001", user: "Lukas Müller", tour: "Couples Romance Spa Experience", amount: "Rp 1.500.000", status: "Pending", date: "Yesterday, 15:20", details: { booking_date: "2026-05-20", preferred_time: "16:00", guests: "2 Pax", hotel_pickup: "Ayana Resort" } },
      ]
    },
    Scooter: {
      stats: [
        { label: "Gross Revenue", value: "Rp 9.400.000", trend: "+22.4%", icon: DollarSign },
        { label: "Confirmed Rentals", value: "45", trend: "-2.1%", icon: Calendar },
        { label: "Total Renters", value: "850", trend: "+10.1%", icon: Users },
        { label: "Active Fleet", value: "60", trend: "+5.0%", icon: MapPin },
      ],
      bookings: [
        { id: "SC-8401", ref: "GYGV-841", user: "Tom Hacker", tour: "Honda Scoopy 2023", amount: "Rp 150.000", status: "Confirmed", date: "Today, 08:00", details: { booking_date: "2026-05-10", duration: "3 Days", delivery_location: "Ngurah Rai Airport" } },
        { id: "SC-8400", ref: "GYGV-840", user: "Elena Rostova", tour: "Yamaha NMAX", amount: "Rp 250.000", status: "Completed", date: "Yesterday, 09:00", details: { booking_date: "2026-05-02", duration: "1 Day", delivery_location: "W Bali Seminyak" } },
        { id: "SC-8399", ref: "GYGV-839", user: "Chris Davis", tour: "Vespa Sprint", amount: "Rp 400.000", status: "Confirmed", date: "Yesterday, 18:15", details: { booking_date: "2026-05-22", duration: "7 Days", delivery_location: "Canggu Echo Beach" } },
      ]
    },
    Transport: {
      stats: [
        { label: "Gross Revenue", value: "Rp 21.000.000", trend: "+15.8%", icon: DollarSign },
        { label: "Confirmed Transfers", value: "32", trend: "+8.9%", icon: Calendar },
        { label: "Total Passengers", value: "2,100", trend: "+14.3%", icon: Users },
        { label: "Active Drivers", value: "28", trend: "+2.1%", icon: MapPin },
      ],
      bookings: [
        { id: "TR-5502", ref: "GYGTR-502", user: "Amanda Lee", tour: "Airport Transfer - DPS", amount: "Rp 300.000", status: "Pending", date: "Today, 13:45", details: { booking_date: "2026-06-05", preferred_time: "13:45", passengers: "3 Pax", pickup_location: "DPS Airport", dropoff_location: "Ubud Center" } },
        { id: "TR-5501", ref: "GYGTR-501", user: "Mark Wilson", tour: "Full Day Private Van (10 Hours)", amount: "Rp 800.000", status: "Confirmed", date: "Today, 07:30", details: { booking_date: "2026-06-08", preferred_time: "08:00", passengers: "8 Pax", pickup_location: "Nusa Dua Resort", dropoff_location: "Multiple Stops - 10 Hours" } },
      ]
    }
  };

  const currentStats = dashboardData[activeCategory].stats;
  const currentBookings = dashboardData[activeCategory].bookings;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1C1C1E] tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Track your product portfolio performance and bookings.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-[#E8EAEF] text-[#1C1C1E] px-5 py-2.5 rounded-xl text-sm font-extrabold hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
             <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* Styled Category Tabs */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 snap-x">
          <button 
          onClick={() => setActiveCategory("Tour")}
          className={`snap-center shrink-0 flex items-center justify-center gap-3 px-6 h-14 rounded-2xl font-extrabold shadow-sm active:scale-95 transition-all ${activeCategory === "Tour" ? "bg-[#1C1C1E] text-white" : "bg-white text-gray-500 hover:bg-gray-50 border border-[#E8EAEF]"}`}>
            <TourIcon size={20} strokeWidth={2.5} className={activeCategory === "Tour" ? "text-[#D9FB41]" : "text-gray-400"} />
            <span className="text-[13px] tracking-wide">Tour Dashboard</span>
          </button>
          <button 
          onClick={() => setActiveCategory("Spa")}
          className={`snap-center shrink-0 flex items-center justify-center gap-3 px-6 h-14 rounded-2xl font-extrabold shadow-sm active:scale-95 transition-all ${activeCategory === "Spa" ? "bg-[#1C1C1E] text-white" : "bg-white text-gray-500 hover:bg-gray-50 border border-[#E8EAEF]"}`}>
            <SpaIcon size={20} strokeWidth={2.5} className={activeCategory === "Spa" ? "text-[#D9FB41]" : "text-gray-400"} />
            <span className="text-[13px] tracking-wide">Spa Dashboard</span>
          </button>
          <button 
          onClick={() => setActiveCategory("Scooter")}
          className={`snap-center shrink-0 flex items-center justify-center gap-3 px-6 h-14 rounded-2xl font-extrabold shadow-sm active:scale-95 transition-all ${activeCategory === "Scooter" ? "bg-[#1C1C1E] text-white" : "bg-white text-gray-500 hover:bg-gray-50 border border-[#E8EAEF]"}`}>
            <ScooterIcon size={20} strokeWidth={2.5} className={activeCategory === "Scooter" ? "text-[#D9FB41]" : "text-gray-400"} />
            <span className="text-[13px] tracking-wide">Scooters</span>
          </button>
          <button 
          onClick={() => setActiveCategory("Transport")}
          className={`snap-center shrink-0 flex items-center justify-center gap-3 px-6 h-14 rounded-2xl font-extrabold shadow-sm active:scale-95 transition-all ${activeCategory === "Transport" ? "bg-[#1C1C1E] text-white" : "bg-white text-gray-500 hover:bg-gray-50 border border-[#E8EAEF]"}`}>
            <TransportIcon size={20} strokeWidth={2.5} className={activeCategory === "Transport" ? "text-[#D9FB41]" : "text-gray-400"} />
            <span className="text-[13px] tracking-wide">Transports</span>
          </button>
      </div>
      
      {/* Soft Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentStats.map((stat, i) => {
          const Icon = stat.icon;
          const isPositive = stat.trend.includes('+');
          const isNeutral = stat.trend === '0.0%';
          return (
            <div key={i} className="bg-white p-6 rounded-3xl border border-[#E8EAEF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col group hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4 text-gray-500">
                <span className="text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeCategory === 'Tour' ? 'bg-[#F8F9FA]' : 'bg-[#F8F9FA]'} group-hover:bg-[#1C1C1E] group-hover:text-[#D9FB41] transition-colors`}>
                  <Icon size={20} strokeWidth={2.5} className={activeCategory === 'Tour' ? "text-[#1C1C1E] group-hover:text-[#D9FB41]" : "text-[#1C1C1E] group-hover:text-[#D9FB41]"} />
                </div>
              </div>
              <h4 className="text-[26px] font-black text-[#1C1C1E] mb-2 tracking-tight">{stat.value}</h4>
              <div className="mt-auto">
                 <span className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-lg
                   ${isPositive ? 'bg-green-50 text-green-700' : isNeutral ? 'bg-gray-50 text-gray-500' : 'bg-red-50 text-red-600'}
                 `}>
                   {isPositive && <TrendingUp size={12} strokeWidth={3} />}
                   {stat.trend} <span className="font-semibold opacity-70">vs last month</span>
                 </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modern Bookings Table */}
      <div className="bg-white rounded-3xl border border-[#E8EAEF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E8EAEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Activity size={20} className="text-[#1C1C1E]" strokeWidth={2.5} />
            <h3 className="font-black text-lg text-[#1C1C1E]">Recent Bookings Log</h3>
          </div>
          <button className="text-sm font-extrabold text-[#1C1C1E] hover:text-gray-500 flex items-center gap-1 transition-colors">
             View All Bookings <ChevronRight size={16} strokeWidth={3} />
          </button>
        </div>
        
        <div className="overflow-x-hidden">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-[#F8F9FA] text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-[#E8EAEF]">
                   <th className="px-6 py-4">Reference</th>
                   <th className="px-6 py-4 hidden sm:table-cell">Customer</th>
                   <th className="px-6 py-4 hidden md:table-cell">Product Selected</th>
                   <th className="px-6 py-4 hidden lg:table-cell">Timestamp</th>
                   <th className="px-6 py-4 text-right">Amount</th>
                   <th className="px-6 py-4 text-center hidden sm:table-cell">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-[#E8EAEF] text-sm">
                {currentBookings.map((booking, i) => (
                  <tr key={i} onClick={() => setSelectedBooking(booking)} className="hover:bg-[#F8F9FA] transition-colors group cursor-pointer active:bg-gray-100">
                     <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white border border-[#E8EAEF] shadow-sm flex items-center justify-center text-[#1C1C1E] font-black text-xs shrink-0 group-hover:bg-[#1C1C1E] group-hover:text-[#D9FB41] transition-colors">
                              {booking.id.split('-')[1]}
                           </div>
                           <div className="flex flex-col">
                              <span className="font-extrabold text-[#1C1C1E]">{booking.ref}</span>
                              <span className="text-[11px] font-bold text-gray-400">{booking.id}</span>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell text-gray-600 font-bold">{booking.user}</td>
                     <td className="px-6 py-4 text-[#1C1C1E] font-bold hidden md:table-cell">
                        {booking.tour}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium hidden lg:table-cell">{booking.date}</td>
                     <td className="px-6 py-4 whitespace-nowrap font-black text-[#1C1C1E] text-right">{booking.amount}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest
                          ${booking.status === 'Confirmed' ? 'bg-[#D9FB41] text-[#1C1C1E]' : ''}
                          ${booking.status === 'Pending' ? 'bg-amber-100 text-amber-800' : ''}
                          ${booking.status === 'Completed' ? 'bg-gray-100 text-gray-500' : ''}
                        `}>
                          {booking.status}
                        </span>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>

      {/* Tap-to-Expand Mobile Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center font-sans px-4">
          <div className="fixed inset-0 bg-[#1C1C1E]/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 z-10 animate-scaleIn">
             <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-[#1C1C1E]">{selectedBooking.ref}</h3>
                  <p className="text-xs font-bold text-gray-400 mt-1">{selectedBooking.id}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest
                    ${selectedBooking.status === 'Confirmed' ? 'bg-[#D9FB41] text-[#1C1C1E]' : ''}
                    ${selectedBooking.status === 'Pending' ? 'bg-amber-100 text-amber-800' : ''}
                    ${selectedBooking.status === 'Completed' ? 'bg-gray-100 text-gray-500' : ''}
                `}>
                    {selectedBooking.status}
                </span>
             </div>
             
             <div className="space-y-4 mb-6 border-y border-[#E8EAEF] py-4">
               <div>
                 <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Customer</p>
                 <p className="text-sm font-bold text-[#1C1C1E]">{selectedBooking.user}</p>
               </div>
               <div>
                 <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Product Selected</p>
                 <p className="text-sm font-bold text-[#1C1C1E]">{selectedBooking.tour}</p>
               </div>
               <div className="flex justify-between">
                 <div>
                   <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Timestamp</p>
                   <p className="text-sm font-bold text-[#1C1C1E]">{selectedBooking.date}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Amount</p>
                   <p className="text-sm font-black text-[#1C1C1E]">{selectedBooking.amount}</p>
                 </div>
               </div>
             </div>

             {selectedBooking.details && (
               <div className="mb-6 p-4 bg-[#F8F9FA] rounded-2xl border border-[#E8EAEF]">
                 <p className="text-[10px] font-extrabold text-[#1C1C1E] uppercase tracking-widest mb-3">Customer Form Details</p>
                 <div className="space-y-3">
                   {Object.entries(selectedBooking.details).map(([key, value]) => (
                     <div key={key} className="flex flex-col">
                       <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight mb-1">{key.replace(/_/g, ' ')}</span>
                       <span className="text-[14px] font-extrabold text-[#1C1C1E] leading-tight break-words">{value}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
             <div className="flex gap-3 mt-6">
               <button onClick={() => setSelectedBooking(null)} className="flex-1 py-3 bg-[#F8F9FA] text-[#1C1C1E] font-extrabold rounded-xl hover:bg-gray-100 transition-colors">Close</button>
               <button onClick={() => setSelectedBooking(null)} className="flex-1 py-3 bg-[#1C1C1E] text-[#D9FB41] font-extrabold rounded-xl hover:bg-black transition-colors">Manage</button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
