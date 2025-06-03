export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stock?: number;
  sale_price?: number;
  sku?: string;
  quantity?: number; // Optional quantity property
}

export interface ReviewUser {
  id: number;
  name: string;
  email: string;
}
export interface Review {
  id: number;
  user: ReviewUser;
  rating: number;
  comment: string;
  reply?: string;
  replied_by?: ReviewUser;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  sale_price?: number; // Added sale_price as an optional property
  rating: number;
  stock: number;
  on_sale: boolean;
  image: string;
  image_2:string;
  image_3:string;
  slug: string;
  description?: string;
  in_stock?: boolean; // Optional property to indicate stock availability
  variations?: ProductVariation[];
  quantity?: number; // Optional quantity property
  review_count?: number;
  average_rating?: number;
  latest_reviews?: Review[];
  // Add other product fields
}

export interface Category {
  id: string;
  name: string;
  products_count: number;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PriceRange {
  label: string;
  min: number | null;
  max: number | null;
  onSale: boolean;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  email_verified_at?: string | null;
  role:string;
  // Add more fields as needed
}

// --- Order/Checkout Types ---

export interface OrderItem {
  product_id: number;
  variation_id?: number | null;
  name: string;
  variation_name?: string;
  price: number;
  quantity: number;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type PaymentMethod = 'cod' | 'card' | 'upi' | 'paypal';

export interface Order {
  id: number | string;
  status: string;
  created_at: string;
  cart: OrderItem[];
  shipping_cost: number;
  estimated_delivery: string;
  total: number;
  shipping: ShippingInfo;
  payment_method: PaymentMethod;
  special_instructions?: string;
}

export interface CartItem {
  product_id: number;
  variation_id: number | null;
  name: string;
  variation_name: string | null;
  price: number;
  image: string;
  stock: number;
  quantity: number;
}

export interface GlossaryTerm {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  description: string;
  details: Array<{ title: string; description: string }>;
  relatedTerms: string[];
  linkable: boolean;
  occurrenceLimit: number;
}

