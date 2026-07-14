// MB Crunchy — Static Product Data (No backend)

export interface Product {
  id: string;
  name: string;
  category: "kitchen" | "mart";
  subcategory: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount: number;
  weight: string;
  rating: number;
  reviewCount: number;
  veg: boolean;
  inStock: boolean;
  image: string;
  isCombo?: boolean;
  isPartyPack?: boolean;
  comboItems?: string[];
  partyPackServes?: number;
  partyPackItems?: string[];
  savings?: number;
  tags?: string[];
}

// ─── Kitchen Products ───

const pizzaProducts: Product[] = [
  { id: "k-pizza-1", name: "Classic Margherita Pizza", category: "kitchen", subcategory: "Pizza", description: "Hand-tossed pizza with fresh mozzarella, basil, and our signature tomato sauce.", price: 249, originalPrice: 299, discount: 17, weight: "Medium (10\")", rating: 4.8, reviewCount: 128, veg: true, inStock: true, image: "🍕", tags: ["bestseller", "veg"] },
  { id: "k-pizza-2", name: "Farm Fresh Veggie Pizza", category: "kitchen", subcategory: "Pizza", description: "Loaded with bell peppers, onions, olives, mushrooms, and sweet corn.", price: 299, originalPrice: 349, discount: 14, weight: "Medium (10\")", rating: 4.6, reviewCount: 94, veg: true, inStock: true, image: "🍕", tags: ["veg"] },
  { id: "k-pizza-3", name: "Pepperoni Pizza", category: "kitchen", subcategory: "Pizza", description: "Classic pepperoni with extra cheese on a crispy thin crust.", price: 329, discount: 0, weight: "Medium (10\")", rating: 4.7, reviewCount: 76, veg: false, inStock: true, image: "🍕", tags: ["non-veg"] },
  { id: "k-pizza-4", name: "Tandoori Chicken Pizza", category: "kitchen", subcategory: "Pizza", description: "Tandoori chicken tikka with onion, capsicum, and mint mayo drizzle.", price: 379, originalPrice: 429, discount: 12, weight: "Large (12\")", rating: 4.5, reviewCount: 63, veg: false, inStock: true, image: "🍕", tags: ["non-veg", "spicy"] },
  { id: "k-pizza-5", name: "Double Cheese Supreme", category: "kitchen", subcategory: "Pizza", description: "Extra mozzarella, cheddar, parmesan with mixed herbs.", price: 349, discount: 0, weight: "Medium (10\")", rating: 4.9, reviewCount: 112, veg: true, inStock: true, image: "🍕", tags: ["bestseller", "veg"] },
];

const burgerProducts: Product[] = [
  { id: "k-burger-1", name: "Crispy Veg Burger", category: "kitchen", subcategory: "Burger", description: "Crispy vegetable patty with lettuce, tomato, and our special sauce.", price: 99, originalPrice: 129, discount: 23, weight: "Single", rating: 4.3, reviewCount: 88, veg: true, inStock: true, image: "🍔", tags: ["veg", "value"] },
  { id: "k-burger-2", name: "Chicken Tikka Burger", category: "kitchen", subcategory: "Burger", description: "Chicken tikka patty with mint chutney and fresh onions.", price: 149, discount: 0, weight: "Single", rating: 4.5, reviewCount: 72, veg: false, inStock: true, image: "🍔", tags: ["non-veg"] },
  { id: "k-burger-3", name: "Peri Peri Chicken Burger", category: "kitchen", subcategory: "Burger", description: "Spicy peri peri chicken fillet with garlic mayo.", price: 179, originalPrice: 199, discount: 10, weight: "Single", rating: 4.6, reviewCount: 56, veg: false, inStock: true, image: "🍔", tags: ["non-veg", "spicy"] },
  { id: "k-burger-4", name: "Maharaja Veg Burger", category: "kitchen", subcategory: "Burger", description: "Double patty loaded with cheese, jalapeños, and onion rings.", price: 179, discount: 0, weight: "Double", rating: 4.4, reviewCount: 43, veg: true, inStock: true, image: "🍔", tags: ["veg", "premium"] },
];

const friesProducts: Product[] = [
  { id: "k-fries-1", name: "Classic French Fries", category: "kitchen", subcategory: "French Fries", description: "Golden crispy fries seasoned with Himalayan pink salt.", price: 89, originalPrice: 109, discount: 18, weight: "Regular", rating: 4.6, reviewCount: 156, veg: true, inStock: true, image: "🍟", tags: ["veg", "popular"] },
  { id: "k-fries-2", name: "Peri Peri Fries", category: "kitchen", subcategory: "French Fries", description: "Crispy fries tossed in spicy peri peri seasoning.", price: 119, originalPrice: 149, discount: 20, weight: "Regular", rating: 4.5, reviewCount: 98, veg: true, inStock: true, image: "🍟", tags: ["veg", "spicy"] },
  { id: "k-fries-3", name: "Cheese Loaded Fries", category: "kitchen", subcategory: "French Fries", description: "Fries loaded with molten cheddar cheese and herbs.", price: 149, discount: 0, weight: "Large", rating: 4.7, reviewCount: 84, veg: true, inStock: true, image: "🍟", tags: ["veg", "premium"] },
  { id: "k-fries-4", name: "Masala Fries", category: "kitchen", subcategory: "French Fries", description: "Indian-style masala fries with chaat masala and lemon.", price: 109, discount: 0, weight: "Regular", rating: 4.4, reviewCount: 67, veg: true, inStock: true, image: "🍟", tags: ["veg", "desi"] },
];

const momosProducts: Product[] = [
  { id: "k-momo-1", name: "Steamed Veg Momos (8 pcs)", category: "kitchen", subcategory: "Momos", description: "Soft steamed momos filled with seasoned vegetables.", price: 139, originalPrice: 169, discount: 18, weight: "8 pieces", rating: 4.7, reviewCount: 134, veg: true, inStock: true, image: "🥟", tags: ["veg", "bestseller"] },
  { id: "k-momo-2", name: "Chicken Momos (12 pcs)", category: "kitchen", subcategory: "Momos", description: "Juicy chicken momos served with spicy dipping sauce.", price: 199, originalPrice: 249, discount: 20, weight: "12 pieces", rating: 4.8, reviewCount: 112, veg: false, inStock: true, image: "🥟", tags: ["non-veg", "bestseller"] },
  { id: "k-momo-3", name: "Pan Fried Veg Momos", category: "kitchen", subcategory: "Momos", description: "Crispy pan-fried vegetable momos with sesame topping.", price: 169, discount: 0, weight: "8 pieces", rating: 4.5, reviewCount: 78, veg: true, inStock: true, image: "🥟", tags: ["veg"] },
  { id: "k-momo-4", name: "Kurkure Chicken Momos", category: "kitchen", subcategory: "Momos", description: "Crunchy deep-fried chicken momos with schezwan dip.", price: 219, discount: 0, weight: "8 pieces", rating: 4.6, reviewCount: 91, veg: false, inStock: true, image: "🥟", tags: ["non-veg", "crunchy"] },
];

const pastaProducts: Product[] = [
  { id: "k-pasta-1", name: "White Sauce Pasta", category: "kitchen", subcategory: "Pasta", description: "Creamy Alfredo pasta with mixed vegetables and herbs.", price: 179, originalPrice: 209, discount: 14, weight: "Regular", rating: 4.5, reviewCount: 68, veg: true, inStock: true, image: "🍝", tags: ["veg", "creamy"] },
  { id: "k-pasta-2", name: "Red Sauce Arrabiata", category: "kitchen", subcategory: "Pasta", description: "Spicy tangy tomato pasta with garlic and chili flakes.", price: 169, discount: 0, weight: "Regular", rating: 4.3, reviewCount: 54, veg: true, inStock: true, image: "🍝", tags: ["veg", "spicy"] },
  { id: "k-pasta-3", name: "Chicken Penne Alfredo", category: "kitchen", subcategory: "Pasta", description: "Penne pasta with tender chicken in rich Alfredo sauce.", price: 229, originalPrice: 259, discount: 12, weight: "Regular", rating: 4.6, reviewCount: 47, veg: false, inStock: true, image: "🍝", tags: ["non-veg"] },
];

const noodlesProducts: Product[] = [
  { id: "k-noodle-1", name: "Hakka Noodles", category: "kitchen", subcategory: "Noodles", description: "Classic stir-fried Hakka noodles with vegetables.", price: 149, originalPrice: 179, discount: 17, weight: "Regular", rating: 4.4, reviewCount: 92, veg: true, inStock: true, image: "🍜", tags: ["veg", "popular"] },
  { id: "k-noodle-2", name: "Schezwan Noodles", category: "kitchen", subcategory: "Noodles", description: "Fiery Schezwan noodles loaded with spicy sauce.", price: 169, discount: 0, weight: "Regular", rating: 4.5, reviewCount: 76, veg: true, inStock: true, image: "🍜", tags: ["veg", "spicy"] },
  { id: "k-noodle-3", name: "Egg Noodles", category: "kitchen", subcategory: "Noodles", description: "Noodles stir-fried with egg, spring onions, and soy sauce.", price: 179, discount: 0, weight: "Regular", rating: 4.3, reviewCount: 58, veg: false, inStock: true, image: "🍜", tags: ["non-veg"] },
  { id: "k-noodle-4", name: "Singapore Rice Noodles", category: "kitchen", subcategory: "Noodles", description: "Thin rice noodles with curry flavor and vegetables.", price: 189, discount: 0, weight: "Regular", rating: 4.2, reviewCount: 41, veg: true, inStock: true, image: "🍜", tags: ["veg"] },
];

const sandwichesProducts: Product[] = [
  { id: "k-sand-1", name: "Grilled Veg Sandwich", category: "kitchen", subcategory: "Sandwiches", description: "Toasted sandwich with fresh veggies, cheese, and mint chutney.", price: 99, originalPrice: 129, discount: 23, weight: "Single", rating: 4.4, reviewCount: 103, veg: true, inStock: true, image: "🥪", tags: ["veg", "value"] },
  { id: "k-sand-2", name: "Chicken Club Sandwich", category: "kitchen", subcategory: "Sandwiches", description: "Triple-layer sandwich with chicken, bacon, lettuce, and mayo.", price: 179, discount: 0, weight: "Triple", rating: 4.6, reviewCount: 67, veg: false, inStock: true, image: "🥪", tags: ["non-veg", "premium"] },
  { id: "k-sand-3", name: "Paneer Tikka Sandwich", category: "kitchen", subcategory: "Sandwiches", description: "Grilled tandoori paneer sandwich with bell peppers.", price: 149, discount: 0, weight: "Double", rating: 4.5, reviewCount: 59, veg: true, inStock: true, image: "🥪", tags: ["veg"] },
];

const cornProducts: Product[] = [
  { id: "k-corn-1", name: "Butter Sweet Corn", category: "kitchen", subcategory: "Sweet Corn", description: "Steamed sweet corn tossed in butter and black pepper.", price: 79, originalPrice: 99, discount: 20, weight: "Regular", rating: 4.5, reviewCount: 87, veg: true, inStock: true, image: "🌽", tags: ["veg", "value"] },
  { id: "k-corn-2", name: "Cheese Corn Cup", category: "kitchen", subcategory: "Sweet Corn", description: "Sweet corn mixed with cheese sauce and spices.", price: 109, discount: 0, weight: "Regular", rating: 4.4, reviewCount: 63, veg: true, inStock: true, image: "🌽", tags: ["veg"] },
  { id: "k-corn-3", name: "Spicy Masala Corn", category: "kitchen", subcategory: "Sweet Corn", description: "Corn tossed with chaat masala, chili, and lemon juice.", price: 89, discount: 0, weight: "Regular", rating: 4.3, reviewCount: 52, veg: true, inStock: true, image: "🌽", tags: ["veg", "spicy"] },
];

const snacksProducts: Product[] = [
  { id: "k-snack-1", name: "Onion Rings (10 pcs)", category: "kitchen", subcategory: "Snacks", description: "Crispy battered onion rings served with dip.", price: 119, originalPrice: 149, discount: 20, weight: "10 pieces", rating: 4.3, reviewCount: 74, veg: true, inStock: true, image: "🧅", tags: ["veg"] },
  { id: "k-snack-2", name: "Chicken Popcorn (Large)", category: "kitchen", subcategory: "Snacks", description: "Bite-sized crispy fried chicken pieces.", price: 179, discount: 0, weight: "Large", rating: 4.6, reviewCount: 93, veg: false, inStock: true, image: "🍗", tags: ["non-veg", "popular"] },
  { id: "k-snack-3", name: "Veg Spring Rolls (6 pcs)", category: "kitchen", subcategory: "Snacks", description: "Crispy spring rolls with vegetable filling.", price: 129, discount: 0, weight: "6 pieces", rating: 4.2, reviewCount: 48, veg: true, inStock: true, image: "🥟", tags: ["veg"] },
  { id: "k-snack-4", name: "French Fries & Nuggets Combo", category: "kitchen", subcategory: "Snacks", description: "Best of both worlds - fries and chicken nuggets.", price: 199, originalPrice: 249, discount: 20, weight: "Combo", rating: 4.5, reviewCount: 61, veg: false, inStock: true, image: "🍗", tags: ["non-veg"] },
];

const frozenProducts: Product[] = [
  { id: "k-frozen-1", name: "Frozen Chicken Nuggets (500g)", category: "kitchen", subcategory: "Frozen Foods", description: "Premium chicken nuggets, ready to fry.", price: 299, originalPrice: 349, discount: 14, weight: "500g", rating: 4.4, reviewCount: 56, veg: false, inStock: true, image: "📦", tags: ["non-veg", "frozen"] },
  { id: "k-frozen-2", name: "Frozen French Fries (1kg)", category: "kitchen", subcategory: "Frozen Foods", description: "Premium frozen shoestring potatoes.", price: 249, discount: 0, weight: "1kg", rating: 4.5, reviewCount: 78, veg: true, inStock: true, image: "📦", tags: ["veg", "frozen"] },
  { id: "k-frozen-3", name: "Frozen Veggie Patty (10 pcs)", category: "kitchen", subcategory: "Frozen Foods", description: "Ready-to-cook vegetable patties.", price: 199, originalPrice: 229, discount: 13, weight: "10 pieces", rating: 4.2, reviewCount: 43, veg: true, inStock: true, image: "📦", tags: ["veg", "frozen"] },
  { id: "k-frozen-4", name: "Frozen Chicken Wings (1kg)", category: "kitchen", subcategory: "Frozen Foods", description: "Party pack chicken wings, pre-marinated.", price: 399, discount: 0, weight: "1kg", rating: 4.6, reviewCount: 49, veg: false, inStock: true, image: "📦", tags: ["non-veg", "frozen"] },
];

// ─── Kitchen Combos & Party Packs ───

const kitchenCombos: Product[] = [
  { id: "k-combo-1", name: "Family Pizza Combo", category: "kitchen", subcategory: "Combos", description: "Perfect family dinner with 2 pizzas and fries", price: 699, originalPrice: 847, discount: 17, weight: "Serves 4", rating: 4.7, reviewCount: 89, veg: true, inStock: true, image: "🍕", isCombo: true, comboItems: ["Margherita Pizza (Medium)", "Farm Veggie Pizza (Medium)", "French Fries (Large)", "Cold Drink (2)"], savings: 148 },
  { id: "k-combo-2", name: "Burger Feast Combo", category: "kitchen", subcategory: "Combos", description: "Loaded burger meal for two", price: 399, originalPrice: 507, discount: 21, weight: "Serves 2", rating: 4.5, reviewCount: 67, veg: false, inStock: true, image: "🍔", isCombo: true, comboItems: ["Chicken Tikka Burger x2", "Peri Peri Fries", "Cold Drink x2"], savings: 108 },
  { id: "k-combo-3", name: "Momo Lover's Platter", category: "kitchen", subcategory: "Combos", description: "Assorted momos platter with dips", price: 499, originalPrice: 617, discount: 19, weight: "Serves 3", rating: 4.8, reviewCount: 112, veg: false, inStock: true, image: "🥟", isCombo: true, comboItems: ["Steamed Veg Momos", "Chicken Momos (12 pcs)", "Pan Fried Momos", "Schezwan Dip"], savings: 118 },
  { id: "k-combo-4", name: "Student Saver Combo", category: "kitchen", subcategory: "Combos", description: "Budget-friendly meal combo", price: 249, originalPrice: 327, discount: 24, weight: "Serves 1", rating: 4.3, reviewCount: 134, veg: true, inStock: true, image: "🍝", isCombo: true, comboItems: ["Red Sauce Pasta", "Garlic Bread", "Cold Drink"], savings: 78 },
];

const kitchenPartyPacks: Product[] = [
  { id: "k-party-1", name: "Birthday Party Pack", category: "kitchen", subcategory: "Party Packs", description: "Complete party package for 10 people", price: 1999, originalPrice: 2599, discount: 23, weight: "Serves 10", rating: 4.9, reviewCount: 45, veg: false, inStock: true, image: "🎉", isPartyPack: true, partyPackServes: 10, partyPackItems: ["Margherita Pizza (Large) x2", "Chicken Wings (24 pcs)", "French Fries (Large x2)", "Chicken Popcorn (Large)", "Cold Drinks (6)", "Dipping Sauces (4)"], savings: 600 },
  { id: "k-party-2", name: "Game Night Combo", category: "kitchen", subcategory: "Party Packs", description: "Perfect game night snacks for 6", price: 1299, originalPrice: 1649, discount: 21, weight: "Serves 6", rating: 4.7, reviewCount: 38, veg: false, inStock: true, image: "🎮", isPartyPack: true, partyPackServes: 6, partyPackItems: ["Chicken Momos (12 pcs)", "Peri Peri Fries (Large)", "Onion Rings (10 pcs)", "Nuggets (15 pcs)", "Cold Drinks (4)"], savings: 350 },
  { id: "k-party-3", name: "Veg Party Platter", category: "kitchen", subcategory: "Party Packs", description: "Vegetarian party pack for 8", price: 1499, originalPrice: 1899, discount: 21, weight: "Serves 8", rating: 4.6, reviewCount: 52, veg: true, inStock: true, image: "🥗", isPartyPack: true, partyPackServes: 8, partyPackItems: ["Farm Veggie Pizza (Large) x2", "Veg Momos (16 pcs)", "French Fries (Large x2)", "Cheese Corn Cup x4", "Cold Drinks (4)"], savings: 400 },
];

// ─── Mart Products ───

const picklesProducts: Product[] = [
  { id: "m-pickle-1", name: "Mango Pickle (500g)", category: "mart", subcategory: "Pickles", description: "Traditional tangy mango pickle made with aged spices and mustard oil.", price: 179, originalPrice: 199, discount: 10, weight: "500g", rating: 4.7, reviewCount: 92, veg: true, inStock: true, image: "🥭", tags: ["popular"] },
  { id: "m-pickle-2", name: "Lemon Pickle (500g)", category: "mart", subcategory: "Pickles", description: "Zesty lemon pickle with fenugreek and asafoetida.", price: 169, discount: 0, weight: "500g", rating: 4.5, reviewCount: 67, veg: true, inStock: true, image: "🍋", tags: [] },
  { id: "m-pickle-3", name: "Mixed Vegetable Pickle (500g)", category: "mart", subcategory: "Pickles", description: "Assorted vegetable pickle - carrot, cauliflower, turnip, and more.", price: 189, originalPrice: 219, discount: 14, weight: "500g", rating: 4.6, reviewCount: 78, veg: true, inStock: true, image: "🥕", tags: ["bestseller"] },
  { id: "m-pickle-4", name: "Chilli Pickle (250g)", category: "mart", subcategory: "Pickles", description: "Spicy green chilli pickle for the brave souls.", price: 129, originalPrice: 149, discount: 13, weight: "250g", rating: 4.4, reviewCount: 43, veg: true, inStock: true, image: "🌶️", tags: ["spicy"] },
  { id: "m-pickle-5", name: "Garlic Pickle (250g)", category: "mart", subcategory: "Pickles", description: "Pungent garlic pickle aged in tangy brine.", price: 149, discount: 0, weight: "250g", rating: 4.3, reviewCount: 51, veg: true, inStock: true, image: "🧄", tags: [] },
];

const oilsProducts: Product[] = [
  { id: "m-oil-1", name: "Cold Pressed Coconut Oil (1L)", category: "mart", subcategory: "Cold Pressed Oils", description: "Pure virgin coconut oil, cold pressed from fresh coconuts.", price: 399, originalPrice: 499, discount: 20, weight: "1 Litre", rating: 4.9, reviewCount: 128, veg: true, inStock: true, image: "🥥", tags: ["bestseller", "organic"] },
  { id: "m-oil-2", name: "Cold Pressed Groundnut Oil (1L)", category: "mart", subcategory: "Cold Pressed Oils", description: "Traditional wood-pressed groundnut oil for daily cooking.", price: 349, originalPrice: 399, discount: 13, weight: "1 Litre", rating: 4.7, reviewCount: 94, veg: true, inStock: true, image: "🥜", tags: ["popular"] },
  { id: "m-oil-3", name: "Cold Pressed Sesame Oil (500ml)", category: "mart", subcategory: "Cold Pressed Oils", description: "Premium sesame oil, perfect for stir-fries and dressings.", price: 249, discount: 0, weight: "500ml", rating: 4.6, reviewCount: 56, veg: true, inStock: true, image: "🫘", tags: [] },
  { id: "m-oil-4", name: "Cold Pressed Mustard Oil (1L)", category: "mart", subcategory: "Cold Pressed Oils", description: "Sharp and pungent mustrad oil, traditionally cold pressed.", price: 299, discount: 0, weight: "1 Litre", rating: 4.5, reviewCount: 73, veg: true, inStock: true, image: "🟤", tags: [] },
];

const honeyProducts: Product[] = [
  { id: "m-honey-1", name: "Wild Forest Honey (250g)", category: "mart", subcategory: "Natural Honey", description: "Pure wild forest honey, raw and unfiltered from the Sahyadris.", price: 299, originalPrice: 349, discount: 14, weight: "250g", rating: 4.8, reviewCount: 134, veg: true, inStock: true, image: "🍯", tags: ["bestseller", "organic"] },
  { id: "m-honey-2", name: "Organic Honey (500g)", category: "mart", subcategory: "Natural Honey", description: "Certified organic honey from chemical-free apiaries.", price: 499, discount: 0, weight: "500g", rating: 4.7, reviewCount: 89, veg: true, inStock: true, image: "🍯", tags: ["organic", "premium"] },
  { id: "m-honey-3", name: "Manuka Honey (100g)", category: "mart", subcategory: "Natural Honey", description: "Premium Manuka honey with high MGO rating.", price: 799, originalPrice: 999, discount: 20, weight: "100g", rating: 4.9, reviewCount: 42, veg: true, inStock: true, image: "🍯", tags: ["premium"] },
];

const organicProducts: Product[] = [
  { id: "m-organic-1", name: "Organic Turmeric Powder (200g)", category: "mart", subcategory: "Organic Products", description: "Pure organic turmeric with high curcumin content.", price: 149, originalPrice: 179, discount: 17, weight: "200g", rating: 4.6, reviewCount: 87, veg: true, inStock: true, image: "🟡", tags: ["organic"] },
  { id: "m-organic-2", name: "Organic Jaggery (500g)", category: "mart", subcategory: "Organic Products", description: "Chemical-free organic jaggery from sugarcane.", price: 129, discount: 0, weight: "500g", rating: 4.5, reviewCount: 64, veg: true, inStock: true, image: "🟤", tags: ["organic"] },
  { id: "m-organic-3", name: "Organic Rice (5kg)", category: "mart", subcategory: "Organic Products", description: "Premium organic basmati rice, aged and aromatic.", price: 599, originalPrice: 699, discount: 14, weight: "5kg", rating: 4.7, reviewCount: 78, veg: true, inStock: true, image: "🍚", tags: ["organic", "popular"] },
  { id: "m-organic-4", name: "Organic Chia Seeds (250g)", category: "mart", subcategory: "Organic Products", description: "Nutrient-rich organic chia seeds imported from South America.", price: 349, discount: 0, weight: "250g", rating: 4.4, reviewCount: 53, veg: true, inStock: true, image: "🫘", tags: ["organic", "superfood"] },
  { id: "m-organic-5", name: "Organic Green Tea (100 bags)", category: "mart", subcategory: "Organic Products", description: "Certified organic green tea from Darjeeling estates.", price: 249, discount: 0, weight: "100 bags", rating: 4.3, reviewCount: 61, veg: true, inStock: true, image: "🍵", tags: ["organic"] },
];

const snacksHomemadeProducts: Product[] = [
  { id: "m-snack-1", name: "Kurkure Bhaji (250g)", category: "mart", subcategory: "Homemade Snacks", description: "Crispy homemade bhaji mix with spices.", price: 99, originalPrice: 119, discount: 17, weight: "250g", rating: 4.5, reviewCount: 89, veg: true, inStock: true, image: "🫓", tags: ["popular"] },
  { id: "m-snack-2", name: "Murukku (200g)", category: "mart", subcategory: "Homemade Snacks", description: "Traditional crunchy murukku made from rice flour.", price: 89, discount: 0, weight: "200g", rating: 4.4, reviewCount: 67, veg: true, inStock: true, image: "🫘", tags: [] },
  { id: "m-snack-3", name: "Banana Chips (200g)", category: "mart", subcategory: "Homemade Snacks", description: "Thinly sliced crispy banana chips with salt and spices.", price: 79, discount: 0, weight: "200g", rating: 4.3, reviewCount: 72, veg: true, inStock: true, image: "🍌", tags: [] },
  { id: "m-snack-4", name: "Mixed Namkeen (500g)", category: "mart", subcategory: "Homemade Snacks", description: "Assorted traditional namkeen mix for tea time.", price: 149, originalPrice: 169, discount: 12, weight: "500g", rating: 4.5, reviewCount: 83, veg: true, inStock: true, image: "🥨", tags: ["popular"] },
  { id: "m-snack-5", name: "Peanut Chikki (250g)", category: "mart", subcategory: "Homemade Snacks", description: "Crunchy peanut and jaggery chikki - a classic treat.", price: 99, discount: 0, weight: "250g", rating: 4.6, reviewCount: 58, veg: true, inStock: true, image: "🥜", tags: ["traditional"] },
];

const spicesProducts: Product[] = [
  { id: "m-spice-1", name: "Garam Masala (100g)", category: "mart", subcategory: "Spices", description: "Premium blend of 12 aromatic spices, freshly ground.", price: 89, originalPrice: 99, discount: 10, weight: "100g", rating: 4.7, reviewCount: 95, veg: true, inStock: true, image: "🫘", tags: ["popular"] },
  { id: "m-spice-2", name: "Red Chilli Powder (200g)", category: "mart", subcategory: "Spices", description: "Pure Guntur red chili powder with vibrant color.", price: 79, discount: 0, weight: "200g", rating: 4.5, reviewCount: 72, veg: true, inStock: true, image: "🌶️", tags: [] },
  { id: "m-spice-3", name: "Turmeric Powder (200g)", category: "mart", subcategory: "Spices", description: "Pure ground turmeric from Erode, Tamil Nadu.", price: 69, discount: 0, weight: "200g", rating: 4.4, reviewCount: 61, veg: true, inStock: true, image: "🟡", tags: [] },
  { id: "m-spice-4", name: "Cumin Seeds (200g)", category: "mart", subcategory: "Spices", description: "Premium whole cumin seeds for tempering.", price: 59, discount: 0, weight: "200g", rating: 4.3, reviewCount: 48, veg: true, inStock: true, image: "🟤", tags: [] },
  { id: "m-spice-5", name: "Chicken Masala (100g)", category: "mart", subcategory: "Spices", description: "Special blend for perfect chicken curry.", price: 99, discount: 0, weight: "100g", rating: 4.6, reviewCount: 83, veg: false, inStock: true, image: "🫘", tags: ["non-veg"] },
];

const healthProducts: Product[] = [
  { id: "m-health-1", name: "Wheat Grass Powder (200g)", category: "mart", subcategory: "Health Products", description: "Pure wheat grass powder rich in chlorophyll and nutrients.", price: 249, originalPrice: 299, discount: 17, weight: "200g", rating: 4.4, reviewCount: 38, veg: true, inStock: true, image: "🌿", tags: ["health"] },
  { id: "m-health-2", name: "Moringa Powder (200g)", category: "mart", subcategory: "Health Products", description: "Superfood moringa leaf powder, high in iron and vitamins.", price: 199, discount: 0, weight: "200g", rating: 4.5, reviewCount: 44, veg: true, inStock: true, image: "🌿", tags: ["health", "superfood"] },
  { id: "m-health-3", name: "Flax Seeds (500g)", category: "mart", subcategory: "Health Products", description: "Premium flax seeds rich in omega-3 fatty acids.", price: 179, discount: 0, weight: "500g", rating: 4.3, reviewCount: 52, veg: true, inStock: true, image: "🫘", tags: ["health"] },
  { id: "m-health-4", name: "Protein Mix (500g)", category: "mart", subcategory: "Health Products", description: "Plant-based protein mix with soy, pea, and brown rice.", price: 449, originalPrice: 499, discount: 10, weight: "500g", rating: 4.2, reviewCount: 29, veg: true, inStock: true, image: "💪", tags: ["health", "protein"] },
];

const essentialsProducts: Product[] = [
  { id: "m-ess-1", name: "Toor Dal (1kg)", category: "mart", subcategory: "Household Essentials", description: "Premium quality toor dal/pigeon pea lentils.", price: 159, originalPrice: 179, discount: 11, weight: "1kg", rating: 4.4, reviewCount: 67, veg: true, inStock: true, image: "🫘", tags: ["essential"] },
  { id: "m-ess-2", name: "Basmati Rice (1kg)", category: "mart", subcategory: "Household Essentials", description: "Aged premium basmati rice, long grain and aromatic.", price: 189, discount: 0, weight: "1kg", rating: 4.6, reviewCount: 78, veg: true, inStock: true, image: "🍚", tags: ["essential", "popular"] },
  { id: "m-ess-3", name: "Wheat Flour Atta (5kg)", category: "mart", subcategory: "Household Essentials", description: "Stone-ground whole wheat flour for soft rotis.", price: 299, originalPrice: 349, discount: 14, weight: "5kg", rating: 4.5, reviewCount: 103, veg: true, inStock: true, image: "🌾", tags: ["essential"] },
  { id: "m-ess-4", name: "Sugar (1kg)", category: "mart", subcategory: "Household Essentials", description: "Fine grain pure sugar.", price: 49, discount: 0, weight: "1kg", rating: 4.2, reviewCount: 45, veg: true, inStock: true, image: "🍚", tags: ["essential"] },
  { id: "m-ess-5", name: "Salt (1kg)", category: "mart", subcategory: "Household Essentials", description: "Iodized refined salt.", price: 29, discount: 0, weight: "1kg", rating: 4.1, reviewCount: 32, veg: true, inStock: true, image: "🧂", tags: ["essential"] },
];

// ─── Category Definitions ───

export interface CategoryDef {
  key: string;
  name: string;
  description: string;
  emoji: string;
  products: Product[];
}

export const kitchenCategories: CategoryDef[] = [
  { key: "frozen-foods", name: "Frozen Foods", description: "Ready-to-cook frozen essentials for quick meals", emoji: "📦", products: frozenProducts },
  { key: "pizza", name: "Pizza", description: "Hand-tossed pizzas with fresh toppings", emoji: "🍕", products: pizzaProducts },
  { key: "burger", name: "Burger", description: "Juicy burgers with premium patties", emoji: "🍔", products: burgerProducts },
  { key: "fries", name: "French Fries", description: "Crispy golden fries and loaded variations", emoji: "🍟", products: friesProducts },
  { key: "momos", name: "Momos", description: "Steamed, fried, and kurkure momos", emoji: "🥟", products: momosProducts },
  { key: "pasta", name: "Pasta", description: "Creamy and tangy pasta bowls", emoji: "🍝", products: pastaProducts },
  { key: "noodles", name: "Noodles", description: "Stir-fried noodles with bold flavors", emoji: "🍜", products: noodlesProducts },
  { key: "sandwiches", name: "Sandwiches", description: "Grilled and toasted sandwiches", emoji: "🥪", products: sandwichesProducts },
  { key: "sweet-corn", name: "Sweet Corn", description: "Seasoned sweet corn cups", emoji: "🌽", products: cornProducts },
  { key: "snacks", name: "Snacks", description: "Quick bites and side orders", emoji: "🧅", products: snacksProducts },
];

export const martCategories: CategoryDef[] = [
  { key: "pickles", name: "Pickles", description: "Traditional Indian pickles made the old-fashioned way", emoji: "🥭", products: picklesProducts },
  { key: "oils", name: "Cold Pressed Oils", description: "Wood-pressed oils with natural nutrients intact", emoji: "🥥", products: oilsProducts },
  { key: "honey", name: "Natural Honey", description: "Pure raw honey from forest and farm", emoji: "🍯", products: honeyProducts },
  { key: "organic", name: "Organic Products", description: "Certified organic staples and superfoods", emoji: "🌿", products: organicProducts },
  { key: "snacks", name: "Homemade Snacks", description: "Crunchy traditional snacks made in-house", emoji: "🥨", products: snacksHomemadeProducts },
  { key: "spices", name: "Spices", description: "Pure ground spices and spice blends", emoji: "🫘", products: spicesProducts },
  { key: "health", name: "Health Products", description: "Nutritious superfoods and health supplements", emoji: "💪", products: healthProducts },
  { key: "essentials", name: "Household Essentials", description: "Daily kitchen staples and pantry items", emoji: "🌾", products: essentialsProducts },
];

export const kitchenCombosData = kitchenCombos;
export const kitchenPartyPacksData = kitchenPartyPacks;

export type SortOption = "default" | "price-low" | "price-high" | "rating" | "newest" | "discount" | "name";

export function filterProducts(products: Product[], filters: { veg?: boolean; nonVeg?: boolean; search?: string }): Product[] {
  return products.filter((p) => {
    if (filters.veg && !filters.nonVeg && !p.veg) return false;
    if (filters.nonVeg && !filters.veg && p.veg) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q) &&
        !p.subcategory.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-low": return sorted.sort((a, b) => a.price - b.price);
    case "price-high": return sorted.sort((a, b) => b.price - a.price);
    case "rating": return sorted.sort((a, b) => b.rating - a.rating);
    case "discount": return sorted.sort((a, b) => b.discount - a.discount);
    case "name": return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest": return sorted;
    default: return sorted;
  }
}

export function getAllKitchenProducts(): Product[] {
  return kitchenCategories.flatMap((c) => c.products);
}

export function getAllMartProducts(): Product[] {
  return martCategories.flatMap((c) => c.products);
}
