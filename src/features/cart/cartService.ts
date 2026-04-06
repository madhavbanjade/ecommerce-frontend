import { CartItem } from "@/src/types";
import { fetchAPI } from "@/src/utils/apiService";

interface AddToCartPayload {
  productId: string;
  size: string;
  quantity: number;
}

 
interface UpdateCartPayload {
  quantity: number;
}
//shape backend in cart items

const mapToCartItem = (raw: any): CartItem => ({
  cartItemId: raw.id,
  productId: raw.productId ?? raw.id,
  name: raw.name,
  slug: raw.slug ?? "",
  image: raw.image,
  unitPrice: raw.price ?? raw.unitPrice, // ✅ handle both cases
  size: raw.size,
  quantity: raw.quantity,
  stockQuantity: raw.stockQuantity ?? 0,

});

//service functions
//get

export const fetchCart = async (): Promise<CartItem[]> => {
  const res = await fetchAPI({ endPoint: "cart" });
  if (!res.success) return [];

  const raw = res.data.data;

  const rawItems = Array.isArray(raw) ? raw : (raw.items ?? []);

  return rawItems.map(mapToCartItem);

};

export const addToCart = async (payload: AddToCartPayload): Promise<CartItem | null> => {
    const res = await fetchAPI({
        endPoint: "cart",
        method: 'POST',
        data: payload
    
    });
    console.log("addtocart", res)
     if(!res.success) return null;

     return mapToCartItem(res.data.data)


}



export const updateCartItem = async (

  cartItemId: string,
  payload: UpdateCartPayload,
): Promise<boolean> => {
  const res  = await fetchAPI({
    endPoint: `cart/${cartItemId}`,
    method:"PATCH",
    data: payload
  })
  return res.success
  
}


export const deleteCartItem  = async (
  cartItemId: string
): Promise<boolean> => {
  const res = await fetchAPI({
    endPoint: `cart/${cartItemId}`,
    method: 'DELETE'
  })
  return res.success
}