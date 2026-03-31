"use client"

import { Minus, Plus, Trash2, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CartItemActionsProps {
  itemId: string
  initialQuantity: number
  size: string
  maxQuantity: number // ✅ ADD THIS
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

  const update = async (newQty: number) => {
    if (newQty < 1 || newQty > maxQuantity) return

    const prevQty = quantity // ✅ store previous safely

    setQuantityLoading(true)
    setQuantity(newQty) // optimistic update

    try {
      const res = await fetch(`http://localhost:3333/api/v1/cart/${itemId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Update failed")
      }
      router.refresh()

    } catch (err) {
      setQuantity(prevQty) // ✅ revert correctly
    } finally {
      setQuantityLoading(false)
    }
  }

const remove = async () => {
  setRemoveLoading(true)

  try {
    await fetch(`http://localhost:3333/api/v1/cart/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    })
  } catch {
    // optionally show an error toast here
  } finally {
    setRemoveLoading(false)  // ← always runs
  }
}

  return (
    <div className="flex items-center gap-3">

      {/* Quantity */}
      <div className="flex items-center gap-2 border border-zinc-300 rounded-xl p-1.5">
        <span className="text-[16px] text-zinc-400 uppercase tracking-wider">
          Qty
        </span>

        {/* Minus */}
        <button
          onClick={() => update(quantity - 1)}
          disabled={quantityLoading || quantity <= 1}
          className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-zinc-100 transition disabled:opacity-30"
        >
          <Minus className=" cursor-pointer w-5 h-5 text-zinc-600" />
        </button>

        {/* Value */}
        <span className="text-lg font-semibold w-5 text-center">
          {quantity}
        </span>

        {/* Plus */}
        <button
          onClick={() => update(quantity + 1)}
          disabled={quantityLoading || quantity >= maxQuantity} // ✅ IMPORTANT
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

     {/* Stock warning - always reserve space, just toggle visibility */}
<span className={`text-[10px] text-red-500 transition-opacity ${
  quantity >= maxQuantity ? "opacity-100" : "opacity-0"
}`}>
  Max stock reached
</span>

      {/* Delete */}
      <button
        onClick={remove}
        disabled={removeLoading}
        className="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 group disabled:opacity-30"
      >
        <Trash2 className=" cursor-pointer w-5 h-5 text-red-500 group-hover:text-red-900 transition-colors" />
      </button>

    </div>
  )
}