import { createClient } from "@supabase/supabase-js";
import { ProductItem } from "@/types/store";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mxlkiqhhnfzuwkzeilct.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bGtpcWhobmZ6dXdremVpbGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1Nzk3MDQsImV4cCI6MjEwNjE1NTcwNH0.rmrOa--NWWlyYQ82NY3aTcQy1UjePv9_j7KcnERSGs4";

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Service to fetch live inventory synced directly with the Haridwar showroom POS
 */
export const SupabaseService = {
  async fetchLiveProducts(): Promise<ProductItem[] | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetchLiveProducts warning:", error);
        return null;
      }

      if (data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          sku: row.sku,
          barcode: row.barcode,
          name: row.name,
          category: row.category,
          price: Number(row.price),
          mrp: Number(row.mrp),
          purchaseCost: Number(row.purchase_cost || 0),
          stock: Number(row.stock || 0),
          sizes: row.sizes || [],
          colors: row.colors || [],
          badge: row.badge,
          isService: Boolean(row.is_service),
          serviceDuration: row.service_duration,
          imageUrl: row.image_url,
          description: row.description,
          fabric: row.fabric,
          occasion: row.occasion,
          washCare: row.wash_care,
        }));
      }
      return null;
    } catch (err) {
      console.warn("Failed to query live products:", err);
      return null;
    }
  },

  async recordOnlineOrder(order: any): Promise<boolean> {
    try {
      const { error } = await supabase.from("bills").insert({
        invoice_number: order.orderNumber,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        items: order.items,
        subtotal: order.subtotal,
        final_total: order.totalAmount,
        payment_method: order.paymentMethod,
        discount_amount: 0,
        notes: `Online Web Order | Address: ${order.shippingAddress}, ${order.city}, ${order.state} - ${order.pincode}`,
      });
      return !error;
    } catch {
      return false;
    }
  },
};
