"use client";

import { useMemo, useState } from "react";
import DishCard from "../components/DishCard";
import SectionDivider from "../components/SectionDivider";
import PageHeader from "../components/PageHeader";
import CallToAction from "../components/CallToAction";
import { motion } from "framer-motion";
import { Leaf, Flame } from "lucide-react";
import { categories, menuItems } from "@/lib/menuData";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterSpicy, setFilterSpicy] = useState(false);

  const filteredItems = useMemo(
    () =>
      menuItems.filter((item) => {
        const categoryMatch =
          activeCategory === "all" ||
          (activeCategory === "specialties"
            ? item.isSpecialty
            : item.category === activeCategory);
        const vegMatch = !filterVeg || item.isVegetarian;
        const spicyMatch = !filterSpicy || item.spiceLevel > 0;
        return categoryMatch && vegMatch && spicyMatch;
      }),
    [activeCategory, filterVeg, filterSpicy]
  );

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
          {/* Category pills */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2.5 pb-4 px-2 -mx-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-red-700 text-white shadow-md shadow-red-700/25"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary filters */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <button
              onClick={() => setFilterVeg((v) => !v)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                filterVeg
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"
              }`}
            >
              <Leaf size={16} /> Vegetarian
            </button>
            <button
              onClick={() => setFilterSpicy((v) => !v)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                filterSpicy
                  ? "bg-red-700 text-white border-red-700 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-red-400"
              }`}
            >
              <Flame size={16} /> Spicy
            </button>
            <span className="ml-auto text-sm text-gray-400 font-medium">
              {filteredItems.length} dish{filteredItems.length === 1 ? "" : "es"}
            </span>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <DishCard key={item.name} {...item} />
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
        description="Reserve your table or get in touch to enjoy our delicious dishes"
        primaryButtonText="Reserve a Table"
        primaryButtonHref="/contact"
        secondaryButtonText="About Us"
        secondaryButtonHref="/about"
        backgroundImage="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop"
      />
    </main>
  );
}
