"use client";

import React, { useState } from "react";
import { X, CheckCircle, ShieldCheck, Truck, Lock, AlertCircle, ArrowRight, MessageSquare } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SupabaseService } from "@/lib/supabaseClient";
import { SITE_CONFIG } from "@/lib/seoEngine";

interface CheckoutModalProps {
  onClose: () => void;
}

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { cart, subtotal, clearCart, setIsCartOpen } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Haridwar",
    state: "Uttarakhand",
    pincode: "249401",
    paymentMethod: "cod" as "cod" | "upi" | "whatsapp",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    total: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg("Please fill in your name, contact phone, and delivery address.");
      return;
    }

    if (formData.phone.replace(/\D/g, "").length < 10) {
      setErrorMsg("Please provide a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const orderNumber = `WEB-RN-${Date.now().toString().slice(-6)}`;
      const orderData = {
        orderNumber,
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
        items: cart.map((c) => ({
          sku: c.product.sku,
          name: c.product.name,
          quantity: c.quantity,
          selectedSize: c.selectedSize || "Standard",
          price: c.product.price,
          total: c.product.price * c.quantity,
        })),
        subtotal,
        totalAmount: subtotal,
        paymentMethod: formData.paymentMethod.toUpperCase(),
        shippingAddress: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      };

      await SupabaseService.recordOnlineOrder(orderData);

      setOrderSuccess({
        orderId: orderNumber,
        total: subtotal,
      });

      clearCart();
    } catch (err: any) {
      console.error("Order recording error:", err);
      setErrorMsg("Could not place order. Please try again or order directly via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyWhatsApp = () => {
    if (!orderSuccess) return;

    const message =
`*🎉 NEW RAJNANDINI BOUTIQUE ORDER*
-----------------------------------
📋 *Order ID*: ${orderSuccess.orderId}
👤 *Customer*: ${formData.name}
📱 *Phone*: ${formData.phone}
📍 *Address*: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}
💰 *Total Amount*: ₹${orderSuccess.total.toLocaleString("en-IN")}
💳 *Payment Mode*: ${formData.paymentMethod.toUpperCase()}

Namaste Indu Ji! I have placed an online order. Please confirm delivery timeline.`;

    const url = `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white text-stone-900 border border-stone-200 rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              {orderSuccess ? "Order Confirmed!" : "Fast Checkout"}
            </h3>
            <p className="text-[11px] text-stone-500">Rajnandini Boutique • Haridwar</p>
          </div>
          <button
            onClick={() => {
              if (orderSuccess) {
                setIsCartOpen(false);
              }
              onClose();
            }}
            className="p-1 rounded text-stone-500 hover:text-stone-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {orderSuccess ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full">
                  Order ID: {orderSuccess.orderId}
                </span>
                <h4 className="text-lg font-bold text-stone-900 mt-2.5">
                  Thank You, {formData.name}!
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto mt-1">
                  Your order is received and logged in our Haridwar showroom system. We will package and dispatch your ethnic attire shortly.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded p-3 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Amount:</span>
                  <span className="font-bold text-[#a81c24]">₹ {orderSuccess.total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment:</span>
                  <span className="font-semibold uppercase text-stone-900">{formData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Delivery Address:</span>
                  <span className="text-stone-800 text-right">{formData.city}, {formData.state}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleNotifyWhatsApp}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Order to WhatsApp (Get Live Tracking)</span>
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider transition"
                >
                  CONTINUE BROWSING
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-[#a81c24] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#a81c24]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#a81c24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="House/Flat number, Street, Landmark"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#a81c24] resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-600 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#a81c24]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-600 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#a81c24]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#a81c24]"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Payment Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: "cod" })}
                    className={`p-2.5 border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      formData.paymentMethod === "cod"
                        ? "border-[#a81c24] bg-red-50 text-[#a81c24] font-bold"
                        : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span className="text-[11px]">Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: "upi" })}
                    className={`p-2.5 border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      formData.paymentMethod === "upi"
                        ? "border-[#a81c24] bg-red-50 text-[#a81c24] font-bold"
                        : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span className="text-[11px]">UPI / QR (5% Off)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: "whatsapp" })}
                    className={`p-2.5 border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      formData.paymentMethod === "whatsapp"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold"
                        : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-[11px]">WhatsApp Pay</span>
                  </button>
                </div>
              </div>

              {/* Order total & CTA */}
              <div className="pt-2 border-t border-stone-200">
                <div className="flex justify-between items-center text-xs mb-3">
                  <span className="text-stone-600">Total payable (Free Pan-India Delivery):</span>
                  <span className="text-base font-extrabold text-[#a81c24]">
                    ₹ {subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#a81c24] hover:bg-[#8e171e] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>CONFIRM & PLACE ORDER</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 text-[10px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rajnandini Boutique Guarantee • Safe & Insured Shipping</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
