"use client"

import { useEffect, useRef, useState } from "react"
import { userCartStore } from "./cartStore"
import { fetchCart } from "./cartService"
import ProductCard from "@/src/components/ui/product-card"
import SliderSection from "@/src/components/layout/slider-section"
import Link from "next/link"
import { ArrowRight, ShoppingBag, CheckCircle2, MapPin, CreditCard, PartyPopper } from "lucide-react"
import { fetchAPI } from "@/src/utils/apiService"
import { Button } from "@/src/components/ui/button"
import CartItemActions from "@/src/components/ui/cart-items-action"
import Image from "next/image"
import { CartItem, ProductCardUi } from "@/src/types"
import { useRouter } from "next/navigation"
import { cancel, shipping } from "@/src/assets"
import { toast } from "sonner"
import swal from "sweetalert2"
import { Skeleton } from "@/src/components/ui/skeleton"

interface CartSyncProps {
  isLoggedIn: boolean
  items?: CartItem[]
  totalItems?: number
  totalPrice?: number
  products?: ProductCardUi[]
}

const STEPS = [
  { id: 1, label: "Shipping",  icon: MapPin },
  { id: 2, label: "Payment",   icon: CreditCard },
  { id: 3, label: "Confirmed", icon: PartyPopper },
]

const PAYMENT_METHODS = [
  { id: "esewa",  label: "eSewa",            color: "bg-green-50  border-green-200  text-green-700"  },
  { id: "khalti", label: "Khalti",           color: "bg-purple-50 border-purple-200 text-purple-700" },
  { id: "cash",   label: "Cash on Delivery", color: "bg-amber-50  border-amber-200  text-amber-700"  },
  { id: "bank",   label: "Bank Transfer",    color: "bg-blue-50   border-blue-200   text-blue-700"   },
]

function Field({ label, name, value, onChange, as: Tag = "input" }: {
  label: string; name: string; value: string
  onChange: (e: any) => void; as?: "input" | "textarea"
}) {
  return (
    <>
      <label className="text-sm font-medium">{label} *</label>
      <Tag name={name} value={value} onChange={onChange} placeholder={label}
        className="border px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400" />
    </>
  )
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-6">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const done = current > s.id
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${done             ? "bg-zinc-900 border-zinc-900 text-white" :
                  current === s.id ? "bg-white border-zinc-900 text-zinc-900 shadow-md" :
                                     "bg-white border-zinc-200 text-zinc-300"}`}>
                {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] font-medium tracking-wide
                ${current === s.id ? "text-zinc-900" : done ? "text-zinc-500" : "text-zinc-300"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 h-0.5 mx-1 mb-4 rounded transition-all duration-500
                ${done ? "bg-zinc-900" : "bg-zinc-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CartSync({
  isLoggedIn, items = [], totalItems = 0, totalPrice = 0, products = [],
}: CartSyncProps) {
  const router = useRouter()
  const syncFromBackend = userCartStore((s) => s.syncFromBackend)
  const clearCart       = userCartStore((s) => s.clearCart)
  const hasSynced       = useRef(false)
  const [loading, setLoading] = useState(true)

  const [open, setOpen]                       = useState(false)
  const [step, setStep]                       = useState(1)
  const [selectedPayment, setSelectedPayment] = useState("")
  const [placedOrder, setPlacedOrder]         = useState<any>(null)
  const [form, setForm] = useState({ fullName: "", phone: "", location: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const closeModal = () => {
    setOpen(false)
    setTimeout(() => { setStep(1); setSelectedPayment(""); setPlacedOrder(null) }, 300)
  }

useEffect(() => {
  if (!isLoggedIn || hasSynced.current) return

  hasSynced.current = true

  fetchCart()
    .then(syncFromBackend)
    .finally(() => {
      setTimeout(() => {
        setLoading(false)
      }, 800) // 600–800ms is smoother than 1000ms
    })
}, [isLoggedIn, syncFromBackend])

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

    {/* Conditional Rendering */}
    {items?.length === 0 ? (
      /* Empty state */
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <ShoppingBag className="w-16 h-16 text-zinc-200" />
        <p className="text-zinc-400 text-sm">
          Your bag is empty — start shopping 🛒
        </p>
      </div>
    ) : (
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Cart items */}
        <div className="flex-1 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
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
                  itemId={item.id}
                  initialQuantity={item.quantity}
                  size={item.size}
                  maxQuantity={item.stockQuantity ?? 0}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
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

            <Button variant="outline" onClick={() => setOpen(true)}>
              Proceed to Shipping <ArrowRight className="w-4 h-4" />
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SliderSection>
      </div>
    </div>

    {/* Modal (unchanged) */}
    {open && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={step < 3 ? closeModal : undefined}
      >
        <div
          className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Keep your modal code as is */}
        </div>
      </div>
    )}
  </div>
)}