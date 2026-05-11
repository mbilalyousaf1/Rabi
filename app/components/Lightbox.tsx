"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxProps {
  images: string[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function Lightbox({
  images,
  isOpen,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>

      {/* Image Container */}
      <div className="relative w-full h-full flex items-center justify-center px-4">
        <div className="relative w-full max-w-4xl h-96 md:h-screen max-h-screen">
          <Image
            src={images[currentIndex]}
            alt="Gallery Image"
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={onPrevious}
        className="absolute left-4 text-white hover:text-gray-300 transition"
        aria-label="Previous image"
      >
        <ChevronLeft size={40} />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 text-white hover:text-gray-300 transition"
        aria-label="Next image"
      >
        <ChevronRight size={40} />
      </button>

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
