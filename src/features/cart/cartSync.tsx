"use client"

import { useEffect, useRef, useState } from "react"
import { userCartStore } from "./cartStore"
import { fetchCart, updateCartItem, deleteCartItem } from "./cartService"
import Link from "next/link"
import { ArrowRight, ShoppingBag, Lock, Minus, Plus, Trash2 } from "lucide-react"
import { CheckoutModal } from "./CheckoutModal"
import Swal from "sweetalert2"
import Image from "next/image"
import { CartItem, ProductCardUi } from "@/src/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface CartSyncProps {
  isLoggedIn: boolean
  items?: CartItem[]
  totalItems?: number
  totalPrice?: number
  products?: ProductCardUi[]
}

const TAX_RATE = 0.13

function ItemControls({ item }: { item: CartItem }) {
  const router        = useRouter()
  const zustandUpdate = userCartStore((s) => s.updateQuantity)
  const zustandRemove = userCartStore((s) => s.removeItem)
  const [qty, setQty]               = useState(item.quantity)
  const [qtyLoading, setQtyLoading] = useState(false)
  const [delLoading, setDelLoading] = useState(false)

  const update = async (newQty: number) => {
    if (newQty < 1 || newQty > (item.stockQuantity ?? 0) || qtyLoading) return
    const prev = qty
    setQty(newQty)
    zustandUpdate(item.id, newQty)
    setQtyLoading(true)
    const ok = await updateCartItem(item.id, { quantity: newQty })
    if (ok) { router.refresh(); toast.success("Cart updated") }
    else { setQty(prev); zustandUpdate(item.id, prev); toast.error("Failed to update cart") }
    setQtyLoading(false)
  }

  const remove = async () => {
    if (delLoading) return
    const result = await Swal.fire({
      title: "Remove item?",
      text: "Are you sure you want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#18181b",
      cancelButtonColor: "#e4e4e7",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
      customClass: { cancelButton: "!text-zinc-900" },
    })
    if (!result.isConfirmed) return
    setDelLoading(true)
    const ok = await deleteCartItem(item.id)
    if (ok) { zustandRemove(item.id); router.refresh(); toast.success("Item removed from cart") }
    else { window.location.reload(); toast.error("Failed to remove item") }
    setDelLoading(false)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center rounded-full border border-zinc-200 bg-white overflow-hidden shrink-0">
        <button
          onClick={() => update(qty - 1)}
          disabled={qtyLoading || qty <= 1}
          className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 transition-colors disabled:opacity-30"
        >
          <Minus className="w-3.5 h-3.5 text-zinc-500" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-zinc-900 select-none">
          {qtyLoading
            ? <span className="inline-block w-2.5 h-2.5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
            : qty}
        </span>
        <button
          onClick={() => update(qty + 1)}
          disabled={qtyLoading || qty >= (item.stockQuantity ?? 0)}
          className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 transition-colors disabled:opacity-30"
        >
          <Plus className="w-3.5 h-3.5 text-zinc-500" />
        </button>
      </div>

      <button
        onClick={remove}
        disabled={delLoading}
        className="flex items-center gap-1.5 hover:text-red-500 disabled:opacity-30 transition-colors shrink-0"
      >
        {delLoading
          ? <span className="inline-block w-3 h-3 border-2 border-zinc-200 border-t-red-400 rounded-full animate-spin" />
          : <Trash2 className="w-5 h-5" />}
        <span className="text-sm font-bold uppercase tracking-wide">Remove</span>
      </button>
    </div>
  )
}

export default function CartSync({
  isLoggedIn, items = [], totalItems = 0, products = [],
}: CartSyncProps) {
  const syncFromBackend = userCartStore((s) => s.syncFromBackend)
  const hasSynced       = useRef(false)
  const [loading,    setLoading]    = useState(true)
  const [open,       setOpen]       = useState(false)
  const [promoCode,  setPromoCode]  = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(items.map((i) => i.id))
  )

  const toggleItem = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const subtotal     = items.filter((i) => selectedIds.has(i.id)).reduce((s, i) => s + (i.unitPrice ?? 0) * i.quantity, 0)
  const estimatedTax = subtotal * TAX_RATE
  const grandTotal   = subtotal + estimatedTax

  useEffect(() => {
    if (!isLoggedIn || hasSynced.current) return
    hasSynced.current = true
    fetchCart()
      .then(syncFromBackend)
      .finally(() => setTimeout(() => setLoading(false), 800))
  }, [isLoggedIn, syncFromBackend])

  return (
    <div className="min-h-screen">
      <div className="container sm:px-6 flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-zinc-800" />
          <h3 className="text-2xl font-bold tracking-tight text-zinc-900">
            Shopping Cart
            <span className="ml-2 text-base font-normal text-zinc-400">
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </h3>
        </div>

        {items?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 gap-5 bg-white rounded-2xl border border-zinc-100 shadow-sm">
            <ShoppingBag className="w-16 h-16 text-zinc-200" />
            <div className="text-center">
              <p className="text-zinc-900 font-semibold text-lg">Your cart is empty</p>
              <p className="text-zinc-400 text-sm mt-1">Add some items to get started</p>
            </div>
            <Link href="/products">
              <button className="mt-2 px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-700 transition-colors">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex gap-8 items-start">

            {/* ── LEFT: item list ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>

              {/* Select all row */}
              <div className="flex items-center gap-3 px-1 pb-1">
                <button
                  onClick={() =>
                    setSelectedIds(
                      selectedIds.size === items.length
                        ? new Set()
                        : new Set(items.map((i) => i.id))
                    )
                  }
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all
                    ${selectedIds.size === items.length
                      ? "bg-zinc-900 border-zinc-900"
                      : selectedIds.size > 0
                      ? "bg-zinc-200 border-zinc-400"
                      : "border-zinc-300 bg-white hover:border-zinc-500"}`}
                >
                  {selectedIds.size === items.length && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {selectedIds.size > 0 && selectedIds.size < items.length && (
                    <div className="w-2.5 h-0.5 bg-zinc-600 rounded" />
                  )}
                </button>
                <span className="text-sm font-medium text-zinc-500">
                  {selectedIds.size === items.length ? "Deselect all" : `Select all (${items.length})`}
                </span>
                {selectedIds.size > 0 && selectedIds.size < items.length && (
                  <span className="ml-auto text-xs text-zinc-400">{selectedIds.size} of {items.length} selected</span>
                )}
              </div>

              {items.map((item) => {
                const initial   = item.name?.[0]?.toUpperCase() ?? "?"
                const lineTotal = (item.unitPrice ?? 0) * item.quantity

                return (
                  <div key={item.id} className="bg-white rounded-2xl border border-zinc-100 p-6 flex gap-5 hover:shadow-sm transition-shadow">

                    {/* Checkbox */}
                    <div
                      className="flex items-center pt-1 shrink-0 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); toggleItem(item.id) }}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                        ${selectedIds.has(item.id) ? "bg-zinc-900 border-zinc-900" : "border-zinc-300 bg-white hover:border-zinc-500"}`}>
                        {selectedIds.has(item.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Image */}
                    <div className="relative w-28 h-32 rounded-xl overflow-hidden shrink-0 bg-zinc-50">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-2xl font-bold">
                          {initial}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-bold tracking-widest text-zinc-400 mb-1">{item.slug}</p>
                          <p className="text-lg font-bold uppercase text-zinc-900 leading-snug">{item.name}</p>
                          {item.size && (
                            <p className="text-md font-medium text-zinc-400 mt-1.5">Size · {item.size.toUpperCase()}</p>
                          )}
                        </div>
                        <p className="text-lg font-bold text-zinc-900 shrink-0 tabular-nums">
                          Rs. {lineTotal.toLocaleString()}
                        </p>
                      </div>
                      <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                        <ItemControls item={item} />
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>

            {/* ── RIGHT: order summary ── */}
            <div className="w-96 shrink-0 sticky top-24">
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-lg overflow-hidden">

                <div className="px-6 py-5 border-b border-zinc-100">
                  <h2 className="text-xl font-black text-zinc-900 tracking-tight">Order Summary</h2>
                  <p className="text-sm text-zinc-400 mt-0.5">{items.length} {items.length === 1 ? "item" : "items"}</p>
                </div>

                <div className="px-6 py-4 flex flex-col gap-3 border-b border-zinc-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">Subtotal</span>
                    <span className="text-sm font-semibold text-zinc-900">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">Shipping</span>
                    <span className="text-sm font-semibold text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">VAT (13%)</span>
                    <span className="text-sm font-semibold text-zinc-900">
                      Rs. {estimatedTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-5 border-b border-zinc-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-zinc-500">Total</span>
                    <span className="text-xl font-bold tabular-nums">
                      Rs. {grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-5 flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="flex-1 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all bg-zinc-50 placeholder:text-zinc-300"
                    />
                    <button
                      onClick={() => promoCode && toast.info("Promo code applied!")}
                      className="px-4 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-700 transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (selectedIds.size === 0) { toast.error("Select at least one item to checkout"); return }
                      setOpen(true)
                    }}
                    disabled={selectedIds.size === 0}
                    className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-700 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white p-3 rounded-xl text-sm font-bold tracking-wide transition-all"
                  >
                    <Lock className="w-4 h-4" />
                    Proceed to Checkout
                  </button>

                  <Link href="/products" className="flex justify-center">
                    <div className="flex items-center gap-2 text-md text-zinc-400 hover:text-zinc-900 transition-colors w-fit">
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                      Continue Shopping
                    </div>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        )}

        <CheckoutModal
          open={open}
          setOpen={setOpen}
          selectedIds={selectedIds}
          items={items}
          grandTotal={grandTotal}
        />

      </div>
    </div>
  )
}
