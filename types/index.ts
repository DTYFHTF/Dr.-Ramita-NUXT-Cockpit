export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  stock: number;
  on_sale: boolean;
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