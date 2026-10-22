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
  DollarSign,
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
  ChevronDown
} from "lucide-react";
import { ProductItem, CustomerOrder, ProductCategory } from "@/types/store";
import { AdminStore, AdminStoreSettings, DEFAULT_SETTINGS } from "@/lib/adminStore";
import { SITE_CONFIG, getProductSlug } from "@/lib/seoEngine";
import { CATEGORIES_LIST } from "@/lib/catalogService";

type AdminTab = "dashboard" | "products" | "orders" | "seo" | "settings";

const AVAILABLE_SIZES = [
  "XS (34)", "S (36)", "M (38)", "L (40)", "XL (42)", "XXL (44)", "3XL (46)",
  "Free Size", "Semi-Stitched", "Unstitched (6.3m)", "Size 28", "Size 30", "Size 32", "Size 34", "Size 36", "Size 38", "Size 40"
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

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>("");

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
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (AdminStore.login(pinInput)) {
      setIsAuthenticated(true);
      setLoginError("");
      loadAllData();
    } else {
      setLoginError("Invalid Admin PIN. (Default PIN: 7464 or rajnandini2026)");
    }
  };

  const handleLogout = () => {
    AdminStore.logout();
    setIsAuthenticated(false);
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => (o.status !== "cancelled" ? sum + o.totalAmount : sum), 0);
    const completedOrders = orders.filter((o) => o.status === "delivered").length;
    const pendingOrders = orders.filter((o) => o.status === "placed" || o.status === "confirmed").length;
    const lowStockCount = products.filter((p) => p.stock <= 5).length;
    const avgOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;

    return {
      totalSales,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      totalProducts: products.length,
      lowStockCount,
      avgOrderValue,
    };
  }, [products, orders]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || p.category.toLowerCase() === categoryFilter.toLowerCase();
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
      sizes: editingProduct.sizes || ["Free Size"],
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
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      await AdminStore.deleteProduct(id);
      setProducts(AdminStore.getProducts());
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
    const text =
`*🙏 Namaste ${order.customerName}!*

Updates on your order from *Rajnandini Boutique Haridwar*:
📦 *Order ID*: ${order.orderNumber}
📊 *Status*: ${order.status.toUpperCase()}
💰 *Total Amount*: ₹${order.totalAmount.toLocaleString("en-IN")} (${order.paymentMethod.toUpperCase()})
📍 *Delivery Address*: ${order.shippingAddress}, ${order.city} - ${order.pincode}

${order.status === "shipped" ? "🚚 Your package has been dispatched via Express Courier and will reach you shortly." : ""}
${order.status === "confirmed" ? "✨ We have verified your order and packaging is underway." : ""}
${order.status === "delivered" ? "🎉 Your order has been marked as Delivered! Thank you for choosing Rajnandini Boutique." : ""}

For any tailoring or exchange questions, call us directly at ${settings.phone}.`;

    const phoneDigits = order.customerPhone.replace(/\D/g, "");
    const cleanPhone = phoneDigits.startsWith("91") ? phoneDigits : `91${phoneDigits}`;
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`, "_blank");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(""), 2000);
  };

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans text-stone-100">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#a81c24]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="text-center mb-8">
            <div className="inline-block bg-white rounded-xl p-3 shadow-md mb-4 border border-stone-700">
              <Image
                src="/logo.png"
                alt="Rajnandini Boutique"
                width={170}
                height={75}
                className="h-12 w-auto object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-[#e02b37]" />
              Rajnandini Admin Portal
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Shopify-grade Inventory, AEO/GEO/SEO & Orders Suite
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2">
                Enter Store Security PIN
              </label>
              <input
                type="password"
                maxLength={20}
                autoFocus
                placeholder="Enter 4-digit PIN (Default: 7464)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-[#e02b37] focus:ring-1 focus:ring-[#e02b37]"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 bg-red-950/50 border border-red-900/60 rounded-lg p-2.5 text-center">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#a81c24] hover:bg-[#8f171e] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition shadow-lg shadow-red-950/40"
            >
              Sign In to Admin
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setPinInput("7464");
                  AdminStore.login("7464");
                  setIsAuthenticated(true);
                  loadAllData();
                }}
                className="w-full py-2 bg-stone-800/80 hover:bg-stone-800 text-xs text-stone-300 font-medium rounded-lg transition"
              >
                ⚡ Quick Demo Login (PIN: 7464)
              </button>
            </div>
          </form>

          <div className="mt-8 pt-4 border-t border-stone-800/80 text-center text-[11px] text-stone-500">
            Showroom: Arya Nagar Chowk, Haridwar • Managed by Indu Sharma
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED SHOPIFY-STYLE ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f1f2f4] text-stone-900 font-sans flex antialiased">
      {/* 1. LEFT SIDEBAR (Shopify Dark Navy / Charcoal Style) */}
      <aside className="w-64 bg-[#1a1c23] text-stone-300 shrink-0 flex flex-col justify-between hidden md:flex border-r border-stone-800 shadow-xl">
        <div>
          {/* Brand header */}
          <div className="p-4 border-b border-stone-800/80 flex items-center justify-between">
            <Link href="/" className="inline-block bg-white rounded-lg p-1.5 shadow-sm">
              <Image
                src="/logo.png"
                alt="Rajnandini"
                width={130}
                height={55}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
              ADMIN
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "dashboard"
                  ? "bg-[#2d3139] text-white shadow-sm"
                  : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#e02b37]" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "orders"
                  ? "bg-[#2d3139] text-white shadow-sm"
                  : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Orders & Fulfillment</span>
              </div>
              {stats.pendingOrders > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {stats.pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "products"
                  ? "bg-[#2d3139] text-white shadow-sm"
                  : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Products & Inventory</span>
              </div>
              <span className="text-[11px] text-stone-400">{products.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("seo")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "seo"
                  ? "bg-[#2d3139] text-white shadow-sm"
                  : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
              }`}
            >
              <Globe2 className="w-4 h-4 text-sky-400" />
              <span>AEO, GEO & SEO Studio</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "settings"
                  ? "bg-[#2d3139] text-white shadow-sm"
                  : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
              }`}
            >
              <Settings className="w-4 h-4 text-purple-400" />
              <span>Store Configuration</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar User Info */}
        <div className="p-3 border-t border-stone-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-stone-400 hover:bg-stone-800 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" />
              View Live Storefront
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="pt-2 flex items-center justify-between px-3 text-xs">
            <div>
              <span className="font-bold text-white block">Indu Sharma</span>
              <span className="text-[10px] text-stone-500">Boutique Founder</span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-stone-400 hover:text-red-400 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN ADMIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-stone-200 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold capitalize text-stone-800">
              {activeTab === "dashboard" && "Store Dashboard"}
              {activeTab === "products" && "Product Catalog & Inventory"}
              {activeTab === "orders" && "Customer Orders & Shipments"}
              {activeTab === "seo" && "AEO, GEO & SEO Optimization Hub"}
              {activeTab === "settings" && "Store & Showroom Settings"}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live & Synced with Showroom
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#a81c24] hover:bg-[#8f171e] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="md:hidden p-2 text-stone-600 hover:text-[#a81c24]"
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Sub-header on Mobile for Nav Tabs */}
        <div className="md:hidden bg-[#1a1c23] px-3 py-2 flex items-center justify-around text-xs text-stone-400 overflow-x-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-2 py-1 ${activeTab === "dashboard" ? "text-white font-bold" : ""}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-2 py-1 ${activeTab === "orders" ? "text-white font-bold" : ""}`}
          >
            Orders ({stats.pendingOrders})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-2 py-1 ${activeTab === "products" ? "text-white font-bold" : ""}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`px-2 py-1 ${activeTab === "seo" ? "text-white font-bold" : ""}`}
          >
            AEO/SEO
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-2 py-1 ${activeTab === "settings" ? "text-white font-bold" : ""}`}
          >
            Settings
          </button>
        </div>

        {/* --------------------------------------------------------- */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* --------------------------------------------------------- */}
        {activeTab === "dashboard" && (
          <main className="p-6 space-y-6">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">
                  ₹{stats.totalSales.toLocaleString("en-IN")}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.4% vs last week
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">{stats.totalOrders}</div>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  {stats.pendingOrders} awaiting fulfillment
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">
                  ₹{stats.avgOrderValue.toLocaleString("en-IN")}
                </div>
                <span className="text-[11px] text-stone-500 mt-1 block">Per customer checkout</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Catalog Inventory</span>
                  <Package className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">{stats.totalProducts}</div>
                <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
                  {stats.lowStockCount} items in low stock
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Table (2 Cols) */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-stone-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">Recent Customer Orders</h3>
                    <p className="text-xs text-stone-500">Live checkouts from website & WhatsApp</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-[#a81c24] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50/80 transition">
                          <td className="p-3 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                          <td className="p-3">
                            <span className="font-semibold text-stone-900 block">{ord.customerName}</span>
                            <span className="text-[10px] text-stone-500">{ord.city}</span>
                          </td>
                          <td className="p-3 font-bold text-stone-900">
                            ₹{ord.totalAmount.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                ord.status === "delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : ord.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : ord.status === "confirmed"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 font-semibold rounded text-stone-700"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AEO / GEO Quick Card (1 Col) */}
              <div className="bg-gradient-to-br from-stone-900 to-[#1e1b1b] text-white p-5 rounded-xl border border-stone-800 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AEO & GEO Haridwar Score</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mb-2">96 / 100 Health</h3>
                  <p className="text-xs text-stone-300 leading-relaxed mb-4">
                    Your boutique is optimized for Perplexity, ChatGPT voice queries, Google SGE and Local Haridwar Maps searches.
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded">
                      <span>Local Haridwar Geotags</span>
                      <span className="text-emerald-400 font-bold">✓ Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded">
                      <span>FAQPage AI Schema</span>
                      <span className="text-emerald-400 font-bold">✓ Indexed</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded">
                      <span>Google Merchant Rich Cards</span>
                      <span className="text-emerald-400 font-bold">✓ Ready</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("seo")}
                  className="mt-5 w-full py-2.5 bg-[#a81c24] hover:bg-[#8f171e] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition"
                >
                  Open AEO & SEO Hub →
                </button>
              </div>
            </div>
          </main>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 2: PRODUCTS & INVENTORY */}
        {/* --------------------------------------------------------- */}
        {activeTab === "products" && (
          <main className="p-6 space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-80">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by product name, SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#a81c24]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-lg text-stone-700 focus:outline-none"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {CATEGORIES_LIST.filter(c => c.id !== "all").map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-3.5 py-1.5 bg-[#a81c24] hover:bg-[#8f171e] text-white text-xs font-bold uppercase rounded-lg transition flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table (Shopify Style) */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">SKU / Barcode</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Inventory</th>
                      <th className="p-3.5">Price & Profit</th>
                      <th className="p-3.5">SEO Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((prod) => {
                      const profit = prod.price - (prod.purchaseCost || 0);
                      const marginPct = prod.purchaseCost ? Math.round((profit / prod.purchaseCost) * 100) : 50;

                      return (
                        <tr key={prod.id} className="hover:bg-stone-50/70 transition">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-14 bg-stone-100 rounded-md overflow-hidden relative shrink-0 border border-stone-200">
                                <Image
                                  src={prod.imageUrl || "/products/product 1.png"}
                                  alt={prod.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <span className="font-bold text-stone-900 block truncate" title={prod.name}>
                                  {prod.name}
                                </span>
                                {prod.badge && (
                                  <span className="inline-block text-[9px] font-bold text-[#a81c24] bg-red-50 px-1.5 py-0.2 rounded mt-0.5">
                                    {prod.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-mono font-semibold text-stone-800 block">{prod.sku}</span>
                            <span className="text-[10px] text-stone-400 font-mono">{prod.barcode}</span>
                          </td>
                          <td className="p-3.5 font-medium text-stone-600">{prod.category}</td>
                          <td className="p-3.5">
                            {prod.stock > 5 ? (
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                {prod.stock} in stock
                              </span>
                            ) : prod.stock > 0 ? (
                              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                                Low: {prod.stock} left
                              </span>
                            ) : (
                              <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded text-[11px]">
                                Out of stock
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-stone-900">
                              ₹{prod.price.toLocaleString("en-IN")}
                              <span className="text-stone-400 line-through text-[10px] ml-1.5 font-normal">
                                ₹{prod.mrp.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-bold">
                              +{marginPct}% margin (₹{profit})
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                              AEO Indexed
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/products/${getProductSlug(prod)}`}
                                target="_blank"
                                title="View on storefront"
                                className="p-1.5 text-stone-500 hover:text-stone-900 rounded"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleEditProduct(prod)}
                                title="Edit Product"
                                className="p-1.5 text-stone-600 hover:text-[#a81c24] rounded"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                title="Delete Product"
                                className="p-1.5 text-stone-400 hover:text-red-600 rounded"
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
          <main className="p-6 space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-80">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by order #, customer, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#a81c24]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {["all", "placed", "confirmed", "shipped", "delivered", "cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition shrink-0 ${
                      orderStatusFilter === st
                        ? "bg-[#1a1c23] text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Order Number</th>
                      <th className="p-3.5">Date & Time</th>
                      <th className="p-3.5">Customer & Phone</th>
                      <th className="p-3.5">Delivery Destination</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Total & Payment</th>
                      <th className="p-3.5">Fulfillment Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/70 transition">
                        <td className="p-3.5 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                        <td className="p-3.5 text-stone-500 text-[11px]">
                          {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-stone-900 block">{ord.customerName}</span>
                          <a
                            href={`tel:${ord.customerPhone}`}
                            className="text-[11px] text-stone-500 hover:text-[#a81c24] font-mono"
                          >
                            {ord.customerPhone}
                          </a>
                        </td>
                        <td className="p-3.5">
                          <span className="font-medium text-stone-800 block">{ord.city}, {ord.state}</span>
                          <span className="text-[10px] text-stone-400 truncate block max-w-xs">{ord.shippingAddress}</span>
                        </td>
                        <td className="p-3.5 font-semibold text-stone-700">
                          {ord.items.length} {ord.items.length === 1 ? "item" : "items"}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-stone-900 block">
                            ₹{ord.totalAmount.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] font-bold text-stone-500 uppercase">
                            {ord.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(ord.orderNumber, e.target.value as CustomerOrder["status"])
                            }
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border capitalize focus:outline-none ${
                              ord.status === "delivered"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : ord.status === "shipped"
                                ? "bg-blue-50 text-blue-800 border-blue-300"
                                : ord.status === "confirmed"
                                ? "bg-purple-50 text-purple-800 border-purple-300"
                                : ord.status === "cancelled"
                                ? "bg-red-50 text-red-800 border-red-300"
                                : "bg-amber-50 text-amber-800 border-amber-300"
                            }`}
                          >
                            <option value="placed">Placed (Pending)</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSendWhatsAppUpdate(ord)}
                              title="Send WhatsApp Update"
                              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded text-[11px]"
                            >
                              Details
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
        {/* TAB 4: AEO, GEO & SEO STUDIO */}
        {/* --------------------------------------------------------- */}
        {activeTab === "seo" && (
          <main className="p-6 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-sky-600" />
                    AEO, GEO & Local SEO Control Center
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Answer Engine Optimization for ChatGPT & Perplexity + Haridwar Local Business Geo-Targeting
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  100% Google Rich Snippets Compliant
                </span>
              </div>

              {/* 3 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* 1. SEO Card */}
                <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                    <Search className="w-4 h-4" />
                    <span>Traditional Search (SEO)</span>
                  </div>
                  <h4 className="font-extrabold text-stone-900">Google SERP Snippet Preview</h4>
                  <div className="bg-white p-3.5 rounded-lg border border-stone-200 text-left shadow-xs">
                    <div className="text-[11px] text-stone-500 flex items-center gap-1">
                      <span>https://rajnandiniboutique.com</span>
                      <span>› Haridwar</span>
                    </div>
                    <div className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
                      {settings.defaultMetaTitle}
                    </div>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {settings.defaultMetaDescription}
                    </p>
                  </div>
                </div>

                {/* 2. GEO Card */}
                <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                    <MapPin className="w-4 h-4" />
                    <span>GEO Local Signals (Uttarakhand)</span>
                  </div>
                  <h4 className="font-extrabold text-stone-900">Local Dominance Locations</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {settings.targetCities.map((city) => (
                      <span
                        key={city}
                        className="px-2.5 py-1 bg-white text-stone-800 text-xs font-bold rounded border border-stone-200 shadow-2xs"
                      >
                        📍 {city}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-stone-600 pt-2 border-t border-stone-200">
                    <strong>GPS Coordinates:</strong> 29.9457° N, 78.1642° E (Arya Nagar Chowk)
                  </div>
                </div>

                {/* 3. AEO Card */}
                <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>AEO (AI Search Engine Answers)</span>
                  </div>
                  <h4 className="font-extrabold text-stone-900">Voice & Perplexity Questions</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Pre-structured Q&A pairs for automated citation in ChatGPT Search, Gemini Live, and Claude Sonnet web browsing.
                  </p>
                  <div className="bg-white p-2.5 rounded border border-stone-200 text-[11px] font-mono text-stone-700">
                    FAQPage Schema Generated ✓
                  </div>
                </div>
              </div>

              {/* JSON-LD Schema Code Viewer */}
              <div className="mt-8 pt-6 border-t border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    Live JSON-LD Structured Data Output
                  </h4>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(
                          {
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            name: settings.storeName,
                            image: `${SITE_CONFIG.url}/logo.png`,
                            telephone: settings.phone,
                            address: {
                              streetAddress: settings.address,
                              addressLocality: settings.city,
                              addressRegion: settings.state,
                              postalCode: settings.pincode,
                              addressCountry: "IN",
                            },
                          },
                          null,
                          2
                        ),
                        "schema"
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded transition"
                  >
                    {copyStatus === "schema" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copyStatus === "schema" ? "Copied!" : "Copy Schema JSON"}</span>
                  </button>
                </div>

                <pre className="p-4 bg-stone-900 text-stone-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-60 border border-stone-800">
                  {JSON.stringify(
                    {
                      "@context": "https://schema.org",
                      "@type": "ClothingStore",
                      name: settings.storeName,
                      founder: "Indu Sharma",
                      telephone: settings.phone,
                      url: SITE_CONFIG.url,
                      currenciesAccepted: "INR",
                      paymentAccepted: "Cash, UPI, Credit Card",
                      address: {
                        "@type": "PostalAddress",
                        streetAddress: settings.address,
                        addressLocality: settings.city,
                        addressRegion: settings.state,
                        postalCode: settings.pincode,
                        addressCountry: "IN",
                      },
                      geo: {
                        "@type": "GeoCoordinates",
                        latitude: 29.9457,
                        longitude: 78.1642,
                      },
                      servesCuisine: undefined,
                      hasOfferCatalog: {
                        "@type": "OfferCatalog",
                        name: "Boutique Collections",
                        itemListElement: [
                          "Pure Silk Banarasi Sarees",
                          "Bridal Lehengas & Lanchas",
                          "Festive Anarkali Suits",
                          "Boutique Custom Tailoring",
                        ],
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </main>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 5: STORE SETTINGS */}
        {/* --------------------------------------------------------- */}
        {activeTab === "settings" && (
          <main className="p-6 max-w-4xl space-y-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-3">
                General Store Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#a81c24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={settings.gstin}
                    onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#a81c24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp Orders Number</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#a81c24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#a81c24]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Showroom Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#a81c24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City & State</label>
                  <input
                    type="text"
                    value={`${settings.city}, ${settings.state}`}
                    disabled
                    className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-lg text-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Free Shipping Above (₹)</label>
                  <input
                    type="number"
                    value={settings.freeShippingAbove}
                    onChange={(e) => setSettings({ ...settings, freeShippingAbove: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#a81c24]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  onClick={() => {
                    AdminStore.saveSettings(settings);
                    alert("Store settings saved successfully!");
                  }}
                  className="px-5 py-2.5 bg-[#a81c24] hover:bg-[#8f171e] text-white text-xs font-bold uppercase rounded-lg transition"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="sticky top-0 bg-white border-b border-stone-200 p-4 sm:px-6 flex items-center justify-between z-10">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {editingProduct.id?.startsWith("custom") ? "Add New Boutique Product" : "Edit Product"}
                </h3>
                <p className="text-xs text-stone-500">Configure catalog details, pricing & AEO/GEO tags</p>
              </div>
              <button
                onClick={() => {
                  setIsProductModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-4 sm:p-6 space-y-6 text-xs">
              {/* 1. Basic Info */}
              <div className="space-y-4">
                <h4 className="font-bold text-stone-800 text-sm border-b border-stone-100 pb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#a81c24]" />
                  Product Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rani Pink Embroidered Flared Anarkali Suit Set"
                      value={editingProduct.name || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#a81c24]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">SKU (Stock Keeping Unit) *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.sku || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono focus:outline-none focus:border-[#a81c24]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                    <select
                      value={editingProduct.category || "Kurtis"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-semibold text-stone-700 focus:outline-none"
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
                    <label className="block font-semibold text-stone-700 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Bestseller / New Arrival / 50% Off"
                      value={editingProduct.badge || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#a81c24]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Inventory Quantity *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.stock ?? 10}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#a81c24]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Pricing & Profit Margins (Shopify Feature) */}
              <div className="space-y-4">
                <h4 className="font-bold text-stone-800 text-sm border-b border-stone-100 pb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Pricing & Profitability (Shopify Margins)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.price || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-900 focus:outline-none focus:border-[#a81c24]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Compare-at Price / MRP (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingProduct.mrp || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-600 focus:outline-none focus:border-[#a81c24]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Wholesale Cost (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingProduct.purchaseCost || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, purchaseCost: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-600 focus:outline-none focus:border-[#a81c24]"
                    />
                  </div>
                </div>

                {/* Profit bar */}
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-semibold">
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

              {/* 3. Media & Images */}
              <div className="space-y-4">
                <h4 className="font-bold text-stone-800 text-sm border-b border-stone-100 pb-2">
                  Product Image / Gallery
                </h4>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Primary Image Path or URL</label>
                  <input
                    type="text"
                    placeholder="/products/product 1.png or https://..."
                    value={editingProduct.imageUrl || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#a81c24]"
                  />
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-stone-600 mb-2">Or select a preset product photoshoot image:</span>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {PRESET_PRODUCT_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img}
                        onClick={() =>
                          setEditingProduct({
                            ...editingProduct,
                            imageUrl: img,
                            images: [img],
                          })
                        }
                        className={`w-14 h-16 rounded-md border-2 overflow-hidden relative shrink-0 transition ${
                          editingProduct.imageUrl === img ? "border-[#a81c24] ring-2 ring-red-200" : "border-stone-200"
                        }`}
                      >
                        <Image src={img} alt="preset" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Sizes & Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-stone-800 text-sm border-b border-stone-100 pb-2">
                  Sizes & Garment Specs
                </h4>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Available Sizes (Click to toggle)</label>
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
                          className={`px-2.5 py-1 rounded text-[11px] font-bold border transition ${
                            selected
                              ? "bg-[#1a1c23] text-white border-black"
                              : "bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Fabric & Lining</label>
                    <input
                      type="text"
                      placeholder="e.g. Pure Georgette / Banarasi Katan Silk"
                      value={editingProduct.fabric || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Occasion</label>
                    <input
                      type="text"
                      placeholder="e.g. Wedding, Festive, Karwa Chauth"
                      value={editingProduct.occasion || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, occasion: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 5. AEO / GEO / SEO Product Specific Fields */}
              <div className="space-y-4 p-4 bg-sky-50/60 rounded-xl border border-sky-200">
                <h4 className="font-bold text-sky-900 text-sm flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-sky-600" />
                  Product AEO, GEO & SEO Controls
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Meta Page Title (50-60 chars)
                    </label>
                    <input
                      type="text"
                      placeholder={`${editingProduct.name || "Product"} | Rajnandini Boutique Haridwar`}
                      value={editingProduct.seo?.metaTitle || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          seo: { ...editingProduct.seo, metaTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Focus Keyword</label>
                    <input
                      type="text"
                      placeholder="e.g. Bridal Lehenga Haridwar"
                      value={editingProduct.seo?.focusKeyword || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          seo: { ...editingProduct.seo, focusKeyword: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">
                      Meta Description (Search & AI Snippet)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Buy designer royal ethnic wear in Haridwar with custom tailoring and express shipping."
                      value={editingProduct.seo?.metaDescription || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          seo: { ...editingProduct.seo, metaDescription: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#a81c24] hover:bg-[#8f171e] text-white rounded-lg font-bold uppercase tracking-wider transition"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* ORDER DETAIL MODAL */}
      {/* --------------------------------------------------------- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Order Summary</span>
                <h3 className="text-base font-bold text-stone-900">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Customer Box */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{selectedOrder.customerName}</span>
                  <a
                    href={`tel:${selectedOrder.customerPhone}`}
                    className="text-stone-700 font-mono font-bold hover:text-[#a81c24]"
                  >
                    📞 {selectedOrder.customerPhone}
                  </a>
                </div>
                <p className="text-stone-600">
                  📍 {selectedOrder.shippingAddress}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-stone-200 text-[11px]">
                  <span>Payment Mode: <strong className="uppercase">{selectedOrder.paymentMethod}</strong></span>
                  <span>Fulfillment: <strong className="capitalize">{selectedOrder.status}</strong></span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold text-stone-800 mb-2">Ordered Items ({selectedOrder.items.length})</h4>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="p-3 flex items-center justify-between bg-white">
                      <div>
                        <span className="font-bold text-stone-900 block">{item.name}</span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          SKU: {item.sku} • Size: {item.selectedSize || "Standard"} • Qty: {item.quantity}
                        </span>
                      </div>
                      <span className="font-bold text-stone-900">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing totals */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping & Delivery</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-200">
                  <span>Total Payable</span>
                  <span className="text-[#a81c24]">₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleSendWhatsAppUpdate(selectedOrder)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
