import { ProductItem, CustomerOrder, ProductCategory } from "@/types/store";
import { INITIAL_PRODUCTS } from "./sampleInventory";
import { SupabaseService } from "./supabaseClient";
import { SITE_CONFIG } from "./seoEngine";

const LOCAL_STORAGE_PRODUCTS_KEY = "rajnandini_admin_products";
const LOCAL_STORAGE_ORDERS_KEY = "rajnandini_admin_orders";
const LOCAL_STORAGE_AUTH_KEY = "rajnandini_admin_authenticated";
const LOCAL_STORAGE_SETTINGS_KEY = "rajnandini_admin_settings";

export const DEFAULT_ADMIN_PIN = "7464"; // Also accepts "rajnandini2026"

export const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: "WEB-RN-849201",
    orderNumber: "WEB-RN-849201",
    customerName: "Pooja Sharma",
    customerPhone: "+91 98971 23450",
    customerEmail: "pooja.sharma@example.com",
    shippingAddress: "House 42, BHEL Sector 3, Near Shiv Murti",
    city: "Haridwar",
    state: "Uttarakhand",
    pincode: "249403",
    items: [
      {
        sku: "RJ-SUIT-001",
        name: "Rani Pink Embroidered Flared Anarkali Suit Set With Dupatta",
        price: 2249,
        quantity: 1,
        selectedSize: "L (40)",
      },
    ],
    subtotal: 2249,
    shippingFee: 0,
    totalAmount: 2249,
    paymentMethod: "cod",
    status: "shipped",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "WEB-RN-849188",
    orderNumber: "WEB-RN-849188",
    customerName: "Neha Verma",
    customerPhone: "+91 97190 88210",
    shippingAddress: "Flat 204, Ganga Heights, Tapovan",
    city: "Rishikesh",
    state: "Uttarakhand",
    pincode: "249192",
    items: [
      {
        sku: "RJ-LHG-001",
        name: "Haldi Yellow & Rani Pink Royal Bridal Lancha Lehenga Set",
        price: 4899,
        quantity: 1,
        selectedSize: "Semi-Stitched",
      },
    ],
    subtotal: 4899,
    shippingFee: 0,
    totalAmount: 4899,
    paymentMethod: "upi",
    status: "confirmed",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "WEB-RN-849052",
    orderNumber: "WEB-RN-849052",
    customerName: "Sunita Rawat",
    customerPhone: "+91 89791 44520",
    shippingAddress: "Rajeev Nagar, Gali No. 4, Near Arya Nagar Chowk",
    city: "Haridwar",
    state: "Uttarakhand",
    pincode: "249407",
    items: [
      {
        sku: "RJ-SAR-001",
        name: "Emerald Green Pure Katan Silk Handloom Banarasi Saree",
        price: 3499,
        quantity: 1,
        selectedSize: "Standard 6.3m",
      },
    ],
    subtotal: 3499,
    shippingFee: 0,
    totalAmount: 3499,
    paymentMethod: "cod",
    status: "delivered",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export interface AdminStoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  freeShippingAbove: number;
  standardShippingFee: number;
  codEnabled: boolean;
  upiId: string;
  gstin: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  targetCities: string[];
}

export const DEFAULT_SETTINGS: AdminStoreSettings = {
  storeName: "Rajnandini Boutique",
  tagline: "Authentic Ethnic Couture, Bridal Lehengas & Pure Silk Sarees",
  phone: "+91 7464987898",
  whatsappNumber: "917464987898",
  address: "Arya Nagar / Rajeev Nagar Chowk",
  city: "Haridwar",
  state: "Uttarakhand",
  pincode: "249407",
  freeShippingAbove: 999,
  standardShippingFee: 99,
  codEnabled: true,
  upiId: "7464987898@upi",
  gstin: "05AAFFR1234Q1Z8",
  defaultMetaTitle: "Rajnandini Boutique Haridwar | Royal Bridal Lehengas & Silk Sarees",
  defaultMetaDescription: "Uttarakhand's premier boutique for designer bridal lehengas, authentic Banarasi silk sarees, anarkalis and custom tailoring by Indu Sharma. Fast delivery across Haridwar, Rishikesh & India.",
  targetCities: ["Haridwar", "Rishikesh", "Dehradun", "Roorkee", "Haldwani", "Delhi NCR", "All India"],
};

export const AdminStore = {
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(LOCAL_STORAGE_AUTH_KEY) === "true";
  },

  login(pin: string): boolean {
    if (pin.trim() === DEFAULT_ADMIN_PIN || pin.trim().toLowerCase() === "rajnandini2026") {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, "true");
      }
      return true;
    }
    return false;
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    }
  },

  getProducts(): ProductItem[] {
    if (typeof window === "undefined") return INITIAL_PRODUCTS;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error reading local admin products:", e);
    }
    // Initialize with INITIAL_PRODUCTS if empty
    this.saveProductsLocally(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  },

  saveProductsLocally(products: ProductItem[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
      window.dispatchEvent(new Event("rajnandini_catalog_updated"));
    }
  },

  async addOrUpdateProduct(product: ProductItem): Promise<boolean> {
    const list = this.getProducts();
    const existingIndex = list.findIndex(
      (p) => p.id === product.id || p.sku.toLowerCase() === product.sku.toLowerCase()
    );

    let updatedList: ProductItem[];
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = { ...updatedList[existingIndex], ...product };
    } else {
      updatedList = [product, ...list];
    }

    this.saveProductsLocally(updatedList);

    // Also attempt remote sync with Supabase
    try {
      await SupabaseService.upsertProduct(product);
    } catch (err) {
      console.warn("Supabase background sync skipped:", err);
    }

    return true;
  },

  async deleteProduct(idOrSku: string): Promise<boolean> {
    const list = this.getProducts();
    const filtered = list.filter(
      (p) => p.id !== idOrSku && p.sku.toLowerCase() !== idOrSku.toLowerCase()
    );
    this.saveProductsLocally(filtered);

    try {
      await SupabaseService.deleteProduct(idOrSku);
    } catch (err) {
      console.warn("Supabase delete failed:", err);
    }
    return true;
  },

  getOrders(): CustomerOrder[] {
    if (typeof window === "undefined") return INITIAL_ORDERS;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error reading local admin orders:", e);
    }
    // Seed with INITIAL_ORDERS
    this.saveOrdersLocally(INITIAL_ORDERS);
    return INITIAL_ORDERS;
  },

  saveOrdersLocally(orders: CustomerOrder[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event("rajnandini_orders_updated"));
    }
  },

  updateOrderStatus(orderNumber: string, status: CustomerOrder["status"]): boolean {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.orderNumber === orderNumber || o.id === orderNumber);
    if (idx >= 0) {
      const updated = [...orders];
      updated[idx] = { ...updated[idx], status };
      this.saveOrdersLocally(updated);
      return true;
    }
    return false;
  },

  getSettings(): AdminStoreSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.warn("Error reading settings:", e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: Partial<AdminStoreSettings>) {
    if (typeof window !== "undefined") {
      const current = this.getSettings();
      const merged = { ...current, ...settings };
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(merged));
    }
  },
};
