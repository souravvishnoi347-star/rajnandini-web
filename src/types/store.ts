export type ProductCategory =
  | "Bridal Wear"
  | "Saree"
  | "Suit Set"
  | "Gown"
  | "Stitching Job"
  | "Accessories"
  | "sarees"
  | "lehengas"
  | "kurtis"
  | "kidswear"
  | "handbags"
  | "jewellery"
  | "cosmetics"
  | "handloom"
  | "parlour"
  | "undergarments"
  | (string & {});

export interface ProductSeoData {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  targetCities?: string[];
  aeoFaqs?: { question: string; answer: string }[];
  localDeliveryAvailable?: boolean;
}

export interface ProductItem {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: ProductCategory;
  price: number;
  mrp: number;
  purchaseCost?: number;
  stock: number;
  sizes?: string[];
  colors?: string[];
  badge?: string;
  isService?: boolean;
  serviceDuration?: string;
  imageUrl?: string;
  images?: string[];
  description?: string;
  fabric?: string;
  occasion?: string;
  washCare?: string;
  seo?: ProductSeoData;
}

export interface CartItem {
  product: ProductItem;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  items: {
    sku: string;
    name: string;
    price: number;
    quantity: number;
    selectedSize?: string;
  }[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: "cod" | "upi" | "whatsapp";
  status: "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
