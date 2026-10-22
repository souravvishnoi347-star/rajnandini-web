"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ThemeService, DEFAULT_THEME_CONFIG } from "@/lib/themeConfig";

const NAV_ROW_1 = [
  { name: "KURTIS", href: "/collections/kurtis" },
  { name: "KURTI SETS", href: "/collections/kurti-sets" },
  { name: "SAREES", href: "/collections/sarees" },
  { name: "LEHENGAS", href: "/collections/lehengas" },
  { name: "BRIDAL LEHENGAS", href: "/collections/bridal-lehenga" },
  { name: "PURSES", href: "/collections/purses" },
  { name: "JUTI", href: "/collections/juti" },
];

const NAV_ROW_2 = [
  { name: "TOP BESTSELLERS", href: "/collections/kurti-sets" },
  { name: "NEW ARRIVALS", href: "/collections/bridal-lehenga" },
  { name: "BUY 2 AT ₹1999", href: "/collections/kurtis" },
  { name: "BUY 3 AT ₹2499", href: "/collections/sarees" },
  { name: "HARIDWAR SHOWROOM", href: "/about" },
  { name: "★ 4.9 REVIEWS", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(DEFAULT_THEME_CONFIG);

  useEffect(() => {
    setTheme(ThemeService.getTheme());
    const handleUpdate = () => setTheme(ThemeService.getTheme());
    window.addEventListener("rajnandini_theme_updated", handleUpdate);
    return () => window.removeEventListener("rajnandini_theme_updated", handleUpdate);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/collections/sarees?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-stone-200 shadow-xs">
      {/* 1. TOP TICKER ANNOUNCEMENT BAR */}
      {theme.announcement.enabled && (
        <div
          style={{ backgroundColor: theme.announcement.bgColor || "#a81c24" }}
          className="text-white text-[11px] font-semibold py-1.5 px-4 overflow-hidden relative transition-colors duration-300"
        >
          <div className="flex items-center justify-center space-x-6 whitespace-nowrap text-center animate-pulse">
            <span>{theme.announcement.text}</span>
            <span>{theme.announcement.secondaryText}</span>
          </div>
        </div>
      )}

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
                placeholder="SEARCH KURTIS, SAREES, LEHENGAS, JUTIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-[11px] uppercase tracking-wider bg-stone-50 border-b-2 border-stone-300 focus:border-[#a81c24] focus:outline-none placeholder-stone-400 font-medium"
              />
            </form>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-1 lg:flex-none text-center">
            <Link href="/" className="inline-flex items-center justify-center group py-0.5" aria-label="Rajnandini Boutique Home">
              <Image
                src="/logo.png"
                alt="Rajnandini Boutique Haridwar"
                width={260}
                height={115}
                priority
                className="h-12 sm:h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-6 text-xs font-semibold text-stone-700">
            <Link
              href="/about"
              className="hidden sm:flex items-center gap-1.5 hover:text-[#a81c24] transition uppercase tracking-wider text-[11px]"
            >
              <User className="w-3.5 h-3.5" />
              <span>SHOWROOM</span>
            </Link>

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

      {/* 3. DUAL-TIER CATEGORY NAVIGATION (ONLY CORE 7 CATEGORIES) */}
      <nav className="hidden lg:block border-t border-stone-200/90 bg-stone-50/50 text-[11px] font-bold text-stone-800 uppercase tracking-wider">
        <div className="max-w-7xl mx-auto px-4">
          {/* Row 1: The 7 Core Categories */}
          <div className="flex items-center justify-center space-x-8 py-2.5 border-b border-stone-200/60">
            {NAV_ROW_1.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-[#a81c24] transition duration-150 py-0.5 tracking-widest text-[11px]"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Row 2: Secondary shortcuts */}
          <div className="flex items-center justify-center space-x-7 py-2 text-[10px] text-stone-600 font-semibold">
            {NAV_ROW_2.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-[#a81c24] transition duration-150"
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
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="SEARCH PRODUCTS..."
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
                className="p-2 rounded hover:bg-stone-50 hover:text-[#a81c24] transition uppercase"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
