"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import {
  Search,
  CircleDot,
  CheckCircle2,
  XCircle,
  ChefHat,
  Clock3,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

type TrackedOrder = {
  id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  created_at: string;
  customer_name: string;
  total_price: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
};

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [recentOrders, setRecentOrders] = useState<TrackedOrder[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const orderIdFromUrl = searchParams.get("orderId");
    if (orderIdFromUrl) {
      setOrderId(orderIdFromUrl);
    } else {
      // Check localStorage if not in URL
      const savedId = localStorage.getItem("lastOrderId");
      if (savedId) setOrderId(savedId);
    }

    const savedPhone = localStorage.getItem("lastOrderPhone");
    if (savedPhone) setPhone(savedPhone);

    // Check for multiple recent orders on this device
    const savedIds = JSON.parse(localStorage.getItem("recentOrderIds") || "[]");
    if (savedIds.length > 0 && !orderIdFromUrl) {
      // If we have saved IDs and no specific ID in URL, trigger a search for all of them
      // Or just pre-fill the most recent one
      setOrderId(savedIds[0]);
    }
  }, [searchParams]);

  const statusMeta = useMemo(() => {
    if (!order) return null;

    switch (order.status) {
      case "pending":
        return {
          label: "Pending",
          description: "We received your order and the owner will review it shortly.",
          tone: "bg-amber-50 text-amber-800 border-amber-200",
          icon: <Clock3 size={18} />,
        };
      case "confirmed":
        return {
          label: "Accepted",
          description: "Great news! Your order is accepted and being prepared.",
          tone: "bg-blue-50 text-blue-800 border-blue-200",
          icon: <CircleDot size={18} />,
        };
      case "completed":
        return {
          label: "Completed",
          description: "Your order has been completed. Enjoy your meal!",
          tone: "bg-emerald-50 text-emerald-800 border-emerald-200",
          icon: <CheckCircle2 size={18} />,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          description: "You have cancelled this order within the 10-minute window.",
          tone: "bg-gray-100 text-gray-800 border-gray-300",
          icon: <XCircle size={18} />,
        };
      case "rejected":
        return {
          label: "Rejected",
          description:
            "Your order was rejected by the restaurant. Please contact them for more info.",
          tone: "bg-rose-50 text-rose-800 border-rose-200",
          icon: <XCircle size={18} />,
        };
      default:
        return null;
    }
  }, [order]);

  const canCancel = useMemo(() => {
    if (!order || order.status !== "pending") return false;
    const createdAt = new Date(order.created_at).getTime();
    const now = Date.now();
    const tenMinutesInMs = 10 * 60 * 1000;
    return now - createdAt < tenMinutesInMs;
  }, [order]);

  const handleTrackOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    setOrder(null);

    try {
      const params = new URLSearchParams({
        orderId: orderId.trim(),
        phone: phone.trim(),
      });

      const response = await fetch(`/api/orders/status?${params.toString()}`, {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to track order right now.");
      }

      if (payload.isList) {
        setRecentOrders(payload.data || []);
        if (payload.data && payload.data.length === 0) {
          setErrorMessage("No recent orders found for this phone number.");
        }
      } else {
        setOrder(payload.data);
        setLastUpdatedAt(new Date());
        setRecentOrders([]);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to track order right now.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setIsCancelling(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, phone: phone.trim() }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to cancel order.");
      }

      alert("Order cancelled successfully.");
      // Refresh order data
      const params = new URLSearchParams({
        orderId: orderId.trim(),
        phone: phone.trim(),
      });
      const refreshRes = await fetch(`/api/orders/status?${params.toString()}`);
      const refreshPayload = await refreshRes.json();
      if (refreshRes.ok) {
        setOrder(refreshPayload.data);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    if (!order) return;
    if (!orderId.trim() || !phone.trim()) return;

    const intervalId = window.setInterval(async () => {
      try {
        setIsAutoRefreshing(true);
        const params = new URLSearchParams({
          orderId: orderId.trim(),
          phone: phone.trim(),
        });
        const response = await fetch(`/api/orders/status?${params.toString()}`, {
          cache: "no-store",
        });
        const payload = await response.json();

        if (!response.ok) {
          return;
        }

        setOrder(payload.data);
        setLastUpdatedAt(new Date());
      } catch {
        // Silent fail during background refresh.
      } finally {
        setIsAutoRefreshing(false);
      }
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [order, orderId, phone]);

  // Cancellation Timer Logic
  useEffect(() => {
    if (!order || order.status !== "pending") {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const createdAt = new Date(order.created_at).getTime();
      const now = Date.now();
      const tenMinutesInMs = 10 * 60 * 1000;
      const diff = tenMinutesInMs - (now - createdAt);
      return diff > 0 ? Math.floor(diff / 1000) : 0;
    };

    const initial = calculateTimeLeft();
    setTimeLeft(initial);

    if (initial <= 0) return;

    const timerId = window.setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        window.clearInterval(timerId);
      }
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [order]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader
        title="Track Your Order"
        description="Check if your order is accepted, pending, completed, or rejected"
        backgroundImage="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop"
      />

      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <Search size={20} className="text-red-700" />
            Find Your Order Status
          </h2>

          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="order-id" className="text-sm font-semibold text-gray-700">
                Order ID
              </label>
              <input
                id="order-id"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. 1ec0... UUID from confirmation"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700/20 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Use same number used at checkout"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700/20 outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                isLoading ? "bg-red-500 cursor-not-allowed" : "bg-red-700 hover:bg-red-800"
              }`}
            >
              {isLoading ? "Checking..." : orderId ? "Track Order" : "Find My Recent Orders"}
            </button>
            {!orderId && (
              <p className="text-center text-xs text-gray-500 mt-2">
                Order ID missing? Enter your phone number to find recent orders.
              </p>
            )}
          </form>
        </div>

        {/* Device History / Search Results */}
        {(recentOrders.length > 0 || (JSON.parse(localStorage.getItem("recentOrderIds") || "[]").length > 0 && !order)) && !order && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock3 size={18} className="text-red-700" />
              {recentOrders.length > 0 ? "Orders Found by Phone" : "Orders Saved on this Device"}
            </h3>
            <p className="text-sm text-gray-600">
              {recentOrders.length > 0 
                ? "We found these orders linked to your phone number." 
                : "We found these recent orders placed from this browser."}
            </p>
            <div className="space-y-3">
              {(recentOrders.length > 0 ? recentOrders : []).concat(
                recentOrders.length === 0 ? JSON.parse(localStorage.getItem("recentOrderIds") || "[]").map((id: string) => ({ id, isSaved: true })) : []
              ).map((ro: any) => (
                <button
                  key={ro.id}
                  onClick={async () => {
                    setOrderId(ro.id);
                    // If it's just a saved ID, we need to fetch its full data
                    if (ro.isSaved) {
                      setIsLoading(true);
                      try {
                        const params = new URLSearchParams({ orderId: ro.id, phone: phone });
                        const res = await fetch(`/api/orders/status?${params.toString()}`);
                        const payload = await res.json();
                        if (res.ok) {
                          setOrder(payload.data);
                          setLastUpdatedAt(new Date());
                        } else {
                          setErrorMessage(payload.error || "Order no longer exists.");
                        }
                      } finally {
                        setIsLoading(false);
                      }
                    } else {
                      setOrder(ro);
                      setLastUpdatedAt(new Date());
                    }
                    setRecentOrders([]);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50 transition text-left group"
                >
                  <div>
                    <p className="font-bold text-gray-900 truncate max-w-[150px]">
                      Order #{ro.id.split('-')[0]}...
                    </p>
                    {ro.created_at && (
                      <p className="text-[10px] text-gray-500 mt-1">
                        {new Date(ro.created_at).toLocaleDateString()} at {new Date(ro.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {ro.total_price && (
                      <p className="text-sm font-bold text-red-700">Rs {Number(ro.total_price).toFixed(2)}</p>
                    )}
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 group-hover:text-red-600 transition">Track Status →</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
            {errorMessage}
          </div>
        )}

        {order && statusMeta && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-4">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border uppercase tracking-wide ${statusMeta.tone}`}
            >
              {statusMeta.icon}
              {statusMeta.label}
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Hello {order.customer_name}, your order status is {statusMeta.label}.
            </h3>
            <p className="text-gray-600">{statusMeta.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">Order ID</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{order.id}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">Placed At</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">Total</p>
                <p className="text-sm font-semibold text-gray-900">
                  Rs {Number(order.total_price).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Items in this order
              </h4>
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {item.quantity}x
                      </span>
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      Rs {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-sm text-gray-500 flex items-center gap-2">
              <ChefHat size={16} className="text-red-700" />
              {isAutoRefreshing
                ? "Checking for updates..."
                : "Auto-refreshing every 7 seconds."}
            </div>
            {lastUpdatedAt && (
              <p className="text-xs text-gray-400">
                Last updated: {lastUpdatedAt.toLocaleTimeString()}
              </p>
            )}
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Clock3 size={16} className="text-gray-400" />
              Keep this page open to get live status changes.
            </div>

            {timeLeft !== null && timeLeft > 0 && (
              <div className="pt-4 border-t border-gray-100 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">
                    Changed your mind? You can cancel within:
                  </p>
                  <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-lg font-mono font-bold text-lg animate-pulse">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-bold hover:bg-rose-100 transition disabled:opacity-50"
                >
                  {isCancelling ? (
                    <>
                      <Clock3 size={18} className="animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle size={18} />
                      Cancel Order
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
