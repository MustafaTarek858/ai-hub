export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

// Mock products
export const products: Product[] = [
  { id: 'p1',  name: 'Whole Milk 1L',        category: 'dairy',    price: 25,  stock: 50 },
  { id: 'p2',  name: 'Cheddar Cheese 200g',  category: 'dairy',    price: 55,  stock: 30 },
  { id: 'p3',  name: 'White Bread',           category: 'bakery',   price: 18,  stock: 40 },
  { id: 'p4',  name: 'Brown Eggs x12',        category: 'dairy',    price: 48,  stock: 25 },
  { id: 'p5',  name: 'Chicken Breast 1kg',    category: 'meat',     price: 120, stock: 20 },
  { id: 'p6',  name: 'Ground Beef 500g',      category: 'meat',     price: 85,  stock: 15 },
  { id: 'p7',  name: 'Tomatoes 1kg',          category: 'veggies',  price: 22,  stock: 60 },
  { id: 'p8',  name: 'Potatoes 2kg',          category: 'veggies',  price: 30,  stock: 45 },
  { id: 'p9',  name: 'Apple Juice 1L',        category: 'drinks',   price: 35,  stock: 35 },
  { id: 'p10', name: 'Mineral Water 6-pack',  category: 'drinks',   price: 28,  stock: 80 },
  { id: 'p11', name: 'Rice Basmati 2kg',      category: 'grains',   price: 65,  stock: 40 },
  { id: 'p12', name: 'Pasta 500g',            category: 'grains',   price: 20,  stock: 55 },
];

// Carts stored per phone number
export const carts = new Map<string, CartItem[]>();
