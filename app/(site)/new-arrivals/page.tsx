import {  arrow, naya } from "@/src/assets";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/src/components/ui/breadcrumb";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";


export default function Brands() {
  return (
<section className="min-w-screen">
  <div className="relative min-w-screen aspect-[16/9] sm:aspect-[21/9] overflow-hidden">

    <Image
      src={naya}
      alt="Brand Banner"
      fill
      priority
      className="object-cover object-center"
    />
  <div className="absolute inset-0 bg-black/30 backdrop-blur-xs">
  <Breadcrumb >
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/" className="hover:text-white">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="text-white">Brands</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb></div>
  </div>
  <div className="min-w-screen border">
    <div className="container flex justify-end items-center">


  <div className="hidden md:flex gap-2">
    <Button variant={"filter"}>Category <Image src={arrow} alt="arrow" width={15} height={10} /></Button>
    <Button variant={"filter"}>Size <Image src={arrow} alt="arrow" width={15} height={10} /></Button>
    <Button variant={"filter"}>Sort By <Image src={arrow} alt="arrow" width={15} height={10}  /></Button>
  </div>
    </div>

  
</div>

</section>


  );
}