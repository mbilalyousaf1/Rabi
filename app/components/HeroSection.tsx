"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctas?: Array<{
    label: string;
    href: string;
    variant: "primary" | "secondary";
  }>;
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  ctas,
}: HeroSectionProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden ">
      {/* Background Image */}
      {backgroundImage && (
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={backgroundImage}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </motion.div>
      )}

      {/* Fallback gradient background */}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-gray-900 to-black z-0"></div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md font-light"
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTAs */}
          {ctas && (
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center mt-8">
              {ctas.map((cta, index) => (
                <Link
                  key={index}
                  href={cta.href}
                  className={`px-8 py-3.5 rounded-full font-semibold transition-all duration-300 cursor-pointer text-lg tracking-wide ${
                    cta.variant === "primary"
                      ? "bg-red-700 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:-translate-y-1"
                      : "border-2 border-white/80 text-white hover:bg-white hover:text-red-800 backdrop-blur-sm hover:-translate-y-1"
                  }`}
                >
                  {cta.label}
                </Link>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/70 rounded-full flex items-start justify-center p-2 backdrop-blur-sm">
            <div className="w-1.5 h-2.5 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
