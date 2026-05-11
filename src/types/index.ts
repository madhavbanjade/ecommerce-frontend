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
  id: string;
  name: string;
  slug: string,
  description: string;
  images: string[];
  originalPrice: number;
  discountPercent: number | null;
  dicountPrice:  number | null;
  tag?: string | null;
}
export interface Product {
  id: number;
  product_name: string;
  product_description: string;
  original_price: number;
  discountPercent?: number | null;
  discounted_price?: number | null;
  images: string[];
  quantity: number;
  is_avilable: boolean;
  sizes: ProductSize[]; 
  tag?: string | null;
  createdAt: Date;
  updatedAt: Date;
}


export interface ApiCartItem {
  id: string;
  name: string;
  price: number;   // backend uses "price"
  quantity: number;
  size: string;
  image: string;
}
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  unitPrice: number;     // ✅ keep this ONLY
  size: string;
  quantity: number;
  stockQuantity: number;
}

export type OrderStatus =
  | "Pending"
  | "Shipped"
  | "Confirmed"
  | "Delivered"
  | "Cancelled"
   | "Returned";


export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  size: string;
  image: string;
}

 export interface Order {
  id: string;
  status: OrderStatus;
  orders: Order[];
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}