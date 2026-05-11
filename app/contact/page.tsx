"use client";

import { useState, FormEvent } from "react";
import SectionDivider from "../components/SectionDivider";
import PageHeader from "../components/PageHeader";
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { supabase } from "@/lib/supabase";

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from('reservations').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          reservation_date: formData.date,
          reservation_time: formData.time,
          guests: parseInt(formData.guests),
          message: formData.message,
          status: 'pending',
        }
      ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving reservation:", error);
      alert("There was an error saving your reservation. Please try again or call us.");
    } finally {
      setIsLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (234) 567-890",
      link: "tel:+1234567890",
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@rabiChinese.com",
      link: "mailto:info@rabiChinese.com",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      value: "+1 (234) 567-890",
      link: "https://wa.me/1234567890",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "123 Main Street, Downtown District, City, State 12345",
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
                      href={`https://wa.me/1234567890?text=${encodeURIComponent(
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
                      )}`}
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
                  <li className="flex justify-between">
                    <span className="font-semibold">Monday - Thursday:</span>
                    <span>11:00 AM - 10:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-semibold">Friday:</span>
                    <span>11:00 AM - 11:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-semibold">Saturday:</span>
                    <span>11:00 AM - 11:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-semibold">Sunday:</span>
                    <span>12:00 PM - 10:00 PM</span>
                  </li>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d-74.0!3d40.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzI1LjYiTiA3NMKwMDAnNDguMCJX!5e0!3m2!1sen!2sus!4v1234567890"
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
                123 Main Street
                <br />
                Downtown District
                <br />
                City, State 12345
              </p>
            </div>

            <div className="card">
              <Phone className="w-8 h-8 text-red-700 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <a
                href="tel:+1234567890"
                className="text-red-700 font-semibold hover:text-red-800"
              >
                +1 (234) 567-890
              </a>
            </div>

            <div className="card">
              <Mail className="w-8 h-8 text-red-700 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <a
                href="mailto:info@rabiChinese.com"
                className="text-red-700 font-semibold hover:text-red-800"
              >
                info@rabiChinese.com
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
