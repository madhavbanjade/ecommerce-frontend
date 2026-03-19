"use client"

import { ProductCardUi } from "@/src/types"
import Image from "next/image"
import { Button } from "./button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: ProductCardUi
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  return (   
  <Card className="cursor-pointer p-4 overflow-hidden"
  onClick={() => router.push(`/product/${product.slug}`)}
  
  >

  {/* Image wrapper — no padding, flush to card edges */}
  <div className="relative w-full aspect-[3/4]">
    <Image
      src={product.images[0]}
      alt={product.name}
      fill
      unoptimized
      className="object-cover object-top"
    />
  </div>

  <CardHeader className="w-full">
    <CardTitle>
      <h5>{product.name}</h5>
    </CardTitle>
   <CardAction className="flex gap-3 items-center">
  {product.dicountPrice ? (
    <>
      <p className="text-lg font-medium">Rs.{product.dicountPrice}</p>
      <p className="text-sm text-gray-400 line-through">Rs.{product.originalPrice}</p>
    </>
  ) : (
    <p className="text-lg font-medium">Rs.{product.originalPrice}</p>
  )}
</CardAction>
  </CardHeader>

  <CardContent>
    <CardDescription className="max-w-none line-clamp-2">
{product.description}
    </CardDescription>
  </CardContent>

  <CardFooter>
    <Button variant={"filter"} className="w-full">{product.tag}</Button>
  </CardFooter>

</Card>
  )
}