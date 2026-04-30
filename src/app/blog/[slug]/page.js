import React from 'react';
import { ArrowLeft, MapPin, Share2, Calendar, Eye, Sparkles, UserCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import StructuredData from '@/components/seo/StructuredData';
import { getSeoDescription, generateBlogJsonLd, injectSmartLinks } from '@/lib/seo';
import { generateSlug } from '@/lib/utils';

const formatContent = (htmlOrText) => {
  if (!htmlOrText) return '<p>No content available for this article yet.</p>';
  if (/<[a-z][\s\S]*>/i.test(htmlOrText)) {
    return htmlOrText;
  }
  return htmlOrText.split(/\n\s*\n/).map(p => {
     return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
  }).join('');
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const { data: post } = await supabase
    .from('blogs')
    .select('*')
    .or(`slug.eq.${slug},slug.eq./blog/${slug},slug.eq.blog/${slug}`)
    .single();

  if (!post) {
    return {
      title: "Article Not Found | Discovering Bali",
      description: "This article could not be found."
    };
  }

  const optimizedDescription = getSeoDescription(post.meta_description || post.content);
  const coverImg = post.image || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80";

  return {
    title: `${post.title} | Discovering Bali Blog`,
    description: optimizedDescription,
    openGraph: {
      title: post.title,
      description: optimizedDescription,
      images: [{ url: coverImg, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: optimizedDescription,
      images: [coverImg],
    },
  };
}

export default async function BlogDetail({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const { data: post } = await supabase
    .from('blogs')
    .select('*')
    .or(`slug.eq.${slug},slug.eq./blog/${slug},slug.eq.blog/${slug}`)
    .single();

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 text-center">
        <h1 className="text-3xl font-extrabold text-primary mb-4">Article Not Found</h1>
        <p className="text-text-secondary mb-8 font-medium">The recommended place you are looking for does not exist or has been removed.</p>
        <Link href="/" className="px-8 py-3 bg-accent text-primary font-bold rounded-full hover:scale-105 transition-transform">
          Return Home
        </Link>
      </div>
    );
  }

  // Fetch all active listings for Smart Internal Linking
  const { data: allListings } = await supabase.from('listings').select('title, id').eq('status', 'Active');
  
  const formattedHtml = formatContent(post.content);
  const smartLinkedHtml = injectSmartLinks(formattedHtml, allListings || []);
  const jsonLd = generateBlogJsonLd(post);

  return (
    <>
      <StructuredData data={jsonLd} />
      <main className="min-h-screen bg-background pb-32 font-sans">
        
        {/* Hero Header Section */}
        <div className="relative w-full h-[50vh] md:h-[65vh] bg-black">
           <img src={post.image || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200'} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-80" />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30"></div>
           
           {/* Top Navigation Bar */}
           <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20">
              <Link href="/blog" className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/10 shadow-sm">
                 <ArrowLeft size={20} />
              </Link>
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
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Content Area with Newsletter Vibe */}
        <div className="max-w-3xl mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-12">
          {/* Formatted Smart Body */}
          <div 
             className="newsletter-content"
             dangerouslySetInnerHTML={{ __html: smartLinkedHtml }}
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
           <p className="text-sm font-medium text-text-secondary italic">"{post.meta_description || 'No description available.'}"</p>
        </div>

      </main>
    </>
  );
}
