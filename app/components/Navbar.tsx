"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { siteConfig } from "../../lib/siteConfig";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/70 shadow-[0_1px_20px_-12px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-700/25 shrink-0 ring-1 ring-white/40">
              <UtensilsCrossed size={22} />
            </div>
            <div className="flex flex-col whitespace-nowrap leading-none">
              <span className="text-2xl md:text-[1.7rem] font-bold text-red-700 font-serif leading-none">
                RABI
              </span>
              <span className="text-[0.6rem] md:text-[0.65rem] tracking-[0.3em] text-yellow-600 font-semibold mt-1">
                CHINESE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-stone-600 hover:text-red-700 font-medium transition-colors duration-300 text-[0.8rem] uppercase tracking-wide after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-yellow-500 after:transition-all after:duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-stone-600 hover:text-red-700 transition duration-300 group"
              aria-label="View Cart"
            >
              <ShoppingBag size={23} />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-red-700 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                  {totalItems}
                </span>
              )}
            </button>
            <div className="h-7 w-px bg-stone-200"></div>
            <a
              href={siteConfig.phoneHref}
              className="hidden xl:flex items-center justify-center gap-2 px-4 py-2.5 text-red-700 border border-red-200 rounded-full hover:bg-red-50 transition duration-300 whitespace-nowrap"
            >
              <Phone size={17} />
              <span className="text-sm font-semibold">Call</span>
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-red-700/30 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
            >
              Reserve
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-stone-700 hover:text-red-700 transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200">
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
                  href={siteConfig.phoneHref}
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
