"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Scissors,
  Check,
  MapPin,
  Star,
  Share2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { ProductItem } from "@/types/store";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import CheckoutModal from "@/components/CheckoutModal";

interface ProductClientViewProps {
  product: ProductItem;
  relatedProducts: ProductItem[];
}

export default function ProductClientView({
  product,
  relatedProducts,
}: ProductClientViewProps) {
  const { addToCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
      ? [product.imageUrl]
      : [];

  const [activeImage, setActiveImage] = useState<string>(
    galleryImages[0] || product.imageUrl || ""
  );

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const discountPercent =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    setShowCheckout(true);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-stone-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#a81c24] transition">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/collections/${encodeURIComponent(product.category)}`}
            className="hover:text-[#a81c24] transition uppercase"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-medium truncate max-w-xs uppercase">{product.name}</span>
        </nav>

        {/* Main Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Product Media Gallery (Subhvastra Style) */}
          <div className="space-y-4">
            {/* Main Large Image */}
            <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden border border-stone-200 shadow-xs">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={`${product.name} - Rajnandini Boutique Haridwar`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top transition duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-stone-100 text-stone-400">
                  <span className="font-serif text-2xl font-bold text-[#a81c24]">
                    Rajnandini
                  </span>
                  <span className="text-xs text-stone-500 mt-1">Haridwar Showroom Exclusive</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute bottom-3 left-3 flex flex-col gap-1 z-10">
                <span className="bg-[#a81c24] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-sm">
                  {product.badge || "Bestseller"}
                </span>
                {discountPercent && (
                  <span className="bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Share action */}
              <button
                onClick={handleShare}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full border border-stone-200 text-stone-700 hover:text-[#a81c24] transition shadow-xs cursor-pointer"
                title="Share Product Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Multi-angle Thumbnail Row (If product has multiple angles) */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2.5">
                {galleryImages.map((img, idx) => {
                  const isSelected = activeImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-[3/4] bg-stone-100 overflow-hidden border-2 transition cursor-pointer ${
                        isSelected
                          ? "border-[#a81c24] shadow-md ring-2 ring-red-100"
                          : "border-stone-200 hover:border-stone-400 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} angle ${idx + 1}`}
                        fill
                        className="object-cover object-top"
                      />
                      <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white font-mono px-1 rounded-xs">
                        {idx === 0 ? "Front" : idx === 1 ? "Side" : idx === 2 ? "Back" : "Detail"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="p-3 bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-[#a81c24]" />
                <span>Haridwar Showroom Stock & Pan-India Dispatch</span>
              </span>
              <span className="font-mono text-stone-500">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Right: Product Purchase Details */}
          <div className="space-y-5">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#a81c24]">
                {product.category}
              </span>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wide text-stone-900 mt-1 leading-snug">
                {product.name}
              </h1>

              {/* Red Stars Social Proof */}
              <div className="flex items-center gap-2 mt-2 text-[#e02b37]">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#e02b37] text-[#e02b37]" />
                  ))}
                </div>
                <span className="text-xs text-stone-600 font-semibold">
                  4.9/5 • 530 Verified Buyer Reviews
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="p-4 bg-stone-50 border border-stone-200 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                ₹ {product.price.toLocaleString("en-IN")}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-sm text-stone-400 line-through">
                  ₹ {product.mrp.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Inclusive of all taxes & Free Pan-India Delivery
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Sizes Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 uppercase tracking-wider">
                    Select Size
                  </span>
                  <span className="text-[#a81c24] text-[11px] font-semibold flex items-center gap-1">
                    <Scissors className="w-3.5 h-3.5" />
                    Custom Alteration / Fitting Available
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-bold border transition cursor-pointer ${
                        selectedSize === size
                          ? "border-[#a81c24] bg-[#a81c24] text-white shadow-xs"
                          : "border-stone-300 bg-white text-stone-800 hover:border-stone-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-stone-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Pure E-Commerce Checkout Actions */}
            <div className="space-y-2.5 pt-2">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                type="button"
                className={`w-full py-3.5 px-6 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer border ${
                  added
                    ? "bg-[#a81c24] text-white border-[#a81c24]"
                    : "bg-white hover:bg-stone-50 text-stone-900 border-stone-900"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added To Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Cart</span>
                  </>
                )}
              </button>

              {/* Instant Buy It Now */}
              <button
                onClick={handleBuyNow}
                type="button"
                className="w-full py-3.5 px-6 bg-[#a81c24] hover:bg-[#8e171e] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>Buy It Now</span>
              </button>
            </div>

            {/* Specifications Box */}
            <div className="border border-stone-200 p-4 bg-stone-50 space-y-2.5 text-xs">
              <h4 className="font-bold text-stone-900 uppercase tracking-wide">
                Product Specifications
              </h4>
              <div className="grid grid-cols-2 gap-3 text-stone-600">
                {product.fabric && (
                  <div>
                    <span className="text-stone-400 block text-[11px]">Pure Fabric:</span>
                    <span className="font-semibold text-stone-900">{product.fabric}</span>
                  </div>
                )}
                {product.occasion && (
                  <div>
                    <span className="text-stone-400 block text-[11px]">Occasion:</span>
                    <span className="font-semibold text-stone-900">{product.occasion}</span>
                  </div>
                )}
                {product.washCare && (
                  <div>
                    <span className="text-stone-400 block text-[11px]">Wash & Care:</span>
                    <span className="font-semibold text-stone-900">{product.washCare}</span>
                  </div>
                )}
                <div>
                  <span className="text-stone-400 block text-[11px]">Quality Check:</span>
                  <span className="font-semibold text-emerald-700">100% Hand-inspected</span>
                </div>
              </div>
            </div>

            {/* Trust Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-stone-600">
              <div className="p-2.5 bg-stone-50 border border-stone-200">
                <Truck className="w-4 h-4 text-[#a81c24] mx-auto mb-1" />
                <span className="font-bold text-stone-900 block">Free Shipping</span>
                <span className="text-[10px] text-stone-500">Pan-India Courier</span>
              </div>

              <div className="p-2.5 bg-stone-50 border border-stone-200">
                <RotateCcw className="w-4 h-4 text-[#a81c24] mx-auto mb-1" />
                <span className="font-bold text-stone-900 block">7 Days Return</span>
                <span className="text-[10px] text-stone-500">Hassle-Free</span>
              </div>

              <div className="p-2.5 bg-stone-50 border border-stone-200">
                <Scissors className="w-4 h-4 text-[#a81c24] mx-auto mb-1" />
                <span className="font-bold text-stone-900 block">Custom Fitting</span>
                <span className="text-[10px] text-stone-500">Showroom Tailors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-stone-200 space-y-6">
            <div className="text-center">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-stone-500">
                EXPLORE MORE
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-stone-900">
                YOU MAY ALSO LIKE
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id || p.sku} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Online Direct Checkout Modal */}
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </>
  );
}
