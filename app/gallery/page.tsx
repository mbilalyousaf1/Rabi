"use client";

import { useState } from "react";
import Image from "next/image";
import SectionDivider from "../components/SectionDivider";
import PageHeader from "../components/PageHeader";
import CallToAction from "../components/CallToAction";
import Lightbox from "../components/Lightbox";
import { UtensilsCrossed, Home, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { galleryImages } from "@/lib/galleryData";

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("food");

  const categories = [
    { id: "food", label: "Food", icon: UtensilsCrossed },
    { id: "interior", label: "Interior", icon: Home },
    { id: "events", label: "Events", icon: Calendar },
  ];

  // Get current images based on category
  const currentImages = galleryImages
    .filter((item) => item.category === activeCategory)
    .map((item) => item.url);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? currentImages.length - 1 : currentImageIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(
      currentImageIndex === currentImages.length - 1 ? 0 : currentImageIndex + 1
    );
  };

  return (
    <main>
      <PageHeader 
        title="Gallery"
        description="Explore the beauty of our dishes, ambiance, and special moments"
        backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop"
        showBack={true}
      />

      <SectionDivider />

      {/* Gallery */}
      <section className="py-12 md:py-16 bg-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Category Tabs */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setCurrentImageIndex(0);
                  }}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition ${
                    activeCategory === cat.id
                      ? "bg-red-700 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <Icon size={20} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Gallery Grid */}
          {currentImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentImages.map((image, idx) => (
                <div
                  key={idx}
                  className="relative h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                  onClick={() => openLightbox(idx)}
                >
                  <Image
                    src={image}
                    alt={`Gallery ${idx}`}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <div className="text-2xl">🔍</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No photos found in this category.
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={currentImages}
        isOpen={lightboxOpen}
        currentIndex={currentImageIndex}
        onClose={() => setLightboxOpen(false)}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />

      <SectionDivider />

      {/* CTA Section */}
      <CallToAction 
        title="Ready to Experience It Yourself?"
        description="Visit us and enjoy the ambiance, food, and hospitality captured in these photos"
        primaryButtonText="Make a Reservation"
        primaryButtonHref="/contact"
        backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop"
      />
    </main>
  );
}
