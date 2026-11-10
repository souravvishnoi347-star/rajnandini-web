"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductItem } from "@/types/store";
import ProductCard from "@/components/ProductCard";
import AeoFaqSection from "@/components/AeoFaqSection";
import { ThemeService, DEFAULT_THEME_CONFIG, ThemeConfig } from "@/lib/themeConfig";
import { Truck, ShieldCheck, Scissors, RefreshCw } from "lucide-react";

interface HomeClientViewProps {
  initialProducts: ProductItem[];
}

export default function HomeClientView({ initialProducts }: HomeClientViewProps) {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);

  useEffect(() => {
    // Load local theme config
    setTheme(ThemeService.getTheme());

    // Purge old sample catalog once if needed and sync local products
    try {
      if (localStorage.getItem("rajnandini_catalog_clean_v1") !== "true") {
        localStorage.removeItem("rajnandini_admin_products");
        localStorage.setItem("rajnandini_catalog_clean_v1", "true");
        setProducts([]);
      } else {
        const stored = localStorage.getItem("rajnandini_admin_products");
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setProducts(parsed);
          }
        }
      }
    } catch (e) {
      console.warn("Could not sync local products:", e);
    }

    // Listen for theme and catalog updates from Admin
    const handleThemeUpdate = () => {
      setTheme(ThemeService.getTheme());
    };

    const handleCatalogUpdate = () => {
      try {
        const stored = localStorage.getItem("rajnandini_admin_products");
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setProducts(parsed);
          }
        }
      } catch (e) {
        console.warn("Could not reload catalog locally:", e);
      }
    };

    window.addEventListener("rajnandini_theme_updated", handleThemeUpdate);
    window.addEventListener("rajnandini_catalog_updated", handleCatalogUpdate);

    return () => {
      window.removeEventListener("rajnandini_theme_updated", handleThemeUpdate);
      window.removeEventListener("rajnandini_catalog_updated", handleCatalogUpdate);
    };
  }, []);

  const kurtiSets = products.filter(
    (p) => p.category === "Suit Set" || p.category === "kurtis" || p.category === "kurti-sets"
  );

  const bridalAndSarees = products.filter(
    (p) => p.category === "Bridal Wear" || p.category === "Saree" || p.category === "sarees" || p.category === "lehengas"
  );

  const featuredBestsellers = products.slice(0, 8);

  return (
    <div className="bg-white space-y-12 sm:space-y-16">
      {/* 1. EDITABLE LIFESTYLE HERO BANNER */}
      <section className="relative w-full bg-[#fdfaf7] border-b border-stone-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#fae8dc] via-[#fdf6f0] to-[#e8f1f5] border border-stone-200/60 shadow-xs flex items-center justify-between p-6 sm:p-12">
            {/* Background Ethnic Floral Art overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#b91c1c_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

            {/* Left Content / Banner Title */}
            <div className="relative z-10 max-w-lg space-y-3 sm:space-y-4">
              {theme.hero.badge && (
                <span className="inline-block bg-[#a81c24] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  {theme.hero.badge}
                </span>
              )}

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
                {theme.hero.headline} <br />
                <span className="text-[#a81c24] italic font-serif font-normal">
                  {theme.hero.subheadline}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-stone-700 font-medium">
                {theme.hero.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={theme.hero.primaryBtnLink || "/collections/kurti-sets"}
                  className="px-6 py-2.5 bg-[#a81c24] hover:bg-[#8e171e] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition shadow-sm"
                >
                  {theme.hero.primaryBtnText}
                </Link>

                <Link
                  href={theme.hero.secondaryBtnLink || "/collections/bridal-lehenga"}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition shadow-sm"
                >
                  {theme.hero.secondaryBtnText}
                </Link>
              </div>
            </div>

            {/* Right: High-Fashion Ethnic Models Grid */}
            <div className="hidden md:flex items-center gap-4 relative z-10 shrink-0">
              <div className="relative w-44 h-64 rounded-xl overflow-hidden shadow-lg border-2 border-white transform -rotate-2 hover:rotate-0 transition duration-300 block">
                <Image
                  src={theme.hero.modelImage1 || "/products/lancha.png"}
                  alt="Rajnandini Bridal Lancha"
                  fill
                  className="object-cover object-top"
                />
              </div>

              <div className="relative w-48 h-72 rounded-xl overflow-hidden shadow-xl border-2 border-white transform hover:scale-105 transition duration-300 block ring-2 ring-[#a81c24]">
                <Image
                  src={theme.hero.modelImage2 || "/products/product 1.png"}
                  alt="Rajnandini Flared Anarkali Suit"
                  fill
                  className="object-cover object-top"
                />
                <span className="absolute bottom-2 left-2 bg-[#a81c24] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase">
                  Featured
                </span>
              </div>

              <div className="relative w-44 h-64 rounded-xl overflow-hidden shadow-lg border-2 border-white transform rotate-2 hover:rotate-0 transition duration-300 block">
                <Image
                  src={theme.hero.modelImage3 || "/products/one piece dress.png"}
                  alt="Rajnandini Reception Gown"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EDITABLE TRUST STRIP */}
      <section className="border-y border-stone-200 bg-stone-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-[#a81c24]" />
              <span className="text-xs font-bold text-stone-800">{theme.trustStrip.item1}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#a81c24]" />
              <span className="text-xs font-bold text-stone-800">{theme.trustStrip.item2}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Scissors className="w-4 h-4 text-[#a81c24]" />
              <span className="text-xs font-bold text-stone-800">{theme.trustStrip.item3}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#a81c24]" />
              <span className="text-xs font-bold text-stone-800">{theme.trustStrip.item4}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION ONE: KURTIS & SUITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-1 mb-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-stone-500">
            {theme.sections.section1Tag}
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-wide text-stone-900 font-sans">
            {theme.sections.section1Title}
          </h2>
        </div>

        {/* 4 Columns Product Grid or Elegant Empty State */}
        {kurtiSets.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {kurtiSets.slice(0, 8).map((product) => (
                <ProductCard key={product.id || product.sku} product={product} />
              ))}
            </div>
            <div className="text-center pt-8">
              <Link
                href="/collections/kurti-sets"
                className="inline-block px-10 py-3 bg-[#a81c24] hover:bg-[#8e171e] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition shadow-sm"
              >
                VIEW ALL KURTIS & SUITS
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-[#fdfaf7] border border-dashed border-stone-300 space-y-3">
            <p className="font-serif font-bold text-stone-900 text-base sm:text-lg">
              New Festive Collection Arriving Soon
            </p>
            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto">
              Our latest boutique Kurtis, Anarkalis & Sharara sets are being curated for this season. Connect on WhatsApp for video walkthrough and custom designs.
            </p>
            <div className="pt-2">
              <a
                href="https://api.whatsapp.com/send?phone=919897123450&text=Namaste%20Indu%20Ji!%20Please%20share%20your%20latest%20Kurti%20and%20Suit%20designs."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition shadow-sm"
              >
                <span>WhatsApp Indu Sharma</span>
              </a>
            </div>
          </div>
        )}
      </section>

      {/* 4. SECTION TWO: BRIDAL LEHENGAS & SAREES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center space-y-1 mb-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-stone-500">
            {theme.sections.section2Tag}
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-wide text-stone-900 font-sans">
            {theme.sections.section2Title}
          </h2>
        </div>

        {/* 4 Columns Product Grid or Elegant Empty State */}
        {bridalAndSarees.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {bridalAndSarees.slice(0, 8).map((product) => (
                <ProductCard key={product.id || product.sku} product={product} />
              ))}
            </div>
            <div className="text-center pt-8">
              <Link
                href="/collections/sarees"
                className="inline-block px-10 py-3 bg-[#a81c24] hover:bg-[#8e171e] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition shadow-sm"
              >
                VIEW ALL SAREES & LEHENGAS
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-[#fdfaf7] border border-dashed border-stone-300 space-y-3">
            <p className="font-serif font-bold text-stone-900 text-base sm:text-lg">
              Royal Bridal Couture & Sarees
            </p>
            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto">
              Banarasi Sarees and Bridal Lehengas are available directly at our Haridwar boutique showroom. Enquire now for personal bridal consultations.
            </p>
            <div className="pt-2">
              <a
                href="https://api.whatsapp.com/send?phone=919897123450&text=Namaste%20Indu%20Ji!%20I%20am%20looking%20for%20Bridal%20Lehengas%20and%20Sarees."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition shadow-sm"
              >
                <span>Book Bridal Consultation</span>
              </a>
            </div>
          </div>
        )}
      </section>

      {/* 5. AEO FAQ ACCORDION */}
      <div className="bg-stone-50 border-t border-stone-200">
        <AeoFaqSection />
      </div>
    </div>
  );
}
