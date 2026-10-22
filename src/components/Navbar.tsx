"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, User, MessageSquare, Truck, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SITE_CONFIG } from "@/lib/seoEngine";

const NAV_ROW_1 = [
  { name: "TOP SELLING", href: "/collections/Saree" },
  { name: "NEW ARRIVALS", href: "/collections/Bridal%20Wear" },
  { name: "ANARKALI GOWN", href: "/collections/Gown" },
  { name: "SHARARA & SUITS", href: "/collections/Suit%20Set" },
  { name: "LEHENGA CHOLI", href: "/collections/Bridal%20Wear" },
  { name: "UNDERGARMENTS", href: "/collections/undergarments" },
  { name: "HANDLOOM SAREES", href: "/collections/Saree" },
  { name: "CUSTOM STITCHING", href: "/collections/Stitching%20Job" },
];

const NAV_ROW_2 = [
  { name: "BUY 2 AT ₹1999", href: "/collections/Suit%20Set" },
  { name: "BUY 3 AT ₹2499", href: "/collections/Saree" },
  { name: "BANARASI SILK", href: "/collections/Saree" },
  { name: "INDO WESTERN", href: "/collections/Gown" },
  { name: "FESTIVAL SUITS", href: "/collections/Suit%20Set" },
  { name: "🚚 TRACK ORDER", href: `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=Track%20Order` },
  { name: "★ 4.9 REVIEWS", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/collections/Saree?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-stone-200 shadow-xs">
      {/* 1. TOP MAROON/RED TICKER ANNOUNCEMENT BAR */}
      <div className="bg-[#a81c24] text-white text-[11px] font-semibold py-1.5 px-4 overflow-hidden relative">
        <div className="flex items-center justify-center space-x-6 whitespace-nowrap text-center animate-pulse">
          <span>🔥 LIMITED TIME OFFER!</span>
          <span>🛍️ BUY 2 GET 5% OFF — CODE: RAJ5</span>
          <span>✨ BUY 3 GET 10% OFF — CODE: RAJ10</span>
          <span>💳 EXTRA 5% OFF ON PREPAID (UPI)</span>
          <span>🚚 FREE SHIPPING ACROSS INDIA</span>
        </div>
      </div>

      {/* 2. MAIN HEADER (SEARCH | LOGO | ACTIONS) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-stone-800 hover:text-[#a81c24]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left: Search Box (Subhvastra Style) */}
          <div className="hidden lg:block w-72">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="SEARCH LEHENGAS, SAREES, SUITS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-[11px] uppercase tracking-wider bg-stone-50 border-b-2 border-stone-300 focus:border-[#a81c24] focus:outline-none placeholder-stone-400 font-medium"
              />
            </form>
          </div>

          {/* Center: Brand Logo (Devanagari / Red Calligraphy Aesthetic) */}
          <div className="flex-1 lg:flex-none text-center">
            <Link href="/" className="inline-flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#a81c24]">
                Rajnandini
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-stone-500 font-bold -mt-1">
                BOUTIQUE • HARIDWAR
              </span>
            </Link>
          </div>

          {/* Right: Actions (Account, Showroom, Cart - Subhvastra Style) */}
          <div className="flex items-center space-x-6 text-xs font-semibold text-stone-700">
            {/* Account / Support */}
            <Link
              href="/about"
              className="hidden sm:flex items-center gap-1.5 hover:text-[#a81c24] transition uppercase tracking-wider text-[11px]"
            >
              <User className="w-3.5 h-3.5" />
              <span>ACCOUNT</span>
            </Link>

            {/* Cart Trigger (Subhvastra Style) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 hover:text-[#a81c24] transition uppercase tracking-wider text-[11px] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#a81c24]" />
              <span>CART ({totalItems})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. SUBHVASTRA-STYLE DUAL-TIER CATEGORY NAVIGATION */}
      <nav className="hidden lg:block border-t border-stone-200/90 bg-stone-50/50 text-[11px] font-bold text-stone-800 uppercase tracking-wider">
        <div className="max-w-7xl mx-auto px-4">
          {/* Row 1 */}
          <div className="flex items-center justify-center space-x-5 xl:space-x-7 py-2 border-b border-stone-200/60">
            {NAV_ROW_1.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-[#a81c24] transition duration-150 py-0.5"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-center space-x-6 py-2 text-[10px] text-stone-600 font-semibold">
            {NAV_ROW_2.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-[#a81c24] transition duration-150 flex items-center gap-1"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="SEARCH LEHENGAS, SAREES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-100 rounded-md border border-stone-200 focus:outline-none"
            />
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-stone-800">
            {[...NAV_ROW_1, ...NAV_ROW_2].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-stone-50 hover:text-[#a81c24] transition"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200">
            <a
              href={`https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=Namaste%20Indu%20Ji!`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Showroom (+91 74649 87898)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
