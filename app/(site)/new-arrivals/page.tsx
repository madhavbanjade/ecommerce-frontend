import {  naya } from "@/src/assets";
import Image from "next/image";


export default function Brands() {
  return (
<section className="w-full">
  <div className="relative min-w-screen aspect-[16/9] sm:aspect-[21/9] overflow-hidden">

    <Image
      src={naya}
      alt="Brand Banner"
      fill
      priority
      className="object-cover object-center"
    />
  <div className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>

  </div>
</section>


  );
}