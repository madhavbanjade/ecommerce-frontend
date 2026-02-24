import {  offer, sale } from "@/src/assets"
import { NavPage } from "@/src/components/layout/nav"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb"
import Image from "next/image"

export default function Brands() {
  return (
    <section className="w-full">
      <div className="relative min-w-screen aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
        <Image  src={sale} alt="Sale Banner" fill priority className="object-cover object-center" />
  <div className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>

      </div>
      <div>
           <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Brands</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          filter
        </div>
      </div>
 
    </section>
  )
}