import React from "react";
import { ChevronRight, Calendar } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const metadata = {
  title: "Discover Bali | Premium Island Blog",
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to strip HTML and get excerpt
const getExcerpt = (html, length = 120) => {
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, '');
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const revalidate = 60; // Revalidate every minute

export default async function Blog() {
  const { data: dbArticles, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'Published')
    .order('created_at', { ascending: false });

  const articles = dbArticles || [];

  return (
    <div className="w-full pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4 lg:max-w-7xl">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight mb-4 text-text-primary">Discover Bali</h1>
          <p className="text-lg md:text-xl font-medium text-text-secondary max-w-2xl">
            Travel guides, tips, and inspiration from locals and experts to help you plan the perfect trip.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl border border-border shadow-soft">
            <h3 className="text-2xl font-bold text-text-primary mb-2">More Content Coming Soon!</h3>
            <p className="text-text-secondary">We are currently writing amazing new articles for you.</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            <Link href={`/blog${articles[0].slug.startsWith('/') ? articles[0].slug.substring(1) : articles[0].slug.startsWith('blog/') ? articles[0].slug.substring(4) : articles[0].slug}`} className="bg-surface rounded-3xl overflow-hidden shadow-soft border border-border mb-16 flex flex-col md:flex-row group cursor-pointer hover:shadow-medium transition-all duration-300 hover:-translate-y-1 block">
              <div className="md:w-1/2 relative overflow-hidden aspect-video md:aspect-auto bg-gray-100 flex items-center justify-center">
                {articles[0].image ? (
                  <img src={articles[0].image} alt="Featured" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/20 text-4xl font-black">DISCOVER BALI</div>
                )}
              </div>
              <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <span className="text-accent font-bold text-sm tracking-widest uppercase mb-4">{articles[0].category || 'Guides'}</span>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-text-primary group-hover:text-accent transition-colors">{articles[0].title}</h2>
                <p className="text-text-secondary text-lg mb-8 leading-relaxed line-clamp-3">{articles[0].meta_description || getExcerpt(articles[0].content)}</p>
                <div className="flex items-center justify-between text-sm font-medium mt-auto">
                  <span className="flex items-center gap-2 text-text-secondary"><Calendar size={18}/> {new Date(articles[0].created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                  <span className="text-accent font-bold flex items-center group-hover:translate-x-2 transition-transform">Read full article <ChevronRight size={18} className="ml-1" /></span>
                </div>
              </div>
            </Link>

            {articles.length > 1 && (
              <>
                <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-text-primary">Latest Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.slice(1).map((article) => (
                    <Link key={article.id} href={`/blog${article.slug.startsWith('/') ? article.slug.substring(1) : article.slug.startsWith('blog/') ? article.slug.substring(4) : article.slug}`} className="bg-surface border border-border rounded-2xl shadow-soft flex flex-col group cursor-pointer hover:shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden block">
                      <div className="relative aspect-video overflow-hidden bg-gray-100 flex items-center justify-center">
                        {article.image ? (
                          <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                           <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/20 text-2xl font-black">DB</div>
                        )}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm tracking-wide uppercase">
                          {article.category || 'Guides'}
                        </div>
                      </div>
                      <div className="p-6 lg:p-8 flex flex-col flex-1">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 text-text-primary group-hover:text-accent transition-colors leading-snug">{article.title}</h3>
                        <p className="text-sm font-medium text-text-secondary mb-6 line-clamp-3 leading-relaxed">{article.meta_description || getExcerpt(article.content)}</p>
                        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm">
                          <span className="font-medium text-text-secondary">{new Date(article.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                          <span className="text-accent font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Read <ChevronRight size={16}/></span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}
