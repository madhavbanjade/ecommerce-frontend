import Image from "next/image";
import { Button } from "../ui/button";
import { naya } from "@/src/assets";

export default function NewArrivals({ products }: { products: any[] }) {
    return(
         <div className="">
  
{/* bg-image */}
  <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-red-600  overflow-hidden">

<Image src={naya} alt="New-arrivals" fill priority className="object-cover "  />
{/* effect */}
<div className="absolute inset-0 bg-black/50 backdrop:blur-xs">
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

    </div>
    )
}