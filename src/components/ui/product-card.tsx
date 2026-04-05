"use client"

import { ProductCardUi } from "@/src/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ShoppingBag, Heart } from "lucide-react"
import { useWishlist } from "@/src/context/wishlist-context"

interface ProductCardProps {
  product: ProductCardUi
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { toggle, isWishlisted } = useWishlist()

  const wishlisted = product?.id ? isWishlisted(product.id) : false

  const discountPercent =
    product.dicountPrice && product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.dicountPrice) /
            product.originalPrice) *
            100
        )
      : null
      

  return (
    <motion.div
      whileHover="hover"
      className="group  flex flex-col rounded-2xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 w-full "
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-200">
        <motion.div
          className="absolute inset-0"
          variants={{ hover: { scale: 1.08 } }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={product.images?.[0] || "/fallback.png"}
            alt={product.name}
            fill
            unoptimized
            className="object-cover p-2 sm:p-4"  
          />
        </motion.div>

        {discountPercent && (
          <div className="absolute top-2 sm:top-3 left-0 bg-[#4285F4] text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-r-full shadow">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggle(product.id)
          }}
          className="absolute cursor-pointer top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-rose-50 transition"
        >
          <Heart
            className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${
              wishlisted
                ? "fill-rose-500 text-rose-500 scale-110"
                : "text-rose-400"
            }`}
          />
        </button>

        {/* Quick View */}
        <motion.div
          className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2"
          variants={{ hover: { opacity: 1, y: 0 } }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/product/${product.slug}`)
            }}
            className="flex items-center gap-1.5 sm:gap-2 bg-div text-white text-[10px] sm:text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg hover:bg-zinc-800 transition whitespace-nowrap cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
            Quick View
          </button>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-2.5 sm:p-4 flex flex-col gap-1.5 sm:gap-2">
        {product.tag && (
          <span
            className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${
              product.tag.toLowerCase() === "new"
                ? "text-emerald-600"
                : product.tag.toLowerCase() === "sale"
                ? "text-sale"
                : "text-gray-900"
            }`}
          >
            {product.tag}
          </span>
        )}

        <h5 className="text-xs sm:text-sm font-semibold text-zinc-800 leading-snug line-clamp-2">
          {product.name}
        </h5>

        <div className="flex items-center justify-between mt-1 sm:mt-2">
          <div className="flex flex-col">
            {product.dicountPrice ? (
              <>
                <span className="text-[10px] sm:text-xs text-sale line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
                <span className="text-sm sm:text-base font-bold text-zinc-900">
                  Rs. {product.dicountPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base font-bold text-zinc-900">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* <button
            className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-div text-white shadow-md hover:bg-black transition"
            >
            <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 cursor-pointer" />
          </button> */}
        </div>
      </div>
    </motion.div>
  )
}