"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, Navigation, MessageCircle, CalendarCheck, XCircle } from "lucide-react";

const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const [bookings, setBookings] = useState([
    {
      id: "b1",
      title: "Uluwatu Sunset Temple & Kecak Fire Dance",
      date: "April 12, 2026",
      time: "15:00 PM",
      status: "Pending",
      image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
      location: "Uluwatu",
      bookingId: "DB-849201",
      guestName: "Nicki",
      guests: 2,
      hotel: "Grand Hyatt Bali, Nusa Dua",
      price: 900000
    },
    {
      id: "b2",
      title: "Traditional Balinese Home Spa",
      date: "April 15, 2026",
      time: "10:00 AM",
      status: "Pending",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
      location: "Your Villa",
      bookingId: "DB-552194",
      guestName: "Nicki",
      guests: 1,
      hotel: "In-Villa Service (Ubud)",
      spaType: "In-Villa Spa",
      duration: "120 Mins",
      price: 650000
    },
    {
      id: "b3",
      title: "Airport Transfer (DPS) to Seminyak",
      date: "March 20, 2026",
      time: "14:30 PM",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80",
      location: "Ngurah Rai Airport",
      bookingId: "DB-110023",
      guestName: "Nicki",
      guests: 4,
      hotel: "International Arrivals Terminal",
      price: 350000
    }
  ]);

  const handleCancelBooking = (bookingId) => {
    setBookings((prevBookings) => 
      prevBookings.map((b) => 
        b.id === bookingId ? { ...b, status: "Cancelled" } : b
      )
    );
  };

  const getBookingType = (b) => {
    // If it's cancelled, we might still show it in Past or keep it in Upcoming depending on design.
    // Usually Cancelled moves to Past or stays in its timeline but marked cancelled.
    // Let's move Cancelled to Past or just filter based on date.
    const bookingDate = new Date(b.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (b.status === "Cancelled") return "past";
    return bookingDate < today ? "past" : "upcoming";
  };

  const filteredBookings = bookings.filter(b => getBookingType(b) === activeTab);

  return (
    <div className="min-h-[100dvh] bg-white pb-32 font-sans overflow-x-hidden">
      
      {/* Header & Tabs */}
      <div className="px-6 pt-12 pb-2 bg-white relative z-10 sticky top-0 border-b border-gray-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Trips</h1>
        
        <div className="flex mt-6 gap-6">
          <button 
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 text-[15px] font-bold transition-all relative ${activeTab === "upcoming" ? "text-primary" : "text-gray-400"}`}
          >
            Upcoming
            {activeTab === "upcoming" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full"></div>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("past")}
            className={`pb-3 text-[15px] font-bold transition-all relative ${activeTab === "past" ? "text-primary" : "text-gray-400"}`}
          >
            Past
            {activeTab === "past" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Bookings Grid (Airbnb Style) */}
      <div className="px-6 pt-8 max-w-6xl mx-auto">
        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredBookings.map((b, index) => (
              <div key={b.id} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                
                {/* Image Section */}
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden group">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Status Badge Over Image */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                    {b.status === "Confirmed" && <CheckCircle2 size={14} className="text-green-600" strokeWidth={3} />}
                    {b.status === "Pending" && <Clock size={14} className="text-orange-500" strokeWidth={3} />}
                    {b.status === "Completed" && <CheckCircle2 size={14} className="text-gray-500" strokeWidth={3} />}
                    {b.status === "Cancelled" && <XCircle size={14} className="text-red-500" strokeWidth={3} />}
                    <span className={`text-[12px] font-bold uppercase tracking-wider ${b.status === "Confirmed" ? "text-green-700" : b.status === "Completed" ? "text-gray-600" : b.status === "Cancelled" ? "text-red-600" : "text-orange-600"}`}>
                      {b.status}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col px-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-extrabold text-[18px] text-primary leading-tight line-clamp-2">{b.title}</h3>
                  </div>
                  
                  <p className="text-[15px] text-gray-500 font-medium mt-1">
                    {b.location} • {b.date}
                  </p>
                  
                  <div className="mt-1 font-semibold text-[15px] text-primary">
                    <span className="font-extrabold text-[15px]">{formatIDR(b.price)}</span>
                  </div>

                  {/* Actions Area */}
                  {activeTab === "upcoming" && (
                    <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
                      <a 
                        href={`https://wa.me/6285174119423?text=${encodeURIComponent(`Hello Trove Experience, regarding my booking:\n\n*TROVE EXPERIENCE BOOKING*\n\n*ID:* #${b.bookingId}\n*TITLE:* ${b.title.toUpperCase()}\n*DATE:* ${b.date} at ${b.time}\n*GUESTS:* ${b.guests} Pax\n*LOCATION:* ${b.hotel}\n*PRICE:* Rp ${b.price.toLocaleString('id-ID')}\n\nPlease assist me to confirm.`)}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 bg-gray-100 text-primary text-[14px] font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors text-center"
                      >
                        Message
                      </a>
                      {b.status === "Pending" && (
                        <button 
                          onClick={() => handleCancelBooking(b.id)}
                          className="flex-1 bg-white border border-red-200 text-red-500 text-[14px] font-bold py-3.5 rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}

                  {/* Cancelled state label if in past */}
                  {b.status === "Cancelled" && activeTab === "past" && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-[13px] font-bold rounded-xl text-center">
                      Booking Cancelled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center">
             <CalendarCheck className="w-12 h-12 text-gray-200 mb-4" strokeWidth={1.5} />
             <h3 className="text-[18px] font-extrabold text-primary mb-2">No trips booked... yet!</h3>
             <p className="text-gray-400 text-[15px] max-w-xs leading-relaxed">Time to dust off your bags and start planning your next great adventure.</p>
             <button className="mt-6 px-6 py-3.5 bg-primary text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all text-[15px]">
               Start Exploring
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

