"use client"

import { Minus, Plus, Trash2, Tag } from "lucide-react"
import { useState } from "react"
import { userCartStore } from "@/src/features/cart/cartStore"
import { deleteCartItem, updateCartItem } from "@/src/features/cart/cartService"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

// ✅ CHANGED IMPORT
import { toast } from "react-toastify"

interface CartItemActionsProps {
  itemId: string
  initialQuantity: number
  size: string
  maxQuantity: number
}

export default function CartItemActions({
  itemId,
  initialQuantity,
  size,
  maxQuantity,
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
      toast.success("Cart updated") // ✅ Toastify
    } else {
      setQuantity(prevQty)
      zustandUpdate(itemId, prevQty)
      toast.error("Failed to update cart") // ✅ Toastify
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
      toast.success("Item removed from cart") // ✅ Toastify
    } else {
      window.location.reload()
      toast.error("Failed to remove item") // ✅ Toastify
    }

    setRemoveLoading(false)
  }

  return (
    <div className="flex items-center gap-3">

      {/* Quantity */}
      <div className="flex items-center gap-2 border border-zinc-300 rounded-xl p-1.5">
        <span className="text-[16px] text-zinc-400 uppercase tracking-wider">
          Qty
        </span>

        <button
          onClick={() => update(quantity - 1)}
          disabled={quantityLoading || quantity <= 1}
          className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-zinc-100 transition disabled:opacity-30"
        >
          <Minus className="cursor-pointer w-5 h-5 text-zinc-600" />
        </button>

        <span className="text-lg font-semibold w-5 text-center">
          {quantityLoading ? (
            <span className="inline-block w-3 h-3 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          ) : (
            quantity
          )}
        </span>

        <button
          onClick={() => update(quantity + 1)}
          disabled={quantityLoading || quantity >= maxQuantity}
          className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-zinc-100 transition disabled:opacity-30"
        >
          <Plus className="cursor-pointer w-5 h-5 text-zinc-600" />
        </button>
      </div>

      {/* Size */}
      <div className="flex items-center gap-1.5 border border-zinc-300 rounded-lg p-1.5">
        <Tag className="w-5 h-5 text-zinc-400" />
        <span className="text-[16px] font-semibold text-zinc-600 uppercase">
          {size}
        </span>
      </div>

      {/* Max stock warning */}
      <span
        className={`text-[10px] text-red-500 transition-opacity ${
          quantity >= maxQuantity ? "opacity-100" : "opacity-0"
        }`}
      >
        Max stock reached
      </span>

      {/* Delete */}
      <button
        onClick={remove}
        disabled={removeLoading}
        className="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 group disabled:opacity-30"
      >
        <Trash2 className="cursor-pointer w-5 h-5 text-red-500 group-hover:text-red-900 transition-colors" />
      </button>
    </div>
  )
}