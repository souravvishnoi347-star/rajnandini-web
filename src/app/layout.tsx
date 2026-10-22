import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import {
  SITE_CONFIG,
  generateLocalBusinessSchema,
  generateAeoFaqSchema,
  GLOBAL_STORE_FAQS,
} from "@/lib/seoEngine";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "Rajnandini Boutique Haridwar | Royal Bridal Lehengas & Pure Silk Sarees",
    template: "%s | Rajnandini Boutique Haridwar",
  },
  description:
    "Rajnandini Boutique Haridwar is Uttarakhand's premier luxury ethnic destination for handcrafted bridal lehengas, authentic Banarasi silk sarees, designer gowns, and custom boutique tailoring by Indu Sharma. Order online or visit our Haridwar showroom.",
  keywords: [
    "Rajnandini Boutique",
    "Boutique in Haridwar",
    "Best Bridal Lehenga Haridwar",
    "Saree Shop in Haridwar",
    "Designer Gowns Haridwar",
    "Custom Blouse Stitching Haridwar",
    "Banarasi Silk Sarees Uttarakhand",
    "Ethnic Wear Haridwar",
    "Wedding Dress Haridwar",
    "Indu Sharma Haridwar Boutique",
  ],
  authors: [{ name: "Indu Sharma - Rajnandini Boutique" }],
  creator: "Rajnandini Boutique",
  publisher: "Rajnandini Boutique Haridwar",
  openGraph: {
    title: "Rajnandini Boutique Haridwar | Handcrafted Bridal Wear & Pure Silk Sarees",
    description:
      "Uttarakhand's royal ethnic studio. Shop authentic bridal lehengas, pure silk sarees, festive suits, and bespoke boutique tailoring. Fast pan-India delivery.",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Rajnandini Boutique Haridwar - Luxury Ethnic Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rajnandini Boutique Haridwar | Luxury Ethnic Wear & Bridal Studio",
    description:
      "Handcrafted bridal lehengas, pure silk sarees, and bespoke tailoring in Haridwar. Direct WhatsApp orders available.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessJsonLd = generateLocalBusinessSchema();
  const aeoFaqJsonLd = generateAeoFaqSchema(GLOBAL_STORE_FAQS);

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        {/* GEO & Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {/* AEO FAQ Schema for ChatGPT, Gemini, Perplexity */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aeoFaqJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-stone-900 font-sans flex flex-col selection:bg-red-700 selection:text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
