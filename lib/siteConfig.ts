// Central place for all static site details. Edit these to rebrand the site.
export const siteConfig = {
  name: "Rabi Chinese Restaurant",
  shortName: "Rabi",
  tagline: "Authentic Flavors, Handcrafted Excellence",

  // Contact — used across the site and for WhatsApp ordering/reservations.
  phoneDisplay: "+1 (234) 567-890",
  phoneHref: "tel:+1234567890",
  // WhatsApp number in international format, digits only (no +, spaces or dashes).
  whatsapp: "1234567890",
  email: "info@rabichinese.com",

  address: {
    line1: "123 Main Street",
    line2: "Downtown District",
    line3: "City, State 12345",
  },

  hours: [
    { day: "Mon - Thu", time: "11:00 AM - 10:00 PM" },
    { day: "Fri - Sat", time: "11:00 AM - 11:00 PM" },
    { day: "Sunday", time: "12:00 PM - 10:00 PM" },
  ],

  social: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
  },

  // Google Maps embed URL (replace with your real location embed).
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d-74.0!3d40.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzI1LjYiTiA3NMKwMDAnNDguMCJX!5e0!3m2!1sen!2sus!4v1234567890",
};

// Build a WhatsApp deep link with a pre-filled message.
export function whatsappLink(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
