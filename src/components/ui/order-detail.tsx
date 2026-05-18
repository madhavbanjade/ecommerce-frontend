"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Package, MapPin, CreditCard } from "lucide-react"
import { Order, OrderStatus } from "@/src/types"

const statusStyles: Record<OrderStatus, string> = {
  Pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped:   "bg-purple-50 text-purple-700 border-purple-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
  Returned:  "bg-red-100 text-red-600 border-red-300",
}

const paymentLabels: Record<string, { label: string; sub: string }> = {
  Cash:   { label: "Cash on Delivery",  sub: "Pay when delivered" },
  Esewa:  { label: "eSewa",             sub: "Paid via eSewa"     },
  Khalti: { label: "Khalti",            sub: "Paid via Khalti"    },
}

export default function OrderDetailModal({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)

  const totalUnits = order.items.reduce((acc, item) => acc + item.quantity, 0)
  const payment = paymentLabels[order.paymentMethod] ?? { label: order.paymentMethod, sub: "" }

  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setOpen(false)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex-1 sm:flex-none text-center px-3 sm:px-5 py-2 border bg-black text-white text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
      >
        View details
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleBackdrop}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">

            {/* ── Header ── */}
            <div className="bg-zinc-950 text-white p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Order</p>
                  <h2 className="text-2xl font-bold tracking-tight">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${statusStyles[order.status]}`}>
                  {order.status}
                </span>
                <p className="text-zinc-400 text-xs">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="p-6 flex flex-col gap-6">

              {/* Items */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Items</p>
                <div className="flex flex-col gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 border border-zinc-100 rounded-xl p-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover border border-zinc-100"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-zinc-900">{item.name}</p>
                        <p className="text-xs text-zinc-400">Size: {item.size} · Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-zinc-900">Rs. {item.totalPrice}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Three columns ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Shipping */}
                <div className="border border-zinc-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Shipping</p>
                  </div>
                  <p className="text-sm font-medium text-zinc-900">{order.fullName}</p>
                  <p className="text-xs text-zinc-400 mt-1">{order.location}</p>
                  <p className="text-xs text-zinc-400">{order.phone}</p>
                </div>

                {/* Payment */}
                <div className="border border-zinc-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Payment</p>
                  </div>
                  <p className="text-sm font-medium text-zinc-900">{payment.label}</p>
                  <p className="text-xs text-zinc-400 mt-1">{payment.sub}</p>
                </div>

                {/* Summary */}
                <div className="border border-zinc-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-3.5 h-3.5 text-zinc-400" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Summary</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Subtotal ({totalUnits} items)</span>
                      <span className="text-zinc-900">Rs. {order.totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Delivery</span>
                      <span className="text-emerald-600">Free</span>
                    </div>
                    <div className="h-px bg-zinc-100 my-1" />
                    <div className="flex justify-between text-sm font-bold">
                      <span>Total</span>
                      <span>Rs. {order.totalPrice}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}