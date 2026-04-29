import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/navigation/BottomNav";
import AuthProvider from "@/components/providers/AuthProvider";
import GoogleTranslate from "@/components/GoogleTranslate";
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: '--font-playfair' });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata = {
  title: {
    default: "Bobby Bali Guide | The #1 Best Tours & Private Drivers in Bali",
    template: "%s | Bobby Bali Guide"
  },
  description: "Experience the ultimate Bali vacation with the island's #1 rated private drivers, bespoke tours, and premium activities. Book secure, local, and unforgettable adventures from Ubud to Nusa Penida.",
  keywords: ["Bali Tours", "Bali Private Driver", "Best Bali Itinerary", "Nusa Penida Tour", "Ubud Tour", "Bali Transport", "Bali Activities", "Bali Vacation Packages"],
  authors: [{ name: "Bobby Bali Guide" }],
  creator: "Bobby Bali Guide",
  publisher: "Bobby Bali Guide",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Bobby Bali Guide | The #1 Best Tours & Private Drivers in Bali",
    description: "Experience the ultimate Bali vacation with the island's #1 rated private drivers, bespoke tours, and premium activities.",
    url: "https://www.bobbybaliguide.com",
    siteName: "Bobby Bali Guide",
    images: [
      {
        url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Beautiful Bali Landscape",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Bobby Bali Guide | The #1 Best Tours & Private Drivers in Bali",
    description: "Experience the ultimate Bali vacation with the island's #1 rated private drivers, bespoke tours, and premium activities.",
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} min-h-screen flex flex-col bg-background selection:bg-accent selection:text-primary pb-24 md:pb-0`}>
        <AuthProvider>
          <GoogleTranslate />
          {/* Navbar handles its own desktop/mobile responsive states now */}
          <Navbar />
          
          <main className="flex-grow w-full relative pt-20 md:pt-24">
            {children}
          </main>
          
          {/* New App-style floating bottom navigation */}
          <BottomNav />

          {/* Hide default Footer on mobile as we rely on bottom nav */}
          <div className="hidden md:block">
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
