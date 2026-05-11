"use client";

import { useEffect, useState } from "react";
import DishCard from "../components/DishCard";
import SectionDivider from "../components/SectionDivider";
import PageHeader from "../components/PageHeader";
import CallToAction from "../components/CallToAction";
import { motion } from "framer-motion";
import { categories, menuItems } from "@/lib/menuData";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterSpicy, setFilterSpicy] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
        });
        const payload = await response.json();
        setMenuItems(payload.data || []);
      } catch (error) {
        console.error("Failed to load menu:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const categoryMatch =
      activeCategory === "all" || 
      (activeCategory === "specialties" ? item.isSpecialty : item.category === activeCategory);
    const vegMatch = !filterVeg || item.isVegetarian;
    const spicyMatch = !filterSpicy || item.spiceLevel > 0;
    const availableMatch = item.isAvailable;
    return categoryMatch && vegMatch && spicyMatch && availableMatch;
  });

  return (
    <main>
      <PageHeader
        title="Our Menu"
        description="Explore our authentic selection of handcrafted Chinese dishes, prepared with the freshest ingredients and traditional techniques"
        backgroundImage="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop"
        showBack={true}
      />

      <SectionDivider />

      <section className="py-12 md:py-16 bg-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 pb-4 px-2 -mx-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition ${
                    activeCategory === cat.id
                      ? "bg-red-700 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-10">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterVeg}
                onChange={(e) => setFilterVeg(e.target.checked)}
                className="w-4 h-4 rounded accent-red-700"
              />
              <span className="text-gray-700 font-medium">Vegetarian Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterSpicy}
                onChange={(e) => setFilterSpicy(e.target.checked)}
                className="w-4 h-4 rounded accent-red-700"
              />
              <span className="text-gray-700 font-medium">Spicy Dishes</span>
            </label>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-700 rounded-full animate-spin"></div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <DishCard
                  key={item.id}
                  {...item}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No items match your filters. Please try different options.
              </p>
            </div>
          )}
        </motion.div>
      </section>

      <CallToAction
        title="Ready to Order?"
        description="Enjoy our delicious dishes at our restaurant or order for delivery"
        primaryButtonText="Order Now"
        primaryButtonHref="/menu"
        secondaryButtonText="Reserve a Table"
        secondaryButtonHref="/contact"
        backgroundImage="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop"
      />
    </main>
  );
}
