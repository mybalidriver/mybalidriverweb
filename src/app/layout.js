import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/navigation/BottomNav";
import AuthProvider from "@/components/providers/AuthProvider";
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
  title: "mybalidriver",
  description: "Modern travel experience platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} min-h-screen flex flex-col bg-background selection:bg-accent selection:text-primary pb-24 md:pb-0`}>
        <AuthProvider>
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
