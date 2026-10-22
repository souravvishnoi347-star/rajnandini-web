import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Scissors,
  Award,
  Heart,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/seoEngine";

export const metadata: Metadata = {
  title: "About Rajnandini Boutique Haridwar | Royal Ethnic Studio by Indu Sharma",
  description:
    "Learn about Rajnandini Boutique Haridwar, founded by Indu Sharma. Bringing pre-draped sarees, royal bridal lehengas, pure Banarasi silk, and master tailoring to Devbhoomi Uttarakhand.",
};

export default function AboutPage() {
  return (
    <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">
      {/* Hero Story */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#a81c24] bg-red-50 px-3 py-1 rounded-full">
          ABOUT RAJNANDINI BOUTIQUE
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide text-stone-900">
          Ethnic Fashion & Bridal Heritage in Haridwar
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          Founded and led by <strong>Indu Sharma</strong>, Rajnandini Boutique brings authentic handloom sarees, designer bridal lehengas, party anarkalis, and master custom tailoring directly to Devbhoomi Haridwar.
        </p>
      </div>

      {/* Two-Column Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-200 shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"
            alt="Indu Sharma - Rajnandini Boutique Haridwar"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 border border-stone-200 text-xs text-stone-700 shadow-xs">
            <span className="font-bold text-stone-900 block">Indu Sharma</span>
            Founder & Master Stylist, Rajnandini Boutique Haridwar
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#a81c24]">
              Direct From Loom Clusters
            </span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-stone-900 mt-0.5">
              Pure Fabrics. Zero Middlemen.
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every piece at Rajnandini Boutique is personally selected by Indu Sharma from master weaver communities across Varanasi, Kanpur, and Surat. From pure Dola silk sarees to heavily embellished bridal lehengas and festive anarkalis, we ensure uncompromised quality.
          </p>

          <div className="space-y-2">
            {[
              "Every saree is inspected for weave density and zari authenticity.",
              "Complimentary fall and pico edge finishing with every purchase.",
              "In-house master tailors for blouse stitching & doorstep fitting in Haridwar.",
              "Direct personal consultation via WhatsApp with store owner Indu Sharma.",
            ].map((point, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href={`https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=Namaste%20Indu%20Ji!%20I%20want%20to%20learn%20more%20about%20Rajnandini%20Boutique.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Indu Sharma</span>
            </a>

            <Link
              href="/collections/Bridal%20Wear"
              className="px-5 py-2.5 bg-[#a81c24] hover:bg-[#8e171e] text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
            >
              Shop Bridal Wear
            </Link>
          </div>
        </div>
      </div>

      {/* Showroom & GEO Citations */}
      <div className="bg-stone-50 border border-stone-200 p-6 sm:p-10 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#a81c24]">
            Physical Showroom
          </span>
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-stone-900">
            Visit Us in Haridwar
          </h3>
          <p className="text-stone-500 text-xs">
            Live draping, fabric touch, and custom fitting services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
          <div className="p-5 bg-white border border-stone-200 space-y-2">
            <MapPin className="w-5 h-5 text-[#a81c24]" />
            <h4 className="font-bold text-stone-900 uppercase">Showroom Address</h4>
            <p className="text-stone-600">
              {SITE_CONFIG.address.street}, Near Shivalik Nagar, Haridwar, Uttarakhand - 249401
            </p>
            <p className="text-[11px] text-[#a81c24] font-semibold">Doorstep fitting across Haridwar & Rishikesh</p>
          </div>

          <div className="p-5 bg-white border border-stone-200 space-y-2">
            <Clock className="w-5 h-5 text-[#a81c24]" />
            <h4 className="font-bold text-stone-900 uppercase">Timings</h4>
            <p className="text-stone-600">
              Monday to Sunday: 10:00 AM – 8:30 PM
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold">Open 7 days a week</p>
          </div>

          <div className="p-5 bg-white border border-stone-200 space-y-2">
            <Phone className="w-5 h-5 text-[#a81c24]" />
            <h4 className="font-bold text-stone-900 uppercase">Contact Us</h4>
            <p className="text-stone-600">
              Phone: +91 74649 87898<br />
              WhatsApp: +91 74649 87898
            </p>
            <p className="text-[11px] text-stone-500">Quick response within 15 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
