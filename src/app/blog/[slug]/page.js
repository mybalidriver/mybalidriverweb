"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Share2, Calendar, Eye, Sparkles, UserCircle, Send } from 'lucide-react';

export default function BlogDetail() {
  const formatContent = (htmlOrText) => {
    if (!htmlOrText) return '<p>No content available for this article yet.</p>';
    if (/<[a-z][\s\S]*>/i.test(htmlOrText)) {
      return htmlOrText;
    }
    return htmlOrText.split(/\n\s*\n/).map(p => {
       return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
    }).join('');
  };
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We expect slug to match the database `slug` which was populated as `/blog/some-slug`
    const saved = localStorage.getItem("bali_places_v3");
    if (saved) {
      const places = JSON.parse(saved);
      const found = places.find(p => p.slug === `/blog/${slug}` || p.slug === `blog/${slug}` || p.slug === slug);
      setPost(found);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="animate-spin text-accent">
           <Sparkles size={32} />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 text-center">
        <h1 className="text-3xl font-extrabold text-primary mb-4">Article Not Found</h1>
        <p className="text-text-secondary mb-8 font-medium">The recommended place you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.push('/')} className="px-8 py-3 bg-accent text-primary font-bold rounded-full hover:scale-105 transition-transform">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-32 font-sans">
      
      {/* Hero Header Section */}
      <div className="relative w-full h-[50vh] md:h-[65vh] bg-black">
         <img src={post.image || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200'} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-80" />
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30"></div>
         
         {/* Top Navigation Bar */}
         <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20">
            <button onClick={() => router.back()} className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/10 shadow-sm">
               <ArrowLeft size={20} />
            </button>
            <button className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/10 shadow-sm">
               <Share2 size={18} />
            </button>
         </div>

         {/* Title / Meta Area */}
         <div className="absolute bottom-6 md:bottom-12 inset-x-6 md:inset-x-12 z-20 flex flex-col md:w-[70%]">
            <span className="inline-flex w-fit px-3 py-1 bg-accent text-primary text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest shadow-sm rounded-[8px] mb-4">
              {post.category || 'Featured'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-4 drop-shadow-lg tracking-tight">
               {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-semibold">
               <div className="flex items-center gap-1.5 backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
                  <MapPin size={14} className="text-accent" />
                  <span>{post.location}</span>
               </div>
               <div className="flex items-center gap-1.5 backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
                  <Eye size={14} className="text-gray-300" />
                  <span>{post.views || '0'} reads</span>
               </div>
               <div className="flex items-center gap-1.5 backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
                  <Calendar size={14} className="text-gray-300" />
                  <span>Recently Updated</span>
               </div>
            </div>
         </div>
      </div>

      {/* Content Area with Newsletter Vibe */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-12">
        


        {/* Formatted Smart Body */}
        <div 
           className="newsletter-content"
           dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />


      </div>

      {/* Masonry Gallery */}
      {post.images && post.images.length > 0 && (
         <div className="max-w-4xl mx-auto px-6 md:px-12 mt-16 mb-8">
            <h3 className="text-2xl font-black text-primary mb-6">Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
               {post.images.map((img, idx) => (
                  <div key={idx} className={`rounded-2xl overflow-hidden shadow-sm aspect-square ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}>
                     <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" alt="Gallery item" />
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* Meta Summary Bottom */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-border">
         <h4 className="font-bold text-primary mb-2">Description</h4>
         <p className="text-sm font-medium text-text-secondary italic">"{post.meta || 'No description available.'}"</p>
      </div>

    </main>
  );
}
