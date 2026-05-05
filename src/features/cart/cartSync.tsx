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
          <span className="ml-2 text-base font-normal text-zinc-400">({totalItems} items)</span>
        </h3>
      </div>

      {/* Empty state */}
      {!loading && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <ShoppingBag className="w-16 h-16 text-zinc-200" />
          <p className="text-zinc-400 text-sm">Your bag is empty — start shopping 🛒</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Cart items */}
      <div className="flex-1 flex flex-col gap-4">

  {loading
    ? Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-zinc-100 p-4 flex gap-4 shadow-sm animate-pulse"
        >
          {/* Image */}
          <Skeleton className="w-32 h-32 rounded-xl" />

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between gap-4">

            {/* Top */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-44" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>

            {/* Bottom */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-9 w-10 rounded-lg" />
            </div>

          </div>
        </div>
      ))

    : items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border border-zinc-100 p-4 flex gap-4 shadow-sm hover:shadow-md transition"
        >
          <div className="relative w-32 h-32 rounded overflow-hidden border bg-zinc-100">
            <Image src={item.image} alt={item.name} fill className="object-contain" unoptimized />
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase">{item.slug}</p>
                <h3 className="font-semibold">{item.name}</h3>
              </div>
              <p className="font-bold">Rs. {item.unitPrice?.toLocaleString()}</p>
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
        <h3 className="text-lg font-bold text-zinc-900">You Might Also Like</h3>
        <div className="relative w-screen left-1/2 -translate-x-1/2 px-4 sm:px-8">
          <SliderSection slideSizes={{ base: "calc(75% - 6px)", sm: "calc(50% - 6px)", md: "calc(33.333% - 8px)", lg: "calc(25% - 9px)", xl: "calc(20% - 11px)" }} autoplay={false} showDots={false}>
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </SliderSection>
        </div>
      </div>

      {/* ── Modal ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={step < 3 ? closeModal : undefined}>
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}>

            {step < 3 && (
              <button onClick={closeModal} aria-label="Close"
                className="absolute top-3 right-3 rounded-full bg-zinc-100 hover:bg-zinc-200 transition">
                <Image src={cancel} alt="close" width={24} height={24} className="opacity-70" />
              </button>
            )}

            <StepIndicator current={step} />

            {/* Step 1 — Shipping */}
            {step === 1 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100">
                    <Image src={shipping} alt="shipping" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Shipping Information</h4>
                    <p className="text-sm text-zinc-400">Please enter your delivery details</p>
                  </div>
                </div>
                <Field label="Full Name"    name="fullName" value={form.fullName} onChange={handleChange} />
                <Field label="Phone Number" name="phone"    value={form.phone}    onChange={handleChange} />
                <Field label="Full Address" name="location" value={form.location} onChange={handleChange} as="textarea" />
                <Button variant="outline" onClick={() => {
                  if (!form.fullName || !form.phone || !form.location) {
                    toast.error("Please fill all fields") // ✅ toast
                    return
                  }
                  toast.success("Shipping details saved!")  // ✅ toast
                  setStep(2)
                }}>
                  Proceed to Payment <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="font-semibold text-zinc-900">Payment Method</h4>
                  <p className="text-sm text-zinc-400">Choose how you'd like to pay</p>
                </div>
                <div className="bg-zinc-50 rounded-xl px-4 py-3 flex justify-between text-sm border border-zinc-100">
                  <span>{totalItems} item{totalItems > 1 ? "s" : ""}</span>
                  <span className="font-bold text-zinc-900">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button key={m.id} onClick={() => setSelectedPayment(m.id)}
                      className={`border-2 rounded-xl py-3 px-3 text-sm font-medium text-left transition-all
                        ${selectedPayment === m.id
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-md scale-[1.02]"
                          : `${m.color} hover:scale-[1.01]`}`}>
                      {selectedPayment === m.id && <CheckCircle2 className="w-3.5 h-3.5 mb-1 inline-block mr-1" />}
                      {m.label}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  asyncAction={async () => {
                    if (!selectedPayment) {
                      toast.error("Please select a payment method") // ✅ toast
                      throw new Error("Please select a payment method")
                    }

                    const loadingToast = toast.loading("Placing your order...") // ✅ loading toast

                    const res = await fetchAPI({
                      endPoint: "orders",
                      method: "POST",
                      data: { ...form, paymentMethod: selectedPayment },
                    })

                    toast.dismiss(loadingToast)

                    if (!res.success) {
                      toast.error(res.error || "Failed to place order") // ✅ toast
                      throw new Error(res.error)
                    }

                    toast.success("Order placed successfully! 🎉") // ✅ toast
                    setPlacedOrder(res.data)
                    clearCart()
                    setStep(3)
                  }}
                  successMessage="Order Placed!"
                >
                  Complete Purchase <ArrowRight className="w-4 h-4" />
                </Button>
                <button onClick={() => setStep(1)} className="text-xs text-zinc-400 hover:text-zinc-700 text-center transition">
                  ← Back to Shipping
                </button>
              </div>
            )}

            {/* Step 3 — Confirmation */}
            {step === 3 && (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-zinc-900">Order Confirmed! 🎉</h4>
                  <p className="text-sm text-zinc-400 mt-1">
                    Thank you, {form.fullName.split(" ")[0]}! Your order is on its way.
                  </p>
                </div>
                <div className="w-full bg-zinc-50 rounded-xl border border-zinc-100 p-4 text-sm text-left flex flex-col gap-2">
                  {[
                    ["Order ID",      `#${placedOrder?.id?.slice(0, 8).toUpperCase() ?? "—"}`],
                    ["Delivering to", placedOrder?.location ?? form.location],
                    ["Contact",       placedOrder?.phone    ?? form.phone],
                    ["Payment",       PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.label ?? ""],
                    ["Status",        placedOrder?.isPaid ? "✅ Paid" : "⏳ Pay on Delivery"],
                  ].map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-zinc-400">{key}</span>
                      <span className="font-medium text-zinc-700 max-w-[55%] text-right truncate">{val}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold text-zinc-900">
                    <span>Total</span>
                    <span>Rs. {(placedOrder?.totalPrice ?? totalPrice).toLocaleString()}</span>
                  </div>
                </div>
                <Link href="/profile/orders" className="w-full">
                  <Button variant="outline" onClick={closeModal} className="w-full">
                    View My Orders <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/products">
                  <button onClick={closeModal} className="text-xs text-zinc-400 hover:text-zinc-700 transition">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}