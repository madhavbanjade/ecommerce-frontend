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
      alt={product.product_name}
      fill
      unoptimized
      className="object-cover object-top"
    />
  </div>

  <CardHeader className="w-full">
    <CardTitle>
      <h5>{product.product_name}</h5>
    </CardTitle>
    <CardAction className="flex gap-3">
      <p className="text-lg">Rs.{product.discounted_price}</p>
      <p className="line-through text-sm text-sale">Rs.{product.original_price}</p>
    </CardAction>
  </CardHeader>

  <CardContent>
    <CardDescription className="max-w-none">
{product.product_description}
    </CardDescription>
  </CardContent>

  <CardFooter>
    <Button variant={"filter"} className="w-full">{product.tag}</Button>
  </CardFooter>

</Card>
  )
}