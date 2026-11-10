"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

const COUTURE_NAV_LINKS = [
  { name: "COLLECTIONS", href: "/collections/all" },
  { name: "BRIDAL EDIT", href: "/collections/bridal-lehenga" },
  { name: "SAREES", href: "/collections/sarees" },
  { name: "KURTI SETS", href: "/collections/kurti-sets" },
  { name: "ATELIER SALON", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (pathname?.startsWith("/admin")) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/collections/all?q=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Left: Brand Logo & Couture Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-serif font-black tracking-[0.22em] text-lg sm:text-xl text-stone-900 group-hover:text-stone-700 transition">
                  RAJNANDINI
                </span>
                <span className="text-[9px] font-mono font-bold tracking-widest text-stone-500 uppercase px-2 py-0.5 rounded-full border border-stone-300 bg-stone-50/80">
                  COUTURE
                </span>
              </Link>
            </div>

            {/* Center: High-Fashion Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.18em] uppercase text-stone-600">
              {COUTURE_NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-stone-950 transition duration-150 py-1 relative group"
                >
                  <span>{link.name}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#c59d5f] transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right: Search, Cart Bag, Mobile Toggle */}
            <div className="flex items-center gap-3 sm:gap-5 text-stone-900">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:text-[#c59d5f] transition rounded-full hover:bg-stone-50"
                aria-label="Search"
                title="Search Couture"
              >
                <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>

              {/* Shopping Bag with Badge (Image 1 Style) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:text-[#c59d5f] transition rounded-full hover:bg-stone-50 cursor-pointer"
                aria-label="Shopping Bag"
                title="View Trousseau Bag"
              >
                <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-stone-900 text-white text-[9px] font-mono font-bold flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 lg:hidden text-stone-900 hover:text-stone-600 transition"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay Bar */}
        {isSearchOpen && (
          <div className="border-t border-stone-200 bg-stone-50 px-4 py-3 animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="SEARCH BY CODE, SILHOUETTE, ZARDOZI, SAREE, LEHENGA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-24 py-2 text-xs font-mono uppercase tracking-wider bg-white border border-stone-300 rounded-full focus:outline-none focus:border-stone-900 placeholder-stone-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1.5 bg-stone-900 text-white text-[10px] font-mono font-bold uppercase rounded-full hover:bg-stone-800 transition"
                >
                  SEARCH
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white/98 backdrop-blur-md px-6 py-6 space-y-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-4">
              <p className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#c59d5f]">
                HAUTE COUTURE DIRECTORY
              </p>
              <div className="flex flex-col space-y-3">
                {COUTURE_NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-lg font-bold tracking-wider text-stone-900 hover:text-[#c59d5f] transition flex items-center justify-between border-b border-stone-100 pb-2"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-stone-300" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-stone-500">
              <span>HARIDWAR SALON</span>
              <a
                href="https://api.whatsapp.com/send?phone=919897123450"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-stone-900 hover:underline"
              >
                +91 98971 23450
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
