"use client"

import { useEffect, useRef, useState } from "react"
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
import { cancel, shipping } from "@/src/assets"

interface CartLayoutProps {
  items?: CartItem[]
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
  const safeItems = items ?? []

  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Sync cart
  useEffect(() => {
    if (!isLoggedIn || hasSynced.current) return
    hasSynced.current = true
    fetchCart().then(syncFromBackend)
  }, [isLoggedIn, syncFromBackend])

  // Prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto"
  }, [open])

  return (
    <div className="container py-4 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <ShoppingBag className="w-6 h-6 text-zinc-800" />
        <h3 className="text-4xl font-semibold">
          Tapai Ko DoKo
          <span className="ml-2 text-base font-normal text-zinc-400">
            ({totalItems} items)
          </span>
        </h3>
      </div>

      {/* Empty */}
      {safeItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <ShoppingBag className="w-16 h-16 text-zinc-200" />
          <p className="text-zinc-400 text-sm">
            Your bag is empty — start shopping 🛒
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Items */}
          <div className="flex-1 flex flex-col gap-4">
            {safeItems.map((item) => (
              <div
                key={item.cartItemId || ""}
                className="bg-white rounded-2xl border border-zinc-100 p-4 flex gap-4 shadow-sm hover:shadow-md transition"
              >
                <div className="relative w-32 h-32 rounded overflow-hidden border bg-zinc-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase">
                        {item.slug}
                      </p>
                      <h3 className="font-semibold">{item.name}</h3>
                    </div>
                    <p className="font-bold">
                      Rs. {item.unitPrice?.toLocaleString()}
                    </p>
                  </div>

                  <CartItemActions
                    itemId={item.cartItemId}
                    initialQuantity={item.quantity}
                    size={item.size}
                    maxQuantity={item.stockQuantity ?? 0}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-2xl border p-5 flex flex-col gap-5 sticky top-6">

              <h3 className="font-semibold">Order Summary</h3>

              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalItems})</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>

              {/* Checkout button */}
              <Button
              variant="outline"
                onClick={() => setOpen(true)}
              >
                Checkout <ArrowRight className="w-4 h-4" />
              </Button>

          <Link href="/products">
  <div className="w-full border border-zinc-200 text-zinc-600 rounded-xl py-3 text-sm font-medium text-center hover:border-zinc-900 hover:text-zinc-900 hover:bg-zinc-50 transition cursor-pointer">
    Continue Shopping
  </div>
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

      {/* ✅ MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
         {/* Close */}
<button
  onClick={() => setOpen(false)}
  aria-label="Close modal"
  className="absolute top-3 right-3  flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition"
>
  <Image
    src={cancel}
    alt="close"
    width={24}
    height={24}
    className="opacity-70 cursor-pointer"
  />
</button>

<div className="flex items-center gap-5 mb-4 " >
  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-zinc-100 ">
    <Image
      src={shipping}
      alt="shipping"
     
    />
  </div>

  <h3 className="text-sm font-semibold text-zinc-900">
    Shipping Details
  </h3>
</div>


            <div className="flex flex-col gap-3">
              <label htmlFor="">Full Name</label>
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="border px-3 py-2 rounded text-sm"
              />

              <label htmlFor="">Phone Number</label>

              <input
                name="phone"
                placeholder="WhatsApp Number"
                value={formData.phone}
                onChange={handleChange}
                className="border px-3 py-2 rounded text-sm"
              />

              <label htmlFor="">Full Address</label>

              <textarea
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="border px-3 py-2 rounded text-sm"
              />

              <Button
              variant="outline"
                asyncAction={async () => {
                  if (
                    !formData.fullName ||
                    !formData.phone ||
                    !formData.location
                  ) {
                    throw new Error("Fill all fields")
                  }

                  const res = await fetchAPI({
                    endPoint: "orders",
                    method: "POST",
                    data: formData,
                  })

                  if (!res.success) throw new Error(res.error)

                  clearCart()
                  setOpen(false)
                  router.push("/orders")
                }}
                successMessage="Order Placed!"
              >
                Confirm Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
