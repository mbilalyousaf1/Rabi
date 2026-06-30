"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { siteConfig } from "../../lib/siteConfig";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-100 mt-24 pb-24">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex flex-col gap-2 mb-4">
              <span className="text-2xl font-bold text-yellow-500 font-serif">
                RABI
              </span>
              <span className="text-xs tracking-widest text-yellow-600 font-semibold">
                CHINESE CUISINE
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Authentic Chinese flavors crafted with tradition and modern flair.
              Experience culinary excellence with every dish.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/menu", label: "Menu" },
                { href: "/about", label: "About Us" },
                { href: "/gallery", label: "Gallery" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-500 transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Hours
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {siteConfig.hours.map((h) => (
                <li key={h.day} className="flex gap-2">
                  <Clock size={16} className="flex-shrink-0 mt-0.5 text-yellow-500" />
                  <div>
                    <div className="font-semibold text-white">{h.day}:</div>
                    <div>{h.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2 text-gray-400">
                <Phone size={16} className="flex-shrink-0 mt-0.5 text-yellow-500" />
                <a href={siteConfig.phoneHref} className="hover:text-yellow-500 transition">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-2 text-gray-400">
                <Mail size={16} className="flex-shrink-0 mt-0.5 text-yellow-500" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-yellow-500 transition"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex gap-2 text-gray-400">
                <MapPin size={16} className="flex-shrink-0 mt-0.5 text-yellow-500" />
                <span>{`${siteConfig.address.line1}, ${siteConfig.address.line3}`}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href={siteConfig.social.facebook}
              className="text-gray-400 hover:text-yellow-500 transition"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href={siteConfig.social.instagram}
              className="text-gray-400 hover:text-yellow-500 transition"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href={siteConfig.social.twitter}
              className="text-gray-400 hover:text-yellow-500 transition"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex gap-4 text-sm">
            <Link href="#" className="text-gray-400 hover:text-yellow-500 transition">
              Privacy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-yellow-500 transition">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
