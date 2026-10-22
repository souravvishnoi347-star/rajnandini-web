import { ProductItem, ProductCategory, FaqItem } from "@/types/store";

export const SITE_CONFIG = {
  name: "Rajnandini Boutique",
  legalName: "Rajnandini Boutique & Ethnic Studio Haridwar",
  tagline: "Authentic Luxury Sarees, Bridal Lehengas & Handloom Fashion",
  description:
    "Discover authentic handcrafted Banarasi silk sarees, designer bridal lehengas, festive suits, and boutique accessories curated by Indu Sharma at Rajnandini Boutique Haridwar. Worldwide Express Shipping.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://rajnandiniboutique.com",
  phone: "+91 7464987898",
  whatsappNumber: "917464987898",
  address: {
    street: "Arya Nagar / Rajeev Nagar",
    city: "Haridwar",
    state: "Uttarakhand",
    pincode: "249407",
    country: "India",
  },
  geo: {
    latitude: 29.9457,
    longitude: 78.1642,
  },
  socials: {
    instagram: "https://instagram.com/rajnandiniboutique",
    facebook: "https://facebook.com/rajnandiniboutique",
  },
};

/**
 * Generate SEO-friendly URL slug for products
 * e.g. "dharti-stich-blouse-dola-silk-saree-rj-sar-001"
 */
export function getProductSlug(product: ProductItem): string {
  const cleanName = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const cleanSku = product.sku.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `${cleanName}-${cleanSku}`;
}

/**
 * Extract SKU from product slug
 */
export function getSkuFromSlug(slug: string): string | null {
  const match = slug.match(/(rj-[a-z]+-[0-9]+)$/i);
  return match ? match[1].toUpperCase() : null;
}

/**
 * High-Converting WhatsApp Direct Ordering Link
 */
export function getWhatsAppOrderUrl(product: ProductItem, size?: string): string {
  const text =
`Namaste Rajnandini Boutique! 🙏

I would like to order this item from your website:
📦 *Product*: ${product.name}
🏷️ *SKU*: ${product.sku}
💰 *Price*: ₹${product.price.toLocaleString("en-IN")}${size ? `\n📏 *Selected Size*: ${size}` : ""}

🔗 *Product Link*: ${SITE_CONFIG.url}/products/${getProductSlug(product)}

Please let me know how to pay (UPI / COD) and delivery timeline to my address. Thank you!`;

  return `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=${encodeURIComponent(text)}`;
}

/**
 * SCHEMA.ORG: Product Rich Snippet for Google Search
 */
export function generateProductSchema(product: ProductItem) {
  const productUrl = `${SITE_CONFIG.url}/products/${getProductSlug(product)}`;
  const defaultImage =
    product.imageUrl ||
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [defaultImage],
    description:
      product.description ||
      `Authentic ${product.name} crafted in premium fabric. Curated by Rajnandini Boutique Haridwar with 100% genuine quality guarantee. Free custom styling and prompt pan-India dispatch.`,
    sku: product.sku,
    mpn: product.barcode,
    brand: {
      "@type": "Brand",
      name: "Rajnandini Boutique",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
        telephone: SITE_CONFIG.phone,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "d",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "48",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

/**
 * SCHEMA.ORG: Local Business & GEO for Haridwar / Uttarakhand Google Rankings
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${SITE_CONFIG.url}/#store`,
    name: SITE_CONFIG.legalName,
    alternateName: "Rajnandini Saree & Lehenga Boutique Haridwar",
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    priceRange: "₹₹",
    image: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.pincode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.geo.latitude,
      longitude: SITE_CONFIG.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:30",
        closes: "21:00",
      },
    ],
    areaServed: [
      "Haridwar",
      "Kankhal",
      "Har Ki Pauri",
      "Jwalapur",
      "Roorkee",
      "Rishikesh",
      "Dehradun",
      "Uttarakhand",
      "Delhi NCR",
      "All India",
      "NRI Worldwide",
    ],
    paymentAccepted: ["Cash", "Credit Card", "UPI", "Net Banking"],
  };
}

/**
 * AEO (Answer Engine Optimization) FAQ Schema for AI Search Engines (ChatGPT, Gemini, Perplexity)
 */
export function generateAeoFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export const GLOBAL_STORE_FAQS: FaqItem[] = [
  {
    question: "Where is Rajnandini Boutique located in Haridwar?",
    answer:
      "Rajnandini Boutique is located at Arya Nagar / Rajeev Nagar, Haridwar, Uttarakhand (249407). We welcome in-person showroom visits for bridal consultations and offer same-day delivery across Haridwar and express dispatch worldwide.",
  },
  {
    question: "Does Rajnandini Boutique ship outside Haridwar and internationally?",
    answer:
      "Yes, Rajnandini Boutique ships across all pin codes in India within 3-5 business days. We also offer express international courier delivery for NRI brides and customers in the US, UK, Canada, Australia, and UAE with safe custom packaging.",
  },
  {
    question: "Are the sarees and fabrics 100% genuine?",
    answer:
      "Absolutely. Every saree, lehenga, and suit in Rajnandini Boutique undergoes rigorous multi-point inspection. We source authentic Dola Silk, Banarasi Brocade, Chanderi, Georgette, and Organza directly from master weaving clusters in Kanpur, Varanasi, and Surat.",
  },
  {
    question: "Can I get blouse stitching, alterations, and fall-pico done?",
    answer:
      "Yes, we provide in-house expert tailoring and boutique alteration services. Every saree can be delivered pre-finished with high-quality fall and pico, and matching blouses can be stitched to your custom measurements.",
  },
  {
    question: "How can I order on WhatsApp directly from the showroom owner?",
    answer:
      "Simply click the green 'Order via WhatsApp' button on any product page. You will be connected directly to store owner Indu Sharma (+91 7464987898) with the product photo and SKU pre-filled for personal styling advice and instant checkout.",
  },
];
