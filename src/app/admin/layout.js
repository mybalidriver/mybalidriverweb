"use client";

import React, { useState } from "react";
import { 
  Calendar, MapPin, Settings, LogOut, 
  Briefcase, Users, Newspaper, Home, Menu, X, Bell, Search, ChevronDown, Activity
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customAvatar, setCustomAvatar] = useState(null);

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result);
        localStorage.setItem("admin_avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem("admin_avatar");
    if (saved) setCustomAvatar(saved);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Manage Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Products & Tours", href: "/admin/listings", icon: MapPin },
    { name: "Content & SEO", href: "/admin/places", icon: Newspaper },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Partner Network", href: "/admin/partners", icon: Briefcase }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#F8F9FA] flex overflow-hidden font-sans text-[#1C1C1E]">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-[#1C1C1E]/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Native Aesthetic Sidebar - Deep Dark */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-[260px] bg-[#1C1C1E] text-white z-50 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-2xl lg:shadow-none`}>
        
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-[#D9FB41] flex items-center justify-center text-[#1C1C1E] font-black text-xl tracking-tighter">DB</div>
             <span className="font-extrabold text-lg tracking-tight">Admin<span className="font-medium opacity-60">Portal</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Global Action Button - Lime Accent with Dark Text */}
        <div className="p-5 border-b border-white/5">
          <Link href="/admin/listings" className="w-full flex items-center justify-center gap-2 bg-[#D9FB41] hover:bg-[#C5E838] text-[#1C1C1E] py-3 rounded-xl font-extrabold text-sm transition-all shadow-[0_4px_20px_rgba(217,251,65,0.15)] active:scale-95">
             Create New Product
          </Link>
        </div>

        {/* Navigation Map */}
        <div className="flex-1 overflow-y-auto py-5">
          <p className="px-6 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">Management</p>
          <nav className="flex flex-col gap-1 px-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-[#D9FB41] text-[#1C1C1E]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#1C1C1E]' : 'text-gray-500'} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Settings */}
        <div className="p-5 border-t border-white/5 flex flex-col gap-1">
           <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Settings size={18} /> Account Settings
            </button>
            <Link href="/" className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
              <LogOut size={18} /> Exit Admin Dashboard
            </Link>
        </div>
      </aside>

      {/* Main Content Space */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header Data Bar */}
        <header className="h-20 bg-white border-b border-[#E8EAEF] flex items-center justify-between px-4 sm:px-8 shrink-0 relative z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-[#1C1C1E] hover:bg-[#F8F9FA] rounded-xl transition-colors">
              <Menu size={24} />
            </button>
            
            {/* Global Search Simulator */}
            <div className="hidden md:flex items-center bg-[#F8F9FA] rounded-xl px-4 py-2.5 w-72 border border-transparent focus-within:border-[#1C1C1E] focus-within:bg-white transition-all">
               <Search size={18} className="text-gray-400 mr-2" />
               <input type="text" placeholder="Search references..." className="bg-transparent border-none focus:ring-0 text-sm font-bold text-[#1C1C1E] w-full outline-none placeholder:font-medium placeholder:text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-gray-500 hover:bg-[#F8F9FA] rounded-full transition-colors">
               <Bell size={22} />
               <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D9FB41] rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-[#E8EAEF] hidden sm:block"></div>
              <div className="flex items-center gap-3 group relative cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  title="Upload Admin Logo"
                />
                <div className="hidden sm:block text-right pointer-events-none">
                  <p className="text-sm font-extrabold text-[#1C1C1E]">{session?.user?.name || "Adrian Bali"}</p>
                  <p className="text-[11px] text-gray-500 font-bold tracking-tight">Super Administrator</p>
                </div>
                <div className="flex items-center gap-2 pointer-events-none">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F8F9FA] border border-[#E8EAEF] relative group">
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                       <span className="text-white text-[8px] font-extrabold uppercase uppercase">Edit</span>
                    </div>
                    {customAvatar ? (
                       <img src={customAvatar} alt="Admin" className="w-full h-full object-cover relative z-0" />
                    ) : session?.user?.image ? (
                        <img src={session.user.image} referrerPolicy="no-referrer" alt="Admin" className="w-full h-full object-cover relative z-0" />
                    ) : (
                        <img src="https://ui-avatars.com/api/?name=Adrian&background=1C1C1E&color=D9FB41" alt="User" className="w-full h-full object-cover relative z-0" />
                    )}
                  </div>
                  <ChevronDown size={14} className="text-gray-400 group-hover:text-[#1C1C1E] transition-colors" />
                </div>
              </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

      </main>

    {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#E8EAEF] flex justify-between px-6 py-4 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] pb-safe rounded-t-[32px]">
        <Link href="/admin" className={`flex flex-col items-center gap-1.5 transition-colors ${pathname === '/admin' ? 'text-[#1C1C1E]' : 'text-gray-400 hover:text-[#1C1C1E]'} group`}>
          <div className="relative">
            <Activity size={22} strokeWidth={pathname === '/admin' ? 3 : 2.5} />
            {pathname === '/admin' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#D9FB41] rounded-full"></div>}
          </div>
          <span className="text-[10px] font-extrabold transition-colors">Overview</span>
        </Link>
        <Link href="/admin/bookings" className={`flex flex-col items-center gap-1.5 transition-colors ${pathname === '/admin/bookings' ? 'text-[#1C1C1E]' : 'text-gray-400 hover:text-[#1C1C1E]'} group`}>
          <div className="relative">
             <Calendar size={22} strokeWidth={pathname === '/admin/bookings' ? 3 : 2.5} />
             {pathname === '/admin/bookings' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#D9FB41] rounded-full"></div>}
          </div>
          <span className="text-[10px] font-bold">Bookings</span>
        </Link>
        <Link href="/admin/listings" className={`flex flex-col items-center gap-1.5 transition-colors ${pathname === '/admin/listings' ? 'text-[#1C1C1E]' : 'text-gray-400 hover:text-[#1C1C1E]'}`}>
          <div className="relative">
             <MapPin size={22} strokeWidth={pathname === '/admin/listings' ? 3 : 2.5} />
             {pathname === '/admin/listings' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#D9FB41] rounded-full"></div>}
          </div>
          <span className="text-[10px] font-bold">Listings</span>
        </Link>
        <Link href="/" className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors">
          <LogOut size={22} strokeWidth={2.5} />
          <span className="text-[10px] font-bold">Exit</span>
        </Link>
      </div>

    </div>
  );
}
