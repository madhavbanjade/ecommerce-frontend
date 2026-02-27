import {  offer } from "@/src/assets"
import { NavPage } from "@/src/components/layout/nav"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb"
import { Card, CardFooter, CardHeader } from "@/src/components/ui/card"
import ProductCard from "@/src/components/ui/product-card"
import { ProductCardUi} from "@/src/types"
import { useEffect } from "react"


export default function Brands() {

  useEffect(() => {

  }, [])
  
  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-6 text-dark">


        {/* ✅ absolute positions the breadcrumb over the image */}
          <Breadcrumb >
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage >
                  Brands
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
  <div className="container">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />  
      ))}
    </div>
    
  </div>
        </div>
   
  )
}