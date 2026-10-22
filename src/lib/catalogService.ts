import { ProductItem, ProductCategory } from "@/types/store";
import { INITIAL_PRODUCTS } from "./sampleInventory";
import { SupabaseService } from "./supabaseClient";
import { getProductSlug, getSkuFromSlug } from "./seoEngine";

// High quality curated stock photos for ethnic categories to ensure luxury visual presentation
export const CATEGORY_HERO_IMAGES: Record<string, string> = {
  sarees: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
  lehengas: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
  kurtis: "https://images.unsplash.com/photo-1596783049964-b816223298a0?auto=format&fit=crop&w=1200&q=80",
  handbags: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
  jewellery: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
  kidswear: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1200&q=80",
  all: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80",
};

export const CATEGORIES_LIST = [
  { id: "all", name: "All Collection", tag: "Complete Boutique" },
  { id: "sarees", name: "Designer Sarees", tag: "Dola Silk & Banarasi" },
  { id: "lehengas", name: "Bridal Lehengas", tag: "Wedding & Festive" },
  { id: "kurtis", name: "Suits & Kurtis", tag: "Pure Chanderi & Cotton" },
  { id: "handbags", name: "Luxury Handbags", tag: "Bridal Clutches & Slings" },
  { id: "jewellery", name: "Boutique Jewellery", tag: "Kundan & Temple" },
  { id: "kidswear", name: "Kids Ethnic", tag: "Festive Kids Wear" },
  { id: "undergarments", name: "Undergarments & Lingerie", tag: "Everyday & Bridal Comfort" },
];

/**
 * Returns complete product list merged between Cloud Supabase & Local Cache
 */
export async function getAllProducts(): Promise<ProductItem[]> {
  try {
    const remote = await SupabaseService.fetchLiveProducts();
    if (remote && remote.length > 0) {
      // Merge initial catalog with remote to ensure comprehensive items
      const remoteSkus = new Set(remote.map((p) => p.sku));
      const fallbacks = (INITIAL_PRODUCTS as ProductItem[]).filter(
        (p) => !remoteSkus.has(p.sku)
      );
      return [...remote, ...fallbacks].filter((p) => !p.isService);
    }
  } catch (err) {
    console.warn("Using fallback inventory:", err);
  }
  return (INITIAL_PRODUCTS as ProductItem[]).filter((p) => !p.isService);
}

/**
 * Fetch a single product by its SEO slug or SKU
 */
export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  const products = await getAllProducts();
  const skuFromSlug = getSkuFromSlug(slug);

  if (skuFromSlug) {
    const found = products.find(
      (p) => p.sku.toLowerCase() === skuFromSlug.toLowerCase()
    );
    if (found) return found;
  }

  // Exact slug match fallback
  return (
    products.find((p) => getProductSlug(p) === slug.toLowerCase()) || null
  );
}

/**
 * Get products filtered by category
 */
export async function getProductsByCategory(category: string): Promise<ProductItem[]> {
  const products = await getAllProducts();
  if (category === "all") return products;
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}
