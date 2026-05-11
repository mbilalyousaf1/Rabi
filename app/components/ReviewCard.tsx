"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface ReviewCardProps {
  name: string;
  rating: number; // 1-5
  comment: string;
  image?: string;
  index?: number;
}

export default function ReviewCard({
  name,
  rating,
  comment,
  image,
  index = 0,
}: ReviewCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(139, 0, 0, 0.1)" }}
      className="card"
    >
      {/* Rating */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={`${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-700 mb-4 italic leading-relaxed">&quot;{comment}&quot;</p>

      {/* Customer Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        {image && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex-shrink-0"></div>
        )}
        <div>
          <p className="font-semibold text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-500">Verified Customer</p>
        </div>
      </div>
    </motion.div>
  );
}
