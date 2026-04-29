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
    default: "MyBaliDriver | Premium Bali Private Drivers & Bespoke Tours",
    template: "%s | MyBaliDriver"
  },
  description: "Discover the true beauty of Bali with MyBaliDriver. We provide premium private car charters, experienced local guides, and bespoke tour packages tailored to your perfect itinerary. Explore Ubud, Nusa Penida, and beyond with comfort and reliability.",
  keywords: ["Bali Private Driver", "Hire Driver in Bali", "Bali Car Charter", "Premium Bali Tours", "Ubud Day Tour", "Nusa Penida Tour Package", "Bali Airport Transfer", "Custom Bali Itinerary", "Local Bali Guide"],
  authors: [{ name: "MyBaliDriver" }],
  creator: "MyBaliDriver",
  publisher: "MyBaliDriver",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "MyBaliDriver | Premium Bali Private Drivers & Bespoke Tours",
    description: "Discover the true beauty of Bali with MyBaliDriver. We provide premium private car charters, experienced local guides, and bespoke tour packages.",
    url: "https://www.mybalidriver.com",
    siteName: "MyBaliDriver",
    images: [
      {
        url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Premium Bali Tour Experience",
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
    title: "MyBaliDriver | Premium Bali Private Drivers & Bespoke Tours",
    description: "Discover the true beauty of Bali with MyBaliDriver. We provide premium private car charters, experienced local guides, and bespoke tour packages.",
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
