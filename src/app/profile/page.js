"use client";

import React from "react";
import { User, HelpCircle, ChevronRight, CalendarCheck, Heart, CircleUser, Briefcase } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const menuItems = [
    { icon: CalendarCheck, label: "My Bookings", path: "/bookings", mobileHide: true },
    { icon: Heart, label: "Wishlist & Favorites", path: "/favorites", mobileHide: true },
    { icon: HelpCircle, label: "Help Center", path: "#" },
    { icon: Briefcase, label: "Become a Partner", path: "#", desktopHide: true },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F8FAFC] pb-32 font-sans font-medium">
      <div className="px-6 pt-16 pb-8 bg-white shadow-sm border-b border-border">
        <h1 className="text-2xl font-extrabold text-primary mb-8">Profile</h1>
        
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-accent rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
             <CircleUser size={40} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">Guest User</h2>
            <div className="bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-md inline-block mt-2">
              Explore Bali
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden flex flex-col">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <Link 
                key={index} 
                href={item.path} 
                className={`items-center justify-between p-5 transition-colors hover:bg-gray-50 cursor-pointer border-b border-border last:border-b-0 ${item.mobileHide ? 'hidden md:flex' : item.desktopHide ? 'flex md:hidden' : 'flex'}`}
              >
                <div className="flex items-center gap-4 text-primary">
                  <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <span className="font-bold text-[15px]">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-text-secondary" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
