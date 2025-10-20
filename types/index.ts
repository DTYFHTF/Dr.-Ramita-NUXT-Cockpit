export interface Doctor {
  id: number;
  name: string;
  slug: string;
  photo?: string;
  contact?: string;
  specialization?: string;
  qualifications?: string;
  experience_years?: number;
  bio?: string;
  languages: string[];
  location?: string;
  consultation_fee?: number;
  available_days: string[];
  working_hours: Array<{
    day: string;
    start: string;
    end: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  treatment_specialties?: Array<{
    condition: string;
    frequency: 'very_high' | 'high' | 'normal' | 'low';
  }>;
  social_links?: string[];
  awards?: string[];
  memberships?: string[];
  consultation_modes?: string[];
  is_active: boolean;
  rating?: number | null;
  reviews_count?: number;
  created_at?: string;
  updated_at?: string;
}
export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stock?: number;
  sku?: string;
  quantity?: number; // Optional quantity property
  // Computed pricing fields from backend
  final_price?: number;
  discount_amount?: number;
  discount_percentage?: number;
  applied_promotions?: Array<{
    id?: number;
    name?: string;
    type?: 'percentage' | 'fixed' | string;
    value?: number;
    source?: string;
  }>;
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
  slug: string;
  description?: string;
  price: string; // Laravel returns price as string
  display_price: string; // Backend-calculated display price (via PriceEngine)
  applied_promotions?: Array<{
    id?: number;
    name?: string;
    type?: 'percentage' | 'fixed' | string;
    value?: number;
    source?: string;
  }>;
  discount_percentage?: number;
  total_stock?: number;
  stock: number;
  in_stock: boolean; // Laravel returns boolean
  has_variations: boolean; // Laravel returns boolean
  is_featured?: boolean; // Featured product flag
  homepage_order?: number; // Custom ordering for featured products
  total_sold?: number; // Total quantity sold (from best-selling scope)
  image: string;
  image_2: string;
  image_3: string;
  category_id?: number | null; // From Laravel response
  is_active: boolean; // From Laravel response
  created_at?: string; // Laravel timestamp
  updated_at?: string; // Laravel timestamp
  categories?: Array<{ // From Laravel response
    id: number;
    name: string;
    slug: string;
  }>;
  variations?: ProductVariation[];
  average_rating?: number; // From Laravel response
  review_count?: number; // From Laravel response
  latest_reviews?: Review[]; // From Laravel response
  
  // Enhanced suggestion fields
  original_price?: number; // For product suggestions
  final_price?: number; // For product suggestions
  has_discount?: boolean; // For product suggestions
  category_name?: string; // For product suggestions
  short_description?: string; // For product suggestions
  
  // Price breakdown from PriceEngine
  price_breakdown?: {
    original_price: number;
    final_price: number;
    discount_amount: number;
    discount_percentage?: number;
    applied_promotions: Array<{
      id?: number;
      name?: string;
      type?: 'percentage' | 'fixed' | string;
      value?: number;
      source?: string;
    }>;
  };
  
  // Frontend-specific properties
  rating?: number; // For backward compatibility
  on_sale?: boolean; // For backward compatibility
  quantity?: number; // Optional quantity property for cart
}

export interface Category {
  id: string | number; // Support both string and number IDs from backend
  name: string;
  slug?: string;
  products_count: number;
  icon: string; // Added icon property for category icon support
  level: 1 | 2 | 3; // Category hierarchy level
  parent_id?: string | number | null; // Parent category ID
  children?: Category[]; // Child categories for hierarchical display
  parent?: Category; // Parent category reference
  full_path?: string; // Full category path for breadcrumbs
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
  count?: number;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  email_verified_at?: string | null;
  role: string;
  profile_image?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  address?: {
    pincode?: string;
    address?: string;
    area?: string;
    landmark?: string;
    city?: string;
    state?: string;
  };
  is_active?: number;
  created_at?: string;
  updated_at?: string;
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
  image?: string;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  pincode: string;
  address: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  default?: boolean;
  country: string;
  email?: string;
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

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product: Product;
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

