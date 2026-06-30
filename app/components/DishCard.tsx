"use client";

import { Flame, Leaf, Star } from "lucide-react";
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="card group overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 md:h-56 mb-4 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {isSpecialty && (
          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
            <Star size={10} fill="currentColor" /> Chef's Special
          </span>
        )}
        {isVegetarian && (
          <span className="badge badge-veg flex items-center gap-1 text-xs">
            <Leaf size={12} /> Vegetarian
          </span>
        )}
        {spiceLevel > 0 && (
          <span className="badge badge-spicy flex items-center gap-1 text-xs">
            {[...Array(spiceLevel)].map((_, i) => (
              <Flame key={i} size={12} />
            ))}
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-700 transition-colors duration-300">
        {name}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <span className="text-xl font-bold text-red-700">Rs {price.toFixed(2)}</span>
        <button 
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={`font-semibold px-4 py-1.5 rounded-full border transition-all duration-300 text-sm shadow-sm ${
            isAvailable
              ? "text-red-700 hover:text-white bg-transparent hover:bg-red-700 border-red-700/30 hover:shadow-md"
              : "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
          }`}
        >
          {isAvailable ? "Add" : "Unavailable"}
        </button>
      </div>
    </motion.div>
  );
}
