"use client";

import { useState } from "react";
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { userCartStore } from "@/src/features/cart/cartStore";
import { addToCart } from "@/src/features/cart/cartService";
import { useWishlist } from "@/src/context/wishlist-context";

import { toast } from "sonner";

interface Size {
  size: string;
  stockQuantity: number;
}

interface AddToCartIslandProps {
  productId: string;
  name: string;
  image: string;
  price: number;
  sizes: Size[];
}

export default function AddToCartIsland({
  productId,
  name,
  image,
  price,
  sizes,
}: AddToCartIslandProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = productId ? isWishlisted(productId) : false;

  const addItem   = userCartStore((s) => s.addItem);
  const cartItems = userCartStore((s) => s.items);

  // deduplicate — merge duplicate size entries by summing stock
  const uniqueSizes = Object.values(
    sizes.reduce<Record<string, Size>>((acc, s) => {
      if (acc[s.size]) acc[s.size].stockQuantity += s.stockQuantity;
      else acc[s.size] = { ...s };
      return acc;
    }, {})
  );

  // Subtract whatever is already in the cart from displayed stock
  const effectiveStock = (size: Size) => {
    const inCart = cartItems.find(
      (i) => i.productId === productId && i.size === size.size
    );
    return Math.max(0, size.stockQuantity - (inCart?.quantity ?? 0));
  };

  const allOutOfStock = uniqueSizes.length > 0 && uniqueSizes.every((s) => effectiveStock(s) === 0);

  const selectedSizeData = uniqueSizes.find((s) => s.size === selectedSize);
  const maxStock = selectedSizeData ? effectiveStock(selectedSizeData) : 99;

  const increment = () => setQuantity((q) => Math.min(q + 1, maxStock));

  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

  //add to cart
  const handleAddToCart = async () => {

    if (!selectedSize) {
      setError("Please select a size before adding to cart.");
      toast.error("Please select a size before adding to cart.");
      return;
    }

    setError(null);

    const cartItem = await addToCart({
      productId,
      size: selectedSize,
      quantity,
    });

    if (!cartItem) {
      setError("Failed to add item to cart. Please try again.");
      toast.error("Failed to add item to cart. Please try again.");
      return;
    }

    addItem(cartItem);
    setQuantity(1);

    toast.success(`${name} added to cart`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Select Size
          </p>

          <div className="flex gap-2 flex-wrap">
            {uniqueSizes.map((s) => {
              const stock = effectiveStock(s);
              const outOfStock = stock === 0;
              const isSelected = selectedSize === s.size;

              return (
                <button
                  key={s.size}
                  disabled={outOfStock}
                  onClick={() => {
                    setSelectedSize(s.size);
                    setError(null);
                    setQuantity(1);
                  }}
                  className={`
                    border rounded-xl px-4 py-2 text-sm font-medium uppercase transition-all duration-200
                    ${
                      outOfStock
                        ? "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                        : isSelected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    }
                  `}
                >
                  {s.size}
                  <span
                    className={`ml-1 text-[10px] ${
                      isSelected ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    ({stock})
                  </span>
                </button>
              );
            })}
          </div>

          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      )}

      {/* Quantity */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Quantity
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={decrement}
            disabled={quantity <= 1}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="w-3 h-3" />
          </button>

          <span className="w-8 text-center text-sm font-semibold">
            {quantity}
          </span>

          <button
            onClick={increment}
            disabled={quantity >= maxStock}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="w-3 h-3" />
          </button>

          {selectedSizeData && (
            <span className="text-xs text-gray-400">
              {maxStock} left in stock
            </span>
          )}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Actions */}
      <div className="flex w-full items-center gap-2">
        {allOutOfStock ? (
          <button
            disabled
            className="flex-1 rounded-xl py-4 text-sm tracking-widest uppercase bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          >
            Out of Stock
          </button>
        ) : (
          <Button
            asyncAction={handleAddToCart}
            className="flex w-160 rounded-xl py-6 text-sm tracking-widest uppercase bg-gray-900 text-white hover:bg-black border-transparent"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        )}

        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            toggle(productId);
            toast.success(
              wishlisted ? "Removed from wishlist" : "Added to wishlist"
            );
          }}
          className={`flex-1 h-[52px] w-16 rounded-xl p-4 flex items-center justify-center transition-colors
            ${
              wishlisted
                ? "border-rose-400 bg-rose-50 hover:bg-rose-100"
                : "border-gray-200 hover:border-red-300"
            }`}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${
              wishlisted
                ? "fill-rose-500 text-rose-500 scale-110"
                : "text-rose-400"
            }`}
          />
        </Button>
      </div>
    </div>
  );
}