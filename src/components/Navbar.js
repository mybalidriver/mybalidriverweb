"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, MapPin, Globe, Menu, Bell, Settings2, ChevronDown, User } from "lucide-react";
import { TourIcon, SpaIcon, TransportIcon, ScooterIcon } from "@/components/icons/CategoryIcons";
import { Wifi } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [filterOpen, setFilterOpen] = useState(false);
  const [activeService, setActiveService] = useState("Tour");
  
  const services = [
    { id: "Tour", icon: TourIcon },
    { id: "Massage", icon: SpaIcon },
    { id: "Transport", icon: TransportIcon },
    { id: "Scooter", icon: ScooterIcon },
    { id: "Esim", icon: Wifi },
  ];

  // Hide the global Navbar on individual tour detail pages or the map page
  if (pathname.match(/^\/tours\/.+/) || pathname === '/map') return null;

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border" : "bg-background"} pt-4 pb-4 md:py-5`}>
      
      {/* MOBILE LAYOUT (Inspired by the Reference Image) */}
      <div className="md:hidden px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {session ? (
            <div className="w-11 h-11 bg-gray-200 rounded-full overflow-hidden border border-border cursor-pointer shadow-sm" onClick={() => router.push('/profile')}>
              <img src={session.user.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"} referrerPolicy="no-referrer" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-11 h-11 bg-gray-100 rounded-full border border-border flex justify-center items-center cursor-pointer hover:bg-gray-200 transition-colors shadow-sm" onClick={() => signIn('google')}>
               <User size={20} className="text-gray-500" />
            </div>
          )}
          <div className="flex flex-col">
            {session ? (
              <>
                <span className="text-xs text-text-secondary font-medium">Hey, <span className="text-text-primary font-bold">{session.user.name?.split(' ')[0]} 👋</span></span>
                <div className="flex items-center gap-1 text-[10px] text-text-secondary mt-0.5">
                  <span className="text-[#25D366] font-bold">Verified</span>
                </div>
              </>
            ) : (
              <>
                <span className="text-[13px] font-extrabold text-primary cursor-pointer hover:opacity-70 transition-opacity" onClick={() => signIn('google')}>Log In</span>
                <span className="text-[10px] text-text-secondary mt-0.5 font-medium">Sign in to save bookings</span>
              </>
            )}
          </div>
        </div>
        <button className="w-10 h-10 border border-border bg-white rounded-full flex items-center justify-center hover:bg-gray-50 relative shadow-soft">
          <Bell size={18} className="text-primary" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
        </button>
      </div>

      {/* DESKTOP LAYOUT (Clean adaptation of the new design system) */}
      <div className="hidden md:flex container mx-auto px-6 lg:max-w-[1400px] items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-[19px] font-extrabold tracking-tight text-primary flex-1 flex items-center uppercase">
          Discovering Bali
        </Link>

        {/* Center Compressed Search */}
        <div className="flex-1 justify-center flex relative z-[60]">
          <div className="flex items-center bg-white border border-border shadow-soft rounded-full pl-2 pr-2 py-2 cursor-pointer transition-shadow w-full max-w-[460px] relative">
            <button 
              onClick={() => setFilterOpen(!filterOpen)} 
              className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full hover:bg-gray-50 text-primary active:scale-95 transition-all outline-none"
            >
              <span className="font-extrabold text-[14px] tracking-tight">{activeService}</span>
              <ChevronDown size={14} className={`text-text-secondary transition-transform duration-300 ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className="h-5 w-[1px] bg-border/80 mx-1 shrink-0"></div>
            <Search size={18} className="text-text-secondary mx-2" />
            <input 
              type="text" 
              placeholder={`Search ${activeService.toLowerCase()}s...`}
              onChange={(e) => window.dispatchEvent(new CustomEvent('searchQueryChanged', { detail: e.target.value }))}
              className="flex-1 outline-none text-sm font-medium bg-transparent text-primary placeholder:text-text-secondary min-w-0" 
            />
            <div className="w-9 h-9 rounded-full bg-accent text-primary flex items-center justify-center ml-2 shadow-sm transition-transform hover:scale-105 shrink-0">
              <Settings2 size={16} strokeWidth={2.5} />
            </div>
            
            {/* Desktop Navbar Dropdown */}
            {filterOpen && (
              <div className="absolute top-[60px] left-0 bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl flex flex-col min-w-[160px] border border-border animate-in fade-in zoom-in-95 duration-200">
                {services.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button 
                      key={s.id} 
                      onClick={() => { 
                        setActiveService(s.id); 
                        setFilterOpen(false); 
                        
                        // Dispatch to page.js
                        window.dispatchEvent(new CustomEvent('serviceChanged', { detail: s.id }));
                        
                        if (s.id === "Transport") {
                          router.push("/map?service=Transport");
                          return;
                        }
                        
                        if (s.id === "Scooter") {
                           setTimeout(() => {
                               const el = document.getElementById("categories-section");
                               if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                           }, 50);
                        }
                      }} 
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] text-left transition-colors ${activeService === s.id ? 'bg-primary text-accent' : 'bg-transparent text-text-secondary hover:bg-gray-50 hover:text-primary'} outline-none`}
                    >
                      <Icon size={16} className={activeService === s.id ? 'text-accent' : 'text-text-secondary'} strokeWidth={2} />
                      {s.id}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex-1 items-center justify-end gap-3 flex">
          <Link href="/about" className="text-sm font-bold text-primary hover:bg-black/5 px-5 py-2.5 rounded-full transition-colors">
            Become a Partner
          </Link>
          <button className="w-10 h-10 border border-border bg-white rounded-full flex items-center justify-center hover:bg-gray-50 shadow-soft">
            <Bell size={18} className="text-primary" />
          </button>
          
          {session ? (
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border border-border cursor-pointer hover:border-black transition-colors shadow-soft" onClick={() => router.push('/profile')}>
              <img src={session.user.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"} referrerPolicy="no-referrer" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          ) : (
            <button onClick={() => signIn('google')} className="w-10 h-10 bg-dark-surface rounded-full flex items-center justify-center text-white shadow-soft transition-transform hover:scale-105 active:scale-95">
              <User size={18} />
            </button>
          )}
        </div>
      </div>
      
    </header>
  );
}
