import { CartItem } from "@/src/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// export interface CartItem {
//   cartItemId: string;
//   productId: string;
//   name: string;
//   image: string;
//   size: string;
//   price: number;
//   quantity: number;
// }

interface CartStore {
  items: CartItem[];
  isLoading: boolean;

  //actions
  syncFromBackend: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (item: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  //derived
  totalCount: () => number;
  totalPrice: () => number;
}

//store
export const userCartStore = create<CartStore>()(
  devtools(
    (set, get) => ({
      items: [],
      isLoading: false,

      //calls when app load
      syncFromBackend: (items) => set({ items }, false, "syncFromBackend"),

      //add item
      addItem: (newItem) => {
        set(
          (state) => {
            const existing = state.items.find(
              (i) =>
                i.productId === newItem.productId && i.size === newItem.size,
            );

            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.productId === newItem.productId && i.size === newItem.size
                    ? { ...i, quantity: i.quantity + newItem.quantity }
                    : i,
                ),
              };
            }

            return { items: [...state.items, newItem] };
          },
          false,
          "addItem",
        );
      },

      //remove item
      removeItem: (cartItemId) => {
        set(
          (state) => ({
            items: state.items.filter((i) => i.id !== cartItemId),
          }),
          false,
          "removeItem",
        );
      },

      //update
      updateQuantity: (cartItemsId, quantity) => {
        set(
          (state) => ({
            items: state.items.map((i) =>
              i.id === cartItemsId ? { ...i, quantity } : i,
            ),
          }),
          false,
          "updateQuantity",
        );
      },

      //clear cart
      clearCart: () => set({ items: [] }, false, "clearCart"),

      //totalcount
      totalCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      //totalPrice
      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    }),
    { name: "CartStore" },
  ),
);