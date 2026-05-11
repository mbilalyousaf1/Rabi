"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

interface CallToActionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  backgroundImage?: string;
}

export default function CallToAction({
  title = "Ready to Experience Authentic Chinese Cuisine?",
  description = "Join us for an unforgettable dining experience",
  primaryButtonText = "Browse Menu",
  primaryButtonHref = "/menu",
  secondaryButtonText = "Make a Reservation",
  secondaryButtonHref = "/contact",
  backgroundImage = "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=600&fit=crop",
}: CallToActionProps) {
  return (
    <section className="w-full bg-transparent px-4 sm:px-6 lg:px-8" style={{ marginTop: 'clamp(3rem, 6vw, 6rem)', marginBottom: 'clamp(3rem, 6vw, 6rem)' }}>
      <div className="w-full max-w-screen-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-red-900 text-white shadow-2xl"
        >
          {/* Background Image with Red Overlay */}
          <div className="absolute inset-0 z-0 bg-red-950">
            <Image
              src={backgroundImage}
              alt="Background"
              fill
              className="object-cover opacity-30 mix-blend-multiply"
            />
            {/* Premium red gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-800/90 via-red-900/95 to-black/90"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20 md:py-28 text-center flex flex-col items-center">
            <p className="inline-flex items-center rounded-full border border-red-400/30 bg-red-950/50 px-4 sm:px-5 py-1.5 sm:py-2 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.16em] text-red-100 mb-6 backdrop-blur-md shadow-sm">
              Your Table Awaits
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 sm:mb-6 text-white drop-shadow-md leading-tight">
              {title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-red-100 mb-8 sm:mb-10 max-w-3xl mx-auto font-medium">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              {primaryButtonText && primaryButtonHref && (
                <Link
                  href={primaryButtonHref}
                  className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-red-800 rounded-full font-bold hover:bg-gray-100 transition shadow-lg hover:shadow-xl hover:-translate-y-1 text-base sm:text-lg"
                >
                  {primaryButtonText}
                </Link>
              )}
              {secondaryButtonText && secondaryButtonHref && (
                <Link
                  href={secondaryButtonHref}
                  className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 border-2 border-white/80 text-white rounded-full font-bold hover:bg-white hover:text-red-900 transition shadow-lg hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm text-base sm:text-lg"
                >
                  {secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
