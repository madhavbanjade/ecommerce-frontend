import { brands, naya } from "@/src/assets";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import Image from "next/image";

export default function Brands() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] text-dark">
      
     
<div className="relative w-full h-100">
  <Image
    src={naya}
    alt="hero"
    fill
    className="object-cover"
    priority
  />
</div>
          
      
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
  );
}
