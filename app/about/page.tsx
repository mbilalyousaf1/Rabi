"use client";

import Image from "next/image";
import SectionDivider from "../components/SectionDivider";
import PageHeader from "../components/PageHeader";
import CallToAction from "../components/CallToAction";
import { Award, Heart, Users, Leaf } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: "Fresh Ingredients",
      description:
        "We source premium, seasonal ingredients directly from trusted local and international suppliers to ensure authenticity and freshness.",
    },
    {
      icon: Heart,
      title: "Passion for Excellence",
      description:
        "Every dish is prepared with dedication and attention to detail, honoring traditional techniques passed down through generations.",
    },
    {
      icon: Users,
      title: "Family & Community",
      description:
        "We believe in bringing people together through food. Our restaurant is a gathering place where memories are created.",
    },
    {
      icon: Award,
      title: "Authentic Taste",
      description:
        "Our chef trained in Beijing and maintains 100% commitment to authentic Chinese culinary traditions and flavors.",
    },
  ];

  return (
    <main>
      <PageHeader 
        title="About Rabi"
        description="Preserving tradition, creating memories, one dish at a time"
        backgroundImage="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=400&fit=crop"
        showBack={true}
      />

      <SectionDivider />

      {/* Restaurant Story */}
      <section className="py-12 md:py-16 bg-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Founded in 2010, Rabi Chinese Restaurant was born from a passion to bring
                authentic Chinese cuisine to our community. What started as a small family
                operation has grown into a beloved dining destination, serving thousands of
                satisfied customers.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Our journey began when Chef Master Wang immigrated from Beijing, bringing with
                him centuries of culinary knowledge and a deep commitment to preserving
                authentic Chinese cooking traditions. He envisioned a place where people from
                all walks of life could experience the true flavors of different Chinese
                regions.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Today, we remain dedicated to our founding principles: quality ingredients,
                time-honored techniques, and warm hospitality. Every dish served at Rabi is a
                testament to our unwavering commitment to excellence.
              </p>
            </div>

            {/* Image */}
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=500&fit=crop"
                alt="Restaurant Interior"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Chef Introduction */}
      <section className="py-12 md:py-16 bg-gray-50 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:grid-cols-2">
            {/* Image */}
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl order-2 md:order-1">
              <Image
                src="https://images.unsplash.com/photo-1577003832033-d79740f4e2bc?w=600&h=500&fit=crop"
                alt="Chef Master Wang"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Text */}
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Master Chef Wang
              </h2>
              <div className="inline-block h-1 w-12 bg-red-700 mb-6"></div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Head Chef Master Wang brings over 35 years of culinary expertise and a deep
                passion for traditional Chinese cooking. Born and trained in Beijing, he has
                mastered the art of wok cooking and the delicate balance of flavors that define
                authentic Chinese cuisine.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Master Wang's philosophy is simple: respect the ingredients, honor the
                traditions, and cook with heart. He personally selects every main ingredient
                and oversees the preparation of our signature dishes to ensure they meet his
                exacting standards.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Under his guidance, our kitchen team has earned recognition for their culinary
                excellence and commitment to authenticity. Master Wang believes that great food
                is not just about taste – it's about creating an experience that brings people
                together.
              </p>
              <div className="pt-4">
                <p className="text-red-700 font-bold text-lg">
                  "Food is love made visible" – Master Wang
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Core Values */}
      <section className="py-12 md:py-16 bg-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Our Cooking Philosophy
            </h2>
            <p className="text-gray-600 text-lg">
              What guides every decision we make in our kitchen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="card">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Icon className="w-8 h-8 text-red-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Sourcing & Ingredients */}
      <section className="py-12 md:py-16 bg-gray-50 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1488479118519-79e2ea34c4d4?w=600&h=500&fit=crop"
                alt="Fresh Ingredients"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                Premium Ingredients
              </h2>
              <h3 className="text-xl font-semibold text-red-700 mb-3">Fresh & Authentic</h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                We believe that great food starts with great ingredients. That's why we only
                source the freshest, highest-quality ingredients from carefully selected
                suppliers who share our commitment to excellence.
              </p>

              <h3 className="text-xl font-semibold text-red-700 mb-3 mt-6">
                Local & Sustainable
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Whenever possible, we source from local farms and producers. We maintain
                relationships with suppliers who practice sustainable farming and ethical
                sourcing methods.
              </p>

              <h3 className="text-xl font-semibold text-red-700 mb-3 mt-6">Traditional Methods</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                We avoid shortcuts and artificial additives. Every ingredient is selected for
                its quality, and every dish is prepared using traditional cooking methods that
                have been perfected over centuries.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Kitchen Gallery */}
      <section className="py-12 md:py-16 bg-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            Behind the Scenes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop",
                title: "Traditional Wok Cooking",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1577003832033-d79740f4e2bc?w=500&h=400&fit=crop",
                title: "Expert Food Preparation",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1498837167922-480c7cc1d000?w=500&h=400&fit=crop",
                title: "Quality Plating",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative h-64 rounded-lg overflow-hidden shadow-lg group">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex items-end justify-start p-4">
                  <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* CTA Section */}
      <CallToAction 
        title="Experience Our Authentic Cuisine"
        description="Join us for a culinary journey that honors tradition and celebrates flavor"
        primaryButtonText="View Menu"
        primaryButtonHref="/menu"
        secondaryButtonText="Make a Reservation"
        secondaryButtonHref="/contact"
        backgroundImage="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop"
      />
    </main>
  );
}
