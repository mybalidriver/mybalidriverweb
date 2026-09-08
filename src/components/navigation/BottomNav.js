"use client";

import React, { useState } from "react";
import { Home, Map, Heart, Instagram } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// WhatsApp SVG Icon
const WhatsAppIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", icon: Home, path: "/" },
    { id: "map", icon: Map, path: "/map" },
    { id: "instagram", icon: Instagram, url: "https://www.instagram.com/mybalidriver", external: true },
    { id: "favorites", icon: Heart, path: "/favorites" },
    { id: "whatsapp", icon: WhatsAppIcon, url: "https://wa.me/6282247819449?text=Hello%20MyBaliDriver,%20I%20would%20like%20to%20know%20more%20about%20your%20services!", external: true },
  ];

  // Map path to active tab on mount
  React.useEffect(() => {
    if (pathname === "/") setActiveTab("home");
    else if (pathname.startsWith("/map")) setActiveTab("map");
    else if (pathname.startsWith("/favorites")) setActiveTab("favorites");
  }, [pathname]);

  // Hide BottomNav on tour detail pages to prevent overlapping with booking bar
  if (pathname.startsWith("/tours/")) return null;

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-6">
      <div className="bg-[#1C1C1E]/60 backdrop-blur-2xl rounded-[32px] py-4 px-6 flex justify-between items-center w-full max-w-sm shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-white/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.external) {
            return (
              <a 
                key={item.id} 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex flex-col items-center justify-center w-10 h-10"
              >
                <Icon 
                  size={22} 
                  className={`relative z-10 transition-colors duration-300 text-white/70 hover:text-white`} 
                />
              </a>
            );
          }

          return (
            <Link 
              key={item.id} 
              href={item.path}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center w-10 h-10"
            >
              {isActive && (
                <div className="absolute inset-0 bg-accent rounded-full shadow-[0_0_15px_rgba(217,251,65,0.4)]"></div>
              )}
              <Icon 
                size={22} 
                className={`relative z-10 transition-colors duration-300 ${isActive ? "text-primary stroke-[2.5px]" : "text-white/70 hover:text-white"}`} 
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
