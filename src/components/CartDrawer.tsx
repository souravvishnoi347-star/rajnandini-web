"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SITE_CONFIG, getProductSlug } from "@/lib/seoEngine";
import CheckoutModal from "./CheckoutModal";

export default function CartDrawer() {
  const pathname = usePathname();
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems, isCartOpen, setIsCartOpen } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isCartOpen || pathname?.startsWith("/admin")) return null;

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    const itemsSummary = cart
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.product.name}* (SKU: ${item.product.sku}) - Qty: ${item.quantity} ${
            item.selectedSize ? `[Size: ${item.selectedSize}]` : ""
          } @ ₹${(item.product.price * item.quantity).toLocaleString("en-IN")}`
      )
      .join("\n");

    const message =
`Namaste Rajnandini Boutique! 🙏

I would like to place an order for these items from my cart:

${itemsSummary}

💰 *Total Amount*: ₹${subtotal.toLocaleString("en-IN")}
🚚 *Delivery*: Free Pan-India Delivery

Please confirm availability and share payment details (UPI/QR or COD). Thank you!`;

    const url = `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white text-stone-900 border-l border-stone-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#a81c24]" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-stone-900">
                  Shopping Cart ({totalItems})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Strip */}
            <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-center">
              <p className="text-[11px] font-bold text-[#a81c24]">
                🎉 You are eligible for FREE Pan-India Shipping!
              </p>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-base text-stone-900">Your cart is empty</h4>
                  <p className="text-xs text-stone-500">
                    Browse our top selling Anarkalis, Sarees, and Bridal Lehengas.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-6 py-2 bg-[#a81c24] text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product.sku}-${item.selectedSize || "std"}`}
                    className="p-3 bg-stone-50 border border-stone-200 flex gap-3 items-center"
                  >
                    <div className="relative w-16 h-20 bg-stone-200 shrink-0 overflow-hidden">
                      {item.product.imageUrl && (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold uppercase tracking-tight text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-mono">
                        SKU: {item.product.sku} {item.selectedSize ? `| Size: ${item.selectedSize}` : ""}
                      </p>
                      <p className="text-xs font-bold text-[#a81c24] mt-1">
                        ₹ {item.product.price.toLocaleString("en-IN")}
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-stone-300 bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.sku, item.quantity - 1, item.selectedSize)}
                            className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.sku, item.quantity + 1, item.selectedSize)}
                            className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.sku, item.selectedSize)}
                          className="text-stone-400 hover:text-red-600 text-xs transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Buttons */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span>₹ {subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping:</span>
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-stone-900 border-t border-stone-200 pt-2">
                    <span>Total Amount:</span>
                    <span className="text-[#a81c24]">₹ {subtotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full py-3.5 bg-[#a81c24] hover:bg-[#8e171e] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[10px] text-stone-500 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>100% Secure Checkout • Authentic Handloom Guarantee</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </>
  );
}
