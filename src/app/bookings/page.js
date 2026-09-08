"use client";

import React from "react";
import { Navigation } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="min-h-[100dvh] bg-white pb-32 font-sans overflow-x-hidden flex items-center justify-center">
      <div className="py-24 md:py-32 flex flex-col items-center justify-center text-center px-4">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <Navigation className="w-10 h-10 text-[#25D366] ml-1 mt-1" strokeWidth={2} />
          </div>
          <h3 className="text-[22px] font-black text-primary mb-3 tracking-tight">Need to check your bookings?</h3>
          <p className="text-gray-500 text-[15px] max-w-[280px] leading-relaxed mb-8 font-medium">
            Contact us directly on WhatsApp for real-time updates and support regarding your upcoming trips.
          </p>
          <a href="https://wa.me/6282247819449" target="_blank" rel="noreferrer" className="w-full max-w-[240px]">
            <button className="px-8 py-4 bg-[#25D366] text-white font-extrabold rounded-full hover:bg-[#20b858] active:scale-95 shadow-[0_8px_20px_rgba(37,211,102,0.3)] transition-all text-[15px] w-full">
              Contact on WhatsApp
            </button>
          </a>
      </div>
    </div>
  );
}

