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

export default function Brands() {
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
        </div>
   
  )
}