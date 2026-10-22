import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles, Heart } from "lucide-react";
import { SITE_CONFIG } from "@/lib/seoEngine";

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-stone-300 border-t-4 border-[#a81c24] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Heritage */}
          <div className="space-y-3">
            <div>
              <span className="font-serif text-3xl font-extrabold text-[#e02b37] tracking-tight block">
                Rajnandini
              </span>
              <p className="text-[10px] tracking-[0.3em] text-stone-400 font-sans uppercase font-bold">
                BOUTIQUE • HARIDWAR
              </p>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Uttarakhand&apos;s celebrated boutique for pre-draped sarees, royal bridal lehengas, pure Banarasi silk, and custom tailored anarkalis. Managed by Indu Sharma.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-stone-300 font-semibold">
              <Sparkles className="w-4 h-4 text-[#e02b37] shrink-0" />
              <span>Registered GST Boutique Showroom</span>
            </div>
          </div>

          {/* Col 2: Top Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-stone-800 pb-2">
              Top Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/collections/Gown" className="text-stone-400 hover:text-white transition">
                  Anarkali Suits & Dresses
                </Link>
              </li>
              <li>
                <Link href="/collections/Bridal%20Wear" className="text-stone-400 hover:text-white transition">
                  Bridal & Wedding Lehengas
                </Link>
              </li>
              <li>
                <Link href="/collections/Saree" className="text-stone-400 hover:text-white transition">
                  Pure Banarasi & Dola Silk Sarees
                </Link>
              </li>
              <li>
                <Link href="/collections/Suit%20Set" className="text-stone-400 hover:text-white transition">
                  Sharara & Palazzo Sets
                </Link>
              </li>
              <li>
                <Link href="/collections/Stitching%20Job" className="text-stone-400 hover:text-white transition">
                  Custom Blouse & Fall-Pico Stitching
                </Link>
              </li>
              <li>
                <Link href="/collections/undergarments" className="text-stone-400 hover:text-white transition">
                  Undergarments & Lingerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-stone-800 pb-2">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>🚚 Free Insured Shipping Across India</li>
              <li>🔄 7 Days Easy Size & Color Exchange</li>
              <li>💳 Prepaid (UPI / NetBanking) & COD Available</li>
              <li>
                <a
                  href={`https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=Track%20Order`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  📦 Track Order on WhatsApp
                </a>
              </li>
              <li>⭐ 100% Genuine Handloom Quality Guarantee</li>
            </ul>
          </div>

          {/* Col 4: Haridwar Showroom */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-stone-800 pb-2">
              Haridwar Showroom
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#e02b37] shrink-0 mt-0.5" />
                <span>
                  {SITE_CONFIG.address.street}, Near Shivalik Nagar, Haridwar, Uttarakhand - 249401
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e02b37] shrink-0" />
                <a href="tel:+917464987898" className="hover:text-white transition">
                  +91 74649 87898 / +91 97607 78479
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#e02b37] shrink-0" />
                <span>Open All 7 Days: 10:00 AM – 8:30 PM</span>
              </div>
              <div className="pt-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=Namaste%20Indu%20Ji!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-bold transition"
                >
                  <span>Chat with Showroom Owner</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} Rajnandini Boutique Haridwar. All Rights Reserved.</p>
          <div className="flex items-center gap-1 text-[11px] text-stone-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#e02b37] fill-[#e02b37]" />
            <span>for Indian Ethnic Couture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
