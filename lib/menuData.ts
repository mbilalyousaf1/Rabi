export type MenuCategory = {
  id: string;
  label: string;
};

export type MenuItem = {
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
  spiceLevel: number;
  isVegetarian: boolean;
  isSpecialty?: boolean;
};

export const categories: MenuCategory[] = [
  { id: "all", label: "All Items" },
  { id: "specialties", label: "Chef's Specialties" },
  { id: "starters", label: "Starters" },
  { id: "soups", label: "Soups" },
  { id: "noodles", label: "Noodles" },
  { id: "rice", label: "Rice Dishes" },
  { id: "chicken", label: "Chicken" },
  { id: "beef", label: "Beef" },
  { id: "seafood", label: "Seafood" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" },
];

export const menuItems: MenuItem[] = [
  { category: "starters", name: "Spring Rolls", description: "Crispy golden rolls filled with vegetables and vermicelli", price: 6.99, image: "https://images.unsplash.com/photo-1605521842636-dfe3fc36070b?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: true },
  { category: "starters", name: "Prawn Toast", description: "Succulent prawns on crispy toast, perfectly seasoned", price: 7.99, image: "https://images.unsplash.com/photo-1585463107173-f60e4a6f2e0f?w=500&h=400&fit=crop", spiceLevel: 1, isVegetarian: false },
  { category: "starters", name: "Chicken Satay", description: "Grilled chicken skewers with peanut sauce and cucumber slices", price: 8.99, image: "https://images.unsplash.com/photo-1599599810694-2a5b27e0c90f?w=500&h=400&fit=crop", spiceLevel: 1, isVegetarian: false },
  { category: "starters", name: "Edamame", description: "Steamed young soybean pods with sea salt", price: 5.99, image: "https://images.unsplash.com/photo-1599599810694-2a5b27e0c90f?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: true },
  { category: "soups", name: "Hot & Sour Soup", description: "Tangy and spicy broth with mushrooms and bamboo shoots", price: 5.99, image: "https://images.unsplash.com/photo-1592068615227-7d440642fdac?w=500&h=400&fit=crop", spiceLevel: 2, isVegetarian: true },
  { category: "soups", name: "Wonton Soup", description: "Delicate wontons in clear, savory chicken broth", price: 6.99, image: "https://images.unsplash.com/photo-1585238341710-4b51926caf1d?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: false },
  { category: "soups", name: "Egg Drop Soup", description: "Silky egg strands in light chicken broth with green onions", price: 5.99, image: "https://images.unsplash.com/photo-1585238341710-4b51926caf1d?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: true },
  { category: "soups", name: "Tom Yum Soup", description: "Thai-inspired coconut curry broth with shrimp and mushrooms", price: 7.99, image: "https://images.unsplash.com/photo-1597103442097-8b74394b95c6?w=500&h=400&fit=crop", spiceLevel: 3, isVegetarian: false },
  { category: "noodles", name: "Lo Mein", description: "Soft egg noodles with vegetables in savory sauce", price: 10.99, image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=500&h=400&fit=crop", spiceLevel: 1, isVegetarian: true },
  { category: "noodles", name: "Chow Mein", description: "Crispy or soft noodles with stir-fried vegetables and proteins", price: 11.99, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop", spiceLevel: 1, isVegetarian: false },
  { category: "noodles", name: "Pad Thai", description: "Stir-fried rice noodles with shrimp, peanuts, and lime juice", price: 12.99, image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop", spiceLevel: 2, isVegetarian: false },
  { category: "noodles", name: "Singapore Mei Fun", description: "Thin rice noodles with curry powder, vegetables and proteins", price: 12.99, image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=500&h=400&fit=crop", spiceLevel: 2, isVegetarian: false },
  { category: "rice", name: "Fried Rice", description: "Wok-fried rice with eggs, vegetables and your choice of meat", price: 11.99, image: "https://images.unsplash.com/photo-1585238341710-4b51926caf1d?w=500&h=400&fit=crop", spiceLevel: 1, isVegetarian: false },
  { category: "rice", name: "Pineapple Fried Rice", description: "Aromatic jasmine rice with pineapple, cashews and shrimp", price: 13.99, image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=500&h=400&fit=crop", spiceLevel: 1, isVegetarian: false },
  { category: "rice", name: "Vegetable Fried Rice", description: "Mixed vegetables, eggs and jasmine rice in aromatic sauce", price: 10.99, image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: true },
  { category: "chicken", name: "Kung Pao Chicken", description: "Tender chicken with roasted peanuts in spicy chili sauce with traditional wok technique", price: 14.99, image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=500&h=400&fit=crop", spiceLevel: 2, isVegetarian: false, isSpecialty: true },
  { category: "chicken", name: "Chicken Teriyaki", description: "Tender chicken glazed with sweet and savory teriyaki sauce", price: 13.99, image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: false },
  { category: "chicken", name: "Lemon Chicken", description: "Crispy chicken with tangy lemon sauce and fresh lemon slices", price: 13.99, image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: false },
  { category: "chicken", name: "Cashew Chicken", description: "Tender chicken stir-fried with crunchy cashews and vegetables", price: 14.99, image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=500&h=400&fit=crop", spiceLevel: 1, isVegetarian: false },
  { category: "beef", name: "Beef with Broccoli", description: "Tender beef slices with fresh broccoli in oyster sauce", price: 14.99, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: false },
  { category: "beef", name: "Black Pepper Beef", description: "Succulent beef with cracked black pepper and aromatic spices", price: 15.99, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop", spiceLevel: 2, isVegetarian: false },
  { category: "beef", name: "Mongolian Beef", description: "Tender beef strips with scallions in a rich, tangy sauce", price: 15.99, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop", spiceLevel: 1, isVegetarian: false },
  { category: "seafood", name: "Shrimp with Garlic Sauce", description: "Fresh shrimp in a savory garlic and black bean sauce", price: 15.99, image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop", spiceLevel: 1, isVegetarian: false },
  { category: "seafood", name: "Salmon Teriyaki", description: "Pan-seared salmon fillet glazed with sweet teriyaki sauce", price: 17.99, image: "https://images.unsplash.com/photo-1580959375944-abd7e991e971?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: false, isSpecialty: true },
  { category: "seafood", name: "Three Delicacies", description: "Shrimp, scallops, and fish in a delicate white wine sauce", price: 18.99, image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: false },
  { category: "vegetarian", name: "Mapo Tofu", description: "Silky tofu in aromatic numbing and spicy sauce, authentic Sichuan style", price: 12.99, image: "https://images.unsplash.com/photo-1612874742237-6526221fcf4e?w=500&h=400&fit=crop", spiceLevel: 3, isVegetarian: true, isSpecialty: true },
  { category: "vegetarian", name: "Vegetable Lo Mein", description: "Soft egg noodles with mixed fresh vegetables in savory sauce", price: 10.99, image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: true },
  { category: "vegetarian", name: "Buddha Jumps Over Wall", description: "Vegetable medley with tofu and mushrooms in aromatic broth", price: 13.99, image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=500&h=400&fit=crop", spiceLevel: 1, isVegetarian: true },
  { category: "desserts", name: "Mango Pudding", description: "Silky smooth mango pudding with fresh mango pieces", price: 5.99, image: "https://images.unsplash.com/photo-1585080163977-24ce76d1f2e5?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: true },
  { category: "desserts", name: "Fried Banana", description: "Golden-fried banana rolls with caramel sauce and vanilla ice cream", price: 6.99, image: "https://images.unsplash.com/photo-1585080163977-24ce76d1f2e5?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: true },
  { category: "desserts", name: "Sesame Balls", description: "Crispy sesame-coated balls filled with sweet red bean paste", price: 5.99, image: "https://images.unsplash.com/photo-1585080163977-24ce76d1f2e5?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: true },
  { category: "drinks", name: "Jasmine Tea", description: "Delicate jasmine-infused green tea", price: 2.99, image: "https://images.unsplash.com/photo-1597318529409-f0c68ec90e3f?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: true },
  { category: "drinks", name: "Lychee Lemonade", description: "Refreshing lychee juice with fresh lemon", price: 4.99, image: "https://images.unsplash.com/photo-1599599810694-2a5b27e0c90f?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: true },
  { category: "drinks", name: "Mango Lassi", description: "Creamy yogurt and mango drink", price: 4.99, image: "https://images.unsplash.com/photo-1599599810694-2a5b27e0c90f?w=500&h=400&fit=crop", spiceLevel: 0, isVegetarian: true },
];
