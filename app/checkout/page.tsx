"use client";

import { useState } from "react";
import { CartItem, useCart } from "../context/CartContext";
import PageHeader from "../components/PageHeader";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CreditCard, Truck, ShieldCheck, CheckCircle2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [isOrdered, setIsOrdered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [placedItems, setPlacedItems] = useState<CartItem[]>([]);
  const [placedTotal, setPlacedTotal] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocationLoading(false);
        setFormErrors(prev => ({...prev, location: ""}));
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please ensure location permissions are granted.");
        setIsLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors: Record<string, string> = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Pakistan Phone validation (03xx-xxxxxxx or +923xx-xxxxxxx)
    const cleanPhone = formData.phone.replace(/[-\s]/g, "");
    const pakistanPhoneRegex = /^((\+92)|(0))3\d{9}$/;
    if (!pakistanPhoneRegex.test(cleanPhone)) {
      errors.phone = "Invalid Pakistan number. Use 03XXXXXXXXX or +923XXXXXXXXX";
    }

    // Enforce location
    if (!coordinates) {
      errors.location = "Please provide your current location for accurate delivery.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.getElementById(firstError);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setFormErrors({});
    setIsLoading(true);

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: formData.address,
          notes: formData.notes,
          coordinates: coordinates ? `${coordinates.lat},${coordinates.lng}` : null,
          items: cart,
          total_price: totalPrice,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to place order.");
      }

      setPlacedOrderId(payload.data?.id || "");
      setPlacedItems(cart);
      setPlacedTotal(totalPrice);
      setIsOrdered(true);
      clearCart();

      // Save order details for easier tracking if user forgets
      if (payload.data?.id) {
        // Handle multiple recent orders in storage
        const existingOrders = JSON.parse(localStorage.getItem("recentOrderIds") || "[]");
        const updatedOrders = [payload.data.id, ...existingOrders].slice(0, 5); // Keep last 5
        localStorage.setItem("recentOrderIds", JSON.stringify(updatedOrders));
        localStorage.setItem("lastOrderId", payload.data.id); // For legacy/compatibility
        localStorage.setItem("lastOrderPhone", formData.phone);
      }

      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("There was an error placing your order. Please try again or call us.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order, <span className="font-semibold text-gray-900">{formData.name}</span>. 
            We've received your request and our chefs are starting to prepare your authentic Chinese meal.
          </p>
          <div className="bg-red-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-bold text-red-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-red-700 space-y-2">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>You'll receive a confirmation call shortly.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Preparation time: 20-30 minutes.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Your food will be delivered fresh and hot.</span>
              </li>
            </ul>
          </div>

          {placedOrderId && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200 text-left">
              <p className="text-xs uppercase tracking-wider text-gray-500">Order ID</p>
              <p className="text-sm font-bold text-gray-900 break-all">{placedOrderId}</p>
              <p className="text-xs text-gray-500 mt-1">
                Save this ID and your phone number to track your order status.
              </p>
            </div>
          )}
          
          <div className="flex flex-col gap-4">
            {placedOrderId && (
              <Link
                href={`/track-order?orderId=${encodeURIComponent(placedOrderId)}`}
                className="inline-block w-full bg-red-700 text-white py-4 rounded-xl font-bold hover:bg-red-800 transition"
              >
                Track My Order
              </Link>
            )}
            
            <Link
              href="/"
              className="inline-block w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              Return to Home
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main>
        <PageHeader 
          title="Checkout"
          description="Complete your order and enjoy authentic Chinese flavors at your doorstep"
          backgroundImage="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop"
        />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck size={48} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any delicious items to your order yet.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-red-700 text-white px-8 py-3 rounded-full font-bold hover:bg-red-800 transition"
          >
            <ChevronLeft size={20} /> Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <PageHeader 
        title="Checkout"
        description="Complete your order and enjoy authentic Chinese flavors at your doorstep"
        backgroundImage="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <Link href="/menu" className="inline-flex items-center gap-2 text-gray-600 hover:text-red-700 mb-8 transition-colors font-medium">
          <ChevronLeft size={20} /> Back to Menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 bg-red-50/30">
                <h2 className="text-2xl font-bold text-gray-900">Delivery Details</h2>
                <p className="text-gray-600 text-sm">Please provide your information for the order</p>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-gray-700">Full Name</label>
                    <input
                      required
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-bold text-gray-700">Phone Number</label>
                    <input
                      required
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (234) 567-890"
                      className={`w-full px-4 py-3 rounded-xl border ${formErrors.phone ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700/20'} outline-none transition-all`}
                    />
                    {formErrors.phone && <p className="text-rose-500 text-xs font-medium mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-gray-700">Email Address</label>
                  <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 rounded-xl border ${formErrors.email ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700/20'} outline-none transition-all`}
                  />
                  {formErrors.email && <p className="text-rose-500 text-xs font-medium mt-1">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="address" className="text-sm font-bold text-gray-700">Delivery Address</label>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isLocationLoading}
                      className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        coordinates 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {isLocationLoading ? (
                        <div className="w-3 h-3 border-2 border-red-700/30 border-t-red-700 rounded-full animate-spin" />
                      ) : coordinates ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Truck size={14} />
                      )}
                      {coordinates ? "Location Captured" : "Get My Current Location"}
                    </button>
                  </div>
                  <textarea
                    required
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street, Apartment, City, State, Zip"
                    className={`w-full px-4 py-3 rounded-xl border ${formErrors.location ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700/20'} outline-none transition-all`}
                  />
                  {formErrors.location && <p className="text-rose-500 text-xs font-medium mt-1">{formErrors.location}</p>}
                  <p className="text-[10px] text-gray-500 italic">
                    Sharing your location helps our riders find you faster in your local area.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-bold text-gray-700">Order Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Special requests, allergies, etc."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700/20 outline-none transition-all"
                  />
                </div>

                <div className="pt-4">
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 mb-8">
                    <ShieldCheck className="text-yellow-700 shrink-0 mt-0.5" size={20} />
                    <p className="text-xs text-yellow-800">
                      Payment will be collected at the time of delivery (Cash or Card). Your information is secure and used only for order processing.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-red-700/20 flex items-center justify-center gap-2 ${
                      isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-800"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      `Place My Order (Rs ${totalPrice.toFixed(2)})`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-32">
              <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                  {cart.map((item) => (
                    <div key={item.name} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm font-bold text-red-700">Rs {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-900 text-xl font-bold pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span>Rs {totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 text-gray-500 text-xs">
                    <Truck size={16} className="text-red-700" />
                    <span>Estimated Delivery: 20-30 mins</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 text-xs">
                    <CreditCard size={16} className="text-red-700" />
                    <span>Pay on Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
