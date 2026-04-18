import React from "react";
import { Heart, Star } from "lucide-react";
import Link from "next/link";

export default function ListingCard({ item, linkTo }) {
  const formattedPrice = `IDR ${Number(item.price).toLocaleString('id-ID')}`;

  return (
    <Link href={linkTo} className="flex flex-col w-full bg-white rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] block w-full outline-none">
      
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F4F4F6] shrink-0">
        <img 
          src={item.image} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] ease-out group-hover:scale-110" 
          alt={item.title} 
        />
        
        {/* Badge */}
        {item.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-block px-3 py-1.5 bg-white/95 backdrop-blur-md text-primary text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-sm rounded-xl border border-white/40">{item.badge}</span>
          </div>
        )}

        {/* Heart Favorite Button */}
        <button className="absolute top-4 right-4 w-[36px] h-[36px] bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-text-secondary/80 shadow-sm z-10 transition-all group-hover:opacity-100 active:scale-90 hover:bg-white hover:text-red-500">
          <Heart size={18} strokeWidth={2.5} />
        </button>
      </div>
      
      {/* Content Section */}
      <div className="flex flex-col p-5 pt-4 flex-1">
        {/* Location & Category (GyG style subtitle) */}
        <div className="text-[11px] font-extrabold tracking-widest text-[#8F8F99] uppercase mb-1.5 truncate">
          {item.service || "Tour"} • {item.location || "Bali"}
        </div>
        
        {/* Title */}
        <h3 className="font-extrabold text-[16px] leading-[1.3] text-primary line-clamp-2 mb-2 group-hover:text-accent transition-colors">
          {item.title}
        </h3>
        
        {/* Ratings */}
        <div className="flex items-center gap-1 mb-4">
          <Star size={13} strokeWidth={2.5} className="fill-[#F59E0B] text-[#F59E0B] pb-[0.5px]" />
          <span className="text-[13px] font-bold text-primary">{Number(item.rating || 5).toFixed(1)}</span>
          <span className="text-[13px] font-semibold text-text-secondary">({item.reviews || 0} reviews)</span>
        </div>

        {/* Footer (Price + Button/Date) */}
        <div className="mt-auto pt-3 flex items-end justify-between gap-2 border-t border-gray-100/80">
          <div className="flex flex-col justify-end">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-0.5">From</span>
            <div className="flex items-end gap-1">
              <span className="font-extrabold text-[17px] text-primary tracking-tight leading-none">
                {formattedPrice}
              </span>
            </div>
          </div>
          <button className="text-[13px] font-extrabold text-primary bg-accent px-4 py-2 rounded-xl shrink-0 shadow-sm transition-transform active:scale-95 group-hover:scale-105">
            Book
          </button>
        </div>
      </div>
    </Link>
  );
}
