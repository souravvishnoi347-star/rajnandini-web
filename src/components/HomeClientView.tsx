"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductItem } from "@/types/store";
import { useCart } from "@/context/CartContext";
import {
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShoppingBag,
  Check,
  MessageCircle,
} from "lucide-react";

interface HomeClientViewProps {
  initialProducts: ProductItem[];
}

interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  price: number;
  category: string;
}

interface RunwayLook {
  id: string;
  lookNumber: string;
  edition: string;
  title: string;
  totalPrice: number;
  image: string;
  hotspots: Hotspot[];
}

const RUNWAY_LOOKS: RunwayLook[] = [
  {
    id: "look-01",
    lookNumber: "LOOK 01 // EDITORIAL",
    edition: "COUTURE BRIDAL",
    title: "THE NOOR ENSEMBLE",
    totalPrice: 810000,
    image: "/products/lancha.png",
    hotspots: [
      {
        id: "hs-1",
        x: 48,
        y: 28,
        title: "Hand-Forged Zardozi Choli & Kundan Choker",
        price: 185000,
        category: "Choli & Jewellery",
      },
      {
        id: "hs-2",
        x: 42,
        y: 58,
        title: "Grand Kalidar Crimson Velvet Lehenga",
        price: 580000,
        category: "Bridal Lehenga",
      },
      {
        id: "hs-3",
        x: 72,
        y: 40,
        title: "Scalloped Organza Zari Sheer Veil",
        price: 45000,
        category: "Dupatta",
      },
    ],
  },
  {
    id: "look-02",
    lookNumber: "LOOK 02 // BESPOKE",
    edition: "FESTIVE COUTURE",
    title: "THE GULBAHAR ANARKALI",
    totalPrice: 48500,
    image: "/products/product 1.png",
    hotspots: [
      {
        id: "hs-4",
        x: 50,
        y: 35,
        title: "Rani Pink Flared Georgette Anarkali Suit",
        price: 34000,
        category: "Suit Set",
      },
      {
        id: "hs-5",
        x: 65,
        y: 60,
        title: "Gota-Patti Handcrafted Organza Dupatta",
        price: 14500,
        category: "Dupatta",
      },
    ],
  },
  {
    id: "look-03",
    lookNumber: "LOOK 03 // RUNWAY",
    edition: "HERITAGE DRAPE",
    title: "THE VARANASI HERITAGE SAREE",
    totalPrice: 112000,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    hotspots: [
      {
        id: "hs-6",
        x: 50,
        y: 45,
        title: "Pure Katan Silk Handloom Banarasi Saree",
        price: 89000,
        category: "Saree",
      },
      {
        id: "hs-7",
        x: 35,
        y: 68,
        title: "Handcrafted Bridal Potli with Antique Zari",
        price: 23000,
        category: "Handbag",
      },
    ],
  },
];

export default function HomeClientView({ initialProducts }: HomeClientViewProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [activeTab, setActiveTab] = useState<"atelier" | "cipher">("atelier");
  const [dossierInput, setDossierInput] = useState("");
  const [dossierSubmitted, setDossierSubmitted] = useState(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [baggedLookId, setBaggedLookId] = useState<string | null>(null);
  const [currentTimeUtc, setCurrentTimeUtc] = useState("");

  // Live UTC ticking clock (Image 4 exact style)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      setCurrentTimeUtc(`${hours}:${minutes}:${seconds} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync products from localStorage if added via Admin
  useEffect(() => {
    try {
      const stored = localStorage.getItem("rajnandini_admin_products");
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not sync local products:", e);
    }
  }, []);

  const handleScrollToBento = () => {
    const el = document.getElementById("bento-edit");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBagLook = (look: RunwayLook) => {
    addToCart(
      {
        id: look.id,
        sku: `RJ-COUTURE-${look.id.toUpperCase()}`,
        barcode: `890${look.id.replace(/\D/g, "") || "101"}`,
        name: `${look.title} (${look.edition})`,
        price: look.totalPrice,
        mrp: Math.round(look.totalPrice * 1.3),
        imageUrl: look.image,
        category: "Bridal Wear",
        stock: 2,
        sizes: ["Bespoke Made-to-Measure"],
        colors: ["Royal Heritage"],
      },
      "Bespoke Made-to-Measure",
      "Royal Heritage",
      1
    );
    setBaggedLookId(look.id);
    setTimeout(() => {
      setBaggedLookId(null);
      setIsCartOpen(true);
    }, 800);
  };

  const handleTransmitDossier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dossierInput.trim()) return;

    const message = encodeURIComponent(
      `*✦ RAJNANDINI ATELIER DOSSIER TRANSMISSION*\n\n` +
      `Request for Private Audience / Bespoke Trousseau Commission.\n` +
      `*Client Frequency*: ${dossierInput.trim()}\n` +
      `*Timestamp*: ${currentTimeUtc}\n` +
      `*Protocol*: Immortal Archive AW26 (Slots Remaining: 05 / 18)\n\n` +
      `Kindly connect with Indu Sharma Atelier.`
    );
    window.open(`https://api.whatsapp.com/send?phone=919897123450&text=${message}`, "_blank");
    setDossierSubmitted(true);
    setTimeout(() => {
      setDossierSubmitted(false);
      setDossierInput("");
    }, 4000);
  };

  return (
    <div className="bg-[#fbf9f5] text-stone-900 min-h-screen selection:bg-stone-900 selection:text-white">
      {/* ========================================================= */}
      {/* 1. HERO SECTION (Exact Replica of Image 1) */}
      {/* ========================================================= */}
      <section className="relative w-full overflow-hidden bg-stone-900 text-white min-h-[90vh] sm:min-h-screen flex items-end">
        {/* Background Editorial Model Photography */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/products/lancha.png"
            alt="Rajnandini Haute Couture Redefine Tradition"
            fill
            priority
            className="object-cover object-top filter brightness-[0.88] contrast-[1.08] scale-[1.02]"
          />
          {/* Subtle high-fashion vignette & gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-stone-950/20" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-stone-950/60" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-20 pt-28 space-y-6 sm:space-y-8">
          {/* Frosted Glass Pill Chip (Image 1 Style) */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/60 shadow-lg text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-stone-900">
              <span className="text-[#c59d5f] text-xs">✦</span>
              <span>AUTUMN / WINTER &apos;26 HAUTE COUTURE</span>
            </div>
          </div>

          {/* Large High-Fashion Typography */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-[-0.03em] text-white leading-[0.92]">
              REDEFINE<br />
              <span className="italic font-normal tracking-tight font-serif text-stone-100">
                TRADITION.
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base font-serif text-stone-300 max-w-xl leading-relaxed tracking-wide">
              Disrupting centuries of heritage with razor-sharp editorial silhouettes, hand-forged zardozi, and unyielding modern luxury.
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/collections/bridal-lehenga"
              className="inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-stone-950 hover:bg-black text-white text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase transition duration-200 border border-white/20 shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>EXPLORE THE COLLECTION</span>
              <span className="text-sm">→</span>
            </Link>

            <button
              onClick={handleScrollToBento}
              className="w-12 h-12 rounded-full bg-white hover:bg-stone-100 text-stone-950 flex items-center justify-center shadow-xl transition hover:scale-105 active:scale-95 shrink-0"
              aria-label="Scroll down to Curated Bento Edit"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. THE BENTO EDIT (Exact Replica of Images 1 & 2) */}
      {/* ========================================================= */}
      <section id="bento-edit" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8">
        {/* Section Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-[#c59d5f]">
            <span>✦</span>
            <span>CURATED ARCHITECTURE</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-stone-900 uppercase">
              THE BENTO EDIT
            </h2>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
              COLL. 01
            </span>
          </div>
        </div>

        {/* Bento Grid Container */}
        <div className="space-y-4 sm:space-y-6">
          {/* Card 1: Top Hero Bento Card (Bridal Edit) */}
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 min-h-[380px] sm:min-h-[460px] flex items-end p-6 sm:p-10 border border-stone-200/80 shadow-sm group">
            {/* Background Visual */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/products/lancha.png"
                alt="The Bridal Edit Couture Lehengas"
                fill
                className="object-cover object-center filter brightness-[0.85] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
            </div>

            {/* Top Pill Tag */}
            <div className="absolute top-5 left-5 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase text-stone-900 shadow-xs border border-white/60">
                <span className="text-[#c59d5f]">✦</span>
                <span>800+ HOURS HAND-ZARDOZI</span>
              </span>
            </div>

            {/* Bottom Content Overlay */}
            <div className="relative z-10 w-full space-y-3 sm:space-y-4">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#c59d5f] block">
                COUTURE BRIDAL // 01
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
                THE BRIDAL EDIT
              </h3>
              <p className="text-xs sm:text-sm font-serif text-stone-300 max-w-xl leading-relaxed">
                Heirloom zari lehengas tailored over 800 hours by master royal artisans in Haridwar & Old Delhi.
              </p>

              <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                <Link
                  href="/collections/bridal-lehenga"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-stone-950 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase hover:bg-stone-100 transition shadow-md"
                >
                  <span>EXPLORE BRIDAL</span>
                  <span>&gt;</span>
                </Link>

                <span className="font-serif text-sm sm:text-base font-bold text-white tracking-wider">
                  FROM ₹ 4.8L
                </span>
              </div>
            </div>
          </div>

          {/* Lower Bento Grid (Left Tall + Right Split) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Bento Card 2: Contemporary Sarees (Left) */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 min-h-[360px] sm:min-h-[420px] flex items-end p-6 sm:p-8 border border-stone-200/80 shadow-sm group">
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"
                  alt="Contemporary Sarees Sculpted Silk"
                  fill
                  className="object-cover object-center filter brightness-[0.8] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              </div>

              {/* Pill */}
              <div className="absolute top-5 left-5 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-mono font-bold tracking-wider uppercase text-stone-900 shadow-xs border border-white/60">
                  <span className="text-[#c59d5f]">✦</span>
                  <span>16 SILHOUETTES</span>
                </span>
              </div>

              <div className="relative z-10 w-full space-y-1.5">
                <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#c59d5f] block">
                  SCULPTED SILK
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  CONTEMPORARY SAREES
                </h4>
                <Link
                  href="/collections/sarees"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-white hover:text-[#c59d5f] transition pt-1"
                >
                  <span>VIEW EDIT</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right Column (Stacked 2 Cards) */}
            <div className="grid grid-rows-2 gap-4 sm:gap-6">
              {/* Bento Card 3: Capsule New Arrivals (White Card) */}
              <Link
                href="/collections/all"
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-stone-400 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-stone-400">
                    CAPSULE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[9px] font-mono font-bold tracking-wider uppercase">
                    LIMITED
                  </span>
                </div>

                <div className="space-y-1 my-4">
                  <h4 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 uppercase tracking-tight group-hover:text-stone-700 transition">
                    NEW ARRIVALS
                  </h4>
                  <span className="text-xs font-mono tracking-widest text-stone-400 uppercase block">
                    DROP 04 // AW26
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs font-mono font-bold text-stone-900">
                  <span>14 PIECES</span>
                  <span className="text-stone-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition">
                    ↗
                  </span>
                </div>
              </Link>

              {/* Bento Card 4: High Jewellery (Dark Card) */}
              <Link
                href="/collections/purses"
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-950 p-6 sm:p-8 border border-stone-800 shadow-xs flex flex-col justify-between group"
              >
                <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-55 transition">
                  <Image
                    src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80"
                    alt="High Jewellery Uncut Polki and Potlis"
                    fill
                    className="object-cover object-center filter grayscale group-hover:grayscale-0 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-stone-950/70" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#c59d5f]">
                    UNCUT POLKI & POTLIS
                  </span>
                </div>

                <div className="relative z-10 mt-auto pt-6 space-y-1">
                  <h4 className="font-serif text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    HIGH JEWELLERY
                  </h4>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-400">
                    <span>ARTIFACTS</span>
                    <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition">
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE RUNWAY / SHOP THE LOOK (Exact Replica of Image 3) */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8 border-t border-stone-200/60">
        {/* Section Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-[#c59d5f]">
            <span>✦</span>
            <span>INTERACTIVE RUNWAY</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-stone-900 uppercase">
              SHOP THE LOOK
            </h2>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1">
              SWIPE <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-xs sm:text-sm font-serif text-stone-500 max-w-xl">
            Tap the radiant pins to preview bespoke pieces and curate your personal trousseau.
          </p>
        </div>

        {/* Horizontal Runway Cards (Swipe on Mobile, Responsive on Desktop) */}
        <div className="flex gap-6 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x snap-mandatory">
          {RUNWAY_LOOKS.map((look) => (
            <div
              key={look.id}
              className="min-w-[310px] sm:min-w-[380px] lg:min-w-[420px] bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col justify-between snap-center"
            >
              {/* Visual with Interactive Hotspots */}
              <div className="relative aspect-[3/4] w-full bg-stone-950 overflow-hidden">
                <Image
                  src={look.image}
                  alt={look.title}
                  fill
                  className="object-cover object-top filter brightness-[0.92]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />

                {/* Hotspots Active Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-[9px] font-mono font-bold tracking-wider uppercase text-white border border-white/20 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{look.hotspots.length} HOTSPOTS ACTIVE</span>
                  </span>
                </div>

                {/* Interactive Hotspot Pins */}
                {look.hotspots.map((hs) => {
                  const isActive = activeHotspotId === hs.id;
                  return (
                    <div
                      key={hs.id}
                      style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      {/* Pulsating Ring Button */}
                      <button
                        onClick={() => setActiveHotspotId(isActive ? null : hs.id)}
                        className="relative w-8 h-8 rounded-full flex items-center justify-center transition focus:outline-none"
                        aria-label={`View ${hs.title}`}
                      >
                        <span className="absolute inset-0 rounded-full bg-[#c59d5f] opacity-75 animate-ping" />
                        <span className="relative w-6 h-6 rounded-full bg-gradient-to-br from-[#c59d5f] to-[#966f33] border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-black">
                          ✦
                        </span>
                      </button>

                      {/* Tooltip Card when Hotspot is Tapped */}
                      {isActive && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 bg-stone-950/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-stone-700 z-30 text-left space-y-1.5 animate-in fade-in zoom-in-95">
                          <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[#c59d5f] block">
                            {hs.category}
                          </span>
                          <p className="font-serif font-bold text-xs text-stone-100 leading-snug">
                            {hs.title}
                          </p>
                          <div className="flex items-center justify-between pt-1 border-t border-stone-800 text-xs">
                            <span className="font-serif font-extrabold text-stone-200">
                              ₹{hs.price.toLocaleString("en-IN")}
                            </span>
                            <button
                              onClick={() => {
                                addToCart(
                                  {
                                    id: hs.id,
                                    sku: `RJ-HS-${hs.id}`,
                                    barcode: `890${hs.id.replace(/\D/g, "") || "999"}`,
                                    name: hs.title,
                                    price: hs.price,
                                    mrp: Math.round(hs.price * 1.3),
                                    imageUrl: look.image,
                                    category: hs.category,
                                    stock: 5,
                                    sizes: ["Standard"],
                                    colors: ["As Shown"],
                                  },
                                  "Standard",
                                  "As Shown",
                                  1
                                );
                                setIsCartOpen(true);
                              }}
                              className="text-[10px] font-mono font-bold text-[#c59d5f] hover:underline uppercase"
                            >
                              + ADD PIECE
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Card Footer (Exact Image 3 Layout) */}
              <div className="p-5 flex items-center justify-between border-t border-stone-100 bg-white">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#c59d5f] uppercase block">
                    {look.lookNumber}
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-black text-stone-950 uppercase tracking-tight">
                    {look.title}
                  </h4>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="font-serif text-sm sm:text-base font-extrabold text-stone-950 block">
                    ₹ {look.totalPrice.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => handleBagLook(look)}
                    className="text-[10px] font-mono font-bold tracking-wider text-stone-900 hover:text-[#c59d5f] uppercase inline-flex items-center gap-1 transition"
                  >
                    {baggedLookId === look.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>ADDED</span>
                      </>
                    ) : (
                      <>
                        <span>+ BAG ALL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. IMMORTAL ARCHIVE // PROTOCOL (Exact Replica of Image 4) */}
      {/* ========================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8 text-center border-t border-stone-200/60">
        {/* Global Quota Strip */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase text-stone-400">
          <span>GLOBAL QUOTA AW26</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950 text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SLOTS REMAINING: 05 / 18</span>
          </span>
        </div>

        {/* Section Headline */}
        <div className="space-y-3 pt-2">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#c59d5f] block">
            IMMORTAL ARCHIVE // PROTOCOL
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-stone-950 leading-[1.02]">
            DEATH OF<br />
            <span className="italic font-normal">CONVENTIONAL</span><br />
            COUTURE.
          </h2>
          <p className="text-xs sm:text-sm font-serif text-stone-600 max-w-xl mx-auto leading-relaxed pt-2">
            We do not produce collections. We commission wearable relics. Only 18 brides inducted globally each solar cycle. Enter biometric concierge frequency to request an audience with the Atelier.
          </p>
        </div>

        {/* Dossier Concierge Form Box (Exact Image 4 Card Layout) */}
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xs max-w-xl mx-auto space-y-6 text-left">
          {/* Tabs: ATELIER AUDIENCE | RUNWAY CIPHER */}
          <div className="grid grid-cols-2 p-1 bg-stone-200/60 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("atelier")}
              className={`py-2 text-center rounded-lg transition ${
                activeTab === "atelier" ? "bg-white text-stone-950 shadow-xs" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              ATELIER AUDIENCE
            </button>
            <button
              onClick={() => setActiveTab("cipher")}
              className={`py-2 text-center rounded-lg transition ${
                activeTab === "cipher" ? "bg-white text-stone-950 shadow-xs" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              RUNWAY CIPHER
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleTransmitDossier} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-stone-500 block">
                CONNECTION FREQUENCY TO:
              </label>
              <input
                type="text"
                required
                placeholder="ENTER ENCRYPTED EMAIL / PRIVATE NUMBER"
                value={dossierInput}
                onChange={(e) => setDossierInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-xs font-mono uppercase tracking-wider text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-950 shadow-xs"
              />
            </div>

            {/* Meta status with Live UTC clock */}
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-wider text-stone-400 pt-1">
              <span>ENCRYPTION: 256 BIT ATELIER PKPQ</span>
              <span className="font-bold text-stone-600">{currentTimeUtc}</span>
            </div>

            {/* Transmit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-stone-950 hover:bg-black text-white text-xs font-mono font-bold tracking-[0.2em] uppercase transition flex items-center justify-center gap-2 shadow-lg active:scale-[0.99]"
            >
              {dossierSubmitted ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>DOSSIER TRANSMITTED TO CONCIERGE</span>
                </>
              ) : (
                <>
                  <span>TRANSMIT DOSSIER</span>
                  <span>↗</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Floating WhatsApp Concierge Pill */}
      <a
        href="https://api.whatsapp.com/send?phone=919897123450&text=Namaste%20Indu%20Ji!%20I%20would%20like%20to%20book%20a%20private%20bridal%20consultation."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-stone-950 text-white text-[11px] font-mono font-bold tracking-wider uppercase border border-stone-700 shadow-2xl flex items-center gap-2 hover:bg-black transition duration-200"
        title="Connect with Indu Sharma Concierge"
      >
        <MessageCircle className="w-4 h-4 text-emerald-400" />
        <span className="hidden sm:inline">ATELIER CONCIERGE</span>
      </a>
    </div>
  );
}
