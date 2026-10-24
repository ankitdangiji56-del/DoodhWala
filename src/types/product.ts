export type ProductCategory = 'milk' | 'ghee' | 'paneer' | 'curd';

export interface ProductVariant {
  id: string;
  product_id: string;
  unit_name: string; // e.g. "500 ml", "1 Litre", "200 g", "500 g", "1 kg"
  sku: string;
  price: number; // Stored in INR (Rupees)
  compare_at_price?: number;
  stock_quantity: number;
  is_available: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  image_url: string;
  is_published: boolean;
  features?: string[];
  storage_info?: string;
  nutrition_facts?: Record<string, string>;
  variants: ProductVariant[];
  created_at?: string;
}
