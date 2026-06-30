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

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=450&fit=crop&q=80`;

export const menuItems: MenuItem[] = [
  { category: "starters", name: "Spring Rolls", description: "Crispy golden rolls filled with vegetables and vermicelli", price: 6.99, image: img("1563245372-f21724e3856d"), spiceLevel: 0, isVegetarian: true },
  { category: "starters", name: "Prawn Toast", description: "Succulent prawns on crispy toast, perfectly seasoned", price: 7.99, image: img("1571091718767-18b5b1457add"), spiceLevel: 1, isVegetarian: false },
  { category: "starters", name: "Chicken Satay", description: "Grilled chicken skewers with peanut sauce and cucumber slices", price: 8.99, image: img("1626804475297-41608ea09aeb"), spiceLevel: 1, isVegetarian: false },
  { category: "starters", name: "Edamame", description: "Steamed young soybean pods with sea salt", price: 5.99, image: img("1496116218417-1a781b1c416c"), spiceLevel: 0, isVegetarian: true },
  { category: "soups", name: "Hot & Sour Soup", description: "Tangy and spicy broth with mushrooms and bamboo shoots", price: 5.99, image: img("1547592180-85f173990554"), spiceLevel: 2, isVegetarian: true },
  { category: "soups", name: "Wonton Soup", description: "Delicate wontons in clear, savory chicken broth", price: 6.99, image: img("1604908176997-125f25cc6f3d"), spiceLevel: 0, isVegetarian: false },
  { category: "soups", name: "Egg Drop Soup", description: "Silky egg strands in light chicken broth with green onions", price: 5.99, image: img("1606756790138-261d2b21cd75"), spiceLevel: 0, isVegetarian: true },
  { category: "soups", name: "Tom Yum Soup", description: "Thai-inspired coconut curry broth with shrimp and mushrooms", price: 7.99, image: img("1512058564366-18510be2db19"), spiceLevel: 3, isVegetarian: false },
  { category: "noodles", name: "Lo Mein", description: "Soft egg noodles with vegetables in savory sauce", price: 10.99, image: img("1552611052-33e04de081de"), spiceLevel: 1, isVegetarian: true },
  { category: "noodles", name: "Chow Mein", description: "Crispy or soft noodles with stir-fried vegetables and proteins", price: 11.99, image: img("1601050690597-df0568f70950"), spiceLevel: 1, isVegetarian: false },
  { category: "noodles", name: "Pad Thai", description: "Stir-fried rice noodles with shrimp, peanuts, and lime juice", price: 12.99, image: img("1606491956689-2ea866880c84"), spiceLevel: 2, isVegetarian: false },
  { category: "noodles", name: "Singapore Mei Fun", description: "Thin rice noodles with curry powder, vegetables and proteins", price: 12.99, image: img("1582878826629-29b7ad1cdc43"), spiceLevel: 2, isVegetarian: false },
  { category: "rice", name: "Fried Rice", description: "Wok-fried rice with eggs, vegetables and your choice of meat", price: 11.99, image: img("1617093727343-374698b1b08d"), spiceLevel: 1, isVegetarian: false },
  { category: "rice", name: "Pineapple Fried Rice", description: "Aromatic jasmine rice with pineapple, cashews and shrimp", price: 13.99, image: img("1604152135912-04a022e23696"), spiceLevel: 1, isVegetarian: false },
  { category: "rice", name: "Vegetable Fried Rice", description: "Mixed vegetables, eggs and jasmine rice in aromatic sauce", price: 10.99, image: img("1525755662778-989d0524087e"), spiceLevel: 0, isVegetarian: true },
  { category: "chicken", name: "Kung Pao Chicken", description: "Tender chicken with roasted peanuts in spicy chili sauce with traditional wok technique", price: 14.99, image: img("1585032226651-759b368d7246"), spiceLevel: 2, isVegetarian: false, isSpecialty: true },
  { category: "chicken", name: "Chicken Teriyaki", description: "Tender chicken glazed with sweet and savory teriyaki sauce", price: 13.99, image: img("1633945274405-b6c8069047b0"), spiceLevel: 0, isVegetarian: false },
  { category: "chicken", name: "Lemon Chicken", description: "Crispy chicken with tangy lemon sauce and fresh lemon slices", price: 13.99, image: img("1567188040759-fb8a883dc6d8"), spiceLevel: 0, isVegetarian: false },
  { category: "chicken", name: "Cashew Chicken", description: "Tender chicken stir-fried with crunchy cashews and vegetables", price: 14.99, image: img("1614777986387-015c2a89b696"), spiceLevel: 1, isVegetarian: false },
  { category: "beef", name: "Beef with Broccoli", description: "Tender beef slices with fresh broccoli in oyster sauce", price: 14.99, image: img("1455619452474-d2be8b1e70cd"), spiceLevel: 0, isVegetarian: false },
  { category: "beef", name: "Black Pepper Beef", description: "Succulent beef with cracked black pepper and aromatic spices", price: 15.99, image: img("1607330289024-1535c6b4e1c1"), spiceLevel: 2, isVegetarian: false },
  { category: "beef", name: "Mongolian Beef", description: "Tender beef strips with scallions in a rich, tangy sauce", price: 15.99, image: img("1551782450-a2132b4ba21d"), spiceLevel: 1, isVegetarian: false },
  { category: "seafood", name: "Shrimp with Garlic Sauce", description: "Fresh shrimp in a savory garlic and black bean sauce", price: 15.99, image: img("1559314809-0d155014e29e"), spiceLevel: 1, isVegetarian: false },
  { category: "seafood", name: "Salmon Teriyaki", description: "Pan-seared salmon fillet glazed with sweet teriyaki sauce", price: 17.99, image: img("1488477181946-6428a0291777"), spiceLevel: 0, isVegetarian: false, isSpecialty: true },
  { category: "seafood", name: "Three Delicacies", description: "Shrimp, scallops, and fish in a delicate white wine sauce", price: 18.99, image: img("1565299624946-b28f40a0ae38"), spiceLevel: 0, isVegetarian: false },
  { category: "vegetarian", name: "Mapo Tofu", description: "Silky tofu in aromatic numbing and spicy sauce, authentic Sichuan style", price: 12.99, image: img("1503764654157-72d979d9af2f"), spiceLevel: 3, isVegetarian: true, isSpecialty: true },
  { category: "vegetarian", name: "Vegetable Lo Mein", description: "Soft egg noodles with mixed fresh vegetables in savory sauce", price: 10.99, image: img("1606491956689-2ea866880c84"), spiceLevel: 0, isVegetarian: true },
  { category: "vegetarian", name: "Buddha Jumps Over Wall", description: "Vegetable medley with tofu and mushrooms in aromatic broth", price: 13.99, image: img("1546069901-ba9599a7e63c"), spiceLevel: 1, isVegetarian: true },
  { category: "desserts", name: "Mango Pudding", description: "Silky smooth mango pudding with fresh mango pieces", price: 5.99, image: img("1551024601-bec78aea704b"), spiceLevel: 0, isVegetarian: true },
  { category: "desserts", name: "Fried Banana", description: "Golden-fried banana rolls with caramel sauce and vanilla ice cream", price: 6.99, image: img("1571877227200-a0d98ea607e9"), spiceLevel: 0, isVegetarian: true },
  { category: "desserts", name: "Sesame Balls", description: "Crispy sesame-coated balls filled with sweet red bean paste", price: 5.99, image: img("1432139509613-5c4255815697"), spiceLevel: 0, isVegetarian: true },
  { category: "drinks", name: "Jasmine Tea", description: "Delicate jasmine-infused green tea", price: 2.99, image: img("1556679343-c7306c1976bc"), spiceLevel: 0, isVegetarian: true },
  { category: "drinks", name: "Lychee Lemonade", description: "Refreshing lychee juice with fresh lemon", price: 4.99, image: img("1544025162-d76694265947"), spiceLevel: 0, isVegetarian: true },
  { category: "drinks", name: "Mango Lassi", description: "Creamy yogurt and mango drink", price: 4.99, image: img("1600271886742-f049cd451bba"), spiceLevel: 0, isVegetarian: true },
];
