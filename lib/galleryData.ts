export type GalleryCategory = "food" | "interior" | "events";

export type GalleryImage = {
  category: GalleryCategory;
  url: string;
  alt: string;
};

export const galleryImages: GalleryImage[] = [
  // Food
  { category: "food", url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop", alt: "Sizzling stir-fry" },
  { category: "food", url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop", alt: "Dumplings platter" },
  { category: "food", url: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&h=600&fit=crop", alt: "Noodle bowl" },
  { category: "food", url: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&h=600&fit=crop", alt: "Fried rice" },
  { category: "food", url: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800&h=600&fit=crop", alt: "Spicy chicken" },
  { category: "food", url: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=600&fit=crop", alt: "Dim sum" },

  // Interior
  { category: "interior", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop", alt: "Dining hall" },
  { category: "interior", url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop", alt: "Cozy seating" },
  { category: "interior", url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop", alt: "Restaurant ambiance" },
  { category: "interior", url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop", alt: "Bar area" },
  { category: "interior", url: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&h=600&fit=crop", alt: "Table setting" },
  { category: "interior", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop", alt: "Warm interior" },

  // Events
  { category: "events", url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop", alt: "Celebration dinner" },
  { category: "events", url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop", alt: "Private party" },
  { category: "events", url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop", alt: "Group gathering" },
  { category: "events", url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&h=600&fit=crop", alt: "Festive table" },
  { category: "events", url: "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&h=600&fit=crop", alt: "Toast" },
  { category: "events", url: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop", alt: "Special occasion" },
];
