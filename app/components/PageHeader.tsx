"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description: string;
  backgroundImage: string;
  showBack?: boolean;
}

export default function PageHeader({ title, description, backgroundImage, showBack = false }: PageHeaderProps) {
  return (
    <section className="relative bg-black text-white py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {showBack && (
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} /> Back
              </Link>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 drop-shadow-md">
            {title}
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl drop-shadow font-light">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
