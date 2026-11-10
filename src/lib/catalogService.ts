import { ProductItem, ProductCategory } from "@/types/store";
import { INITIAL_PRODUCTS } from "./sampleInventory";
import { SupabaseService } from "./supabaseClient";
import { getProductSlug, getSkuFromSlug } from "./seoEngine";

// High quality curated stock photos for ethnic categories to ensure luxury visual presentation
export const CATEGORY_HERO_IMAGES: Record<string, string> = {
  sarees: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
  lehengas: "/products/lancha.png",
  "bridal-lehenga": "/products/lancha.png",
  kurtis: "/products/product 1.png",
  "kurti-sets": "/products/suit full.png",
  purses: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
  juti: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
  all: "/products/product 1.png",
};

// Exactly what Rajnandini Boutique sells:
export const CATEGORIES_LIST = [
  { id: "all", name: "All Products", tag: "Complete Boutique" },
  { id: "kurtis", name: "Kurtis", tag: "Daily & Office Wear" },
  { id: "kurti-sets", name: "Kurti Sets", tag: "Anarkali, Sharara & Pant Sets" },
  { id: "sarees", name: "Sarees", tag: "Banarasi, Dola Silk & Organza" },
  { id: "lehengas", name: "Lehengas", tag: "Festive & Party Wear" },
  { id: "bridal-lehenga", name: "Bridal Lehengas", tag: "Royal Wedding Collection" },
  { id: "purses", name: "Purses & Clutches", tag: "Bridal Potlis & Handbags" },
  { id: "juti", name: "Juti & Footwear", tag: "Handcrafted Mojris & Heels" },
];

/**
 * Returns complete product list merged between Cloud Supabase, Local Admin Cache & Initial Fallback
 */
export async function getAllProducts(): Promise<ProductItem[]> {
  // If in client browser, check if Admin has created or modified products locally
  let clientOverride: ProductItem[] | null = null;
  if (typeof window !== "undefined") {
    try {
      // Purge old sample catalog cache once
      if (localStorage.getItem("rajnandini_catalog_clean_v1") !== "true") {
        localStorage.removeItem("rajnandini_admin_products");
        localStorage.setItem("rajnandini_catalog_clean_v1", "true");
      }

      const stored = localStorage.getItem("rajnandini_admin_products");
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          clientOverride = parsed;
        }
      }
    } catch {
      // fallback
    }
  }

  try {
    const remote = await SupabaseService.fetchLiveProducts();
    if (remote && remote.length > 0) {
      const remoteSkus = new Set(remote.map((p) => p.sku));
      const pool = clientOverride !== null ? clientOverride : (INITIAL_PRODUCTS as ProductItem[]);
      const fallbacks = pool.filter((p) => !remoteSkus.has(p.sku));
      return [...remote, ...fallbacks].filter((p) => !p.isService);
    }
  } catch (err) {
    console.warn("Using fallback inventory:", err);
  }

  if (clientOverride !== null) {
    return clientOverride.filter((p) => !p.isService);
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

  // Fallback match on slug name
  return (
    products.find((p) => getProductSlug(p).toLowerCase() === slug.toLowerCase()) ||
    null
  );
}
