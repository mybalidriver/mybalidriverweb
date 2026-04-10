import React from "react";
import { ChevronRight, Calendar } from "lucide-react";

export const metadata = {
  title: "Discover Bali | Premium Island Blog",
};

const articles = [
  { id: 1, title: 'The Ultimate 7-Day Bali Itinerary for First Timers', category: 'Guides', date: 'Oct 12, 2026', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', excerpt: 'Discover the perfect balance of culture, beaches, and nightlife with our comprehensive 7-day guide through the island of the Gods.' },
  { id: 2, title: 'Top 5 Hidden Waterfalls in Northern Bali', category: 'Nature', date: 'Oct 05, 2026', image: 'https://images.unsplash.com/photo-1590504104977-802758117769?auto=format&fit=crop&w=800&q=80', excerpt: 'Escape the crowds and venture north to find Bali’s most spectacular and untouched cascading waterfalls hidden deep in the jungle.' },
  { id: 3, title: 'Ubud Food Guide: Best Warungs & Vegan Cafes', category: 'Food', date: 'Sep 28, 2026', image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80', excerpt: 'From traditional Babi Guling to world-class vegan raw food, explore the culinary capital of Bali.' },
  { id: 4, title: 'How to Ride a Scooter in Bali Safely', category: 'Tips', date: 'Sep 15, 2026', image: 'https://images.unsplash.com/photo-1627063544321-dfb8df2a2cc6?auto=format&fit=crop&w=800&q=80', excerpt: 'Everything you need to know about international licenses, helmets, local traffic rules, and renting your first scooter.' },
];

export default function Blog() {
  return (
    <div className="w-full pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4 lg:max-w-7xl">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight mb-4 text-text-primary">Discover Bali</h1>
          <p className="text-lg md:text-xl font-medium text-text-secondary max-w-2xl">
            Travel guides, tips, and inspiration from locals and experts to help you plan the perfect trip.
          </p>
        </div>

        {/* Featured Article */}
        <div className="bg-surface rounded-3xl overflow-hidden shadow-soft border border-border mb-16 flex flex-col md:flex-row group cursor-pointer hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
          <div className="md:w-1/2 relative overflow-hidden aspect-video md:aspect-auto">
            <img src={articles[0].image} alt="Featured" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <span className="text-accent font-bold text-sm tracking-widest uppercase mb-4">{articles[0].category}</span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-text-primary group-hover:text-accent transition-colors">{articles[0].title}</h2>
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">{articles[0].excerpt}</p>
            <div className="flex items-center justify-between text-sm font-medium mt-auto">
              <span className="flex items-center gap-2 text-text-secondary"><Calendar size={18}/> {articles[0].date}</span>
              <span className="text-accent font-bold flex items-center group-hover:translate-x-2 transition-transform">Read full article <ChevronRight size={18} className="ml-1" /></span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-text-primary">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(1).map((article) => (
            <div key={article.id} className="bg-surface border border-border rounded-2xl shadow-soft flex flex-col group cursor-pointer hover:shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm tracking-wide uppercase">
                  {article.category}
                </div>
              </div>
              <div className="p-6 lg:p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 text-text-primary group-hover:text-accent transition-colors leading-snug">{article.title}</h3>
                <p className="text-sm font-medium text-text-secondary mb-6 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm">
                  <span className="font-medium text-text-secondary">{article.date}</span>
                  <span className="text-accent font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Read <ChevronRight size={16}/></span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
