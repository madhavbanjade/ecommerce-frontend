"use client"

import { ProductCardUi } from "@/src/types"
import Image from "next/image"
import { Button } from "./button"
import { heroImg, menImg, womenImg } from "@/src/assets"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"

interface ProductCardProps {
  product: ProductCardUi
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
  <Card className="cursor-pointer p-4 overflow-hidden">

  {/* Image wrapper — no padding, flush to card edges */}
  <div className="relative w-full aspect-[3/4]">
    <Image
      src={womenImg}
      alt="product-image"
      fill
      className="object-cover object-top"
    />
  </div>

  <CardHeader className="w-full">
    <CardTitle>
      <h5>Hoodie</h5>
    </CardTitle>
    <CardAction className="flex gap-3">
      <p className="text-lg">$120</p>
      <p className="line-through text-sm text-sale">$120</p>
    </CardAction>
  </CardHeader>

  <CardContent>
    <CardDescription className="max-w-none">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione et
      sequi laboriosam iste eaque perspiciatis ullam accusamus totam error impedit!
    </CardDescription>
  </CardContent>

  <CardFooter>
    <Button variant={"filter"} className="w-full">Quick View</Button>
  </CardFooter>

</Card>
  )
}