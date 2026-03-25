  "use client"

  import { ProductCardUi } from "@/src/types"
  import Image from "next/image"
  import { useRouter } from "next/navigation"
  import { motion } from "framer-motion"
  import { ShoppingBag, Heart } from "lucide-react"
  import { useState } from "react"

  interface ProductCardProps {
    product: ProductCardUi
  }

  export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter()
    const [wishlisted, setWishlisted] = useState(false)

    const discountPercent =
      product.dicountPrice && product.originalPrice
        ? Math.round(
            ((product.originalPrice - product.dicountPrice) / product.originalPrice) * 100
          )
        : null


        const toggleWishlist = async (e: React.MouseEvent) => {

          e.stopPropagation()
          setWishlisted(!wishlisted)
          try {
            const res = await fetch(
              `http://localhost:3333/api/v1/users/wishlist/${product.id}`,
              {
                method: "POST",
                credentials: "include"
              }
            )
            const data = await res.json()
            console.log("data", data)
             if (!data.success) setWishlisted(wishlisted)
            
          } catch (error) {
            setWishlisted(wishlisted)
          }
        }


    return (
      <motion.div
        whileHover="hover"
        onClick={() => router.push(`/product/${product.slug}`)}
        className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden  border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 w-full"
      >
        {/* ── Image ── */}
        <div className="relative aspect-square overflow-hidden bg-gray-200">

          {/* Image zoom */}
          <motion.div
            className="absolute inset-0"
            variants={{ hover: { scale: 1.08 } }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              unoptimized
              className="object-cover p-4"
            />
          </motion.div>

          {/* Discount Badge */}
          {discountPercent && (
            <div className="absolute top-3 left-0 bg-[#4285F4] text-white text-xs font-semibold px-3 py-1 rounded-r-full shadow">
              {discountPercent}% OFF
            </div>
          )}

          {/* Wishlist */}
        
        <button
          onClick={toggleWishlist}
          className="absolute cursor-pointer top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-rose-50 transition disabled:opacity-50"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              wishlisted ? "fill-rose-500 text-rose-500" : "text-rose-400"
            }`}
          />
        </button>

          {/* Quick View */}
          <motion.div
            className="absolute bottom-3 left-1/2 -translate-x-1/2"
            variants={{ hover: { opacity: 1, y: 0 } }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/product/${product.slug}`)
              }}
              className="flex items-center gap-2 bg-div text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg hover:bg-zinc-800 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              Quick View
            </button>
          </motion.div>
        </div>

        {/* ── Info ── */}
        <div className="p-4 flex flex-col gap-2">
          {/* Tag */}
        {product.tag && (
    <span
      className={`text-xs font-semibold uppercase tracking-wide ${
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

          {/* Name */}
          <h5 className="text-sm font-semibold text-zinc-800 leading-snug line-clamp-2">
            {product.name}
          </h5>

          {/* Price */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              {product.dicountPrice ? (
                <>
                  <span className="text-xs text-sale line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-base font-bold text-zinc-900">
                    Rs. {product.dicountPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-base font-bold text-zinc-900">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/product/${product.slug}`)
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-div text-white shadow-md hover:bg-black transition"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }