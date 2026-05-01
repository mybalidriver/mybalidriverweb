import { createClient } from '@supabase/supabase-js';
import HomeClient from './HomeClient';

// Cache this page for 1 hour (3600 seconds) on the CDN
export const revalidate = 3600;

export default async function Page() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use anon key for public data to match client behavior
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch listings
  const { data: listingsData } = await supabase
    .from('listings')
    .select('id, type, title, location, price, duration, category, rating, reviews, status, image, company_name, originalService:data->originalService, isCampaignPinned:data->isCampaignPinned, campaignTitle:data->campaignTitle, campaignDescription:data->campaignDescription, campaignLabel:data->campaignLabel, campaignVideo:data->campaignVideo, campaignYoutubeLink:data->campaignYoutubeLink, campaignRecommendation:data->campaignRecommendation, campaignIgLink:data->campaignIgLink, isBestTripPinned:data->isBestTripPinned, spaSetting:data->spaSetting, tourTiers:data->tourTiers, allInclusiveTiers:data->allInclusiveTiers, allInclusiveSurcharge:data->allInclusiveSurcharge, pricingType:data->pricingType, min60:data->min60, min90:data->min90, min120:data->min120, dailyPrice:data->dailyPrice, weeklyPrice:data->weeklyPrice, monthlyPrice:data->monthlyPrice, badge:data->badge')
    .eq('status', 'Active');
  
  const initialListings = (listingsData || []).map(d => ({
    ...d,
    service: d.originalService || d.type
  }));

  // Fetch blogs
  const { data: initialBlogs } = await supabase
    .from('blogs')
    .select('id, title, slug, image, category')
    .eq('status', 'Published')
    .order('created_at', { ascending: false })
    .limit(4);

  // Fetch settings
  const { data: settingsData } = await supabase
    .from('homepage_settings')
    .select('campaign_video, campaign_youtube_link, campaign_recommendation, campaign_ig_link, campaign_recommendation_2, campaign_ig_link_2')
    .eq('id', 1)
    .single();

  const initialSettings = settingsData ? {
    campaignVideo: settingsData.campaign_video || "",
    campaignYoutubeLink: settingsData.campaign_youtube_link || "",
    campaignRecommendation: settingsData.campaign_recommendation || "",
    campaignIgLink: settingsData.campaign_ig_link || "",
    campaignRecommendation2: settingsData.campaign_recommendation_2 || "",
    campaignIgLink2: settingsData.campaign_ig_link_2 || ""
  } : null;

  return (
    <HomeClient 
      initialListings={initialListings || []} 
      initialBlogs={initialBlogs || []} 
      initialSettings={initialSettings} 
    />
  );
}
