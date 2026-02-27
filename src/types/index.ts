export type APIResponse<T = unknown> =
  | {
      success: true;
      data: T;
      error: null;
    }
  | {
      success: false;
      data: null;
      error: string;
    };

export interface ProductSize {
  productId: number;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "3XL";
  stock_quantity: number;
}
export interface ProductCardUi{
  id: number;
  product_name: string;
  product_description: string;
  original_price: number;
  discounted_percentage?: number | null;
  badge?: string | null;
}
export interface Product {
  id: number;
  product_name: string;
  product_description: string;
  original_price: number;
  discount_percentage?: number | null;
  discounted_price?: number | null;
  images: string[];
  quantity: number;
  is_avilable: boolean;
  sizes: ProductSize[]; 
  badge?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
