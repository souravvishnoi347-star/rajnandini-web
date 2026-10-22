"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { FaqItem } from "@/types/store";
import { GLOBAL_STORE_FAQS } from "@/lib/seoEngine";

interface AeoFaqSectionProps {
  faqs?: FaqItem[];
  title?: string;
  subtitle?: string;
}

export default function AeoFaqSection({
  faqs = GLOBAL_STORE_FAQS,
  title = "Frequently Asked Questions & Answers",
  subtitle = "Direct answers for online ordering, bridal consultations, authentic silk verification, and Haridwar showroom visits.",
}: AeoFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#a81c24] text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HELP & ORDERING GUIDE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-stone-900">
          {title}
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-2xs transition"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-[#a81c24] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-stone-900">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#a81c24] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
