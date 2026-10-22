import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/catalogService";
import ProductCard from "@/components/ProductCard";
import AeoFaqSection from "@/components/AeoFaqSection";
import { Truck, ShieldCheck, Scissors, RefreshCw } from "lucide-react";

export default async function HomePage() {
  const allProducts = await getAllProducts();

  // Categorized product groups
  const kurtiSets = allProducts.filter(
    (p) => p.category === "Suit Set" || p.category === "kurtis" || p.category === "kurti-sets"
  );

  const bridalAndSarees = allProducts.filter(
    (p) => p.category === "Bridal Wear" || p.category === "Saree" || p.category === "sarees" || p.category === "lehengas"
  );

  const featuredBestsellers = allProducts.slice(0, 8);

  return (
    <div className="bg-white space-y-12 sm:space-y-16">
      {/* 1. SUBHVASTRA-STYLE LIFESTYLE HERO BANNER */}
      <section className="relative w-full bg-[#fdfaf7] border-b border-stone-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#fae8dc] via-[#fdf6f0] to-[#e8f1f5] border border-stone-200/60 shadow-xs flex items-center justify-between p-6 sm:p-12">
            {/* Background Ethnic Floral Art overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#b91c1c_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

            {/* Left Content / Banner Title */}
            <div className="relative z-10 max-w-lg space-y-3 sm:space-y-4">
              <span className="inline-block bg-[#a81c24] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Festive & Bridal &apos;26 Collection
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
                Royal Ethnic Wear <br />
                <span className="text-[#a81c24] italic font-serif font-normal">
                  Rajnandini Haridwar
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-stone-700 font-medium">
                Kurtis, Kurti Sets, Pure Sarees, Regal Lehengas, Purses & Handcrafted Jutis.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/products/rani-pink-embroidered-flared-anarkali-suit-set-with-dupatta-rj-suit-001"
                  className="px-6 py-2.5 bg-[#a81c24] hover:bg-[#8e171e] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition shadow-sm"
                >
                  SHOP FIRST ARRIVAL
                </Link>

                <Link
                  href="/collections/kurti-sets"
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition shadow-sm"
                >
                  EXPLORE KURTI SETS
                </Link>
              </div>
            </div>

            {/* Right: High-Fashion Ethnic Models Grid using ChatGPT Shoots */}
            <div className="hidden md:flex items-center gap-4 relative z-10 shrink-0">
              <Link
                href="/products/haldi-yellow-rani-pink-royal-bridal-lancha-lehenga-set-rj-lhg-001"
                className="relative w-44 h-64 rounded-xl overflow-hidden shadow-lg border-2 border-white transform -rotate-2 hover:rotate-0 transition duration-300 block"
              >
                <Image
                  src="/products/lancha.png"
                  alt="Rajnandini Bridal Lancha"
                  fill
                  className="object-cover object-top"
                />
              </Link>
              <Link
                href="/products/rani-pink-embroidered-flared-anarkali-suit-set-with-dupatta-rj-suit-001"
                className="relative w-48 h-72 rounded-xl overflow-hidden shadow-xl border-2 border-white transform hover:scale-105 transition duration-300 block ring-2 ring-[#a81c24]"
              >
                <Image
                  src="/products/product 1.png"
                  alt="Rajnandini Rani Pink Flared Anarkali Suit"
                  fill
                  className="object-cover object-top"
                />
                <span className="absolute bottom-2 left-2 bg-[#a81c24] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase">
                  Featured
                </span>
              </Link>
              <Link
                href="/products/wine-maroon-heavily-embellished-reception-anarkali-gown-rj-gwn-002"
                className="relative w-44 h-64 rounded-xl overflow-hidden shadow-lg border-2 border-white transform rotate-2 hover:rotate-0 transition duration-300 block"
              >
                <Image
                  src="/products/one piece dress.png"
                  alt="Rajnandini Reception Gown"
                  fill
                  className="object-cover object-top"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="border-y border-stone-200 bg-stone-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-[#a81c24]" />
              <span className="text-xs font-bold text-stone-800">FREE SHIPPING ALL OVER INDIA</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#a81c24]" />
              <span className="text-xs font-bold text-stone-800">100% PURE FABRIC ASSURANCE</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Scissors className="w-4 h-4 text-[#a81c24]" />
              <span className="text-xs font-bold text-stone-800">CUSTOM BLOUSE & FALL-PICO</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#a81c24]" />
              <span className="text-xs font-bold text-stone-800">7 DAYS EASY EXCHANGE</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION ONE: KURTIS & KURTI SETS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-1 mb-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-stone-500">
            FESTIVE & EVERYDAY WEAR
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-wide text-stone-900 font-sans">
            KURTIS, ANARKALI SUIT SETS & SHARARAS
          </h2>
        </div>

        {/* 4 Columns Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {(kurtiSets.length > 0 ? kurtiSets.slice(0, 8) : featuredBestsellers.slice(0, 4)).map(
            (product) => (
              <ProductCard key={product.id || product.sku} product={product} />
            )
          )}
        </div>

        <div className="text-center pt-8">
          <Link
            href="/collections/kurti-sets"
            className="inline-block px-10 py-3 bg-[#a81c24] hover:bg-[#8e171e] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition shadow-sm"
          >
            VIEW ALL KURTIS & SUITS
          </Link>
        </div>
      </section>

      {/* 4. SECTION TWO: ROYAL BRIDAL LEHENGAS & PURE SILK SAREES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center space-y-1 mb-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-stone-500">
            DEV BHOOMI HARIDWAR WEAVES
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-wide text-stone-900 font-sans">
            ROYAL BRIDAL LEHENGAS & PURE BANARASI SAREES
          </h2>
        </div>

        {/* 4 Columns Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {(bridalAndSarees.length > 0 ? bridalAndSarees.slice(0, 8) : featuredBestsellers.slice(4, 8)).map(
            (product) => (
              <ProductCard key={product.id || product.sku} product={product} />
            )
          )}
        </div>

        <div className="text-center pt-8">
          <Link
            href="/collections/sarees"
            className="inline-block px-10 py-3 bg-[#a81c24] hover:bg-[#8e171e] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition shadow-sm"
          >
            VIEW ALL SAREES & LEHENGAS
          </Link>
        </div>
      </section>

      {/* 5. AEO FAQ ACCORDION */}
      <div className="bg-stone-50 border-t border-stone-200">
        <AeoFaqSection />
      </div>
    </div>
  );
}
