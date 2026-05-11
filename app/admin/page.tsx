"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  LogOut,
  RefreshCw,
  Search,
  CircleDot,
  Package,
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  MapPin,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/menuData";

type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rejected";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  created_at: string;
  notes?: string;
  coordinates?: string;
};

type Reservation = {
  id: string;
  name: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  status: string;
  created_at: string;
};

type Product = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
  spiceLevel: number;
  isVegetarian: boolean;
  isAvailable: boolean;
  isSpecialty: boolean;
};

const initialProductForm = {
  name: "",
  description: "",
  price: 0,
  category: "starters",
  image: "",
  spiceLevel: 0,
  isVegetarian: false,
  isSpecialty: false,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "orders" | "reservations" | "products" | "gallery"
  >("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "all">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null,
  );
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState(initialProductForm);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({
    url: "",
    category: "food",
  });
  const [isSavingGallery, setIsSavingGallery] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const playNotificationSound = () => {
    if (!isSoundEnabled) return;
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    );
    audio.play().catch((e) => console.error("Sound play failed:", e));
  };

  useEffect(() => {
    fetchOrders();
    fetchReservations();
    fetchProducts();
    fetchGallery();

    const timer = window.setInterval(() => {
      fetchOrders(true);
      fetchReservations();
      fetchProducts();
    }, 8000);

    return () => window.clearInterval(timer);
  }, [isSoundEnabled]);

  const orderCounts = useMemo(
    () => ({
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      rejected: orders.filter((o) => o.status === "rejected").length,
    }),
    [orders],
  );

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const statusMatch = orderFilter === "all" || order.status === orderFilter;
      const textMatch =
        !term ||
        order.customer_name.toLowerCase().includes(term) ||
        order.customer_phone.toLowerCase().includes(term) ||
        order.customer_address.toLowerCase().includes(term) ||
        order.items.some((item) => item.name.toLowerCase().includes(term));

      return statusMatch && textMatch;
    });
  }, [orders, orderFilter, searchTerm]);

  const filteredProducts = useMemo(() => {
    const term = productSearchTerm.trim().toLowerCase();
    return products.filter((product) => {
      if (!term) return true;
      return (
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    });
  }, [products, productSearchTerm]);

  const orderFilterItems: Array<{
    key: OrderStatus | "all";
    label: string;
    count: number;
  }> = [
    { key: "all", label: "All", count: orderCounts.all },
    { key: "pending", label: "Pending", count: orderCounts.pending },
    { key: "confirmed", label: "Accepted", count: orderCounts.confirmed },
    { key: "completed", label: "Completed", count: orderCounts.completed },
    { key: "rejected", label: "Rejected", count: orderCounts.rejected },
  ];

  async function fetchOrders(isBackgroundRefresh = false) {
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to load orders.");
      }

      const incomingOrders = (payload.data || []) as Order[];
      setOrders((prevOrders) => {
        if (isBackgroundRefresh && incomingOrders.length > prevOrders.length) {
          playNotificationSound();
        }
        return incomingOrders;
      });
      setErrorMessage("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load orders.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchReservations() {
    try {
      const response = await fetch("/api/admin/reservations", {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to load reservations.");
      }

      setReservations(payload.data || []);
      setErrorMessage("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load reservations.";
      setErrorMessage(message);
    }
  }

  async function fetchProducts() {
    try {
      const response = await fetch("/api/admin/products", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to load products.");
      }

      setProducts(payload.data || []);
      setErrorMessage("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load products.";
      setErrorMessage(message);
    }
  }

  async function fetchGallery() {
    try {
      const response = await fetch("/api/admin/gallery", { cache: "no-store" });
      const payload = await response.json();
      if (response.ok) {
        setGalleryItems(payload.data || []);
      }
    } catch (error) {
      console.error("Failed to load gallery:", error);
    }
  }

  async function updateStatus(
    table: "orders" | "reservations",
    id: string,
    newStatus: string,
  ) {
    if (table === "orders") {
      setUpdatingOrderId(id);
    }

    const endpoint =
      table === "orders" ? "/api/admin/orders" : "/api/admin/reservations";
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });

    const payload = await response.json();

    if (!response.ok) {
      alert(payload.error || "Error updating status");
      setUpdatingOrderId(null);
      return;
    }

    if (table === "orders") {
      await fetchOrders();
      setUpdatingOrderId(null);
      return;
    }

    await fetchReservations();
  }

  async function removeItemFromOrder(orderId: string, itemIndex: number) {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (targetOrder.items.length <= 1) {
      alert("An order must have at least one item. Use 'Reject Order' instead.");
      return;
    }

    if (!confirm("Are you sure you want to remove this item from the order?"))
      return;

    setUpdatingOrderId(orderId);

    const updatedItems = targetOrder.items.filter((_, idx) => idx !== itemIndex);

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, items: updatedItems }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to update order.");
      }

      await fetchOrders();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([
      fetchOrders(),
      fetchReservations(),
      fetchProducts(),
      fetchGallery(),
    ]);
    setRefreshing(false);
  }

  const resetProductForm = () => {
    setProductFormData(initialProductForm);
    setEditingProduct(null);
  };

  const openAddProduct = () => {
    resetProductForm();
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      spiceLevel: product.spiceLevel,
      isVegetarian: product.isVegetarian,
      isSpecialty: product.isSpecialty || false,
    });
    setIsProductModalOpen(true);
  };

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingProduct(true);

    try {
      const method = editingProduct ? "PATCH" : "POST";
      const body = editingProduct
        ? { id: editingProduct.id, ...productFormData }
        : productFormData;

      const response = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to save product.");
      }

      await fetchProducts();
      setIsProductModalOpen(false);
      resetProductForm();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSavingProduct(false);
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to delete product.");
      }

      await fetchProducts();
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function toggleProductAvailability(
    productId: string,
    nextAvailability: boolean,
  ) {
    setUpdatingProductId(productId);
    const response = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: productId,
        isAvailable: nextAvailability,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      alert(payload.error || "Failed to update availability.");
      setUpdatingProductId(null);
      return;
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, isAvailable: nextAvailability }
          : product,
      ),
    );
    setUpdatingProductId(null);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Upload failed.");
      }

      setProductFormData((prev) => ({ ...prev, image: payload.url }));
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function handleGalleryImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Upload failed.");
      }

      setGalleryFormData((prev) => ({ ...prev, url: payload.url }));
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSaveGalleryItem(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingGallery(true);

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(galleryFormData),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to save gallery item.");
      }

      await fetchGallery();
      setIsGalleryModalOpen(false);
      setGalleryFormData({ url: "", category: "food" });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSavingGallery(false);
    }
  }

  async function handleDeleteGalleryItem(id: string) {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to delete image.");
      }

      await fetchGallery();
    } catch (error: any) {
      alert(error.message);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "accepted";
      case "cancelled":
        return "cancelled by user";
      case "rejected":
        return "rejected by restaurant";
      default:
        return status;
    }
  };

  const getStatusAccent = (status: string) => {
    switch (status) {
      case "pending":
        return "border-l-amber-400";
      case "confirmed":
        return "border-l-blue-500";
      case "completed":
        return "border-l-emerald-500";
      case "cancelled":
        return "border-l-gray-400";
      case "rejected":
        return "border-l-rose-500";
      default:
        return "border-l-gray-300";
    }
  };

  return (
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-400 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Rabi Admin</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Owner Dashboard</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { id: "orders", label: "Orders", icon: ShoppingBag, badge: orderCounts.pending },
              { id: "reservations", label: "Reservations", icon: Calendar, badge: reservations.filter(r => r.status === "pending").length },
              { id: "products", label: "Products", icon: Package },
              { id: "gallery", label: "Gallery", icon: ImageIcon },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id
                    ? "bg-red-600/10 text-white font-semibold"
                    : "hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={20}
                    className={activeTab === item.id ? "text-red-500" : "text-slate-500 group-hover:text-slate-300"}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    activeTab === item.id ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                  <Volume2 size={16} />
                </div>
                <span className="text-sm font-medium">Notification Sound</span>
              </div>
              <button
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative ${isSoundEnabled ? 'bg-red-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isSoundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 rounded-xl transition-all group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-10 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 capitalize">{activeTab}</h2>
              <p className="text-xs text-slate-400 hidden sm:block">Manage your restaurant operations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 shadow-sm bg-white"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin text-red-600" : ""}
              />
              <span className="text-sm font-bold hidden sm:inline">Refresh</span>
            </button>
            
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-xs font-bold text-slate-600">AD</span>
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8">
          {errorMessage && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-6 py-4 text-sm flex items-center gap-3"
            >
              <XCircle size={20} />
              {errorMessage}
            </motion.div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium animate-pulse text-sm tracking-widest uppercase">Loading Dashboard...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-6xl mx-auto"
              >
                {activeTab === "orders" ? (
                  <div className="space-y-8">
                    {/* Filter Section */}
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                        {orderFilterItems.map((filterItem) => (
                          <button
                            key={filterItem.key}
                            onClick={() => setOrderFilter(filterItem.key)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
                              orderFilter === filterItem.key
                                ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              {filterItem.label}
                              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                                orderFilter === filterItem.key ? "bg-white/20" : "bg-slate-100 text-slate-400"
                              }`}>
                                {filterItem.count}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="w-full lg:w-96 relative group">
                        <Search
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors"
                        />
                        <input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search orders, phone, address..."
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/5 outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                      <div className="bg-white rounded-3xl p-20 text-center border border-slate-200 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <ShoppingBag className="text-slate-300" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No results found</h3>
                        <p className="text-slate-400">Try adjusting your filters or search term.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {filteredOrders.map((order) => (
                          <div
                            key={order.id}
                            className={`group bg-white rounded-3xl shadow-sm border border-slate-200 hover:border-slate-300 transition-all duration-300 overflow-hidden relative ${
                              expandedOrder === order.id ? 'ring-2 ring-red-500/20 shadow-xl' : ''
                            }`}
                          >
                            {/* Accent Line */}
                            <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                              order.status === 'pending' ? 'bg-amber-400' :
                              order.status === 'confirmed' ? 'bg-blue-500' :
                              order.status === 'completed' ? 'bg-emerald-500' :
                              'bg-rose-500'
                            }`} />

                            <div
                              className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                              <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-300 ${
                                  order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                  order.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                                  'bg-slate-50 text-slate-600'
                                }`}>
                                  <ShoppingBag size={28} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-slate-900 text-lg">
                                      {order.customer_name}
                                    </h3>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                      {getStatusLabel(order.status)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                                    <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span>•</span>
                                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                                <div className="text-left md:text-right">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                  <p className="text-xl font-black text-slate-900">
                                    Rs {order.total_price.toFixed(2)}
                                  </p>
                                </div>
                                <div className={`p-2 rounded-full transition-colors ${expandedOrder === order.id ? 'bg-slate-100 text-slate-900 rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'} duration-300`}>
                                  <ChevronDown size={24} />
                                </div>
                              </div>
                            </div>

                            <AnimatePresence>
                              {expandedOrder === order.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-8 pb-8 pt-2 grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-slate-100 bg-slate-50/50">
                                    <div className="space-y-6">
                                      <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Customer Details</h4>
                                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-400 font-bold uppercase">Phone</span>
                                            <span className="text-sm font-bold text-slate-700">{order.customer_phone}</span>
                                          </div>
                                          <div className="pt-3 border-t border-slate-100">
                                            <span className="text-xs text-slate-400 font-bold uppercase block mb-2">Address</span>
                                            <span className="text-sm font-medium text-slate-700 leading-relaxed block">{order.customer_address}</span>
                                          </div>
                                          {order.coordinates && (
                                            <a
                                              href={`https://www.google.com/maps/search/?api=1&query=${order.coordinates}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-bold text-red-600 hover:text-white transition-all bg-red-50 hover:bg-red-600 p-2.5 rounded-xl border border-red-100"
                                            >
                                              <MapPin size={14} /> Open Location
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {order.notes && (
                                        <div>
                                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Special Notes</h4>
                                          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-sm text-amber-900 italic leading-relaxed">
                                            "{order.notes}"
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div className="md:col-span-2 flex flex-col h-full">
                                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Ordered Items</h4>
                                      <div className="flex-1 space-y-3">
                                        {order.items.map((item, idx) => (
                                          <div
                                            key={idx}
                                            className="group/item flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                                          >
                                            <div className="flex items-center gap-4">
                                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs">
                                                {item.quantity}x
                                              </div>
                                              <div>
                                                <span className="block font-bold text-slate-800">
                                                  {item.name}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                  Rs {item.price.toFixed(2)} / unit
                                                </span>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-5">
                                              <span className="font-black text-slate-900">
                                                Rs {(item.price * item.quantity).toFixed(2)}
                                              </span>
                                              {order.status === "pending" && (
                                                <button
                                                  onClick={() => removeItemFromOrder(order.id, idx)}
                                                  disabled={updatingOrderId === order.id}
                                                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-30"
                                                  title="Remove Item"
                                                >
                                                  <Trash2 size={16} />
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      
                                      <div className="mt-8 flex flex-wrap gap-3 items-center justify-between pt-6 border-t border-slate-200">
                                        <div className="flex gap-3">
                                          {order.status === "pending" && (
                                            <button
                                              disabled={updatingOrderId === order.id}
                                              onClick={() => updateStatus("orders", order.id, "confirmed")}
                                              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 disabled:opacity-60"
                                            >
                                              <CircleDot size={18} /> Accept Order
                                            </button>
                                          )}
                                          {order.status === "confirmed" && (
                                            <button
                                              disabled={updatingOrderId === order.id}
                                              onClick={() => updateStatus("orders", order.id, "completed")}
                                              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 disabled:opacity-60"
                                            >
                                              <CheckCircle size={18} /> Mark Completed
                                            </button>
                                          )}
                                          {["pending", "confirmed"].includes(order.status) && (
                                            <button
                                              disabled={updatingOrderId === order.id}
                                              onClick={() => updateStatus("orders", order.id, "rejected")}
                                              className="flex items-center gap-2 px-6 py-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-2xl font-bold transition disabled:opacity-60"
                                            >
                                              <XCircle size={18} /> Reject
                                            </button>
                                          )}
                                        </div>
                                        
                                        {updatingOrderId === order.id && (
                                          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full">
                                            <RefreshCw size={14} className="animate-spin" />
                                            Updating...
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : activeTab === "reservations" ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-slate-800">Active Bookings</h3>
                      <p className="text-sm text-slate-400 font-medium">Total: {reservations.length}</p>
                    </div>
                    
                    {reservations.length === 0 ? (
                      <div className="bg-white rounded-3xl p-20 text-center border border-slate-200 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Calendar className="text-slate-300" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No reservations found</h3>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reservations.map((res) => (
                          <div
                            key={res.id}
                            className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-200 border-l-[6px] ${getStatusAccent(res.status)} flex flex-col justify-between gap-6 hover:shadow-md transition-all`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shrink-0">
                                  <Calendar size={28} />
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{res.name}</h3>
                                  <p className="text-sm text-slate-400 font-medium">{res.phone}</p>
                                </div>
                              </div>
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusColor(res.status)}`}>
                                {getStatusLabel(res.status)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                              <div className="flex-1 flex items-center gap-2 px-3 border-r border-slate-200">
                                <Clock size={16} className="text-red-600" />
                                <span className="text-sm font-black text-slate-800">
                                  {res.reservation_date} <span className="text-slate-400 font-medium ml-1">at</span> {res.reservation_time}
                                </span>
                              </div>
                              <div className="px-4 flex items-center gap-2">
                                <span className="text-lg font-black text-slate-800">{res.guests}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Guests</span>
                              </div>
                            </div>

                            <div className="flex gap-2 border-t border-slate-100 pt-5">
                              {res.status === "pending" && (
                                <button
                                  onClick={() => updateStatus("reservations", res.id, "confirmed")}
                                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2"
                                >
                                  <CheckCircle size={18} /> Confirm
                                </button>
                              )}
                              {res.status !== "cancelled" && (
                                <button
                                  onClick={() => updateStatus("reservations", res.id, "cancelled")}
                                  className="flex-1 py-3 border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-xl font-bold transition flex items-center justify-center gap-2"
                                >
                                  <XCircle size={18} /> Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : activeTab === "products" ? (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                      <div className="w-full md:w-96 relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                          placeholder="Search menu items..."
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-red-500 outline-none transition-all shadow-sm"
                        />
                      </div>
                      <button
                        onClick={openAddProduct}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-600/20 whitespace-nowrap"
                      >
                        <Plus size={20} />
                        Add New Item
                      </button>
                    </div>

                    {filteredProducts.length === 0 ? (
                      <div className="bg-white rounded-3xl p-20 text-center border border-slate-200 shadow-sm">
                        <Package className="mx-auto text-slate-200 mb-6" size={60} />
                        <h3 className="text-xl font-bold text-slate-800">No products found</h3>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className={`group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${!product.isAvailable ? 'opacity-75 grayscale-[0.5]' : ''}`}
                          >
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon size={48} className="text-slate-300" />
                                </div>
                              )}
                              <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-lg">
                                  {product.category}
                                </span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openEditProduct(product)}
                                    className="w-9 h-9 bg-white/90 backdrop-blur-md text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white shadow-lg transition-all"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="w-9 h-9 bg-white/90 backdrop-blur-md text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white shadow-lg transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                              {!product.isAvailable && (
                                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[2px]">
                                  <span className="bg-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] text-slate-900 shadow-2xl">
                                    Sold Out
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-red-600 transition-colors">
                                  {product.name}
                                </h3>
                                <div className="text-right">
                                  <span className="text-xl font-black text-slate-900">
                                    Rs {product.price.toFixed(0)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">
                                {product.description}
                              </p>

                              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                  {product.isSpecialty && (
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center" title="Specialty">
                                      <Plus size={16} />
                                    </div>
                                  )}
                                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                    product.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                  }`}>
                                    {product.isAvailable ? 'Live' : 'Hidden'}
                                  </span>
                                </div>
                                
                                <button
                                  onClick={() => toggleProductAvailability(product.id, !product.isAvailable)}
                                  disabled={updatingProductId === product.id}
                                  className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                                    product.isAvailable
                                      ? "text-rose-600 hover:bg-rose-50"
                                      : "text-emerald-600 hover:bg-emerald-50"
                                  } disabled:opacity-30`}
                                >
                                  {updatingProductId === product.id ? (
                                    <RefreshCw size={14} className="animate-spin" />
                                  ) : product.isAvailable ? (
                                    "Disable"
                                  ) : (
                                    "Enable"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">Visual Gallery</h3>
                        <p className="text-slate-400 font-medium">Manage images for your customers to see.</p>
                      </div>
                      <button
                        onClick={() => setIsGalleryModalOpen(true)}
                        className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
                      >
                        <Plus size={20} />
                        Upload Image
                      </button>
                    </div>

                    {galleryItems.length === 0 ? (
                      <div className="bg-white rounded-3xl p-20 text-center border border-slate-200 shadow-sm">
                        <ImageIcon className="mx-auto text-slate-200 mb-6" size={60} />
                        <h3 className="text-xl font-bold text-slate-800">Gallery is empty</h3>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {galleryItems.map((item) => (
                          <div
                            key={item.id}
                            className="group relative aspect-square bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm"
                          >
                            <img
                              src={item.url}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              alt="Gallery"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 p-4">
                              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/30">
                                {item.category}
                              </span>
                              <button
                                onClick={() => handleDeleteGalleryItem(item.id)}
                                className="w-12 h-12 bg-white text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-2xl transform translate-y-4 group-hover:translate-y-0 duration-300"
                                title="Delete Image"
                              >
                                <Trash2 size={24} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Modals with enhanced styling */}
      <AnimatePresence>
        {(isProductModalOpen || isGalleryModalOpen) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsProductModalOpen(false);
                setIsGalleryModalOpen(false);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            {isProductModalOpen && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-3xl overflow-hidden"
              >
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                      {editingProduct ? "Refine Product" : "New Menu Entry"}
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">Capture details for your digital menu</p>
                  </div>
                  <button
                    onClick={() => setIsProductModalOpen(false)}
                    className="w-12 h-12 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl flex items-center justify-center transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Identity</label>
                      <input
                        required
                        type="text"
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-slate-800"
                        placeholder="Kung Pao Chicken"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Group</label>
                      <select
                        value={productFormData.category}
                        onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-red-500 outline-none transition-all bg-white font-bold text-slate-800 appearance-none shadow-sm cursor-pointer"
                      >
                        {categories.filter((c) => c.id !== "all").map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Flavor Description</label>
                    <textarea
                      required
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-red-500 outline-none transition-all h-24 resize-none font-medium text-slate-600 leading-relaxed"
                      placeholder="Describe the aromatic profiles..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (Rs)</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={productFormData.price}
                        onChange={(e) => setProductFormData({ ...productFormData, price: parseFloat(e.target.value) })}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-red-500 outline-none transition-all font-black text-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Spice (0-3)</label>
                      <input
                        type="number"
                        min="0"
                        max="3"
                        value={productFormData.spiceLevel}
                        onChange={(e) => setProductFormData({ ...productFormData, spiceLevel: parseInt(e.target.value) })}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-red-500 outline-none transition-all font-black text-slate-800"
                      />
                    </div>
                    <div className="flex items-center h-full pt-6">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={productFormData.isVegetarian}
                          onChange={(e) => setProductFormData({ ...productFormData, isVegetarian: e.target.checked })}
                          className="w-6 h-6 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                        />
                        <span className="text-xs font-black text-slate-600 group-hover:text-emerald-600 transition-colors uppercase tracking-widest">Veggie</span>
                      </label>
                    </div>
                    <div className="flex items-center h-full pt-6">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={productFormData.isSpecialty}
                          onChange={(e) => setProductFormData({ ...productFormData, isSpecialty: e.target.checked })}
                          className="w-6 h-6 rounded-lg border-slate-300 text-amber-500 focus:ring-amber-400 transition-all cursor-pointer"
                        />
                        <span className="text-xs font-black text-slate-600 group-hover:text-amber-500 transition-colors uppercase tracking-widest">Specialty</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Asset</label>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-40 h-40 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 group hover:border-red-500 transition-all">
                        {productFormData.image ? (
                          <img src={productFormData.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={32} className="text-slate-300 group-hover:text-red-500 transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center gap-3">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                        <label
                          htmlFor="image-upload"
                          className={`flex items-center justify-center gap-3 px-8 py-5 border-2 border-slate-100 bg-slate-50 rounded-2xl cursor-pointer hover:bg-white hover:border-red-500 hover:shadow-xl hover:shadow-red-500/5 transition-all group ${
                            isUploading ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          {isUploading ? <RefreshCw size={24} className="animate-spin text-red-600" /> : <Upload size={24} className="text-slate-400 group-hover:text-red-600" />}
                          <div className="text-left">
                            <span className="block text-sm font-black text-slate-800">Select Image File</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">JPG, PNG, WebP up to 5MB</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    disabled={isSavingProduct}
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSavingProduct && <RefreshCw size={18} className="animate-spin" />}
                    {editingProduct ? "Finalize Updates" : "Commit to Menu"}
                  </button>
                </div>
              </motion.div>
            )}

            {isGalleryModalOpen && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden"
              >
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Add to Gallery</h2>
                  <button
                    onClick={() => setIsGalleryModalOpen(false)}
                    className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveGalleryItem} className="p-10 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Photo Context</label>
                    <select
                      value={galleryFormData.category}
                      onChange={(e) => setGalleryFormData({ ...galleryFormData, category: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-red-500 outline-none transition-all font-bold text-slate-800 bg-white"
                    >
                      <option value="food">Food & Cuisine</option>
                      <option value="interior">Dining Space</option>
                      <option value="events">Special Events</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Asset</label>
                    <div className="flex flex-col gap-6">
                      <div className="w-full aspect-video bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 group hover:border-red-500 transition-all">
                        {galleryFormData.url ? (
                          <img src={galleryFormData.url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={32} className="text-slate-300" />
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleGalleryImageUpload} className="hidden" id="gallery-upload" />
                      <label
                        htmlFor="gallery-upload"
                        className={`flex items-center justify-center gap-3 px-8 py-5 border-2 border-slate-100 bg-slate-50 rounded-2xl cursor-pointer hover:bg-white hover:border-red-500 hover:shadow-xl transition-all ${
                          isUploading ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        {isUploading ? <RefreshCw size={24} className="animate-spin text-red-600" /> : <Upload size={24} className="text-slate-400" />}
                        <span className="text-sm font-black text-slate-800">Choose Masterpiece</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsGalleryModalOpen(false)}
                      className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingGallery || !galleryFormData.url}
                      className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isSavingGallery && <RefreshCw size={18} className="animate-spin" />}
                      Save to Gallery
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
