"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/track-order", label: "Track Order" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-700 text-white rounded-full flex items-center justify-center shadow-md shrink-0">
              <UtensilsCrossed size={22} />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-2xl md:text-3xl font-bold text-red-700 font-serif leading-none mt-1">
                RABI
              </span>
              <span className="text-[0.65rem] md:text-xs tracking-widest text-yellow-600 font-semibold mt-1">
                CHINESE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-red-700 font-medium transition duration-300 text-sm uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-gray-700 hover:text-red-700 transition duration-300 group"
              aria-label="View Cart"
            >
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-red-700 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                  {totalItems}
                </span>
              )}
            </button>
            <div className="h-8 w-px bg-gray-200 mx-1"></div>
            <a
              href="tel:+1234567890"
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-red-700 border-2 border-red-700 rounded-full hover:bg-red-700 hover:text-white transition duration-300 whitespace-nowrap"
            >
              <Phone size={18} />
              <span className="text-sm font-bold">Call</span>
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center px-6 py-2.5 bg-red-700 text-white rounded-full font-bold hover:bg-red-800 transition duration-300 whitespace-nowrap shadow-sm hover:shadow-md"
            >
              Reserve
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-red-700 transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-red-700 font-medium transition px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 flex flex-col gap-3 pt-4 pb-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-100 text-gray-900 rounded-full font-bold hover:bg-gray-200 transition"
                >
                  <ShoppingBag size={20} />
                  View Cart ({totalItems})
                </button>
                <a
                  href="tel:+1234567890"
                  className="flex items-center justify-center gap-2 px-6 py-3 text-red-700 border-2 border-red-700 rounded-full hover:bg-red-700 hover:text-white transition text-sm font-bold whitespace-nowrap"
                >
                  <Phone size={18} />
                  Call Us
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center px-6 py-3 bg-red-700 text-white rounded-full font-bold hover:bg-red-800 transition whitespace-nowrap text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reserve Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
