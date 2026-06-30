"use client";

import { useState, FormEvent } from "react";
import SectionDivider from "../components/SectionDivider";
import PageHeader from "../components/PageHeader";
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig, whatsappLink } from "@/lib/siteConfig";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Static site: no backend. The reservation is confirmed via WhatsApp below.
    setSubmitted(true);
    setIsLoading(false);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      value: siteConfig.phoneDisplay,
      link: siteConfig.phoneHref,
    },
    {
      icon: Mail,
      title: "Email",
      value: siteConfig.email,
      link: `mailto:${siteConfig.email}`,
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      value: siteConfig.phoneDisplay,
      link: `https://wa.me/${siteConfig.whatsapp}`,
    },
    {
      icon: MapPin,
      title: "Location",
      value: `${siteConfig.address.line1}, ${siteConfig.address.line2}, ${siteConfig.address.line3}`,
      link: "#map",
    },
  ];

  return (
    <main>
      <PageHeader 
        title="Get in Touch"
        description="Have a question? Want to make a reservation? We'd love to hear from you"
        backgroundImage="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=400&fit=crop"
        showBack={true}
      />

      <SectionDivider />

      {/* Contact Methods */}
      <section className="py-12 md:py-16 bg-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <a
                  key={idx}
                  href={method.link}
                  target={method.link.startsWith("http") ? "_blank" : undefined}
                  rel={method.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="card text-center hover:border-red-700 hover:shadow-lg"
                >
                  <Icon className="w-12 h-12 text-red-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 font-medium break-all">{method.value}</p>
                </a>
              );
            })}
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Reservation Form & Hours */}
      <section className="py-12 md:py-16 bg-gray-50 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Reservation Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Make a Reservation
              </h2>
              <p className="text-gray-600 mb-8">
                Book your table in advance for the best experience. We look forward to
                serving you delicious authentic Chinese cuisine.
              </p>

              {submitted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-8 bg-green-50 border border-green-200 text-green-800 rounded-3xl text-center shadow-sm"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Reservation Received!</h3>
                  <p className="text-sm mb-6">
                    Thank you, {formData.name}! We've received your request for {formData.guests} guests on {formData.date} at {formData.time}.
                  </p>
                  
                  <div className="space-y-3">
                    <p className="text-xs text-green-700 font-medium uppercase tracking-wider">Recommended Action</p>
                    <a
                      href={whatsappLink(
                        `🪑 *New Table Reservation* 🪑\n\n` +
                        `*Customer Details:*\n` +
                        `👤 Name: ${formData.name}\n` +
                        `📞 Phone: ${formData.phone}\n` +
                        `📧 Email: ${formData.email}\n\n` +
                        `*Booking Details:*\n` +
                        `📅 Date: ${formData.date}\n` +
                        `⏰ Time: ${formData.time}\n` +
                        `👥 Guests: ${formData.guests}\n` +
                        `${formData.message ? `📝 Special Requests: ${formData.message}\n` : ""}\n` +
                        `Please confirm if this table is available!`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20"
                    >
                      <MessageSquare size={18} /> Confirm via WhatsApp
                    </a>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="text-sm text-green-700 font-semibold hover:underline"
                    >
                      Back to Form
                    </button>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-700"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-700"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-700"
                    placeholder="+1 (234) 567-890"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Number of Guests *
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-700"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-700"
                    placeholder="Any dietary restrictions or special occasions?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-red-700 text-white font-semibold py-3 rounded transition flex items-center justify-center gap-2 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-800"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    "Reserve Table"
                  )}
                </button>
              </form>
            </div>

            {/* Hours & Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Hours & Location
              </h2>

              {/* Hours */}
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
                  <Clock className="text-red-700" size={24} />
                  Operating Hours
                </h3>
                <ul className="space-y-3 text-gray-700">
                  {siteConfig.hours.map((h) => (
                    <li key={h.day} className="flex justify-between">
                      <span className="font-semibold">{h.day}:</span>
                      <span>{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Order CTA */}
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Want to Order?
                </h3>
                <p className="text-gray-700 mb-4">
                  Browse our menu and place an order for delivery or pickup
                </p>
                <Link
                  href="/menu"
                  className="inline-block w-full text-center bg-red-700 text-white font-semibold py-2 rounded hover:bg-red-800 transition"
                >
                  Order Now
                </Link>
              </div>

              {/* Special Notes */}
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Please Note
                </h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Reservations are recommended, especially on weekends</li>
                  <li>• Large parties (8+) may require advance notice</li>
                  <li>• Private dining rooms available for special occasions</li>
                  <li>• Takeout and delivery available daily</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Map */}
      <section id="map" className="py-12 md:py-16 bg-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            Location
          </h2>

          <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={siteConfig.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="card">
              <MapPin className="w-8 h-8 text-red-700 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600 text-sm">
                {siteConfig.address.line1}
                <br />
                {siteConfig.address.line2}
                <br />
                {siteConfig.address.line3}
              </p>
            </div>

            <div className="card">
              <Phone className="w-8 h-8 text-red-700 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <a
                href={siteConfig.phoneHref}
                className="text-red-700 font-semibold hover:text-red-800"
              >
                {siteConfig.phoneDisplay}
              </a>
            </div>

            <div className="card">
              <Mail className="w-8 h-8 text-red-700 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-red-700 font-semibold hover:text-red-800"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-gray-50 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Do you take walk-in customers?",
                a: "Yes, we welcome walk-in customers! However, we recommend making a reservation, especially on weekends, to ensure you get a table.",
              },
              {
                q: "Do you offer delivery?",
                a: "Yes! We offer delivery within our service area. Call us to place an order or visit our menu page to see all available options.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, cash, and mobile payment options. We also offer special discounts for cash payments.",
              },
              {
                q: "Can you accommodate dietary restrictions?",
                a: "Absolutely! Let us know your dietary requirements when making a reservation, and our chef will be happy to prepare special dishes for you.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
