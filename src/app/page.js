import HomeClient from './HomeClient';
import { getHomepageListings, getPublishedBlogs, getHomepageSettings } from '@/lib/cache';

// Cache this page for 1 hour (3600 seconds) on the CDN
export const revalidate = 3600;

export default async function Page() {

  // Fetch all initial data in parallel to prevent sequential waterfalls
  const [listingsData, initialBlogs, settingsData] = await Promise.all([
    getHomepageListings(),
    getPublishedBlogs(4),
    getHomepageSettings()
  ]);

  const initialListings = (listingsData || []).map(d => ({
    id: d.id,
    type: d.type,
    title: d.title,
    location: d.location,
    price: d.price,
    duration: d.duration,
    category: d.category,
    rating: d.rating,
    reviews: d.reviews,
    status: d.status,
    image: d.image,
    company_name: d.company_name,
    originalService: d.originalService,
    isCampaignPinned: d.isCampaignPinned,
    campaignTitle: d.campaignTitle,
    campaignDescription: d.campaignDescription,
    campaignLabel: d.campaignLabel,
    campaignVideo: d.campaignVideo,
    campaignYoutubeLink: d.campaignYoutubeLink,
    campaignRecommendation: d.campaignRecommendation,
    campaignIgLink: d.campaignIgLink,
    isBestTripPinned: d.isBestTripPinned,
    spaSetting: d.spaSetting,
    tourTiers: d.tourTiers,
    allInclusiveTiers: d.allInclusiveTiers,
    allInclusiveSurcharge: d.allInclusiveSurcharge,
    pricingType: d.pricingType,
    min60: d.min60,
    min90: d.min90,
    min120: d.min120,
    dailyPrice: d.dailyPrice,
    weeklyPrice: d.weeklyPrice,
    monthlyPrice: d.monthlyPrice,
    badge: d.badge,
    service: d.originalService || d.type
  }));

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
