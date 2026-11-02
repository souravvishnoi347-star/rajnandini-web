"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Globe2,
  Settings,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Users,
  Copy,
  Check,
  Printer,
  MessageCircle,
  Sparkles,
  MapPin,
  HelpCircle,
  Eye,
  RefreshCw,
  FileText,
  ChevronRight,
  X,
  ChevronDown,
  Palette,
  Monitor,
  Smartphone,
  Sliders,
  Upload,
  Camera,
  Image as ImageIcon,
  IndianRupee,
  Calendar,
  Download,
  Bell,
  Sun,
  Moon,
  MoreVertical,
  ChevronLeft
} from "lucide-react";
import { ProductItem, CustomerOrder, ProductCategory } from "@/types/store";
import { AdminStore, AdminStoreSettings, DEFAULT_SETTINGS } from "@/lib/adminStore";
import { SITE_CONFIG, getProductSlug } from "@/lib/seoEngine";
import { CATEGORIES_LIST } from "@/lib/catalogService";
import { ThemeService, ThemeConfig, DEFAULT_THEME_CONFIG } from "@/lib/themeConfig";

type AdminTab = "dashboard" | "orders" | "products" | "customers" | "analytics" | "editor" | "seo" | "settings";

const AVAILABLE_SIZES = [
  "XS (34)", "S (36)", "M (38)", "L (40)", "XL (42)", "XXL (44)", "3XL (46)",
  "Free Size", "Semi-Stitched", "Unstitched (6.3m)", "Size 28", "Size 30", "Size 32", "Size 34", "Size 36", "Size 38", "Size 40"
];

const AVAILABLE_COLORS = [
  { name: "Rani Pink", hex: "#e02b66" },
  { name: "Maroon", hex: "#800000" },
  { name: "Red", hex: "#dc2626" },
  { name: "Royal Blue", hex: "#2563eb" },
  { name: "Emerald Green", hex: "#059669" },
  { name: "Mustard Yellow", hex: "#d97706" },
  { name: "Antique Gold", hex: "#d4af37" },
  { name: "Wine / Burgundy", hex: "#4a0e2e" },
  { name: "Black", hex: "#18181b" },
  { name: "Ivory White", hex: "#faf0e6" },
  { name: "Pastel Peach", hex: "#fdba74" },
  { name: "Navy Blue", hex: "#1e3a8a" },
];

const PRESET_PRODUCT_IMAGES = [
  "/products/product 1.png",
  "/products/product 1 (2).png",
  "/products/product 1(3).png",
  "/products/product 1 (4).png",
  "/products/lancha.png",
  "/products/suit full.png",
  "/products/suit.png",
  "/products/one piece.png",
  "/products/one piece dress.png",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80"
];

function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z" />
    </svg>
  );
}

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  // Data state
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [settings, setSettings] = useState<AdminStoreSettings>(DEFAULT_SETTINGS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [salesTimeframe, setSalesTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const [editorSavedNotice, setEditorSavedNotice] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Modals & Drawers
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [productToast, setProductToast] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const auth = AdminStore.isAuthenticated();
    setIsAuthenticated(auth);
    if (auth) {
      loadAllData();
    }
  }, []);

  const loadAllData = () => {
    setProducts(AdminStore.getProducts());
    setOrders(AdminStore.getOrders());
    setSettings(AdminStore.getSettings());
    setTheme(ThemeService.getTheme());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (AdminStore.login(pinInput)) {
      setIsAuthenticated(true);
      setLoginError("");
      loadAllData();
    } else {
      setLoginError("Invalid Security PIN. Please check and try again.");
    }
  };

  const handleLogout = () => {
    AdminStore.logout();
    setIsAuthenticated(false);
    setPinInput("");
  };

  // Metrics
  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
    const lowStockCount = products.filter((p) => p.stock <= 5).length;
    const totalProducts = products.length;
    const pendingOrders = orders.filter((o) => o.status === "placed" || o.status === "confirmed").length;

    return {
      totalSales,
      totalOrders,
      avgOrderValue,
      lowStockCount,
      totalProducts,
      pendingOrders,
    };
  }, [products, orders]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerPhone.includes(searchTerm);
      const matchesStatus =
        orderStatusFilter === "all" || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, orderStatusFilter]);

  // Product Actions
  const handleOpenAddProduct = () => {
    const nextSku = `RJ-PRD-${String(products.length + 1).padStart(3, "0")}`;
    setEditingProduct({
      id: `custom-${Date.now()}`,
      sku: nextSku,
      barcode: `89${Date.now().toString().slice(-6)}`,
      name: "",
      category: "Kurtis",
      price: 1999,
      mrp: 3999,
      purchaseCost: 900,
      stock: 12,
      sizes: ["M (38)", "L (40)", "XL (42)"],
      colors: ["Red", "Maroon"],
      badge: "New Arrival",
      imageUrl: "/products/product 1.png",
      images: ["/products/product 1.png"],
      description: "Authentic boutique ethnic design curated by Indu Sharma for Rajnandini Boutique Haridwar.",
      fabric: "Pure Georgette / Handloom Silk",
      occasion: "Festive & Wedding Wear",
      washCare: "Dry Clean Only",
      seo: {
        metaTitle: "",
        metaDescription: "",
        focusKeyword: "Boutique Kurtis Haridwar",
        targetCities: ["Haridwar", "Rishikesh", "Dehradun"],
        localDeliveryAvailable: true,
      },
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod: ProductItem) => {
    setEditingProduct({
      ...prod,
      seo: prod.seo || {
        metaTitle: `${prod.name} | Rajnandini Boutique Haridwar`,
        metaDescription: `Buy ${prod.name} online at ₹${prod.price}. Curated ethnic boutique couture in Haridwar with express delivery.`,
        focusKeyword: `${prod.name} Haridwar`,
        targetCities: ["Haridwar", "Rishikesh", "Dehradun"],
        localDeliveryAvailable: true,
      },
    });
    setIsProductModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setEditingProduct((prev) => {
            if (!prev) return null;
            const currentImages = prev.images || (prev.imageUrl ? [prev.imageUrl] : []);
            if (currentImages.includes(result)) return prev;
            const updated = [...currentImages, result];
            return {
              ...prev,
              imageUrl: prev.imageUrl && prev.imageUrl !== "/products/product 1.png" ? prev.imageUrl : result,
              images: updated,
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (imgToRemove: string) => {
    if (!editingProduct) return;
    const currentImages = (editingProduct.images || []).filter((img) => img !== imgToRemove);
    const newPrimary = editingProduct.imageUrl === imgToRemove
      ? (currentImages[0] || "/products/product 1.png")
      : (editingProduct.imageUrl || "/products/product 1.png");
    setEditingProduct({
      ...editingProduct,
      imageUrl: newPrimary,
      images: currentImages,
    });
  };

  const handleSetPrimaryImage = (img: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      imageUrl: img,
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.sku) return;

    const fullProduct: ProductItem = {
      id: editingProduct.id || `custom-${Date.now()}`,
      sku: editingProduct.sku.trim().toUpperCase(),
      barcode: editingProduct.barcode || `89${Date.now().toString().slice(-6)}`,
      name: editingProduct.name.trim(),
      category: editingProduct.category || "Kurtis",
      price: Number(editingProduct.price) || 999,
      mrp: Number(editingProduct.mrp) || Number(editingProduct.price) * 2,
      purchaseCost: Number(editingProduct.purchaseCost) || 0,
      stock: Number(editingProduct.stock) || 0,
      sizes: editingProduct.sizes && editingProduct.sizes.length > 0 ? editingProduct.sizes : ["Free Size"],
      colors: editingProduct.colors || [],
      badge: editingProduct.badge || undefined,
      imageUrl: editingProduct.imageUrl || editingProduct.images?.[0] || "/products/product 1.png",
      images: editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : [editingProduct.imageUrl || "/products/product 1.png"],
      description: editingProduct.description || "",
      fabric: editingProduct.fabric || "",
      occasion: editingProduct.occasion || "",
      washCare: editingProduct.washCare || "",
      seo: editingProduct.seo,
    };

    await AdminStore.addOrUpdateProduct(fullProduct);
    setProducts(AdminStore.getProducts());
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductToast(`"${fullProduct.name}" saved to store catalog!`);
    setTimeout(() => setProductToast(null), 4000);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      await AdminStore.deleteProduct(id);
      setProducts(AdminStore.getProducts());
      setProductToast(`Deleted "${name}" from inventory`);
      setTimeout(() => setProductToast(null), 3000);
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = (orderNumber: string, status: CustomerOrder["status"]) => {
    AdminStore.updateOrderStatus(orderNumber, status);
    setOrders(AdminStore.getOrders());
    if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const handleSendWhatsAppUpdate = (order: CustomerOrder) => {
    const text = `*👑 Namaste ${order.customerName}!*
Thank you for shopping with *Rajnandini Boutique Haridwar*.

📦 *Order ID*: ${order.orderNumber}
📊 *Status*: ${order.status.toUpperCase()}
💰 *Total Amount*: ₹${order.totalAmount.toLocaleString("en-IN")} (${order.paymentMethod.toUpperCase()})
📍 *Delivery Address*: ${order.shippingAddress}, ${order.city} - ${order.pincode}

${order.status === "shipped" ? "🚚 Your package has been dispatched via Express Courier and will reach you shortly." : ""}
${order.status === "confirmed" ? "✅ We have verified your order and packaging is underway." : ""}
${order.status === "delivered" ? "🎉 Your order has been marked as Delivered! Thank you for choosing Rajnandini." : ""}

For any tailoring or exchange questions, call us directly at ${settings.phone}.`;

    const phoneDigits = order.customerPhone.replace(/\D/g, "");
    const cleanPhone = phoneDigits.startsWith("91") ? phoneDigits : `91${phoneDigits}`;
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`, "_blank");
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // ----------------------------------------------------
  // LOGIN SCREEN (Nexus PRO Style)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4f46e5]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] rounded-2xl shadow-lg shadow-indigo-500/25 text-white mb-4">
              <CrownIcon className="w-7 h-7" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Rajnandini
              </h1>
              <span className="text-[11px] font-black uppercase tracking-wider bg-[#4f46e5] text-white px-2 py-0.5 rounded-md shadow-xs">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Showroom Inventory, Orders & Storefront Suite
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Security Passcode PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter 4-digit PIN (Default: 7464)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-lg tracking-widest text-slate-900 focus:outline-none focus:border-[#4f46e5] focus:bg-white transition"
                />
              </div>
              {loginError && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center justify-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {loginError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-sm tracking-wide rounded-xl transition shadow-lg shadow-indigo-500/25 active:scale-[0.99]"
            >
              Sign In to Dashboard
            </button>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setPinInput("7464");
                  AdminStore.login("7464");
                  setIsAuthenticated(true);
                  loadAllData();
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200/80 text-xs text-slate-700 font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <span>⚡ Quick Demo Login (PIN: 7464)</span>
              </button>
            </div>
          </form>

          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 font-medium">
            Showroom: Arya Nagar Chowk, Haridwar • Managed by Indu Sharma
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED NEXUS PRO STYLE ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex antialiased relative">
      {/* Toast Notification */}
      {productToast && (
        <div className="fixed top-4 right-4 z-[999] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold">{productToast}</span>
          <button
            onClick={() => setProductToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. LEFT SIDEBAR (Nexus PRO Light Theme) */}
      <aside className="w-64 bg-white border-r border-slate-200/80 shrink-0 flex flex-col justify-between hidden md:flex shadow-xs">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <CrownIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-slate-900">Rajnandini</span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#4f46e5] text-white px-1.5 py-0.2 rounded">
                    PRO
                  </span>
                </div>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 text-xs p-1 rounded" title="Collapse sidebar">
              «
            </button>
          </div>

          {/* Section: Operational Core */}
          <div className="px-3 pt-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
              Operational Core
            </span>

            <nav className="space-y-1 text-xs">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition ${
                  activeTab === "dashboard"
                    ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition ${
                  activeTab === "orders"
                    ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Orders</span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === "orders" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition ${
                  activeTab === "products"
                    ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === "products" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("customers")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition ${
                  activeTab === "customers"
                    ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition ${
                  activeTab === "analytics"
                    ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab("editor")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition ${
                  activeTab === "editor"
                    ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Theme Editor</span>
              </button>

              <button
                onClick={() => setActiveTab("seo")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition ${
                  activeTab === "seo"
                    ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Globe2 className="w-4 h-4" />
                <span>Marketing & SEO</span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition ${
                  activeTab === "settings"
                    ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Sidebar Footer with Cloud Storage Bar & Support */}
        <div className="p-4 space-y-3">
          {/* Cloud Storage Widget */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 text-[11px]">Cloud Storage</span>
              <span className="font-extrabold text-[#4f46e5] text-[11px]">78%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
              <div className="h-full bg-[#4f46e5] rounded-full w-[78%]" />
            </div>
            <span className="text-[10px] text-slate-400 block font-medium">
              15.8 MB of 20 MB used
            </span>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
            <button
              onClick={() => window.open(`https://api.whatsapp.com/send?phone=${settings.whatsappNumber}`, "_blank")}
              className="flex items-center gap-1.5 hover:text-slate-700 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Support</span>
            </button>
            <span className="font-mono">v2.4.0</span>
          </div>

          <div className="pt-1 border-t border-slate-100 flex items-center justify-between px-1">
            <Link
              href="/"
              target="_blank"
              className="text-[11px] text-slate-500 hover:text-[#4f46e5] font-semibold flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View Storefront</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-[11px] text-slate-400 hover:text-red-600 transition flex items-center gap-1"
              title="Sign out"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top Header Bar (Nexus PRO Style) */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4 shadow-xs">
          {/* Top Search bar */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, products, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-12 py-2 text-xs bg-slate-100/70 border border-slate-200/70 rounded-xl focus:outline-none focus:bg-white focus:border-[#4f46e5] transition font-medium text-slate-800 placeholder-slate-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded shadow-xs">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-3.5 shrink-0">
            {/* Online Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4f46e5] to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                IS
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  Indu Sharma
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  Store Owner / Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Sub-header on Mobile for Nav Tabs */}
        <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-1 overflow-x-auto text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === "dashboard" ? "bg-[#4f46e5] text-white font-bold" : "hover:bg-slate-100"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === "orders" ? "bg-[#4f46e5] text-white font-bold" : "hover:bg-slate-100"
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === "products" ? "bg-[#4f46e5] text-white font-bold" : "hover:bg-slate-100"
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === "editor" ? "bg-[#4f46e5] text-white font-bold" : "hover:bg-slate-100"
            }`}
          >
            Theme Editor
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === "seo" ? "bg-[#4f46e5] text-white font-bold" : "hover:bg-slate-100"
            }`}
          >
            SEO
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === "settings" ? "bg-[#4f46e5] text-white font-bold" : "hover:bg-slate-100"
            }`}
          >
            Settings
          </button>
        </div>

        {/* --------------------------------------------------------- */}
        {/* TAB 1: DASHBOARD OVERVIEW (Nexus PRO Image 1 & 2 Layout) */}
        {/* --------------------------------------------------------- */}
        {activeTab === "dashboard" && (
          <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Page Header with Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-slate-600">Overview</span>
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Dashboard Overview
                  </h2>
                  <span className="text-[11px] font-bold text-[#4f46e5] bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-full">
                    ● Live Q4 Engine
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Last 30 Days</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => alert("Exporting boutique sales and customer reports in CSV...")}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export Data</span>
                </button>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md shadow-indigo-500/25 active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Order / Product</span>
                </button>
              </div>
            </div>

            {/* 4 Top Metric Cards (Image 1 Exact Layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. TOTAL REVENUE */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Total Revenue
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#4f46e5] flex items-center justify-center">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    ₹1,28,430.80
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      ↑ +14.8%
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">vs last month</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-slate-500 font-medium">Monthly Target</span>
                    <span className="font-bold text-slate-900">₹1,40,000 (91.7%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#4f46e5] rounded-full w-[91.7%]" />
                  </div>
                </div>
              </div>

              {/* 2. TOTAL ORDERS */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Total Orders
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    3,842
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      ↑ +8.2%
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">vs last month</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Avg. Order Value</span>
                  <span className="font-bold text-slate-900">₹1,850.00</span>
                </div>
              </div>

              {/* 3. ACTIVE CUSTOMERS */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Active Customers
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    14,290
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      ↑ +21.4%
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">new signups</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Retention Rate</span>
                  <span className="font-bold text-slate-900">92.4%</span>
                </div>
              </div>

              {/* 4. LOW STOCK ALERTS */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Low Stock Alerts
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    18 SKU
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      ! Action Needed
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">in fulfillment</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => {
                      setActiveTab("products");
                      setCategoryFilter("all");
                    }}
                    className="font-bold text-[#4f46e5] hover:underline flex items-center gap-1"
                  >
                    <span>Review inventory →</span>
                  </button>
                  <span className="text-red-500 font-semibold">3 critical</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Sales Overview & Category Donut (Image 1 Exact Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left / 2 Cols: Sales Overview Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                        Sales Overview
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        +12% vs LY
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Revenue & Order volume trajectory over time
                    </p>
                  </div>

                  {/* Daily / Weekly / Monthly pill toggle */}
                  <div className="bg-slate-100/80 p-1 rounded-xl flex items-center text-xs font-semibold self-start sm:self-auto">
                    <button
                      onClick={() => setSalesTimeframe("daily")}
                      className={`px-3 py-1 rounded-lg transition ${
                        salesTimeframe === "daily" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setSalesTimeframe("weekly")}
                      className={`px-3 py-1 rounded-lg transition ${
                        salesTimeframe === "weekly" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => setSalesTimeframe("monthly")}
                      className={`px-3 py-1 rounded-lg transition ${
                        salesTimeframe === "monthly" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Sub-KPI Row */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50/70 border border-slate-100 rounded-xl">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Gross Revenue</span>
                    <span className="text-base font-extrabold text-slate-900">₹4,25,800.00</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Est. Net Profit</span>
                    <span className="text-base font-extrabold text-slate-900">₹2,98,100.40</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Refund Rate</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-extrabold text-slate-900">1.2%</span>
                      <span className="text-[10px] text-emerald-600 font-bold">(-0.4%)</span>
                    </div>
                  </div>
                </div>

                {/* SVG Area Chart (Image 1 Curve + Peak Tooltip) */}
                <div className="relative pt-4">
                  {/* Floating Peak Tooltip (Oct 14 Peak: ₹14,230.00) */}
                  <div className="absolute top-4 left-[64%] -translate-x-1/2 z-10 bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-center pointer-events-none">
                    <span className="text-[10px] font-semibold text-slate-400 block">Oct 14 Peak</span>
                    <span className="text-xs font-extrabold block">₹14,230.00</span>
                    <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">184 orders placed</span>
                  </div>

                  {/* SVG Chart Graphic */}
                  <div className="w-full h-56 relative">
                    <svg viewBox="0 0 800 220" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="40" y1="30" x2="780" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="80" x2="780" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="130" x2="780" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="180" x2="780" y2="180" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Left labels */}
                      <text x="10" y="35" fill="#94a3b8" fontSize="10">₹100k</text>
                      <text x="10" y="85" fill="#94a3b8" fontSize="10">₹75k</text>
                      <text x="10" y="135" fill="#94a3b8" fontSize="10">₹25k</text>
                      <text x="20" y="185" fill="#94a3b8" fontSize="10">₹0</text>

                      {/* Previous Year Comparison Line (Dotted / Thin gray) */}
                      <path
                        d="M 50 170 Q 150 160 250 150 T 450 130 T 600 110 T 750 95"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />

                      {/* Gradient Fill Under Current Wave */}
                      <path
                        d="M 50 170 C 130 150, 180 145, 270 140 C 350 125, 430 100, 520 40 C 600 35, 680 40, 750 35 L 750 180 L 50 180 Z"
                        fill="url(#purpleAreaGrad)"
                      />

                      {/* Main Purple Line Curve */}
                      <path
                        d="M 50 170 C 130 150, 180 145, 270 140 C 350 125, 430 100, 520 40 C 600 35, 680 40, 750 35"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Anchor dots */}
                      <circle cx="270" cy="140" r="4" fill="#ffffff" stroke="#4f46e5" strokeWidth="3" />
                      <circle cx="520" cy="40" r="6" fill="#ffffff" stroke="#4f46e5" strokeWidth="3.5" />
                    </svg>
                  </div>

                  {/* Month Markers */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-4 pt-2 border-t border-slate-100">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span className="text-[#4f46e5] font-extrabold bg-indigo-50 px-2 py-0.5 rounded">Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>

                  {/* Legend below chart */}
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]" />
                        <span className="font-semibold text-slate-700">Current Period</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-0.5 bg-slate-300" />
                        <span>Previous Year Comparison</span>
                      </div>
                    </div>
                    <span className="font-medium">Calculated UTC+5:30 • Updated 2m ago</span>
                  </div>
                </div>
              </div>

              {/* Right / 1 Col: Sales by Category Donut Chart */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                      Sales by Category
                    </h3>
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Top performing inventory segments
                  </p>

                  {/* Donut Chart */}
                  <div className="relative my-6 flex items-center justify-center">
                    <div className="w-44 h-44 relative flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        {/* 42% Indigo - Kurtis & Suits */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#4f46e5"
                          strokeWidth="14"
                          strokeDasharray="100 139"
                          strokeDashoffset="0"
                        />
                        {/* 28% Emerald - Pure Banarasi Sarees */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="14"
                          strokeDasharray="67 172"
                          strokeDashoffset="-100"
                        />
                        {/* 18% Teal - Lehengas */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#14b8a6"
                          strokeWidth="14"
                          strokeDasharray="43 196"
                          strokeDashoffset="-167"
                        />
                        {/* 12% Lavender - Handbags & Accessories */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#818cf8"
                          strokeWidth="14"
                          strokeDasharray="29 210"
                          strokeDashoffset="-210"
                        />
                      </svg>

                      {/* Center label inside Donut */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Total Sales
                        </span>
                        <span className="text-xl font-black text-slate-900">
                          ₹12.8L
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown List */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5] shrink-0" />
                        <span>Kurtis & Suit Sets</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 mr-2">42%</span>
                        <span className="text-slate-400">₹53,940</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shrink-0" />
                        <span>Pure Banarasi Sarees</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 mr-2">28%</span>
                        <span className="text-slate-400">₹35,960</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#14b8a6] shrink-0" />
                        <span>Bridal & Party Lehengas</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 mr-2">18%</span>
                        <span className="text-slate-400">₹23,115</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#818cf8] shrink-0" />
                        <span>Handbags & Accessories</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 mr-2">12%</span>
                        <span className="text-slate-400">₹15,415</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acquisition Attribution Bar (Bottom of Card) */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Acquisition Attribution
                  </span>
                  <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden">
                    <div className="h-full bg-[#4f46e5] w-[45%]" title="Direct: 45%" />
                    <div className="h-full bg-[#10b981] w-[32%]" title="Social: 32%" />
                    <div className="h-full bg-[#14b8a6] w-[23%]" title="Organic: 23%" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Direct: 45%</span>
                    <span>Social: 32%</span>
                    <span>Organic: 23%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Recent Orders Table (Image 2 Exact Layout) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
              {/* Header with Title and View All */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Recent Orders
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Manage and audit incoming real-time checkout activities
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Search inside orders */}
                  <div className="relative w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100/70 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:border-[#4f46e5] font-medium text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  {/* Filter Pills (All / Delivered / Pending / Canceled) */}
                  <div className="bg-slate-100/80 p-1 rounded-xl flex items-center text-xs font-semibold">
                    <button
                      onClick={() => setOrderStatusFilter("all")}
                      className={`px-3 py-1 rounded-lg transition ${
                        orderStatusFilter === "all" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      All ({orders.length})
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter("delivered")}
                      className={`px-3 py-1 rounded-lg transition ${
                        orderStatusFilter === "delivered" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Delivered
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter("confirmed")}
                      className={`px-3 py-1 rounded-lg transition ${
                        orderStatusFilter === "confirmed" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setOrderStatusFilter("cancelled")}
                      className={`px-3 py-1 rounded-lg transition ${
                        orderStatusFilter === "cancelled" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Canceled
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-[#4f46e5] hover:underline flex items-center gap-1 pl-1"
                  >
                    <span>View All →</span>
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="py-3.5 pr-4">Order ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 px-4">Payment / Items</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredOrders.slice(0, 6).map((ord) => {
                      const dateObj = new Date(ord.createdAt);
                      const formattedDate = dateObj.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
                      const formattedTime = dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

                      return (
                        <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                          {/* Order ID */}
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-1.5 font-bold text-[#4f46e5]">
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="hover:underline"
                              >
                                #{ord.orderNumber.replace("WEB-", "")}
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(ord.orderNumber);
                                  setCopyStatus(ord.orderNumber);
                                  setTimeout(() => setCopyStatus(""), 2000);
                                }}
                                className="text-slate-300 hover:text-slate-600 p-0.5"
                                title="Copy Order Number"
                              >
                                {copyStatus === ord.orderNumber ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                                {ord.customerName.slice(0, 2)}
                              </div>
                              <div className="min-w-0 max-w-[180px]">
                                <span className="font-bold text-slate-900 block truncate">
                                  {ord.customerName}
                                </span>
                                <span className="text-[11px] text-slate-400 block truncate">
                                  {ord.customerEmail || ord.customerPhone}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Date & Time */}
                          <td className="py-4 px-4 text-slate-500 text-[11px]">
                            <span className="block font-medium text-slate-700">{formattedDate}</span>
                            <span className="text-slate-400 font-mono">{formattedTime}</span>
                          </td>

                          {/* Payment / Items */}
                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-800 block uppercase text-[11px]">
                              {ord.paymentMethod === "upi" ? "UPI •••• 9812" : "Cash on Delivery (COD)"}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              ({ord.items.length} item{ord.items.length > 1 ? "s" : ""})
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-4">
                            <span className="font-bold text-slate-900 text-sm">
                              ₹{ord.totalAmount.toLocaleString("en-IN")}
                            </span>
                          </td>

                          {/* Status Pill (Matching Image 2) */}
                          <td className="py-4 px-4">
                            {ord.status === "delivered" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#ecfdf5] text-[#059669]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                                Delivered
                              </span>
                            )}
                            {ord.status === "confirmed" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#eff6ff] text-[#2563eb]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                                Pending
                              </span>
                            )}
                            {ord.status === "shipped" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#f5f3ff] text-[#7c3aed]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                                Processing
                              </span>
                            )}
                            {(ord.status === "cancelled" || ord.status === "placed") && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#fef2f2] text-[#dc2626]">
                                <X className="w-3 h-3 text-[#dc2626]" />
                                {ord.status === "cancelled" ? "Canceled" : "New Order"}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 pl-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                title="View Order Details"
                                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedOrder(ord);
                                  setTimeout(handlePrintInvoice, 300);
                                }}
                                title="Print Tax Invoice"
                                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleSendWhatsAppUpdate(ord)}
                                title="WhatsApp Customer"
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="p-1.5 text-slate-300 hover:text-slate-600 rounded-lg"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination (Image 2 Exact Layout) */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-3">
                <span>Showing 1 to {Math.min(6, filteredOrders.length)} of {orders.length} results</span>
                <div className="flex items-center gap-1 font-semibold">
                  <button className="px-2.5 py-1 text-slate-400 hover:text-slate-700 transition">
                    &lt; Previous
                  </button>
                  <button className="w-7 h-7 bg-[#4f46e5] text-white rounded-lg font-bold flex items-center justify-center shadow-xs">
                    1
                  </button>
                  <button className="w-7 h-7 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-center transition">
                    2
                  </button>
                  <button className="w-7 h-7 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-center transition">
                    3
                  </button>
                  <span className="px-1 text-slate-300">...</span>
                  <button className="px-2.5 py-1 text-slate-600 hover:text-slate-900 transition">
                    Next &gt;
                  </button>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 2: PRODUCTS CATALOG (Nexus PRO Modern Style) */}
        {/* --------------------------------------------------------- */}
        {activeTab === "products" && (
          <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Products Catalog & Inventory
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Manage ethnic couture collections, wholesale margins, pricing & AEO tags
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md shadow-indigo-500/25 active:scale-[0.98] self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Product</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by name, SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#4f46e5] font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#4f46e5]"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {CATEGORIES_LIST.filter(c => c.id !== "all").map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="Undergarments">Undergarments</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">SKU / Barcode</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Inventory</th>
                      <th className="p-4">Selling Price & Profit</th>
                      <th className="p-4">SEO Index</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredProducts.map((prod) => {
                      const profit = prod.price - (prod.purchaseCost || 0);
                      const marginPct = prod.purchaseCost ? Math.round((profit / prod.purchaseCost) * 100) : 50;

                      return (
                        <tr key={prod.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-14 bg-slate-100 rounded-xl overflow-hidden relative shrink-0 border border-slate-200">
                                {prod.imageUrl?.startsWith("data:") ? (
                                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Image
                                    src={prod.imageUrl || "/products/product 1.png"}
                                    alt={prod.name}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <span className="font-bold text-slate-900 block truncate" title={prod.name}>
                                  {prod.name}
                                </span>
                                {prod.badge && (
                                  <span className="inline-block text-[9px] font-bold text-[#4f46e5] bg-indigo-50 px-1.5 py-0.2 rounded mt-0.5">
                                    {prod.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-mono font-bold text-slate-800 block">{prod.sku}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{prod.barcode}</span>
                          </td>
                          <td className="p-4 font-semibold text-slate-600">{prod.category}</td>
                          <td className="p-4">
                            {prod.stock > 5 ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {prod.stock} in stock
                              </span>
                            ) : prod.stock > 0 ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Low: {prod.stock} left
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-700 font-bold bg-red-50 px-2.5 py-0.5 rounded-full text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                Out of stock
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">
                              ₹{prod.price.toLocaleString("en-IN")}
                              <span className="text-slate-400 line-through text-[10px] ml-1.5 font-normal">
                                ₹{prod.mrp.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-bold">
                              +{marginPct}% margin (₹{profit})
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold text-[#4f46e5] bg-indigo-50 px-2 py-0.5 rounded-full">
                              AEO Indexed
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/products/${getProductSlug(prod)}`}
                                target="_blank"
                                title="View on storefront"
                                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleEditProduct(prod)}
                                title="Edit Product"
                                className="p-1.5 text-slate-400 hover:text-[#4f46e5] rounded-lg hover:bg-slate-100 transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                title="Delete Product"
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 3: CUSTOMER ORDERS & SHIPMENTS */}
        {/* --------------------------------------------------------- */}
        {activeTab === "orders" && (
          <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Orders & Shipments Management
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Track delivery status, print invoices & send WhatsApp notifications
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Downloading today's fulfillment dispatch sheet...")}
                  className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Dispatch Sheet</span>
                </button>
              </div>
            </div>

            {/* Full Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden p-6 space-y-4">
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="py-3.5 pr-4">Order ID</th>
                      <th className="py-3.5 px-4">Customer & Contact</th>
                      <th className="py-3.5 px-4">Delivery Address</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-4 pr-4">
                          <span className="font-bold text-[#4f46e5] block">{ord.orderNumber}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(ord.createdAt).toLocaleDateString("en-IN")}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                          <a href={`tel:${ord.customerPhone}`} className="text-[11px] text-slate-500 hover:text-[#4f46e5]">
                            {ord.customerPhone}
                          </a>
                        </td>
                        <td className="py-4 px-4 max-w-[200px]">
                          <span className="text-slate-700 block truncate">{ord.shippingAddress}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {ord.city}, {ord.state} - {ord.pincode}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="text-[11px] text-slate-700 font-semibold truncate max-w-[180px]">
                              {it.quantity}x {it.name}
                            </div>
                          ))}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-extrabold text-slate-900 text-sm block">
                            ₹{ord.totalAmount.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">
                            {ord.paymentMethod}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.orderNumber, e.target.value as CustomerOrder["status"])}
                            className="px-2.5 py-1 rounded-xl text-xs font-bold border capitalize focus:outline-none bg-slate-50 border-slate-200 text-slate-800"
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              title="View Details"
                              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSendWhatsAppUpdate(ord)}
                              title="WhatsApp"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 4: CUSTOMERS TAB */}
        {/* --------------------------------------------------------- */}
        {activeTab === "customers" && (
          <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Active Customers Directory
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Boutique VIP clients, order histories & lifetime value
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Customers</span>
                <span className="text-2xl font-extrabold text-slate-900">14,290</span>
                <span className="text-xs text-emerald-600 font-bold block mt-1">↑ +21.4% this month</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Repeat Purchase Rate</span>
                <span className="text-2xl font-extrabold text-slate-900">48.2%</span>
                <span className="text-xs text-slate-400 font-medium block mt-1">High showroom loyalty</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">VIP Haridwar Clients</span>
                <span className="text-2xl font-extrabold text-slate-900">840+</span>
                <span className="text-xs text-[#4f46e5] font-bold block mt-1">Bridal couture members</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <h3 className="font-bold text-sm text-slate-900 mb-4">Recent Verified Showroom Shoppers</h3>
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#4f46e5]/10 text-[#4f46e5] font-bold flex items-center justify-center uppercase">
                        {o.customerName.slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{o.customerName}</span>
                        <span className="text-slate-400 text-[11px]">{o.city}, {o.state} • {o.customerPhone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900 block">₹{o.totalAmount.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">{o.paymentMethod}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 5: ANALYTICS TAB */}
        {/* --------------------------------------------------------- */}
        {activeTab === "analytics" && (
          <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Showroom & Online Analytics
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Real-time conversion rates, sales channels & customer acquisition
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Conversion Rate</span>
                <span className="text-2xl font-extrabold text-slate-900">3.84%</span>
                <span className="text-xs text-emerald-600 font-bold block mt-1">↑ +0.6% vs benchmark</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Page Views</span>
                <span className="text-2xl font-extrabold text-slate-900">84,290</span>
                <span className="text-xs text-slate-400 font-medium block mt-1">In last 30 days</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Cart Abandonment</span>
                <span className="text-2xl font-extrabold text-slate-900">28.4%</span>
                <span className="text-xs text-emerald-600 font-bold block mt-1">Low across industry</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Avg. Session Time</span>
                <span className="text-2xl font-extrabold text-slate-900">4m 18s</span>
                <span className="text-xs text-slate-400 font-medium block mt-1">High engagement</span>
              </div>
            </div>
          </main>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 6: THEME EDITOR TAB */}
        {/* --------------------------------------------------------- */}
        {activeTab === "editor" && (
          <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Visual Theme & Content Customizer
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Customize announcements, showroom hero banners, colors & branding
                </p>
              </div>

              <button
                onClick={() => {
                  ThemeService.saveTheme(theme);
                  setEditorSavedNotice(true);
                  setTimeout(() => setEditorSavedNotice(false), 3000);
                }}
                className="px-5 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-500/25"
              >
                {editorSavedNotice ? "✓ Theme Saved!" : "Save & Publish Changes"}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Top Announcement Bar Text</label>
                <input
                  type="text"
                  value={theme.announcement.text}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      announcement: { ...theme.announcement, text: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4f46e5] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Hero Banner Main Headline</label>
                <input
                  type="text"
                  value={theme.hero.headline}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      hero: { ...theme.hero, headline: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4f46e5] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Hero Subtitle</label>
                <input
                  type="text"
                  value={theme.hero.subheadline}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      hero: { ...theme.hero, subheadline: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4f46e5] font-medium"
                />
              </div>
            </div>
          </main>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 7: SEO & AEO OPTIMIZATION */}
        {/* --------------------------------------------------------- */}
        {activeTab === "seo" && (
          <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                AEO, GEO & SEO Optimization Hub
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Configure local Haridwar keywords, Google rich snippet schemas & metadata
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Default Website Meta Title</label>
                <input
                  type="text"
                  value={settings.defaultMetaTitle}
                  onChange={(e) => setSettings({ ...settings, defaultMetaTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4f46e5] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Default Meta Description</label>
                <textarea
                  rows={3}
                  value={settings.defaultMetaDescription}
                  onChange={(e) => setSettings({ ...settings, defaultMetaDescription: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#4f46e5] font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    AdminStore.saveSettings(settings);
                    setProductToast("SEO Settings saved successfully!");
                    setTimeout(() => setProductToast(null), 3000);
                  }}
                  className="px-5 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-500/25"
                >
                  Save SEO Configuration
                </button>
              </div>
            </div>
          </main>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 8: STORE SETTINGS */}
        {/* --------------------------------------------------------- */}
        {activeTab === "settings" && (
          <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Showroom & Store Settings
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Payment gateways, WhatsApp notifications, showroom address & shipping
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Store Name</label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#4f46e5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Owner WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#4f46e5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">UPI ID for Direct Payments</label>
                  <input
                    type="text"
                    value={settings.upiId}
                    onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#4f46e5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Free Insured Shipping Above (₹)</label>
                  <input
                    type="number"
                    value={settings.freeShippingAbove}
                    onChange={(e) => setSettings({ ...settings, freeShippingAbove: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#4f46e5]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    AdminStore.saveSettings(settings);
                    setProductToast("Settings updated successfully!");
                    setTimeout(() => setProductToast(null), 3000);
                  }}
                  className="px-5 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-500/25"
                >
                  Save Store Settings
                </button>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* --------------------------------------------------------- */}
      {/* ADD / EDIT PRODUCT MODAL (Shopify Style Slide-Over/Modal) */}
      {/* --------------------------------------------------------- */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-4 sm:px-6 flex items-center justify-between z-10">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {editingProduct.id?.startsWith("custom") ? "Add New Boutique Product" : "Edit Product"}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Configure catalog details, pricing in ₹ & multi-photo gallery</p>
              </div>
              <button
                onClick={() => {
                  setIsProductModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-6 text-xs">
              {/* 1. Basic Info */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#4f46e5]" />
                  Product Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rani Pink Embroidered Flared Anarkali Suit Set"
                      value={editingProduct.name || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#4f46e5] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SKU (Stock Keeping Unit) *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.sku || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus:outline-none focus:border-[#4f46e5]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={editingProduct.category || "Kurtis"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#4f46e5]"
                    >
                      {CATEGORIES_LIST.filter(c => c.id !== "all").map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                      <option value="Undergarments">Undergarments</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Bestseller / New Arrival / 50% Off"
                      value={editingProduct.badge || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#4f46e5]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Inventory Quantity *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.stock ?? 10}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Pricing & Profit Margins (Shopify Feature with ₹) */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  Pricing & Profitability (Shopify Margins in ₹)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.price || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#4f46e5]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Compare-at Price / MRP (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingProduct.mrp || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:border-[#4f46e5]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Wholesale Cost (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingProduct.purchaseCost || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, purchaseCost: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                </div>

                {/* Profit bar */}
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800 font-bold">
                  <span>
                    Estimated Profit: <strong>₹{(editingProduct.price || 0) - (editingProduct.purchaseCost || 0)}</strong> per unit
                  </span>
                  <span>
                    Margin:{" "}
                    <strong>
                      {editingProduct.purchaseCost
                        ? Math.round((((editingProduct.price || 0) - editingProduct.purchaseCost) / editingProduct.purchaseCost) * 100)
                        : 50}
                      %
                    </strong>
                  </span>
                </div>
              </div>

              {/* 3. Media & Multi-Image Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#4f46e5]" />
                    Product Photos & Multi-Image Gallery
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {editingProduct.images?.length || 1} photo(s) attached
                  </span>
                </div>

                {/* Drag & Drop Upload from Device */}
                <label className="border-2 border-dashed border-slate-200 hover:border-[#4f46e5] bg-slate-50/70 hover:bg-indigo-50/20 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition text-center group">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-[#4f46e5] flex items-center justify-center mb-2 group-hover:scale-110 transition shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-800 text-xs">
                    Click to Upload Photos from Phone or PC
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Select multiple photos from gallery or take a picture (JPG, PNG, WEBP)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Gallery of Uploaded Photos */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div>
                    <span className="block text-[11px] font-bold text-slate-700 mb-2">
                      Selected Gallery Photos (Click photo to set as Primary thumbnail):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {editingProduct.images.map((img, idx) => {
                        const isPrimary = (editingProduct.imageUrl || editingProduct.images?.[0]) === img;
                        return (
                          <div
                            key={idx}
                            className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition ${
                              isPrimary ? "border-[#4f46e5] ring-2 ring-indigo-200" : "border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            {img.startsWith("data:") ? (
                              <img src={img} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                              <Image src={img} alt="preview" fill className="object-cover" />
                            )}
                            {isPrimary && (
                              <span className="absolute top-1 left-1 bg-[#4f46e5] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                                Primary
                              </span>
                            )}
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-1">
                              {!isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(img)}
                                  className="px-2 py-0.5 bg-white text-slate-900 text-[10px] font-bold rounded shadow-xs hover:bg-slate-100"
                                >
                                  Set Primary
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(img)}
                                className="p-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                title="Delete photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Preset Photoshoot Library */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-600 mb-2">
                    Or pick from Haridwar Showroom Photoshoot:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {PRESET_PRODUCT_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img}
                        onClick={() => {
                          const cur = editingProduct.images || [];
                          const updated = cur.includes(img) ? cur : [...cur, img];
                          setEditingProduct({
                            ...editingProduct,
                            imageUrl: img,
                            images: updated,
                          });
                        }}
                        className={`w-14 h-16 rounded-xl border-2 overflow-hidden relative shrink-0 transition ${
                          editingProduct.imageUrl === img ? "border-[#4f46e5] ring-2 ring-indigo-200" : "border-slate-200"
                        }`}
                      >
                        <Image src={img} alt="preset" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Sizes & Colors */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
                  Sizes, Colors & Garment Specs
                </h4>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Available Sizes (Click to toggle)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_SIZES.map((sz) => {
                      const selected = editingProduct.sizes?.includes(sz);
                      return (
                        <button
                          type="button"
                          key={sz}
                          onClick={() => {
                            const cur = editingProduct.sizes || [];
                            const next = selected ? cur.filter((s) => s !== sz) : [...cur, sz];
                            setEditingProduct({ ...editingProduct, sizes: next });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                            selected
                              ? "bg-[#4f46e5] text-white border-[#4f46e5]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Variants */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Color Palette (Click to toggle)</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_COLORS.map((col) => {
                      const selected = editingProduct.colors?.includes(col.name);
                      return (
                        <button
                          type="button"
                          key={col.name}
                          onClick={() => {
                            const cur = editingProduct.colors || [];
                            const next = selected ? cur.filter((c) => c !== col.name) : [...cur, col.name];
                            setEditingProduct({ ...editingProduct, colors: next });
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                            selected
                              ? "border-[#4f46e5] bg-indigo-50 text-slate-900 font-bold ring-1 ring-[#4f46e5]"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span>{col.name}</span>
                          {selected && <Check className="w-3 h-3 text-[#4f46e5] ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fabric & Lining</label>
                    <input
                      type="text"
                      placeholder="e.g. Pure Georgette / Banarasi Katan Silk"
                      value={editingProduct.fabric || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#4f46e5]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Occasion</label>
                    <input
                      type="text"
                      placeholder="e.g. Wedding, Festive, Karwa Chauth"
                      value={editingProduct.occasion || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, occasion: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#4f46e5]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                </div>
              </div>

              {/* LIVE STOREFRONT CARD PREVIEW */}
              <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-[#4f46e5]" />
                    Customer Storefront Card Live Preview
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Live preview of how customers see this product</span>
                </div>
                <div className="max-w-xs mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
                  <div className="relative aspect-[3/4] bg-slate-100">
                    {editingProduct.imageUrl ? (
                      editingProduct.imageUrl.startsWith("data:") ? (
                        <img src={editingProduct.imageUrl} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <Image src={editingProduct.imageUrl} alt="preview" fill className="object-cover" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No image uploaded
                      </div>
                    )}
                    {editingProduct.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-[#4f46e5] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        {editingProduct.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {editingProduct.category || "Kurtis"}
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs line-clamp-1">
                      {editingProduct.name || "Product Title Preview"}
                    </h5>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-sm font-extrabold text-slate-900">
                        ₹{(editingProduct.price || 0).toLocaleString("en-IN")}
                      </span>
                      {Number(editingProduct.mrp) > Number(editingProduct.price) && (
                        <>
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{Number(editingProduct.mrp).toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">
                            Save ₹{(Number(editingProduct.mrp) - Number(editingProduct.price)).toLocaleString("en-IN")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl font-bold transition shadow-md shadow-indigo-500/25 active:scale-[0.98]"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* ORDER DETAILS & PRINT INVOICE DRAWER */}
      {/* --------------------------------------------------------- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Order</span>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-bold text-[10px] uppercase block mb-1">Customer Name</span>
                <span className="font-bold text-slate-900 block">{selectedOrder.customerName}</span>
                <span className="text-slate-500 font-mono text-[11px]">{selectedOrder.customerPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold text-[10px] uppercase block mb-1">Delivery Address</span>
                <span className="text-slate-700 font-medium block">{selectedOrder.shippingAddress}</span>
                <span className="text-slate-500 text-[11px] font-semibold">
                  {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Order Items</h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between bg-white">
                    <div>
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">SKU: {item.sku} • Size: {item.selectedSize || "Standard"}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900 block">₹{item.price.toLocaleString("en-IN")}</span>
                      <span className="text-slate-400 text-[10px]">Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total breakdown */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Insured Express Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-100">
                <span>Total Amount ({selectedOrder.paymentMethod.toUpperCase()})</span>
                <span>₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => handleSendWhatsAppUpdate(selectedOrder)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Customer</span>
              </button>

              <button
                onClick={handlePrintInvoice}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
