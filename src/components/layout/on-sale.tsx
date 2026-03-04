import Image from "next/image";
import { Button } from "../ui/button";
import { arrow, sale } from "@/src/assets";
import ProductListing from "../server/productListing";

export default function OnSale({slug}:any){
    return(
           <section className="w-full">
      <div className="relative min-w-screen aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
        <Image  src={sale} alt="Sale Banner" fill priority className="object-cover object-center" />
  <div className="absolute inset-0 bg-black/30 backdrop-blur-xs">

  </div>

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
  <ProductListing slug={slug} />
    </section>
    )
}