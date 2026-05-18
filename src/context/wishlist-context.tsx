"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { toast } from "sonner"

interface WishlistContextType {
  wishlistIds: string[]
  toggle: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  toggle: () => {},
  isWishlisted: () => false,
})

export function WishlistProvider({
  children,
  initialIds = [],
}: {
  children: ReactNode
  initialIds?: string[]
}) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(initialIds)

  // ✅ FETCH WISHLIST ON LOAD
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("http://localhost:3333/api/v1/users/wishlist", {
          credentials: "include",
        })

        if (!res.ok) return

        const result = await res.json()

        // 🔥 extract IDs from your backend response
        const ids = result.data.map((item: any) => item.id)

        setWishlistIds(ids)
      } catch (err) {
        console.error("Failed to load wishlist", err)
      }
    }

    fetchWishlist()
  }, [])

  // ✅ FIXED TOGGLE (NO DOUBLE BUG)
  const toggle = async (productId: string) => {
    const isAlreadyWishlisted = wishlistIds.includes(productId)

    // optimistic update
    setWishlistIds((prev) =>
      isAlreadyWishlisted
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )

    try {
      const res = await fetch(
        `http://localhost:3333/api/v1/users/wishlist/${productId}`,
        {
          method: "POST",
          credentials: "include",
        }
      )

      if (!res.ok) throw new Error()
    } catch (error) {
      console.error(error)
      // 🔥 CORRECT revert
      setWishlistIds((prev) =>
        isAlreadyWishlisted
          ? [...prev, productId]
          : prev.filter((id) => id !== productId)
      )

      toast.error("You need to be logged in first!")
    }
  }

  const isWishlisted = (productId: string) =>
    wishlistIds.includes(productId)

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, toggle, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)