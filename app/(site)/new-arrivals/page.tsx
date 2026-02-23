import { naya } from "@/src/assets";
import { NavPage } from "@/src/components/layout/nav";
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
    <div className="grid grid-rows-[auto_1fr_auto] gap-6 text-dark">
       <Breadcrumb className="container">
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
      
      {/* Image container with breadcrumb overlaid */}
      <div className="relative h-100">
        <Image src={naya} alt="hero" fill className="object-contain" priority />
      </div>
    </div>
  );
}
