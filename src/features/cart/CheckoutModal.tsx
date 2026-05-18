"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { fetchAPI } from "@/src/utils/apiService"
import { userCartStore } from "./cartStore"
import {
  ArrowRight, CheckCircle2, MapPin,
  CreditCard, PartyPopper, X, Package,
} from "lucide-react"
import { CartItem } from "@/src/types"

const PAYMENT_METHODS = [
  { id: "esewa",  label: "eSewa"            },
  { id: "khalti", label: "Khalti"           },
  { id: "cash",   label: "Cash on Delivery" },
  { id: "bank",   label: "Bank Transfer"    },
]

const STEPS = [
  { id: 1, label: "Shipping",  icon: MapPin },
  { id: 2, label: "Payment",   icon: CreditCard },
  { id: 3, label: "Confirmed", icon: PartyPopper },
]

function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
  )
}

function Field({ label, name, value, onChange, error, as: Tag = "input" }: {
  label: string; name: string; value: string; error?: string
  onChange: (e: any) => void; as?: "input" | "textarea"
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{label} *</label>
      <Tag
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all
          ${error
            ? "border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50"
            : "border-zinc-200 focus:ring-zinc-900/20 focus:border-zinc-900"}`}
        rows={Tag === "textarea" ? 3 : undefined}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
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

interface CheckoutModalProps {
  open: boolean
  setOpen: (b: boolean) => void
  selectedIds: Set<string>
  items: CartItem[]
  grandTotal: number
}

type FormErrors = { fullName: string; phone: string; location: string }

function validate(form: { fullName: string; phone: string; location: string }): FormErrors {
  const errs: FormErrors = { fullName: "", phone: "", location: "" }

  if (!form.fullName.trim()) {
    errs.fullName = "Full name is required"
  } else if (form.fullName.trim().length < 2) {
    errs.fullName = "Full name must be at least 2 characters"
  } else if (!/^[a-zA-Z\s]+$/.test(form.fullName.trim())) {
    errs.fullName = "Full name can only contain letters"
  }

  if (!form.phone.trim()) {
    errs.phone = "Phone number is required"
  } else if (!/^\d+$/.test(form.phone.trim())) {
    errs.phone = "Phone number must contain digits only"
  } else if (form.phone.trim().length < 10) {
    errs.phone = "Phone number must be at least 10 digits"
  } else if (form.phone.trim().length > 15) {
    errs.phone = "Phone number must be at most 15 digits"
  }

  if (!form.location.trim()) {
    errs.location = "Address is required"
  } else if (form.location.trim().length < 5) {
    errs.location = "Address must be at least 5 characters"
  }

  return errs
}

export function CheckoutModal({ open, setOpen, selectedIds, items, grandTotal }: CheckoutModalProps) {
  const router    = useRouter()
  const clearCart = userCartStore((s) => s.clearCart)

  const [step,            setStep]            = useState(1)
  const [selectedPayment, setSelectedPayment] = useState("")
  const [placedOrder,     setPlacedOrder]     = useState<any>(null)
  const [submitting,      setSubmitting]      = useState(false)
  const [nextLoading,     setNextLoading]     = useState(false)
  const [form,            setForm]            = useState({ fullName: "", phone: "", location: "" })
  const [errors,          setErrors]          = useState<FormErrors>({ fullName: "", phone: "", location: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    // clear error for this field as user types
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const closeModal = () => {
    setOpen(false)
    setTimeout(() => {
      setStep(1)
      setSelectedPayment("")
      setPlacedOrder(null)
      setErrors({ fullName: "", phone: "", location: "" })
    }, 300)
  }

  const handleNextStep = async () => {
    const errs = validate(form)
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) {
      toast.error("Please fix the errors before continuing")
      return
    }
    setNextLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    setNextLoading(false)
    toast.success("Shipping info confirmed!")
    setStep(2)
  }

  const handlePlaceOrder = async () => {
    if (!selectedPayment) { toast.error("Please select a payment method"); return }
    setSubmitting(true)
    try {
      const res = await fetchAPI({
        endPoint: "orders/selected",
        method: "POST",
        data: { ...form, paymentMethod: selectedPayment, cartItemIds: [...selectedIds] },
      })
      if (!res.success) {
        console.error("[CheckoutModal] order failed:", res.error)
        toast.error(res.error ?? "Failed to place order")
        return
      }
      setPlacedOrder(res?.data?.data)
      clearCart()
      setStep(3)
    } catch {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto"
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={step < 3 ? closeModal : undefined}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dark header */}
        <div className="bg-zinc-950 text-white p-6 rounded-t-2xl shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Checkout</p>
              <h2 className="text-2xl font-bold tracking-tight">
                {step === 1 ? "Shipping Info" : step === 2 ? "Payment" : "Order Placed!"}
              </h2>
            </div>
            {step < 3 && (
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <StepIndicator current={step} />
        </div>

        {/* Scrollable body */}
        <div className="p-6 overflow-y-auto">

          {/* Step 1 — Shipping */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <Field
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
              <Field
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
              />
              <Field
                label="Address"
                name="location"
                value={form.location}
                onChange={handleChange}
                error={errors.location}
                as="textarea"
              />

              {/* Order items summary */}
              <div className="border border-zinc-100 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-3.5 h-3.5 text-zinc-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Order Summary · {items.length} item{items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-zinc-500">
                    <span className="truncate pr-2">
                      {item.name}
                      {item.size && <span className="ml-1 text-zinc-400">({item.size})</span>}
                      {" "}× {item.quantity}
                    </span>
                    <span className="shrink-0 text-zinc-800">
                      Rs. {((item.unitPrice ?? 0) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="h-px bg-zinc-100 my-1" />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Delivery</span>
                  <span className="text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span>Total</span>
                  <span>Rs. {grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                disabled={nextLoading}
                className="w-full bg-zinc-950 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {nextLoading ? (
                  <><Spinner /> Saving info…</>
                ) : (
                  <>Continue to Payment <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Select Payment Method</p>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedPayment(m.id)}
                    className={`border-2 rounded-xl py-3 px-4 text-sm font-semibold transition-all text-left
                      ${selectedPayment === m.id
                        ? "border-zinc-900 bg-zinc-50 text-zinc-900 shadow-md scale-[1.02]"
                        : "border-zinc-100 text-zinc-500 hover:border-zinc-300"}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="border border-zinc-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Delivering To</p>
                </div>
                <p className="text-sm font-medium text-zinc-900">{form.fullName}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{form.location}</p>
                <p className="text-xs text-zinc-400">{form.phone}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  disabled={submitting}
                  className="flex-1 border border-zinc-200 text-zinc-600 py-3 rounded-xl text-sm font-semibold hover:border-zinc-900 hover:text-zinc-900 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="flex-1 bg-zinc-950 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {submitting ? <><Spinner /> Placing…</> : "Place Order"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Confirmed */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <PartyPopper className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Order Confirmed!</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Thanks {form.fullName?.split(" ")[0]}! Your order is on its way.
                </p>
              </div>
              {placedOrder && (
                <div className="w-full border border-zinc-100 rounded-xl p-4 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Order Details</p>
                  <div className="flex justify-between text-xs text-zinc-500 mb-1">
                    <span>Order ID</span>
                    <span className="font-mono text-zinc-800">#{placedOrder.id?.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500 mb-1">
                    <span>Total</span>
                    <span className="text-zinc-800">
                      Rs. {grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Payment</span>
                    <span className="text-zinc-800 capitalize">{selectedPayment}</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => { closeModal(); router.push("/profile/orders") }}
                className="w-full bg-zinc-950 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
              >
                View My Orders
              </button>
              <button onClick={closeModal} className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
                Continue Shopping
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
