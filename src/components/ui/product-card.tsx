"use client"

import { ProductCardUi } from "@/src/types"
import Image from "next/image"
import { Button } from "./button"
import { Heart } from "lucide-react"
import { useState } from "react"
import { menImg } from "@/src/assets"
import { Card, CardContent, CardFooter, CardHeader } from "./card"

interface ProductCardProps {
  product: ProductCardUi
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)

  return (
    <Card className="group h-full flex flex-col relative border border-gray-100 bg-white text-dark rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">

      {/* ── Image Section ── */}
      <CardHeader className="relative w-full h-64 overflow-hidden">

        <Image
          src={menImg}
          alt=""
          fill
          priority
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-green-400 text-black text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full z-10">
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform duration-200"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3 z-10">
          <Button className="w-full text-xs tracking-[0.2em] uppercase bg-white text-black hover:bg-black hover:text-black transition-all duration-300 rounded-xl shadow">
            Add to Cart
          </Button>
        </div>
      </CardHeader>

      {/* ── Content Section ── */}
      <CardContent className="px-3 pt-3 pb-2 space-y-1 flex-1">
        <p className="text-gray-900 text-sm font-semibold leading-snug truncate">
          {product.product_name}
        </p>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
          {product.product_description}
        </p>
      </CardContent>

      {/* ── Price Section ── */}
      <CardFooter className="px-3 pb-4 flex items-center gap-2">
        <span className="text-gray-900 font-bold text-sm">
          Rs.{product.discounted_price}
        </span>
        {product.original_price && (
          <span className="text-gray-400 text-xs line-through">
            Rs.{product.original_price}
          </span>
        )}
      </CardFooter>

    </Card>
  )
}