export interface Product {
  id: string;
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