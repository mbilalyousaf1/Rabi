"use client";

import { Flame, Leaf, Star, Plus } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface DishCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
  spiceLevel?: number; // 0-3
  isVegetarian?: boolean;
  isAvailable?: boolean;
  isSpecialty?: boolean;
}

import { useCart } from "../context/CartContext";

export default function DishCard({
  name,
  description,
  price,
  image,
  spiceLevel = 0,
  isVegetarian = false,
  isAvailable = true,
  isSpecialty = false,
}: DishCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    addToCart({ name, price, image });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="card group overflow-hidden cursor-pointer flex flex-col p-0"
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden bg-stone-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        {/* Specialty ribbon */}
        {isSpecialty && (
          <span className="absolute top-3 left-3 bg-yellow-400/95 text-stone-900 px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider shadow-sm">
            <Star size={11} fill="currentColor" /> Chef&apos;s Special
          </span>
        )}

        {/* Dietary chips */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {isVegetarian && (
            <span className="bg-white/90 backdrop-blur text-emerald-700 w-7 h-7 rounded-full flex items-center justify-center shadow-sm" title="Vegetarian">
              <Leaf size={14} />
            </span>
          )}
          {spiceLevel > 0 && (
            <span className="bg-white/90 backdrop-blur text-red-600 px-2 h-7 rounded-full flex items-center gap-0.5 shadow-sm" title={`Spice level ${spiceLevel}`}>
              {[...Array(spiceLevel)].map((_, i) => (
                <Flame key={i} size={13} fill="currentColor" />
              ))}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-semibold text-stone-900 mb-1.5 group-hover:text-red-700 transition-colors duration-300">
          {name}
        </h3>
        <p className="text-sm text-stone-500 mb-5 line-clamp-2 flex-1">{description}</p>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-red-700">
            Rs {price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`inline-flex items-center gap-1.5 font-semibold pl-3 pr-4 py-2 rounded-full text-sm transition-all duration-300 ${
              isAvailable
                ? "bg-red-700 text-white hover:bg-red-800 hover:shadow-md hover:shadow-red-700/25 active:scale-95"
                : "text-stone-400 bg-stone-100 cursor-not-allowed"
            }`}
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
