export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'fruits' | 'vegetables' | 'dairy' | 'bakery' | 'meat' | 'pantry' | 'beverages' | 'snacks';
  price: number;
  originalPrice?: number;
  unit: string;
  availableUnits?: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isOrganic?: boolean;
  isGlutenFree?: boolean;
  isVegan?: boolean;
  badge?: string;
  discountPercent?: number;
  image: string;
  description: string;
  origin: string;
  shelfLife: string;
  nutrition?: NutritionInfo;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUnit: string;
}

export interface MealBundle {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  prepTime: string;
  serves: string;
  productIds: string[];
  discount: number; // e.g. 15 for 15% off
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';

export type DietaryFilter = 'all' | 'organic' | 'vegan' | 'gluten-free' | 'sale';

export interface OrderDetails {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  tipAmount: number;
  total: number;
  status: 'confirmed' | 'packing' | 'on_the_way' | 'delivered';
  address: string;
  instructions?: string;
  timeSlot: string;
  paymentMethod: string;
  etaMinutes: number;
}
