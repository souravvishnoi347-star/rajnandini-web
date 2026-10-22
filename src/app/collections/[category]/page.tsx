import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, MapPin, Scissors, ShieldCheck, ArrowLeft } from "lucide-react";
import { getAllProducts } from "@/lib/catalogService";
import ProductCard from "@/components/ProductCard";
import { SITE_CONFIG } from "@/lib/seoEngine";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  const categories = Array.from(new Set(products.map((p) => p.category)));
  return categories.map((cat) => ({
    category: encodeURIComponent(cat),
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  const title = `${decodedCategory} Collection in Haridwar | Rajnandini Boutique`;
  const description = `Shop authentic ${decodedCategory} handcrafted with pure fabrics at Rajnandini Boutique Haridwar. Curated by Indu Sharma with custom boutique alterations and pan-India express delivery.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}/collections/${category}`,
      siteName: SITE_CONFIG.name,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  const allProducts = await getAllProducts();
  const lowerCat = decodedCategory.toLowerCase();

  const categoryProducts = allProducts.filter((p) => {
    const pCat = (p.category || "").toLowerCase();
    if (lowerCat === "all") return true;
    if (lowerCat === "kurtis" || lowerCat === "kurti") {
      return pCat.includes("kurti") || pCat.includes("suit");
    }
    if (lowerCat === "kurti-sets") {
      return pCat.includes("suit") || pCat.includes("kurti") || pCat.includes("sharara");
    }
    if (lowerCat.includes("saree")) {
      return pCat.includes("saree") || pCat.includes("silk");
    }
    if (lowerCat === "bridal-lehenga") {
      return pCat.includes("bridal") || (pCat.includes("lehenga") && (p.name.toLowerCase().includes("bridal") || p.price > 3000));
    }
    if (lowerCat.includes("lehenga") || lowerCat.includes("lancha")) {
      return pCat.includes("lehenga") || pCat.includes("bridal") || p.name.toLowerCase().includes("lancha");
    }
    if (lowerCat.includes("purse") || lowerCat.includes("bag")) {
      return pCat.includes("bag") || pCat.includes("purse") || pCat.includes("handbag");
    }
    if (lowerCat.includes("juti") || lowerCat.includes("shoe") || lowerCat.includes("footwear")) {
      return pCat.includes("footwear") || pCat.includes("juti") || pCat.includes("mojri");
    }
    return pCat === lowerCat;
  });

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb & Header Banner */}
      <div className="space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#a81c24] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Collections</span>
        </Link>

        <div className="bg-stone-50 border border-stone-200 p-6 sm:p-8 space-y-2 text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#a81c24]">
            Rajnandini Boutique Haridwar
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-stone-900">
            {decodedCategory}
          </h1>

          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mx-auto">
            Discover authentic handcrafted {decodedCategory.toLowerCase()} curated by Indu Sharma. 100% pure fabrics, master boutique tailoring, and free pan-India shipping.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2 text-xs text-stone-600 font-semibold">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#a81c24]" />
              <span>Haridwar Showroom Ready</span>
            </span>
            <span className="flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5 text-[#a81c24]" />
              <span>Custom Alterations Available</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#a81c24]" />
              <span>Pure Fabric Guarantee</span>
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200 text-xs text-stone-600">
          <span>
            Showing <strong className="text-stone-900">{categoryProducts.length}</strong> styles
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#a81c24]">
            Free Delivery on All Orders
          </span>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id || product.sku} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-stone-50 border border-stone-200 space-y-3">
            <p className="text-stone-600 text-xs sm:text-sm">
              New styles in {decodedCategory} are arriving this week in our Haridwar showroom.
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=Namaste%20Indu%20Ji!%20Do%20you%20have%20custom%20designs%20for%20${encodeURIComponent(decodedCategory)}?`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <span>Ask Indu Sharma on WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
