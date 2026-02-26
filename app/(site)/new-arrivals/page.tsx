import { arrow, brands, heroImg, menImg, naya, womenImg } from "@/src/assets";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";

export default function Brands() {
  return (
    <div className="">
  
{/* bg-image */}
  <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-red-600  overflow-hidden">

<Image src={naya} alt="New-arrivals" fill priority className="object-cover "  />
{/* effect */}
<div className="absolute inset-0 bg-black/50 backdrop:blur-xs">
    <Breadcrumb className="py-3">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/" className="hover:text-white">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="text-white">Brands</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
  <div className="container h-full flex items-center">
  <div className="text-white flex flex-col items-start gap-4  max-w-2xl">
    <h1 className="text-4xl font-bold">New Arrivals</h1>
    <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis eveniet magnam similique ab, reiciendis officiis doloribus corrupti laudantium placeat dolor culpa dolorum, deleniti reprehenderit, aliquam repellat fuga dolores nemo est?
    </p>
    <Button variant={"default"} className="mt-8">
      Explore Collection
    </Button>
  </div>
</div>
  </div>

 </div>

<div className="container">
  hg1

</div>
    </div>
  
    
  );
}