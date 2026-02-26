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
{/* body */}
          <Card >

            <CardHeader>
              home
            </CardHeader>
            <CardFooter>
Card Footervdfds
            </CardFooter>
          </Card>
        </div>
   
  )
}