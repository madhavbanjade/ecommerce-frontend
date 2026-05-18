"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { userCartStore } from "@/src/features/cart/cartStore"
import { deleteCartItem, updateCartItem } from "@/src/features/cart/cartService"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

import { toast } from "sonner"

interface CartItemActionsProps {
  itemId: string
  initialQuantity: number
  size: string
  maxQuantity: number
  qtyOnly?: boolean
  trashOnly?: boolean
}

export default function CartItemActions({
  itemId,
  initialQuantity,
  size,
  maxQuantity,
  qtyOnly = false,
  trashOnly = false,
}: CartItemActionsProps) {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [quantityLoading, setQuantityLoading] = useState(false)
  const [removeLoading, setRemoveLoading] = useState(false)
  const router = useRouter()

  const zustandUpdate = userCartStore((s) => s.updateQuantity)
  const zustandRemove = userCartStore((s) => s.removeItem)

  const update = async (newQty: number) => {
    if (newQty < 1 || newQty > maxQuantity || quantityLoading) return

    const prevQty = quantity

    setQuantity(newQty)
    zustandUpdate(itemId, newQty)
    setQuantityLoading(true)

    const success = await updateCartItem(itemId, { quantity: newQty })

    if (success) {
      router.refresh()
      toast.success("Cart updated")
    } else {
      setQuantity(prevQty)
      zustandUpdate(itemId, prevQty)
      toast.error("Failed to update cart")
    }

    setQuantityLoading(false)
  }

  const remove = async () => {
    if (removeLoading) return

    const result = await Swal.fire({
      title: "Remove item?",
      text: "Are you sure you want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#18181b",
      cancelButtonColor: "#e4e4e7",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
      customClass: {
        cancelButton: "!text-zinc-900",
      },
    })

    if (!result.isConfirmed) return

    setRemoveLoading(true)

    const success = await deleteCartItem(itemId)

    if (success) {
      zustandRemove(itemId)
      router.refresh()
      toast.success("Item removed from cart")
    } else {
      window.location.reload()
      toast.error("Failed to remove item")
    }

    setRemoveLoading(false)
  }

  if (trashOnly) return (
    <button
      onClick={remove}
      disabled={removeLoading}
      className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 shrink-0"
    >
      {removeLoading ? (
        <span className="inline-block w-3 h-3 border-2 border-zinc-200 border-t-red-400 rounded-full animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </button>
  )

  if (qtyOnly) return (
    <div className="flex items-center rounded-full border border-zinc-200 bg-zinc-50 overflow-hidden shrink-0">
      <button
        onClick={() => update(quantity - 1)}
        disabled={quantityLoading || quantity <= 1}
        className="w-7 h-7 flex items-center justify-center hover:bg-zinc-200 transition-colors disabled:opacity-30"
      >
        <Minus className="w-3 h-3 text-zinc-600" />
      </button>
      <span className="w-6 text-center text-sm font-semibold text-zinc-900 select-none">
        {quantityLoading ? (
          <span className="inline-block w-2.5 h-2.5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
        ) : quantity}
      </span>
      <button
        onClick={() => update(quantity + 1)}
        disabled={quantityLoading || quantity >= maxQuantity}
        className="w-7 h-7 flex items-center justify-center hover:bg-zinc-200 transition-colors disabled:opacity-30"
      >
        <Plus className="w-3 h-3 text-zinc-600" />
      </button>
    </div>
  )

  return (
    <div className="flex items-center gap-2">

      {/* Size chip */}
      <span className="text-[11px] font-bold uppercase tracking-wide bg-zinc-900 text-white px-2.5 py-1 rounded-full shrink-0">
        {size}
      </span>

      {/* Qty stepper */}
      <div className="flex items-center rounded-full border border-zinc-200 bg-zinc-50 overflow-hidden shrink-0">
        <button
          onClick={() => update(quantity - 1)}
          disabled={quantityLoading || quantity <= 1}
          className="w-7 h-7 flex items-center justify-center hover:bg-zinc-200 transition-colors disabled:opacity-30"
        >
          <Minus className="w-3 h-3 text-zinc-600" />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-zinc-900 select-none">
          {quantityLoading ? (
            <span className="inline-block w-2.5 h-2.5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          ) : quantity}
        </span>
        <button
          onClick={() => update(quantity + 1)}
          disabled={quantityLoading || quantity >= maxQuantity}
          className="w-7 h-7 flex items-center justify-center hover:bg-zinc-200 transition-colors disabled:opacity-30"
        >
          <Plus className="w-3 h-3 text-zinc-600" />
        </button>
      </div>

      {/* Max stock badge */}
      {quantity >= maxQuantity && (
        <span className="text-[10px] font-semibold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full shrink-0">
          Max
        </span>
      )}

      {/* Delete */}
      <button
        onClick={remove}
        disabled={removeLoading}
        className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 shrink-0"
      >
        {removeLoading ? (
          <span className="inline-block w-3 h-3 border-2 border-zinc-200 border-t-red-400 rounded-full animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  )
}
