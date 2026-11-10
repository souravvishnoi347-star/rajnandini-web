"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-white text-stone-900 border-t border-stone-200/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Brand & Tagline (Image 4 Style) */}
        <div className="space-y-3 max-w-xl">
          <Link href="/" className="inline-block">
            <h2 className="font-serif font-black tracking-[0.22em] text-2xl sm:text-3xl text-stone-950 uppercase">
              RAJNANDINI
            </h2>
          </Link>
          <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
            Haute Couture Salons in Haridwar, Rishikesh, Mehrauli (New Delhi), and Colaba (Mumbai).
          </p>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-stone-100">
          {/* Showrooms */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-stone-400 block">
              SHOWROOMS
            </span>
            <ul className="space-y-2 text-xs font-serif text-stone-700">
              <li>Colaba, Mumbai</li>
              <li>Mehrauli, New Delhi</li>
              <li>Arya Nagar, Haridwar</li>
              <li>Tapovan, Rishikesh</li>
            </ul>
          </div>

          {/* Private Concierge */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-stone-400 block">
              PRIVATE CONCIERGE
            </span>
            <ul className="space-y-2 text-xs font-serif text-stone-700">
              <li>
                <a
                  href="https://api.whatsapp.com/send?phone=919897123450&text=Namaste%20Indu%20Ji!%20I%20would%20like%20to%20enquire%20about%20Bridal%20Bespoke%20Couture."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-950 hover:underline transition"
                >
                  Bridal Bespoke Service
                </a>
              </li>
              <li>Heritage Restoration</li>
              <li>Global Secure Courier</li>
              <li>
                <a
                  href="tel:+919897123450"
                  className="font-mono text-[11px] font-semibold text-stone-900 hover:underline"
                >
                  +91 98971 23450
                </a>
              </li>
            </ul>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-stone-400 block">
              CURATIONS
            </span>
            <ul className="space-y-2 text-xs font-serif text-stone-700">
              <li>
                <Link href="/collections/bridal-lehenga" className="hover:text-stone-950 transition">
                  Royal Bridal Lehengas
                </Link>
              </li>
              <li>
                <Link href="/collections/sarees" className="hover:text-stone-950 transition">
                  Pure Banarasi Weaves
                </Link>
              </li>
              <li>
                <Link href="/collections/kurti-sets" className="hover:text-stone-950 transition">
                  Bespoke Anarkali Suits
                </Link>
              </li>
              <li>
                <Link href="/collections/purses" className="hover:text-stone-950 transition">
                  Handcrafted Potlis
                </Link>
              </li>
            </ul>
          </div>

          {/* Archive Status */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-stone-400 block">
              ATELIER STATUS
            </span>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 space-y-2 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>SALON ACTIVE</span>
              </div>
              <p className="text-stone-500 text-[10px]">
                Indu Sharma Atelier • Arya Nagar Chowk, Haridwar
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Policy Bar (Matching Image 4) */}
        <div className="pt-8 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono tracking-wider uppercase text-stone-400 gap-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/about" className="hover:text-stone-900 transition">
              AUTHENTICATION CERTIFICATE
            </Link>
            <Link href="/about" className="hover:text-stone-900 transition">
              CLIENT PRIVACY
            </Link>
            <Link href="/about" className="hover:text-stone-900 transition">
              ARCHIVE POLICY
            </Link>
          </div>

          <span className="text-stone-500 text-center sm:text-right">
            © 2026 RAJNANDINI ATELIER. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
}
