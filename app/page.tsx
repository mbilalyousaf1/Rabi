"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroSection from "./components/HeroSection";
import DishCard from "./components/DishCard";
import ReviewCard from "./components/ReviewCard";
import SectionDivider from "./components/SectionDivider";
import CallToAction from "./components/CallToAction";
import { MapPin, Phone, Clock, ChevronRight } from "lucide-react";
import { menuItems } from "@/lib/menuData";
import { siteConfig } from "@/lib/siteConfig";

export default function Home() {
  const specialties = menuItems.filter((item) => item.isSpecialty).slice(0, 4);

  const reviews = [
    {
      name: "Sarah Chen",
      rating: 5,
      comment:
        "Absolutely authentic! The flavors transported me back to Beijing. Exceptional service and presentation.",
    },
    {
      name: "Marcus Johnson",
      rating: 5,
      comment:
        "Best Chinese food in town. Every dish feels handcrafted with love. Highly recommend the Peking Duck!",
    },
    {
      name: "Elena Rodriguez",
      rating: 5,
      comment:
        "Fresh ingredients, traditional recipes, modern ambiance. Everything was perfect. Can't wait to return!",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <HeroSection
        title="Rabi Chinese Restaurant"
        subtitle="Authentic Flavors, Handcrafted Excellence, Wok-Fresh Tradition"
        backgroundImage="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=800&fit=crop"
        ctas={[
          { label: "Order Now", href: "/menu", variant: "primary" },
          { label: "View Menu", href: "/menu", variant: "secondary" },
        ]}
      />

      {/* Restaurant Intro */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-chinese font-bold text-gray-900 mb-4">
              Welcome to Rabi Chinese 
            </h2>
            <div className="inline-block h-1 w-16 bg-red-700 mb-6"></div>
          </div>

          <p className="text-lg md:text-xl text-gray-800 text-center leading-relaxed mb-6 font-chinese tracking-wide">
            Experience the authentic taste of China brought to life through generations of
            culinary excellence. Our head chef, Master Wang, combines traditional cooking
            techniques with premium seasonal ingredients to create unforgettable dining
            experiences.
          </p>

          <p className="text-lg md:text-xl text-gray-800 text-center leading-relaxed font-chinese tracking-wide">
            Every dish is crafted with passion and precision. From our signature Peking Duck
            to hand-pulled noodles, we honor centuries of Chinese culinary tradition while
            embracing modern presentation and service.
          </p>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Featured Dishes */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Chef's Specialties
            </h2>
            <p className="text-gray-600">
              Handpicked dishes that showcase our culinary excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14 md:mb-16">
            {specialties.map((dish) => (
              <DishCard key={dish.name} {...dish} />
            ))}
          </div>

          <div className="h-px w-full max-w-xl mx-auto bg-gradient-to-r from-transparent via-red-300 to-transparent mb-8 md:mb-10"></div>

          <div className="text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-red-700 text-white px-8 py-3 rounded font-semibold hover:bg-red-800 transition"
            >
              Explore Full Menu <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Customer Reviews */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Guest Reviews
            </h2>
            <p className="text-gray-600">
              Hear what our valued customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <ReviewCard key={idx} index={idx} {...review} />
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Hours & Info */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Hours */}
            <div className="card text-center">
              <Clock className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hours</h3>
              <ul className="space-y-2 text-gray-600">
                {siteConfig.hours.map((h) => (
                  <li key={h.day}>
                    <span className="font-semibold">{h.day}:</span> {h.time}
                  </li>
                ))}
              </ul>
            </div>

            {/* Phone */}
            <div className="card text-center">
              <Phone className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-600 mb-3">
                <span className="font-semibold">Phone:</span>
              </p>
              <a
                href={siteConfig.phoneHref}
                className="text-red-700 font-bold text-lg hover:text-red-800"
              >
                {siteConfig.phoneDisplay}
              </a>
              <p className="text-gray-600 mt-3 text-sm">
                <span className="font-semibold">WhatsApp:</span> {siteConfig.phoneDisplay}
              </p>
            </div>

            {/* Location */}
            <div className="card text-center">
              <MapPin className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
              <p className="text-gray-600 mb-4">
                {siteConfig.address.line1}
                <br />
                {siteConfig.address.line2}
                <br />
                {siteConfig.address.line3}
              </p>
              <Link
                href="/contact"
                className="text-red-700 font-semibold hover:text-red-800"
              >
                Get Directions →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Map Section */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            Find Us
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
        </div>
      </section>

      {/* Visual separator before CTA */}
      <div className="w-full bg-white flex justify-center py-8">
        <div className="h-2 w-24 rounded-full bg-gray-200"></div>
      </div>

      {/* CTA Section */}
      <CallToAction />

      {/* Footer breathing room */}
      <div className="h-10 md:h-14 bg-white" aria-hidden="true"></div>
    </main>
  );
}
