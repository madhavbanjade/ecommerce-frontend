"use client"

import { useEffect, useRef } from "react"
import { userCartStore } from "./cartStore"
import { fetchCart } from "./cartService"
import ProductCard from "@/src/components/ui/product-card"
import SliderSection from "@/src/components/layout/slider-section"
import Link from "next/link"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { fetchAPI } from "@/src/utils/apiService"
import { Button } from "@/src/components/ui/button"
import CartItemActions from "@/src/components/ui/cart-items-action"
import Image from "next/image"
import { CartItem, ProductCardUi } from "@/src/types"
import { useRouter } from "next/navigation"

interface CartLayoutProps {
  items?: CartItem[]           // ✅ make optional
  totalItems?: number
  totalPrice?: number
  products?: ProductCardUi[]
}

interface CartSyncProps extends CartLayoutProps {
  isLoggedIn: boolean
}

export default function CartSync({
  isLoggedIn,
  items,
  totalItems = 0,
  totalPrice = 0,
  products,
}: CartSyncProps) {
  const router = useRouter()
  const syncFromBackend = userCartStore((s) => s.syncFromBackend)
  const clearCart = userCartStore((s) => s.clearCart)
  const hasSynced = useRef(false)
const safeProducts = products ?? []

  // ✅ Ensure items is always an array
  const safeItems = items ?? []

  // Sync cart on login
  useEffect(() => {
    if (!isLoggedIn || hasSynced.current) return
    hasSynced.current = true

    fetchCart().then(syncFromBackend)
  }, [isLoggedIn, syncFromBackend])

  return (
    <div className="container py-4 flex flex-col gap-6">

      <div className="flex items-center gap-3">
        <ShoppingBag className="w-6 h-6 text-zinc-800" />
        <h3 className="text-4xl font-semibold">
          Tapai Ko DoKo
          <span className="ml-2 text-base font-normal text-zinc-400">
            ({totalItems} items)
          </span>
        </h3>
      </div>

      {/* Empty State */}
      {safeItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <ShoppingBag className="w-16 h-16 text-zinc-200" />
          <p className="text-zinc-400 text-sm">
            Your bag is empty — start shopping 🛒
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-4">
            {safeItems.map((item) => {
              const itemTotal = item.unitPrice ?? 0

              return (
                <div
                  key={item.cartItemId}
                  className="bg-white rounded-2xl border border-zinc-100 p-4 flex gap-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Image */}
                <div className="relative w-32 h-32 rounded  overflow-hidden border border-zinc-200 bg-zinc-200 shrink-0">
  <Image
    src={item.image}
    alt={item.name}
    fill
    unoptimized
    className="object-contain"
  />
</div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between gap-4">

                    {/* Top */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
                          | {item.slug || "product"}
                        </p>
                        <h3 className="text-base font-semibold text-zinc-900">
                          {item.name}
                        </h3>
                      </div>

                      <p className="text-base font-bold text-zinc-900">
                        Rs. {itemTotal.toLocaleString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <CartItemActions
                      itemId={item.cartItemId}
                      initialQuantity={item.quantity}
                      size={item.size}
                      maxQuantity={item.stockQuantity ?? 0}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm flex flex-col gap-5 sticky top-6">

              <h3 className="font-semibold text-zinc-900">
                Order Summary
              </h3>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="font-medium text-zinc-800">
                    Rs. {totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Delivery</span>
                  <span className="text-emerald-600 font-semibold">
                    Free
                  </span>
                </div>

                <div className="h-px bg-zinc-100" />

                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg">
                    Rs. {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Promo */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 border px-4 py-2.5 rounded-xl text-sm outline-none"
                />
                <Button className="bg-zinc-900 text-white px-4 rounded-xl text-xs font-bold"
                variant={"outline"}
                >
                  Apply
                </Button>
              </div>

              {/* Checkout */}
              <Button
                className="w-full"
                variant={"outline"}
                asyncAction={async () => {
                  const res = await fetchAPI({
                    endPoint: "orders",
                    method: "POST",
                  })

                  if (!res.success) throw new Error(res.error)

                  clearCart()
                  router.push("/orders")
                }}
                successMessage="Order Placed!"
              >
                Checkout <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Continue Shopping */}
              <Link href="/products">
                <button className="w-full border text-zinc-500 rounded-xl py-3 text-xs font-semibold hover:border-zinc-900 hover:text-zinc-900 transition">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-zinc-900">
          You Might Also Like
        </h3>

        <div className="relative w-screen left-1/2 -translate-x-1/2 px-4 sm:px-8">
          <SliderSection
            slideSizes={{
              base: "calc(75% - 6px)",
              sm: "calc(50% - 6px)",
              md: "calc(33.333% - 8px)",
              lg: "calc(25% - 9px)",
              xl: "calc(20% - 11px)",
            }}
            autoplay={false}
            showDots={false}
          >
            {safeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SliderSection>
        </div>
      </div>
    </div>
  )
}